import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import {
  Button, Col, Row, Stack,
} from 'react-bootstrap';
import NewTachesEditor from './newTachesEditor';

function RameAddTaskEditor({ onValidateNewTaches, onCancel }) {
  const [taches, setTaches] = useState([]);

  const addNewTache = (tache) => setTaches([...taches, tache]);

  const removeTache = (idx) => setTaches([...taches.slice(0, idx), ...taches.slice(idx + 1)]);

  return (
    <>
      <Row>
        <Col>
          <Stack gap={2}>
            <Button size="xl" variant="warning" onClick={onCancel}>Annuler</Button>
            {
              taches.length > 0 && (
                <Button size="xl" variant="primary" onClick={() => onValidateNewTaches(taches)}>Enregistrer les nouvelles tâches</Button>
              )
            }
          </Stack>
        </Col>
      </Row>
      <Row>
        <Col>
          <NewTachesEditor taches={taches} onNewTache={addNewTache} onRemoveTache={removeTache} />
        </Col>
      </Row>
    </>
  );
}

RameAddTaskEditor.propTypes = {
  onValidateNewTaches: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default observer(RameAddTaskEditor);
