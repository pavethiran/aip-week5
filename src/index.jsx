import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import './index.scss';
import combinedReducers from './reducers';
import { initializeApp } from './actions';
import registerServiceWorker from './registerServiceWorker';
import routes from './routes';


/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  combinedReducers,
  composeEnhancers(applyMiddleware(thunk)),
);
/* eslint-enable */

store.dispatch(initializeApp());

ReactDOM.render(
  <Provider store={store}>
    <Router>{ renderRoutes(routes) }</Router>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
