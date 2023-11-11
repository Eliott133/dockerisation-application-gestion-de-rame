import React, { useContext } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import RootStore from '../RootStore';

import logoPict from '../assets/logo.png';

function AppNavbar() {
  const { rameMgr } = useContext(RootStore);
  const navigate = useNavigate();

  const disconnect = () => {
    rameMgr.currentOperator = null;
    navigate('/');
  };

  return (
    <Navbar expand="xxl" fixed="top" bg="dark" variant="dark" className="py-1">
      <Navbar.Brand as={Link} to="/">
        <img
          src={logoPict}
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt={`${APP_ENV_APP_TITLE} Logo`}
        />
        {' '}
        {APP_ENV_APP_TITLE}
        {
          rameMgr.currentOperator && ` (opérateur ${rameMgr.currentOperator})`
        }
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="AppNavbar" />
      <Navbar.Collapse id="AppNavbar">
        {
          !!rameMgr.currentOperator && (
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/management">Actions</Nav.Link>
              <Nav.Link as={NavLink} to="/history">Historique</Nav.Link>
              <Nav.Link onClick={disconnect}>Se déconnecter</Nav.Link>
            </Nav>
          )
        }
      </Navbar.Collapse>
    </Navbar>
  );
}

export default observer(AppNavbar);
