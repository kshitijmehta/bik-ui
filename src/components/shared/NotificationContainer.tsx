import React from 'react';

interface Props {
  _isError: boolean,
  _isSuccess: boolean,
  message?: string
}

const NotificationContainer : React.FunctionComponent<Props> = (props: Props) => {
  const { 
    _isError,
    _isSuccess,
    message
  } = props;
  return (
    <>
    {
      _isError &&
      <div className="login-error-message">
        <span className="uk-notification-message-danger"> {message} </span>
      </div>
    }
    {
      _isSuccess &&
      <div className="login-error-message">
        <span className="uk-notification-message-success"> {message} </span>
      </div>
    }
    </>
  )
}

export {
  NotificationContainer
}