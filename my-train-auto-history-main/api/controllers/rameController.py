from typing import Dict, List, Optional

from flask import Blueprint, request, make_response
from werkzeug.exceptions import BadRequest

from controllers.actionsController import build_action
from model.production.Rame import Rame
from model.production.TacheRestante import TacheRestante
from services import rameServices

__all__ = ['rame_controller']

rame_controller = Blueprint('rame', __name__)


def _build_rame_with_taches_representation(rame: Rame, taches: Optional[List[TacheRestante]] = None) -> Dict:
    dic_rep = dict(numSerie=rame.num_serie, typeRame=rame.type_rame, numTaches=rame.nb_taches)
    if taches is not None:
        dic_rep['taches'] = [dict(idx=t.num_tache, tache=t.tache) for t in taches]
    return dic_rep


@rame_controller.route("/api/v1/rames", methods=['GET'])
def get_rames():
    rames = rameServices.get_rames()
    return [_build_rame_with_taches_representation(r) for r in rames]


@rame_controller.route("/api/v1/rames", methods=['POST'])
def create_rame():
    data = request.get_json(force=False)
    num_serie = data.get('numSerie')
    type_rame = data.get('typeRame')
    taches = data.get('taches')
    operateur = data.get('operateur')
    if not num_serie or not type_rame or not taches or not operateur:
        raise BadRequest('Information manquante: numSerie, typeRame, taches et operateur sont obligatoires')
    rame, taches = rameServices.create_rame(num_serie, type_rame, taches, operateur)
    return _build_rame_with_taches_representation(rame, taches)


@rame_controller.route("/api/v1/rames/<num_serie>", methods=['GET'])
def get_rame(num_serie: str):
    with_details = True if 'details' in request.args else False
    rame, taches = rameServices.get_rame_info(num_serie, with_details)
    return _build_rame_with_taches_representation(rame, taches)


@rame_controller.route("/api/v1/rames/<num_serie>/actions", methods=['GET'])
def get_rame_actions(num_serie: str):
    return [build_action(action) for action in rameServices.get_rame_actions(num_serie)]


@rame_controller.route("/api/v1/rames/<num_serie>/actions", methods=['POST'])
def create_rame_action(num_serie: str):
    data = request.get_json(force=False)
    action = data.get('action')
    operateur = data.get('operateur')
    if not action or not operateur:
        raise BadRequest('Information manquante: action et operateur sont obligatoires')

    if action == 'entretien':
        taches_effectuees = data.get('taches')
        if not taches_effectuees:
            raise BadRequest('Information manquante: taches est obligatoire')
        rame, taches = rameServices.create_rame_entretien_action(num_serie, taches_effectuees, operateur)
        return _build_rame_with_taches_representation(rame, taches)

    elif action == 'ajoutTaches':
        taches_to_create = data.get('taches')
        if not taches_to_create:
            raise BadRequest('Information manquante: taches est obligatoire')
        rame, taches = rameServices.create_rame_ajout_taches_action(num_serie, taches_to_create, operateur)
        return _build_rame_with_taches_representation(rame, taches)

    elif action == 'sortie':
        rameServices.remove_rame(num_serie, operateur)
        return make_response('', 204)

    else:
        raise BadRequest('Action inconnue')
