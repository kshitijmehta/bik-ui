import React from 'react';
import { useHistory } from "react-router-dom";
import { SubProducts } from 'appConstants';

interface Props{
  subProductToggle: Function;
  addEditToggle: Function;
}

const AdminNav: React.FunctionComponent<Props> = (props: Props) => {
  const { subProductToggle, addEditToggle } = props;
  const history = useHistory();

  return (
    <div className="uk-width-1-1 uk-width-1-4@m tm-aside-column">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container" uk-sticky="offset: 90; bottom: true; media: @m;">
        <div className="uk-card-header">
          <div className="uk-grid-small uk-flex-center" uk-grid="true">
            <div>
              <a className="uk-button uk-button-default uk-button-small" onClick={() => {addEditToggle(false); history.push('/admin')}}>
                <span className="uk-margin-xsmall-right" uk-icon="icon: cog; ratio: .75;"></span>
                <span>View/Edit</span>
              </a>
            </div>
            <div>
              <button className="uk-button uk-button-default uk-button-small" title="Add"
              onClick={() => addEditToggle(true)}>
                <span uk-icon="icon: sign-out; ratio: .75;"></span>
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
        <div>
          <nav>
            <ul className="uk-nav uk-nav-default tm-nav">
              <li>
                <a onClick={() => subProductToggle(SubProducts.USERS)}>Users</a>
              </li>
              <li>
                <a onClick={() => subProductToggle(SubProducts.PRODUCT)}>Products</a>
              </li>
              <li>
                <a onClick={() => subProductToggle(SubProducts.SUB_PRODUCT)}>Sub-Category</a>
              </li>
              <li>
                <a onClick={() => subProductToggle(SubProducts.SIZE)}>Size</a>
              </li>
              <li>
                <a onClick={() => subProductToggle(SubProducts.COLOUR)}>Colour</a>
              </li>
              <li>
                <a onClick={() => subProductToggle(SubProducts.COUPONS)}>Coupons</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export {
  AdminNav
}