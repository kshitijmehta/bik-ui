import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { UserInformation, UserNav, UserSettings } from '.';
import { getUser, AppState, getUserSettings } from 'reducers';

const UserContainer: React.FunctionComponent = () => {

  /**
   * Hooks
   */
  const [showSettings, setShowSettings] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state: AppState) => state.user)
  useEffect(() => {
    dispatch(getUser());
  },[]);

  const userSettings = useSelector((state: AppState) => state.userSettings)
  useEffect(() => {
    dispatch(getUserSettings());
  },[]);

  /**
   * Local Methods
   */
  const toggelDetails = (selected: string): void => {
    if(selected === 'personal') {
      setShowSettings(false);
    } else {
      setShowSettings(true);
    }
  }

  return (
    <main>
        <section className="uk-section uk-section-small">
          <div className="uk-container">
            <div className="uk-grid-medium" uk-grid="true">
              <UserNav toggelDetails={toggelDetails}/>
               { !showSettings && <UserInformation user={userData} />}
              {showSettings &&  <UserSettings user={userSettings}/>}
            </div>
          </div>
        </section>
      </main>
  )
}

export {
  UserContainer
}