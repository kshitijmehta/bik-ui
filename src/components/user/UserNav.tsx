import React, { useState } from 'react';

interface Props {
  toggelDetails: Function;
  showSettings: boolean;
  showPersonal: boolean;
  showOrders: boolean;
}

const UserNav: React.FunctionComponent<Props> = (props: Props)=> {

  return (
    <div className="uk-width-1-1 uk-width-1-4@m tm-aside-column user-nave-sticky">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container" uk-sticky="offset: 50; bottom: true; width-element: true">
        <div className="uk-card-header">
          <div className="uk-grid-small uk-child-width-1-1" uk-grid="true">
            <div>
              <div className="uk-grid-small uk-flex-center" uk-grid="true">
                <div>
                  <a className="uk-button uk-button-default uk-button-small"><span className="uk-margin-xsmall-right" uk-icon="icon: cog; ratio: .75;"></span><span>Quick Links</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <nav>
            <ul className="uk-nav uk-nav-default tm-nav quick-links">
              <li className={props.showPersonal ? 'uk-active' : ''}>
                <a onClick={(): void => {props.toggelDetails('personal')}}>Personal Information</a>
              </li>
              <li className={props.showOrders ? 'uk-active' : ''}>
                <a onClick={(): void => {props.toggelDetails('orders')}}>Orders</a>
              </li>
              <li className={props.showSettings ? 'uk-active' : ''}>
                <a onClick={(): void => {props.toggelDetails('settings')}}>Settings</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export { UserNav };