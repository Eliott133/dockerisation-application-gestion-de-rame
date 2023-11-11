import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import AppNavbar from './AppNavbar';

export default function Root() {
  return (
    <>
      <AppNavbar />
      <main>
        <Container fluid>
          <Outlet />
        </Container>
      </main>
    </>
  );
}
