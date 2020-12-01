import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { UserInformation, UserNav, UserSettings } from '.';
import { AppState, getUserSettings } from 'reducers';
import { Orders } from './Orders';
import { useParams } from 'react-router-dom';

const UserContainer: React.FunctionComponent = () => {

  /**
   * Hooks
   */
  const { userTab } = useParams();
  const [showSettings, setShowSettings] = useState(false);
  const [showPersonal, setShowPersonal] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state: AppState) => state.user);

  const userSettings = useSelector((state: AppState) => state.userSettings)
  useEffect(() => {
    dispatch(getUserSettings());
    toggelDetails(userTab || '')
  },[]);

  useEffect(() => {
    toggelDetails(userTab || '')
  },[userTab])
  /**
   * Local Methods
   */
  const toggelDetails = (selected: string): void => {
    if(selected === 'orders') {
      setShowSettings(false);
      setShowPersonal(false);
      setShowOrders(true);
    } else if(selected === 'settings') {
      setShowSettings(true);
      setShowPersonal(false);
      setShowOrders(false);
    } else {
      setShowSettings(false);
      setShowPersonal(true);
      setShowOrders(false);
    }
  }

  return (
    <main>
        <section className="uk-section uk-section-small">
          <div className="uk-container">
            <div className="uk-grid-medium" uk-grid="true">
              <UserNav toggelDetails={toggelDetails}
                showPersonal={showPersonal} 
                showSettings={showSettings} 
                showOrders={showOrders} />
                {showPersonal && <UserInformation user={userData} />}
                {showSettings &&  <UserSettings user={userSettings}/>}
                {showOrders &&  <Orders/>}
            </div>
          </div>
        </section>
      </main>
  )
}

export {
  UserContainer
}