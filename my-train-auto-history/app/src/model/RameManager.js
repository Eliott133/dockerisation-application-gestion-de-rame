import { makeAutoObservable, runInAction } from 'mobx';
import { ROOT_AX, ROOT_URL } from '../RESTInfo';
import Rame from './Rame';

export default class RameManager {
  _rames = [];

  _loading = null;

  _currentOperateur = null;

  constructor() {
    makeAutoObservable(this);
  }

  get rames() {
    return this._rames;
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

  get currentOperator() {
    return this._currentOperateur;
  }

  set currentOperator(operateur) {
    this._currentOperateur = operateur;
  }

  async getRames() {
    try {
      runInAction(() => {
        this._loading = true;
      });
      const data = await ROOT_AX.get(`${ROOT_URL}/rames`).then((res) => res.data);
      runInAction(() => {
        this._rames = data.map((r) => new Rame(r));
        this._loading = null;
      });
    } catch (e) {
      runInAction(() => {
        this._loading = e;
      });
    }
  }

  async createRame({
    numSerie, typeRame, taches,
  }) {
    if (!this._currentOperateur || !numSerie || !typeRame || !taches || !taches.length) {
      throw new Error('missing required information');
    }
    try {
      runInAction(() => {
        this._loading = true;
      });
      const rameData = await ROOT_AX.post(`${ROOT_URL}/rames`, {
        numSerie,
        typeRame,
        taches,
        operateur: this._currentOperateur,
      }).then((res) => res.data);
      runInAction(() => {
        this._rames.push(new Rame(rameData));
        this._loading = null;
      });
    } catch (e) {
      runInAction(() => {
        this._loading = e;
      });
    }
  }

  async removeRame({ rameIdx = null, rameNumSerie = null }) {
    let rameIdxToRemove;
    if (rameIdx !== null) {
      if (rameIdx < 0 || rameIdx >= this._rames.length) {
        throw new Error('Bad rameIdx');
      }
      rameIdxToRemove = rameIdx;
    } else if (rameNumSerie !== null) {
      rameIdxToRemove = this._rames.findIndex((r) => r.numSerie === rameNumSerie);
      if (rameIdxToRemove < 0) {
        throw new Error('Bad rameNumSerie');
      }
    } else {
      throw new Error('Missing rame information');
    }
    const rameToRemove = this._rames[rameIdxToRemove];
    try {
      runInAction(() => {
        this._loading = true;
      });
      await ROOT_AX.post(`${ROOT_URL}/rames/${rameToRemove.numSerie}/actions`, {
        operateur: this._currentOperateur,
        action: 'sortie',
      });
      runInAction(() => {
        this._rames.splice(rameIdxToRemove, 1);
        this._loading = null;
      });
      return true;
    } catch (e) {
      runInAction(() => {
        this._loading = e;
      });
      return false;
    }
  }
}
