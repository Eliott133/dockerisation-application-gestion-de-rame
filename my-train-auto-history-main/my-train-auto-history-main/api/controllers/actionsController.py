from datetime import datetime as dt

from flask import Blueprint, request
from werkzeug.exceptions import BadRequest

from services import actionServices

__all__ = ['action_controller', 'build_action']

action_controller = Blueprint('action', __name__)


def format_timestamp(timestamp: dt) -> str:
    return timestamp.isoformat()


def build_action(action):
    d = dict(numSerie=action.num_serie, operateur=action.operateur,
             timestamp=format_timestamp(action.timestamp), action=action.action)
    if action.type_rame:
        d['typeRame'] = action.type_rame
    if action.taches:
        d['taches'] = action.taches
    return d


@action_controller.route("/api/v1/actions", methods=['GET'])
def get_actions():
    raw_limit = request.args.get('limit', '10')
    try:
        limit = int(raw_limit)
    except ValueError:
        raise BadRequest('Limite incorrecte')
    num_serie = request.args.get('numSerie')
    operateur = request.args.get('operateur')
    return [build_action(action) for action in actionServices.get_actions(
        num_serie=num_serie, operateur=operateur, limit=limit)]
