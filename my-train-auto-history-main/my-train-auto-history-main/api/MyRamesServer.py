import logging
from argparse import ArgumentParser

from flask import Flask
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from controllers.actionsController import action_controller
from controllers.errorHandler import error_handler
from controllers.rameController import rame_controller
from dao.history_db import HistoryDbDAO
from dao.production_db import ProductionDbDAO
from utils.loggingUtils import configure_logging

LOG = logging.getLogger(__name__)


def setup_argument_parser() -> ArgumentParser:
    parser = ArgumentParser(description="My Rames Server")
    parser.add_argument('-c', '--config', help="Configuration file location (default: ./config.py)",
                        metavar='<configuration file>', type=str, default='./config.py')
    parser.add_argument('-s', '--static-folder', help="Static resource folder path (default: ./static)",
                        metavar='<static folder path>', type=str, default='./static')
    parser.add_argument('-l', '--log-level', help="Level of logger", metavar='<logging level>', type=str,
                        default='INFO', choices=['DEBUG', 'INFO', 'WARNING', 'FATAL'])
    return parser


def create_server_apps(config_file_path: str, static_folder_path: str, log_level: str) -> Flask:
    app: Flask = Flask(__name__, static_url_path='/app', static_folder=static_folder_path)
    app.config.from_pyfile(config_file_path)
    app.config['LOG_LEVEL'] = log_level

    # Proxy settings
    app.wsgi_app = ProxyFix(
        app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
    )

    # CORS setup for Flask
    if app.config.get('ENABLE_CORS', False):
        app.logger.warning("ENABLE CORS")
        cors = CORS(app, resources={r"/api/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "moz-extension://*"],
            "supports_credentials": True
        }})

    # Production DB Setup
    prod_db_dao = ProductionDbDAO(app.config)
    prod_db_dao.open()
    prod_db_dao.init_production_db()

    # History DB Setup
    history_db_dao = HistoryDbDAO(app)

    # REST Controllers setup
    app.register_blueprint(error_handler)
    app.register_blueprint(rame_controller)
    app.register_blueprint(action_controller)

    # Register teardown processing when client session end
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        LOG.info("Close prod db dao")
        prod_db_dao.close_session()

    return app


def start_server(app: Flask):
    host = app.config.get('SERVER_HOST', '127.0.0.1')
    port = app.config.get('SERVER_PORT', 5000)
    debug = app.config.get('DEBUG', False)
    app.logger.info("Start Flask-socketio server on host {} and port {}".format(host, port))
    if debug:
        app.logger.warning('DEBUG mode enabled')
    app.run(host=host, port=port, debug=debug)


if __name__ == '__main__':
    # Parse application arguments
    arg_parser = setup_argument_parser()
    args = arg_parser.parse_args()

    # Logging configuration
    configure_logging(args.log_level)

    # Create and configure apps
    app = create_server_apps(args.config, args.static_folder, args.log_level)
    # Start server
    start_server(app)
