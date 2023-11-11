import React, {
  useContext, useEffect, useReducer,
} from 'react';
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import {
  Alert,
  Button, Col, ListGroup, Row,
} from 'react-bootstrap';
import RootStore from '../../RootStore';
import NewRameEditor from './NewRameEditor';
import RameEditor from './RameEditor';

function initState() {
  return {
    editNewRame: false,
    editRame: false,
    selectedRame: null,
  };
}

function reduceState(state, action) {
  switch (action?.type) {
    case 'switch-edit-new-rame':
      return {
        ...state, editRame: false, editNewRame: true, selectedRame: null,
      };
    case 'switch-edit-rame':
      return {
        ...state,
        editRame: action.rame !== state.selectedRame,
        editNewRame: false,
        selectedRame: action.rame !== state.editRame ? action.rame : null,
      };
    case 'switch-no-edit':
      return {
        ...state, editRame: false, editNewRame: false, selectedRame: null,
      };
    default:
      throw new Error(`Illegal action type: ${action.type}`);
  }
}

function RameManagement() {
  const { rameMgr } = useContext(RootStore);
  const [state, dispatch] = useReducer(reduceState, initState());

  useEffect(() => {
    rameMgr.getRames();
  }, []);

  const disableAction = rameMgr.isloading;
  const error = rameMgr.loadingError;

  let detailComponent;
  if (state.editNewRame) {
    detailComponent = <NewRameEditor onRameCreated={() => dispatch({ type: 'switch-no-edit' })} />;
  } else if (state.editRame) {
    detailComponent = (
      <RameEditor
        rame={state.selectedRame}
        operateur={rameMgr.currentOperator}
        onRemoveRame={(r) => rameMgr.removeRame({ rameNumSerie: r.numSerie }).finally(() => dispatch({ type: 'switch-no-edit' }))}
      />
    );
  } else {
    detailComponent = <Button size="xl" onClick={() => dispatch({ type: 'switch-edit-new-rame' })} variant="primary">Rentrer une rame</Button>;
  }

  return (
    <Row className={classNames('align-items-center')}>
      <Col>
        <Row className="mb-4">
          <Col><h1>Gestion des rames</h1></Col>
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
          <Col xs={12} md={4} xl={2}>
            {
            rameMgr.rames && rameMgr.rames.length ? (
              <ListGroup>
                {
                rameMgr.rames.map((rame) => (
                  <ListGroup.Item key={rame.numSerie} action disabled={disableAction} onClick={() => dispatch({ type: 'switch-edit-rame', rame })}>
                    {`${rame.numSerie} (${rame.typeRame})`}
                  </ListGroup.Item>
                ))
                }
              </ListGroup>
            ) : (
              <h3>Aucune rame présente</h3>
            )
          }
          </Col>
          <Col xs={12} md={8} xl={10} className={classNames('text-center')}>
            {detailComponent}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default observer(RameManagement);
