import React, {
  useContext, useReducer,
} from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { observer } from 'mobx-react';
import { Button, Form } from 'react-bootstrap';
import RootStore from '../../RootStore';
import NewTachesEditor from './newTachesEditor';

function initState() {
  return {
    numSerie: '',
    typeRame: '',
    taches: [],
  };
}

function reduceState(state, action) {
  switch (action?.type) {
    case 'set-numSerie':
      return { ...state, numSerie: action.value };
    case 'set-typeRame':
      return { ...state, typeRame: action.value };
    case 'add-tache':
      return { ...state, taches: [...state.taches, action.value] };
    case 'remove-tache':
      return {
        ...state,
        taches: [...state.taches.slice(0, action.value), ...state.taches.slice(action.value + 1)],
      };
    default:
      throw new Error(`Illegal State, unmnanaged action type: ${action?.type}`);
  }
}

function NewRameEditor({ onRameCreated }) {
  const { rameMgr } = useContext(RootStore);
  const [state, dispatch] = useReducer(reduceState, initState());

  const createNewRame = (e) => {
    e.preventDefault();
    const cleanedNumSerie = state.numSerie.trim();
    const cleanedTypeRame = state.typeRame.trim();
    if (cleanedNumSerie && cleanedTypeRame && state.taches.length > 0) {
      rameMgr.createRame({
        numSerie: cleanedNumSerie,
        typeRame: cleanedTypeRame,
        taches: state.taches,
      }).then(() => onRameCreated());
    }
  };

  return (
    <Form onSubmit={createNewRame}>
      <fieldset disabled={rameMgr.isloading}>
        <Form.Group className="mb-3" controlId="formNewEditorNumSerie">
          <Form.Label>Numéro de Série</Form.Label>
          <Form.Control
            size="xl"
            type="text"
            placeholder="Numéro de série"
            required
            maxLength={12}
            value={state.numSerie}
            onChange={(e) => dispatch({ type: 'set-numSerie', value: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formNewEditorTypeRame">
          <Form.Label>Type de rame</Form.Label>
          <Form.Control
            size="xl"
            type="text"
            placeholder="Type de rame"
            required
            maxLength={50}
            value={state.typeRame}
            onChange={(e) => dispatch({ type: 'set-typeRame', value: e.target.value })}
          />
        </Form.Group>
        <NewTachesEditor
          taches={state.taches}
          onNewTache={(t) => dispatch({ type: 'add-tache', value: t })}
          onRemoveTache={(idx) => dispatch({ type: 'remove-tache', value: idx })}
        />
        <Button size="xl" variant="success" type="submit">
          Rentrer la rame
        </Button>
      </fieldset>
    </Form>
  );
}

NewRameEditor.propTypes = {
  onRameCreated: PropTypes.func.isRequired,
};

export default observer(NewRameEditor);
