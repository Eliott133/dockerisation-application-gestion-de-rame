import logging
from typing import TypedDict, Optional

import werkzeug
from flask import Blueprint
from pymongo.errors import DuplicateKeyError
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from werkzeug.exceptions import InternalServerError, HTTPException, NotFound

LOG = logging.getLogger(__name__)

__all__ = ['error_handler']

error_handler = Blueprint('error', __name__)


class ErrorMessage(TypedDict):
    error: str
    details: Optional[str]
    code: int
    type: Optional[str]


@error_handler.app_errorhandler(werkzeug.exceptions.BadRequest)
def handle_bad_request(e):
    return ErrorMessage(error='bad request', details=str(e), code=400, type=None), 400


@error_handler.app_errorhandler(IntegrityError)
def handle_integrity_error(e: IntegrityError):
    return ErrorMessage(error='Database integrity exception', details="no detail", code=409, type=None), 409


@error_handler.app_errorhandler(SQLAlchemyError)
def handle_sql_error(e: SQLAlchemyError):
    return ErrorMessage(error='SQL server error', details=str(e), code=500, type=None), 500


@error_handler.app_errorhandler(NotFound)
def handle_not_found(e):
    return ErrorMessage(error='resource not found', details=str(e), code=404, type=None), 404


@error_handler.app_errorhandler(DuplicateKeyError)
def handle_duplicate_key(e):
    return ErrorMessage(error='duplicate exception', details=str(e), code=409, type=None), 409


@error_handler.app_errorhandler(HTTPException)
def handle_other_http_exception(e: HTTPException):
    return ErrorMessage(error=e.description, details=str(e), code=e.code, type=None), e.code


@error_handler.app_errorhandler(Exception)
def handle_other_exception(e: Exception):
    LOG.warning("Unmanaged error: %s.", str(e))
    return ErrorMessage(error="Unmanaged error", details=str(e), type=type(e).__name__, code=500), 500
