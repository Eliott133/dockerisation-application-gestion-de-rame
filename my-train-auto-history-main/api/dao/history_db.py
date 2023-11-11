import logging

from flask import Flask
from flask_mongoengine import MongoEngine

from utils.Singleton import Singleton

LOG = logging.getLogger(__name__)

__all__ = ['HistoryDbDAO']


class HistoryDbDAO(metaclass=Singleton):
    __slots__ = ['__db']

    def __init__(self, app: Flask):
        self.__db = MongoEngine(app)

    @property
    def db(self) -> MongoEngine:
        return self.__db
