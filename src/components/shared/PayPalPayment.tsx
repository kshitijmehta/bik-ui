import React, { useEffect, useRef, useState, Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPayPalOrder, AppState, savePayPalOrder, getCart, defaultCheckout } from 'reducers';
import { useHistory } from 'react-router-dom';
import { ProductCoupon } from 'types';
declare global {
  interface Window { paypal: any,paypalOrderId:any, didPriceChanged: boolean, paypalButton: any }
}

interface Props {
  cartTotalPrice: string;
  cartTotalWithShipping: string;
  quantityCount: number;
  isStandard: boolean;
  paymentMode: string;
  setContainerIsCard: Dispatch<SetStateAction<boolean>>;
  cartOrderId:number;
}
const PayPalPayment : React.FunctionComponent<Props> = (props: Props) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const paypalPaymentLoadingRef = useRef<HTMLButtonElement>(null);
  const paypalModalRef = useRef<HTMLDivElement>(null)
  const checkout = useSelector((state: AppState) => state.checkout);
  const userData = useSelector((state: AppState) => state.user);
  const couponData = useSelector<AppState, ProductCoupon[]>(state => state.coupon.data || []);
  const [paypalPaymentMessage, setPaypalPaymentMessage] = useState("Please don't close this window while we process your payment.");
  const [paypalOrderId, setPayPalOrderId] = useState('');
  const [paymentErroredOut, setPaymentErroredOut] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isCard, setIsCard] = useState(false);

  useEffect(()=>{
    if(props.paymentMode === 'paypal' && checkout.data && checkout.data.orderId){
      setPayPalOrderId(checkout.data.orderId);
      window.paypalOrderId = checkout.data.orderId
    }
  },[checkout.data]);

  useEffect(() => {
    if(props.cartTotalPrice !== '0'){
      if (window.paypalButton) {
        window.paypalButton.close();
        delete window.paypalButton;
        // setTimeout(()=>{
        //   history.go(0)
        // })
      }
      window.paypalButton = window.paypal.Buttons({
        createOrder: function () {
          if(!window.paypalOrderId){
            if(!window.didPriceChanged){
              togglePaymenModal('c');
            }
            return false;
          } else {
            paypalPaymentLoadingRef.current?.click();
            return window.paypalOrderId;
          }
        },
        onCancel: function (err:any) {
          fundingType('credit');
          window.paypalOrderId = '';
        },
        onApprove:function(data:any,actions:any) {
          togglePaymenModal('b');
          return actions.order.capture().then(function(details:any)  {
            successPaypalPayment(data,details);
           });
        },
        onClick: async function (d: any) {
          window.paypalOrderId = '';
          fundingType(d.fundingSource);
          togglePaymenModal('d');
          await dispatch(getPayPalOrder(props.cartTotalPrice.toString(), props.cartTotalWithShipping.toString(),props.cartOrderId,couponData && couponData[0] && couponData[0].couponId))
        },
        onError: function(data: any){
          console.log('error')
          console.log(data)
        }
      });
      window.paypalButton.render('#paypal-button-container')
    }
    
  },[props.cartTotalPrice,props.cartTotalWithShipping]);

  useEffect(()=> {
    if(checkout._priceChanged && props.paymentMode === 'paypal') {
      window.didPriceChanged= true;
      setPaypalPaymentMessage(checkout.message || '');
      setTimeout(() => {
        window.didPriceChanged = false;
        history.go(0);
        togglePaymenModal('e');
      },5000);
    }
  },[checkout._priceChanged]);

  const togglePaymenModal = (tt?:string) => {
    paypalPaymentLoadingRef.current?.click();
  };

  const fundingType = (funding: string) => {
    console.log(funding)
    if(funding === 'card'){
      setIsCard(true);
      if(window.innerWidth > 959){
        window.scrollTo({
          top: 150,
          behavior: 'smooth'
        })
      }
      props.setContainerIsCard(true);

    }else {
      if(window.innerWidth > 959){
        window.scrollTo(0,0);
      }
      setTimeout(()=>{
        setIsCard(false);
      props.setContainerIsCard(false)
      },
      1000)
    }
      setPaypalPaymentMessage("Please don't close this window while we process your payment.");
      setPaymentErroredOut(false);
      setPaymentSuccess(false);
  }


  useEffect(() => {
    if(checkout._isPaymentSucceess){
      setPaymentErroredOut(false);
      setPaymentSuccess(true);
      setPaypalPaymentMessage(checkout.message || "");
      setTimeout(() => {
        dispatch(defaultCheckout());
        togglePaymenModal('f');
        history.push('userinformation/orders');
      }, 5000);
    } else if(!checkout._isPaymentSucceess && checkout._isError) {
      setPaymentErroredOut(true);
      setPaymentSuccess(false);
      setPaypalPaymentMessage(checkout.message || "");
    }
  },[checkout._isPaymentSucceess,checkout._isError])
  const successPaypalPayment = (orderData: string, paymentData: string) => {

    dispatch(savePayPalOrder({
      paypalResponse: {
        orderData,
        paymentData,
      },
      orderId: props.cartOrderId,
      addressId: userData.data && userData.data.addressId || '',
      quantity: props.quantityCount,
      couponId: couponData && couponData[0] && couponData[0].couponId,
      isStandard: props.isStandard,
      userAddress: userData.data?.addressLineOne + ' ' + userData.data?.addressLineTwo + ' ' +
      userData.data?.addressLineThree + ' ' + userData.data?.city + ' ' + userData.data?.state +
      ' ' + userData.data?.pincode + ' ' + userData.data?.country,
      userName: userData.data?.firstName + ' ' + userData.data?.lastName
    }))
  };

  return(
    <>
      <div id="paypal-button-container"></div>
      <button ref={paypalPaymentLoadingRef} id="payment-loading" uk-toggle="target: #paypal-div" type="button">order</button>
      <div id="paypal-div" uk-modal="true; esc-close: false; bg-close: false">
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        {
          (paymentSuccess || paymentErroredOut)  &&  <button className="uk-modal-close-default" type="button" uk-close="true"></button>
        }
        <div ref={paypalModalRef} className="uk-modal-body uk-nav-center">
          <p>{paypalPaymentMessage}</p>
            {
              !paymentSuccess && !paymentErroredOut && <div  uk-spinner="true"></div>
            }
            {
              paymentSuccess && !paymentErroredOut && 
              <>
              <span className="uk-label uk-label-success">Redirecting to Orders <div  uk-spinner="true"></div></span>
              </>
            }
            {
              paymentErroredOut && <span className="uk-label uk-label-danger">Payment Failed</span> 
            } 
        </div>
        </div>
      </div>
    </>
  )
}

export {
  PayPalPayment
}