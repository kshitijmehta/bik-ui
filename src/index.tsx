import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from 'history';

import './index.css';
import { UserContainer } from 'components/user';
import { UserLogin } from 'components/login'
import { MainFooter } from 'components/footer';
import { Navigation } from 'components/pilot';
import { MainContainer } from 'components/admin/MainContainer';

import * as serviceWorker from './serviceWorker';
import { store } from 'reducers';



const app = (
  <Provider store={store}>
    <React.StrictMode>
      <Router history={createBrowserHistory()}>
        <Navigation />
          <Switch>
            <Route path="/userinformation" exact>
              <UserContainer />
            </Route>
            <Route path="/login" exact>
              <UserLogin />
            </Route>
            <Route path="/admin/:product?/:productId?" exact>
              <MainContainer />
            </Route>
          </Switch>
        <MainFooter />
      </Router>
    </React.StrictMode>
  </Provider>
);

ReactDOM.render(
  app,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
