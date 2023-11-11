import RameManager from './model/RameManager';

const STORE = {
  rameMgr: new RameManager(),
};

STORE.rameMgr.currentOperator = 'toto';

export default STORE;
