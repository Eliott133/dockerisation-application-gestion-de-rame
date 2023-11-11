from datetime import datetime as dt
from typing import List, Tuple

import mongoengine as me

__all__ = ['HistoryAction', 'HistoryTache', 'ACTION_TYPE',
           'create_hist_entree', 'create_hist_entretien', 'create_hist_ajout_tache',
           'create_hist_sortie']

ACTION_TYPE = ['entree', 'entretien', 'ajoutTache', 'sortie']


class HistoryTache(me.EmbeddedDocument):
    idx = me.IntField(required=True)
    tache = me.StringField(required=False)


class HistoryAction(me.Document):
    num_serie = me.StringField(db_field='numSerie', required=True, max_length=12)
    operateur = me.StringField(required=True, max_length=50)
    timestamp = me.DateTimeField(default=dt.utcnow)
    action = me.StringField(required=True, choices=ACTION_TYPE, max_length=10)

    type_rame = me.StringField(db_field='typeRame', required=False, max_length=50)
    taches = me.ListField(me.EmbeddedDocumentField(HistoryTache))

    meta = {
        'collection': 'actions',
        'indexes': [
            'operateur'
        ]
    }


def create_hist_entree(num_serie: str, type_rame: str, operateur: str,
                       taches: List[Tuple[int, str]]) -> HistoryAction:
    return HistoryAction(
        num_serie=num_serie,
        type_rame=type_rame,
        operateur=operateur,
        action='entree',
        taches=[HistoryTache(idx=idx, tache=tache) for idx, tache in taches]
    )


def create_hist_entretien(num_serie: str, operateur: str,
                          taches: List[int]) -> HistoryAction:
    return HistoryAction(
        num_serie=num_serie,
        operateur=operateur,
        action='entretien',
        taches=[HistoryTache(idx=idx) for idx in taches]
    )


def create_hist_ajout_tache(num_serie: str, operateur: str,
                            taches: List[Tuple[int, str]]) -> HistoryAction:
    return HistoryAction(
        num_serie=num_serie,
        operateur=operateur,
        action='ajoutTache',
        taches=[HistoryTache(idx=idx, tache=tache) for idx, tache in taches]
    )


def create_hist_sortie(num_serie: str, operateur: str) -> HistoryAction:
    return HistoryAction(
        num_serie=num_serie,
        operateur=operateur,
        action='sortie'
    )
