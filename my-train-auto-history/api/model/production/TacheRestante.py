from sqlalchemy import Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from dao.production_db import Base

__all__ = ['TacheRestante']


class TacheRestante(Base):
    __tablename__ = 'taches'

    num_serie: Mapped[str] = mapped_column(ForeignKey("rames.num_serie"), primary_key=True)
    num_tache: Mapped[int] = mapped_column(Integer, primary_key=True)
    tache: Mapped[str] = mapped_column(Text, nullable=False)

    def __init__(self, num_serie: str, num_tache: int, tache: str):
        self.num_serie = num_serie
        self.num_tache = num_tache
        self.tache = tache

    def __repr__(self) -> str:
        return f"Tache(numSerie={self.num_serie!r}, numTache={self.num_tache!r}, tache={self.tache[:10]!r})"
