import React from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import { Button, Modal } from 'react-bootstrap';

function RameDeletionConfirmation({
  rame, show, onDelete, onCancel,
}) {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation de sortie</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Êtes-vous certain de retirer la rame&nbsp;
          {rame.numSerie}
          &nbsp;?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button variant="danger" onClick={onDelete}>Retirer la rame</Button>
      </Modal.Footer>
    </Modal>
  );
}

RameDeletionConfirmation.propTypes = {
  rame: MPropTypes.objectOrObservableObject.isRequired,
  show: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

RameDeletionConfirmation.defaultProps = {
  show: false,
};

export default observer(RameDeletionConfirmation);
