import React, { useContext, useState } from 'react';
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Button, Col, Form, Row,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import RootStore from '../RootStore';

function Login() {
  const { rameMgr } = useContext(RootStore);
  const [username, setUsername] = useState(rameMgr.currentOperator ?? '');
  const navigate = useNavigate();

  const submitUsername = (e) => {
    e.preventDefault();
    const cleanedUsername = username.trim();
    if (!cleanedUsername) {
      setUsername('');
    } else {
      rameMgr.currentOperator = cleanedUsername;
      navigate('/management');
    }
  };

  return (
    <Row className={classNames('align-items-center', 'justify-content-center', 'vh-full')}>
      <Col xs={12} md={6} xl={4}>
        <Form onSubmit={submitUsername}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Opérateur</Form.Label>
            <Form.Control
              type="text"
              size="lg"
              placeholder="Votre nom d'opérateur"
              maxLength={50}
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="success" size="lg">Valider</Button>
        </Form>
      </Col>
    </Row>
  );
}

export default observer(Login);
