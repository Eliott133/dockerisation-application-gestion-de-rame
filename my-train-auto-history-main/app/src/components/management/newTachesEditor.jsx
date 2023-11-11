import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import {
  Button, Form, InputGroup, ListGroup,
} from 'react-bootstrap';

function newTachesEditor({ taches, onNewTache, onRemoveTache }) {
  const [newTache, setNewTache] = useState('');

  const addNewTache = () => {
    const cleanedNewTache = newTache.trim();
    if (!cleanedNewTache) {
      setNewTache(cleanedNewTache);
    } else {
      onNewTache(cleanedNewTache);
      setNewTache('');
    }
  };
  return (
    <>
      <Form.Group className="mb-3" controlId="formAddNewTache">
        <Form.Label>Nouvelle tache</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control as="textarea" aria-label="nouvelle tache" value={newTache} onChange={(e) => setNewTache(e.target.value)} />
          <Button variant="outline-success" onClick={addNewTache}>Add</Button>
        </InputGroup>
      </Form.Group>
      <ListGroup className="mb-3">
        {
          taches.map((tache, idx) => (
            /* eslint-disable-next-line react/no-array-index-key */
            <InputGroup key={idx}>
              <Form.Control as="textarea" aria-label="nouvelle tache" value={tache} disabled />
              <Button variant="outline-danger" onClick={() => onRemoveTache(idx)}>Suppr</Button>
            </InputGroup>
          ))
        }
      </ListGroup>
    </>
  );
}

newTachesEditor.propTypes = {
  taches: MPropTypes.arrayOrObservableArray.isRequired,
  onNewTache: PropTypes.func.isRequired,
  onRemoveTache: PropTypes.func.isRequired,
};

export default observer(newTachesEditor);
