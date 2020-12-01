import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'reducers';
import { User } from 'types';

const UserDetails: React.FunctionComponent = () => {
  const userData = useSelector<AppState, User>(state => state.user.data || {} as User);
  console.log(userData)
  return (
    <div className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
        <header className="uk-card-header"><h1 className="uk-h2">Order Summay</h1></header>
        <div className="uk-card-body">
          <div className="uk-form-stacked">
            <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
            <fieldset className="uk-fieldset">
                  <legend className="uk-h4">#User Details</legend>
                  <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-4@s" uk-grid="true">
                    <div>
                      <label>
                        <div className="uk-form-label">Name</div>
                        <span className="uk-text-small">
                          {userData.firstName + ' ' + userData.lastName}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">Mobile</div>
                        <span className="uk-text-small">{userData.mobile}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">Email</div>
                        <span className="uk-text-small">{userData.emailAddress}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">Discount</div>
                        <span className="uk-text-small">{userData.discount || 0}%</span>
                      </label>
                    </div>
                  </div>
                  <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-4@s" uk-grid="true">
                    <div>
                      <label>
                        <div className="uk-form-label">Country</div>
                        <span className="uk-text-small">{userData.country}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">State</div>
                        <span className="uk-text-small">{userData.state}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">City</div>
                        <span className="uk-text-small">{userData.city}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">Pincode</div>
                        <span className="uk-text-small">{userData.pincode}</span>
                      </label>
                    </div>
                  </div>
                  <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-1@s" uk-grid="true">
                    <div>
                      <label>
                        <div className="uk-form-label">Address</div>
                        <span className="uk-text-small">
                          {
                            userData.addressLineOne
                            + ' ' +
                            userData.addressLineTwo
                            + ' ' +
                            userData.addressLineThree
                          }
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="uk-divider-icon"></div>
                </fieldset>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {
  UserDetails
}