from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from dao.production_db import Base

__all__ = ['Rame']


class Rame(Base):
    __tablename__ = 'rames'

    num_serie: Mapped[str] = mapped_column(String(12), primary_key=True)
    type_rame: Mapped[str] = mapped_column(String(50), nullable=False)
    nb_taches: Mapped[int] = mapped_column(Integer, nullable=False)

    def __init__(self, num_serie: str, type_rame: str, nb_taches: int):
        self.num_serie = num_serie
        self.type_rame = type_rame
        self.nb_taches = nb_taches

    def __repr__(self) -> str:
        return f"Rame(numSerie={self.num_serie!r}, typeRame={self.type_rame!r}, nbTaches={self.nb_taches!r})"
