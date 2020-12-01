import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { SubProducts } from 'appConstants';

interface Props{
  subProductToggle: Function;
  addEditToggle: Function;
}

const AdminNav: React.FunctionComponent<Props> = (props: Props) => {
  const { subProductToggle, addEditToggle } = props;
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState(1);
  const [isOnList, setIsOnList] = useState(true);

  const {product, productId} = useParams();

  useEffect(() => {
    if(product == 'product' && productId){
      setSelectedTab(SubProducts.PRODUCT)
    }
  },[product, productId])

  return (
    <div className="uk-width-1-1 uk-width-1-4@m tm-aside-column">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container" uk-sticky="offset: 90; bottom: true; media: @m;">
        <div className="uk-card-header">
          <div className="uk-grid-small uk-flex-center" uk-grid="true">
            <div>
              <a className={`${isOnList? 'uk-button uk-button-default uk-button-small uk-active' : 'uk-button uk-button-default uk-button-small'}`}
              onClick={() => {addEditToggle(false);setIsOnList(true); history.push('/admin')}}>
                <span className="uk-margin-xsmall-right" uk-icon="icon: cog; ratio: .75;"></span>
                <span>List</span>
              </a>
            </div>
            <div>
              <button className={`${!isOnList? 'uk-button uk-button-default uk-button-small uk-active' : 'uk-button uk-button-default uk-button-small'}`}
               title="Add"
                onClick={() => {addEditToggle(true); ;setIsOnList(false)}}
                disabled={selectedTab === SubProducts.USERS || selectedTab === SubProducts.ORDERS}
                >
                <span uk-icon="icon: sign-out; ratio: .75;"></span>
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
        <div>
          <nav>
            <ul className="uk-nav uk-nav-default tm-nav">
              <li className={`${selectedTab === SubProducts.USERS ? 'uk-active': ''}`}>
                <a onClick={() => {subProductToggle(SubProducts.USERS);setIsOnList(true);addEditToggle(false);setSelectedTab(SubProducts.USERS)}}>Users</a>
              </li>
              <li className={`${selectedTab === SubProducts.ORDERS ? 'uk-active': ''}`}>
                <a onClick={() => {subProductToggle(SubProducts.ORDERS);setIsOnList(true);addEditToggle(false);setSelectedTab(SubProducts.ORDERS)}}>Orders</a>
              </li>
              <li className={`${selectedTab === SubProducts.PRODUCT ? 'uk-active': ''}`}>
                <a onClick={() => {subProductToggle(SubProducts.PRODUCT);setSelectedTab(SubProducts.PRODUCT)}}>Products</a>
              </li>
              <li className={`${selectedTab === SubProducts.SUB_PRODUCT ? 'uk-active': ''}`}>
                <a onClick={() => {subProductToggle(SubProducts.SUB_PRODUCT);setSelectedTab(SubProducts.SUB_PRODUCT)}}>Sub-Category</a>
              </li>
              <li className={`${selectedTab === SubProducts.SIZE ? 'uk-active': ''}`}>
                <a onClick={() => {subProductToggle(SubProducts.SIZE);setSelectedTab(SubProducts.SIZE)}}>Size</a>
              </li>
              <li className={`${selectedTab === SubProducts.COLOUR ? 'uk-active': ''}`}>
                <a onClick={() => {subProductToggle(SubProducts.COLOUR);setSelectedTab(SubProducts.COLOUR)}}>Colour</a>
              </li>
              <li className={`${selectedTab === SubProducts.COUPONS ? 'uk-active': ''}`}>
                <a onClick={() => {subProductToggle(SubProducts.COUPONS);setSelectedTab(SubProducts.COUPONS)}}>Coupons</a>
              </li>
              <li className={`${selectedTab === SubProducts.SHIPPER ? 'uk-active': ''}`}>
                <a onClick={() => {subProductToggle(SubProducts.SHIPPER);setSelectedTab(SubProducts.SHIPPER)}}>Shipper</a>
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