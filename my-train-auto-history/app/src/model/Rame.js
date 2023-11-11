import { makeAutoObservable, runInAction } from 'mobx';
import { ROOT_AX, ROOT_URL } from '../RESTInfo';

export default class Rame {
  numSerie;

  typeRame;

  nbTaches;

  _tachesRestantes;

  _loading = null;

  constructor(jsonData) {
    makeAutoObservable(this);
    if (jsonData) {
      this.fromJson(jsonData);
    }
  }

  fromJson(jsonData) {
    this.numSerie = jsonData?.numSerie ?? this.numSerie;
    this.typeRame = jsonData?.typeRame ?? this.typeRame;
    this.nbTaches = jsonData?.numTaches ?? this.nbTaches;
    this._tachesRestantes = jsonData?.taches ?? this._tachesRestantes;
  }

  get tachesRestantes() {
    return this._tachesRestantes;
  }

  get isloading() {
    return this._loading === true;
  }

  get loadingError() {
    if (this._loading && this._loading !== true) {
      return this._loading;
    }
    return null;
  }

  async refresh({ withDetails = false }) {
    const params = {};
    if (withDetails) {
      params.details = true;
    }
    try {
      runInAction(() => {
        this._loading = true;
      });
      const data = await ROOT_AX.get(`${ROOT_URL}/rames/${this.numSerie}`, {
        params,
      }).then((res) => res.data);
      runInAction(() => {
        this.fromJson(data);
        this._loading = false;
      });
      return this;
    } catch (e) {
      runInAction(() => {
        this._loading = e;
      });
      return this;
    }
  }

  async validateTaches({ tacheIndexes, operateur }) {
    if (!tacheIndexes || !operateur || !tacheIndexes.length) {
      throw new Error('missing required information');
    }
    try {
      runInAction(() => {
        this._loading = true;
      });
      const data = await ROOT_AX.post(`${ROOT_URL}/rames/${this.numSerie}/actions`, {
        operateur,
        action: 'entretien',
        taches: tacheIndexes,
      }).then((res) => res.data);
      runInAction(() => {
        this.fromJson(data);
        this._loading = null;
      });
      return this;
    } catch (e) {
      runInAction(() => {
        this._loading = e;
      });
      return this;
    }
  }

  async addTaches({ taches, operateur }) {
    if (!taches || !operateur || !taches.length) {
      throw new Error('missing required information');
    }
    try {
      runInAction(() => {
        this._loading = true;
      });
      const data = await ROOT_AX.post(`${ROOT_URL}/rames/${this.numSerie}/actions`, {
        operateur,
        action: 'ajoutTaches',
        taches,
      }).then((res) => res.data);
      runInAction(() => {
        this._loading = null;
        this.fromJson(data);
      });
      return this;
    } catch (e) {
      runInAction(() => {
        this._loading = e;
      });
      return this;
    }
  }
}
