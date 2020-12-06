import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from 'history';

import './index.css';
import { UserContainer } from 'components/user';
import { UserLogin } from 'components/login'
import { MainFooter } from 'components/footer';
import { MobileNavigation, Navigation } from 'components/pilot';
import { MainContainer } from 'components/admin/MainContainer';
import { CustomerContainer } from 'components/customer';

import * as serviceWorker from './serviceWorker';
import { store } from 'reducers';
import { CustomerProductDetails } from 'components/customer/ProductDetails';
import { CustomerProductDetailsConstainer } from 'components/customer/ProductDetails/CustomerProductDetailsContainer';
import { CustomerCartContainer } from 'components/customer/Cart';
import { CheckoutContainer } from 'components/customer/Checkout';
import { HomePageContainer } from 'components/customer/Home';
import {ContactUs, ScrollToTop} from 'components/shared';



const app = (
  <Provider store={store}>
    <React.StrictMode>
      <Router history={createBrowserHistory()}>
      <ScrollToTop />
        <Navigation />
        <MobileNavigation/>
          <Switch>
          <Route path="/" exact>
              <HomePageContainer />
            </Route>
            <Route path="/userinformation/:userTab?" exact>
              <UserContainer />
            </Route>
            <Route path="/login" exact>
              <UserLogin />
            </Route>
            <Route path="/admin/:product?/:productId?" exact>
              <MainContainer />
            </Route>
            <Route path="/product/:product/:filterOn?" exact>
              <CustomerContainer />
            </Route>
            <Route path="/productDetails/:queryProductId" exact>
              <CustomerProductDetailsConstainer />
            </Route>
            <Route path="/cart" exact>
              <CustomerCartContainer/>
            </Route>
            <Route path="/checkout" exact>
              <CheckoutContainer/>
            </Route>
            <Route path="/contactus" exact>
              <ContactUs/>
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
