import React from 'react';
// import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import { Form } from 'react-bootstrap';

function TacheView({ tache }) {
  return (
    <Form.Control as="textarea" aria-label="Tache" value={tache.tache} readOnly />
  );
}

TacheView.propTypes = {
  tache: MPropTypes.objectOrObservableObject.isRequired,
};

export default observer(TacheView);
