import React, { useState } from 'react';

interface Props {
  toggelDetails: Function;
}

const UserNav: React.FunctionComponent<Props> = (props: Props)=> {
  const [isPersonalInfo, setIsPersonalInfo] = useState(true);
  return (
    <div className="uk-width-1-1 uk-width-1-4@m tm-aside-column">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container" uk-sticky="offset: 90; bottom: true; media: @m;">
        <div className="uk-card-header">
          <div className="uk-grid-small uk-child-width-1-1" uk-grid="true">
            <section>
              <div className="uk-width-1-3 uk-width-1-4@s uk-width-1-2@m uk-margin-auto uk-visible-toggle uk-position-relative uk-border-circle uk-overflow-hidden uk-light">
                <img className="uk-width-1-1" src="/thomas.svg" />
                <a className="uk-link-reset uk-overlay-primary uk-position-cover uk-hidden-hover" href="#">
                  <div className="uk-position-center"><span uk-icon="icon: camera; ratio: 1.25;"></span></div>
                </a>
              </div>
            </section>
            <div className="uk-text-center">
              <div className="uk-h4 uk-margin-remove">Tarun Batra</div>
              <div className="uk-text-meta">Joined June 6, 2018</div>
            </div>
            <div>
              <div className="uk-grid-small uk-flex-center" uk-grid="true">
                <div>
                  <a className="uk-button uk-button-default uk-button-small" onClick={(): void => {props.toggelDetails('settings'); setIsPersonalInfo(false)}}><span className="uk-margin-xsmall-right" uk-icon="icon: cog; ratio: .75;"></span><span>Settings</span></a>
                </div>
                <div>
                  <button className="uk-button uk-button-default uk-button-small" title="Log out"><span uk-icon="icon: sign-out; ratio: .75;"></span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <nav>
            <ul className="uk-nav uk-nav-default tm-nav">
              <li className={!isPersonalInfo ? 'uk-active' : ''}>
                <a onClick={(): void => {props.toggelDetails('settings'); setIsPersonalInfo(false)}}>Orders <span>(2)</span></a>
              </li>
              <li className={isPersonalInfo ? 'uk-active' : ''}>
                <a onClick={(): void => {props.toggelDetails('personal'); setIsPersonalInfo(true)}}>Personal Info</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export { UserNav };