import logging


def configure_logging(level: str = None):
    log_formatter = logging.Formatter("%(asctime)s - %(name)-s - [%(levelname)-5.5s]  %(message)s")
    root_logger = logging.getLogger()
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(log_formatter)
    root_logger.addHandler(console_handler)

    log_level = logging.INFO
    if level:
        level = level.upper()
        if level == 'DEBUG':
            log_level = logging.DEBUG
        elif level == 'WARNING':
            log_level = logging.WARNING
        elif level == 'FATAL':
            log_level = logging.FATAL
    root_logger.setLevel(log_level)
