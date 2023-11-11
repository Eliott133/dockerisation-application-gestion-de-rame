import logging
from typing import List, Tuple, Optional, Any, Iterable

from sqlalchemy import select, delete, and_, update
from werkzeug.exceptions import BadRequest, NotFound

from dao.production_db import ProductionDbDAO
from model.history.HistoryAction import HistoryAction, create_hist_entree, create_hist_entretien, \
    create_hist_ajout_tache, create_hist_sortie
from model.production.Rame import Rame
from model.production.TacheRestante import TacheRestante

LOG = logging.getLogger(__name__)

__all__ = ['create_rame', 'get_rame_info', 'create_rame_entretien_action', 'create_rame_ajout_taches_action',
           'remove_rame', 'get_rame_actions']


def get_rames() -> Any:
    prod_db_session = ProductionDbDAO().session
    return prod_db_session.scalars(select(Rame)).all()


def create_rame(num_serie: str, type_rame: str, taches: List[str], operateur: str) -> Tuple[Rame, List[TacheRestante]]:
    # Validate input data
    if not num_serie or len(num_serie) > 12:
        raise BadRequest('Mauvais numéro de série de rame')
    if not operateur or len(operateur) > 50:
        raise BadRequest('Operateur manquant ou incorrect')
    if not type_rame or len(type_rame) > 50:
        raise BadRequest('Mauvais type de rame')
    if not taches or any(filter(lambda l: not l, taches)):
        raise BadRequest('Mauvaise tache')

    prod_db_session = ProductionDbDAO().session
    rame = Rame(num_serie, type_rame, len(taches))
    prod_db_session.add(rame)
    taches_restantes = [TacheRestante(num_serie, num_tache, tache) for num_tache, tache in enumerate(taches, start=1)]
    prod_db_session.add_all(taches_restantes)

    # Create a history action
    history_action = create_hist_entree(num_serie, type_rame, operateur,
                                        [(t.num_tache, t.tache) for t in taches_restantes])
    history_action.save()

    prod_db_session.commit()
    return rame, taches_restantes


def get_rame_info(num_serie: str, with_taches: bool = False) -> Tuple[Rame, Optional[List[TacheRestante]]]:
    # Validate input data
    if not num_serie or len(num_serie) > 12:
        raise BadRequest('Mauvais numéro de série de rame')

    prod_db_session = ProductionDbDAO().session
    rame: Optional[Rame] = prod_db_session.get(Rame, num_serie)
    if not rame:
        raise NotFound('Rame inconnue')
    if with_taches:
        rq_taches = select(TacheRestante.num_tache, TacheRestante.tache) \
            .where(TacheRestante.num_serie == num_serie) \
            .order_by(TacheRestante.num_tache)
        taches = list(prod_db_session.execute(rq_taches))
    else:
        taches = None
    return rame, taches


def create_rame_entretien_action(num_serie: str, taches_effectuees: List[int], operateur: str) -> Tuple[
    Rame, List[TacheRestante]]:
    # Validate input data
    if not num_serie or len(num_serie) > 12:
        raise BadRequest('Mauvais numéro de série de rame')
    if not operateur or len(operateur) > 50:
        raise BadRequest('Operateur manquant ou incorrect')
    if not taches_effectuees or any(filter(lambda l: not l, taches_effectuees)):
        raise BadRequest('Mauvaise tache effecutée')

    prod_db_session = ProductionDbDAO().session
    # Delete taches
    rq_delete_taches = delete(TacheRestante).where(
        and_(
            TacheRestante.num_serie == num_serie,
            TacheRestante.num_tache.in_(taches_effectuees)
        )
    )
    res = prod_db_session.execute(rq_delete_taches)
    # check that all requested taches have been deleted
    if res.rowcount != len(taches_effectuees):
        raise BadRequest('Bad task to delete')

    # Create a history action
    history_action = create_hist_entretien(num_serie, operateur, taches_effectuees)
    history_action.save()

    # commit session
    prod_db_session.commit()
    # return rame info
    return get_rame_info(num_serie, with_taches=True)


def create_rame_ajout_taches_action(num_serie: str, taches: List[str], operateur: str) -> Tuple[
    Rame, List[TacheRestante]]:
    # Validate input data
    if not num_serie or len(num_serie) > 12:
        raise BadRequest('Mauvais numéro de série de rame')
    if not operateur or len(operateur) > 50:
        raise BadRequest('Operateur manquant ou incorrect')
    if not taches or any(filter(lambda l: not l, taches)):
        raise BadRequest('Mauvaise tache à ajouter')

    prod_db_session = ProductionDbDAO().session
    # Retrieve tache count of rame
    current_task_count = prod_db_session.scalars(select(Rame.nb_taches).where(Rame.num_serie == num_serie)).first()
    if current_task_count is None:
        raise NotFound('Rame inconnue')
    LOG.info("current task count: " + str(current_task_count))

    # Create new taches
    new_taches = [TacheRestante(num_serie, num_tache, tache)
                  for num_tache, tache in enumerate(taches, start=current_task_count + 1)]
    prod_db_session.add_all(new_taches)

    # update tache count of rame
    new_task_count = current_task_count + len(taches)
    rq_update = update(Rame).where(Rame.num_serie == num_serie).values(nb_taches=new_task_count)
    prod_db_session.execute(rq_update)

    # Create a history action
    history_action = create_hist_ajout_tache(num_serie, operateur,
                                             [(t.num_tache, t.tache) for t in new_taches])
    history_action.save()

    # commit session
    prod_db_session.commit()
    # return rame info
    return get_rame_info(num_serie, with_taches=True)


def remove_rame(num_serie: str, operateur: str) -> None:
    if not num_serie or len(num_serie) > 12:
        raise BadRequest('Mauvais numéro de série de rame')
    if not operateur or len(operateur) > 50:
        raise BadRequest('Operateur manquant ou incorrect')

    prod_db_session = ProductionDbDAO().session

    # Remove all remaining taches
    rq = delete(TacheRestante).where(TacheRestante.num_serie == num_serie)
    LOG.info(rq)
    prod_db_session.execute(rq)

    # Remove Rame
    rq = delete(Rame).where(Rame.num_serie == num_serie)
    LOG.info(rq)
    res = prod_db_session.execute(rq)

    # Check at least one rame has been removed
    if res.rowcount == 0:
        raise NotFound('Rame inconnue')

    # Create a history action
    history_action = create_hist_sortie(num_serie, operateur)
    history_action.save()

    # commit session
    prod_db_session.commit()


def get_rame_actions(num_serie: str) -> Iterable[HistoryAction]:
    # Get Rame history actions, sorted by timestamp desc
    return HistoryAction.objects(num_serie=num_serie).order_by('-timestamp')
