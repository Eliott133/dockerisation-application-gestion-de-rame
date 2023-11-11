import React from 'react';
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
// import PropTypes from 'prop-types';
// import classNames from 'classnames';
import Root from './components/Root';
import FatalError from './components/FatalError';
import RootStore from './RootStore';
import STORE from './store';

import './App.scss';
import Login from './components/Login';
import RameManagement from './components/management/RameManagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <FatalError />,
    children: [
      {
        index: true,
        element: <Login />,
        loader: () => {
          const { rameMgr } = STORE;
          if (rameMgr.currentOperator) {
            throw redirect('/management');
          }
          return true;
        },
      },
      {
        path: 'management',
        element: <RameManagement />,
        loader: () => {
          const { rameMgr } = STORE;
          if (!rameMgr.currentOperator) {
            throw redirect('/');
          }
          return true;
        },
      },
      {
        path: 'history',
        element: <div>History</div>,
        loader: () => {
          const { rameMgr } = STORE;
          if (!rameMgr.currentOperator) {
            throw redirect('/');
          }
          return true;
        },
      },
    ],
  },
]);

export default function App() {
  return (
    <RootStore.Provider value={STORE}>
      <RouterProvider router={router} />
    </RootStore.Provider>
  );
}
