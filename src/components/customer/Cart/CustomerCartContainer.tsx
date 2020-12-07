import React from 'react';
import { useHistory } from 'react-router-dom';
import { CartDetails } from './CartDetails';
import { CartPrice } from './CartPrice';

const CustomerCartContainer: React.FunctionComponent = () => {
  const history = useHistory();
  return (
    <main>
      <section className="uk-section uk-section-small">
        <div className="uk-container">
          <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
            <div className="uk-text-center">
              <ul className="uk-breadcrumb uk-flex-center uk-margin-remove">
                <li><a onClick={()=>history.push('/')}>Home</a></li>
                <li><span>Cart</span></li>
              </ul>
              <h1 className="uk-margin-small-top uk-margin-remove-bottom">Cart</h1>
            </div>
            <div>
              <div className="uk-grid-medium" uk-grid="true">
                <CartDetails/>
                <CartPrice/>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export {
  CustomerCartContainer
}