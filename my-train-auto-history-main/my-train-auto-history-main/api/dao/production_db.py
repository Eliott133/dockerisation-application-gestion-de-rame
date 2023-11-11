import logging
from typing import Dict

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base, DeclarativeBase, Session

from utils.Singleton import Singleton

LOG = logging.getLogger(__name__)

__all__ = ['Base', 'ProductionDbDAO']

Base: DeclarativeBase = declarative_base()


class ProductionDbDAO(metaclass=Singleton):
    __slots__ = ['__engine', '__session', '__url']

    def __init__(self, configuration: Dict = None):
        self.__build_url(configuration)
        self.__engine = None
        self.__session = None

    @property
    def engine(self):
        return self.__engine

    @property
    def session(self) -> Session:
        return self.__session

    def __build_url(self, configuration: Dict):
        # retrieve related configuration values
        db_conf = configuration['SQLDB_SETTINGS']
        db_name = db_conf['db']
        user = db_conf['user']
        password = db_conf['password']
        host = db_conf.get('host', 'localhost')
        port = db_conf.get('port')
        # build connection url of form mysql+mysqldb://<user>:<password>@<host>[:<port>]/<db_name>
        url = 'mysql+mysqldb://'
        if user and password:
            url += user + ':' + password
        url += '@' + host
        if port:
            url += ':' + str(port)
        url += '/' + db_name
        self.__url = url
        LOG.info("URl set: " + self.__url)

    def open(self) -> None:
        if self.__engine is None:
            self.__engine = create_engine(self.__url)
        self.__session = scoped_session(sessionmaker(autocommit=False,
                                                     autoflush=False,
                                                     bind=self.__engine))
        Base.query = self.__session.query_property()

    def close(self) -> None:
        if self.__session is not None:
            self.__session.remove()
            self.__session = None

    def init_production_db(self) -> None:
        Base.metadata.create_all(bind=self.__engine)

    def close_session(self) -> None:
        if self.__session is not None:
            self.__session.remove()

    def __enter__(self):
        self.open()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            self.close()
        except Exception as e:
            LOG.warning("Exception while closing Mongo connection: " + str(e))
