import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, resendOTP } from 'reducers';

interface Props{
  showOtpContainer: boolean;
  setEnteredOTP: Dispatch<SetStateAction<string>>;
}


const CashOnDeliveryPayment: React.FunctionComponent<Props> = (props: Props) => {
  const {
    showOtpContainer
  } = props;

  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(30);
  const [enteredOTP, setEnteredOTP] = useState('');
  const checkout = useSelector((state: AppState) => state.checkout);

  useEffect(()=> {
    if(showOtpContainer){
      const timer = setInterval(() => {
        if(timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        }
      },1000);
      return () => clearTimeout(timer);
    }
  });

  const resendOtpToCustomer = () => {
    dispatch(resendOTP());
    setTimeLeft(30)
  };
  return (
    <section className="uk-card-body">
      <div className="uk-grid-small  uk-child-width-1-1 uk-child-width-1-2@s" uk-grid="true">
        <div className="uk-width-expand">
          <div className="uk-text-small">Enter OTP</div>
          {
            timeLeft > 0 && !checkout._isError &&
            <div className="uk-text-meta uk-text-small uk-text-danger">Retry in {timeLeft}sec</div>
          }
        </div>
        <div className="uk-text-right">
          <input 
            className="uk-input"
            type="text"
            value={enteredOTP}
            onChange={(e) => {setEnteredOTP(e.currentTarget.value); props.setEnteredOTP(e.currentTarget.value)}}/>
          {
             timeLeft === 0 && !checkout._isError &&
             <a 
            className="uk-text-meta uk-text-small uk-text-success uk-link-muted"
            onClick={()=> resendOtpToCustomer()}>Resend OTP</a>
          }
        </div>
      </div>
      {
        checkout._isError && 
      <div className="uk-text-meta uk-text-small uk-text-danger">{checkout.message}</div>
      }
      {
        checkout._isFetchCodCodeSuccess && 
        <div className="login-error-message">
        <span className="uk-notification-message-success uk-text-meta uk-text-small uk-text-success"> {checkout.message} </span>
      </div>
      }
      
    </section>
  )
}

export {
  CashOnDeliveryPayment
}