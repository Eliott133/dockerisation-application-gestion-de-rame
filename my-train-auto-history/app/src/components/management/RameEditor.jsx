import React, {
  useContext, useEffect, useReducer,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import {
  Alert, Button, Col, ListGroup, Modal, Row, Stack,
} from 'react-bootstrap';
import RameDeletionConfirmation from './RameDeletionConfirmation';
import TacheView from './TacheView';
import RameAddTaskEditor from './RameAddTaskEditor';

function initState() {
  return {
    onRemoveRameValidation: false,
    tacheToShow: null,
    selectingTaches: false,
    selectedTaches: null,
  };
}

function reduceState(state, action) {
  switch (action?.type) {
    case 'start-removing-rame':
      return { ...state, onRemoveRameValidation: true };
    case 'end-removing-rame':
      return { ...state, onRemoveRameValidation: false };
    case 'select-tache': {
      if (state.selectingTaches) {
        return {
          ...state,
          selectedTaches: [
            ...state.selectedTaches.slice(0, action.idx),
            !state.selectedTaches[action.idx],
            ...state.selectedTaches.slice(action.idx + 1),
          ],
        };
      }
      return { ...state, tacheToShow: action.tache !== state.tacheToShow ? action.tache : null };
    }

    case 'start-selection':
      return {
        ...state,
        selectingTaches: true,
        selectedTaches: Array(action.taches.length).fill(false),
      };
    case 'stop-selection':
      return { ...state, selectingTaches: false, selectedTaches: null };
    case 'start-adding-new-taches':
      return { ...state, addingNewTaches: true };
    case 'stop-adding-new-taches':
      return { ...state, addingNewTaches: false };
    case 'reset':
      return initState();
    default:
      throw new Error(`Illegal action type: ${action?.type}`);
  }
}

function createTacheExtract(tache) {
  return tache.length > 20 ? `${tache.substring(0, 17)}...` : tache;
}

function RameEditor({ rame, operateur, onRemoveRame }) {
  const [state, dispatch] = useReducer(reduceState, initState());

  useEffect(() => {
    rame.refresh({ withDetails: true });
    dispatch({ type: 'reset' });
  }, [rame]);

  const disableAction = rame.isloading;
  const error = rame.loadingError;

  const validateRameDeletion = () => {
    const resDeletion = onRemoveRame(rame);
    if (resDeletion?.finally) {
      resDeletion.finally(() => dispatch({ type: 'end-removing-rame' }));
    } else {
      dispatch({ type: 'end-removing-rame' });
    }
  };

  const validateTachesSelection = () => {
    const tacheIndexes = rame.tachesRestantes.filter((tache, idx) => !!state.selectedTaches[idx])
      .map((tache) => tache.idx);
    if (!tacheIndexes.length) {
      return;
    }
    const res = rame.validateTaches({ tacheIndexes, operateur });
    if (res?.finally) {
      res.finally(() => dispatch({ type: 'stop-selection' }));
    } else {
      dispatch({ type: 'stop-selection' });
    }
  };

  const validateNewTaches = (taches) => {
    if (!taches?.length) {
      return;
    }
    const res = rame.addTaches({ taches, operateur });
    if (res?.finally) {
      res.finally(() => dispatch({ type: 'stop-adding-new-taches' }));
    } else {
      dispatch({ type: 'stop-adding-new-taches' });
    }
  };

  let detailComponent;
  if (state.tacheToShow) {
    detailComponent = <TacheView tache={state.tacheToShow} />;
  } else if (state.selectingTaches) {
    detailComponent = (
      <Stack gap={3}>
        <span>
          Tâche(s) selectionnée(s) :
          {state.selectedTaches.filter((s) => !!s).length}
        </span>
        <Button size="xl" variant="primary" onClick={validateTachesSelection}>Valider les tâches</Button>
        <Button size="xl" variant="warning" onClick={() => dispatch({ type: 'stop-selection' })}>Annuler la section</Button>
      </Stack>
    );
  } else if (state.addingNewTaches) {
    detailComponent = <RameAddTaskEditor onValidateNewTaches={validateNewTaches} onCancel={() => dispatch({ type: 'stop-adding-new-taches' })} />;
  } else {
    detailComponent = (
      <Stack gap={3}>
        <Button size="xl" variant="primary" onClick={() => dispatch({ type: 'start-selection', taches: rame.tachesRestantes })}>Selectionner des tâches à valider</Button>
        <Button size="xl" variant="danger" onClick={() => dispatch({ type: 'start-removing-rame' })}>Sortir la rame</Button>
        <Button size="xl" variant="info" onClick={() => dispatch({ type: 'start-adding-new-taches' })}>Ajouter des taches</Button>
      </Stack>
    );
  }

  return (
    <>
      <RameDeletionConfirmation
        rame={rame}
        show={state.onRemoveRameValidation}
        onDelete={validateRameDeletion}
        onCancel={() => dispatch({ type: 'end-removing-rame' })}
      />
      <Row className={classNames('align-items-center')}>
        <Col>
          <Row className="mb-4">
            <Col>
              <h2>
                Rame&nbsp;
                {rame.numSerie}
              </h2>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <ul className="list-unstyled">
                <li>
                  Type de rame :&nbsp;
                  {rame.typeRame}
                </li>
                <li>
                  Nombre de tâche :&nbsp;
                  {rame.nbTaches}
                </li>
              </ul>
            </Col>
          </Row>
          {
          error && (
            <Row>
              <Col>
                <Alert variant="danger">
                  <Alert.Heading>Erreur</Alert.Heading>
                  <p>{error.message}</p>
                </Alert>
              </Col>
            </Row>
          )
        }
          <Row className="justify-content-evenly">
            <Col xs={12} md={6} xl={4}>
              <h3>Tâches à effectuer</h3>
              {
            rame.tachesRestantes && rame.tachesRestantes.length ? (
              <ListGroup>
                {
                rame.tachesRestantes.map((tache, idx) => (
                  <ListGroup.Item
                    key={tache.idx}
                    action
                    disabled={disableAction}
                    onClick={() => dispatch({ type: 'select-tache', tache, idx })}
                    active={tache === state.tacheToShow
                      || (state.selectedTaches && state.selectedTaches[idx])}
                  >
                    {createTacheExtract(tache.tache)}
                  </ListGroup.Item>
                ))
                }
              </ListGroup>
            ) : (
              <h3>Aucune tache à effectuer</h3>
            )
          }
            </Col>
            <Col xs={12} md={6} xl={8} className={classNames('text-center')}>
              {detailComponent}
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

RameEditor.propTypes = {
  rame: MPropTypes.objectOrObservableObject.isRequired,
  operateur: PropTypes.oneOfType([PropTypes.string,
    MPropTypes.objectOrObservableObject]).isRequired,
  onRemoveRame: PropTypes.func.isRequired,
};

export default observer(RameEditor);
