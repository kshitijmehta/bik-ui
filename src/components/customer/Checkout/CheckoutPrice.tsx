import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, Cart, getRazorPayOrder, saveRazorPayOrder, getCart, errorCheckout, getCodOrder, saveCodOrder, UserLocation, defaultCheckout, setShippingPrice } from 'reducers';
import { CustomerCart, ProductCoupon, CustomerShippment } from 'types';
import { PayPalButton, PayPalPayment, CashOnDeliveryPayment } from 'components/shared';
import { useHistory } from 'react-router-dom';
import { getCurrencyIcon, calculateUserDiscountPrice, calculateUserDiscount } from 'services';

interface Props {
  paymentMode: string;
  shippingType: string;
  setCartTotal: Dispatch<SetStateAction<number>>;
};
declare global {
  interface Window { Razorpay: any; }
}
window.Razorpay = window.Razorpay || {};

const CheckoutPrice: React.FunctionComponent<Props> = (props: Props) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [cartTotalPrice, setCartTotalPrice] = useState(0);
  const [userDiscountTotal, setUserDiscountTotal] = useState('0');
  const [totalAfterDiscount, setTotalAfterDiscount] = useState('0');
  const [userCouponTotal, setUserCouponTotal] = useState('0');
  const [discountedTotal, setDiscountedTotal] = useState('0');
  const [priceAfterShipping, setPriceAfterShipping] = useState('0');
  const [quantityCount, setQuantityCount] = useState(0);
  const [cartOrderId, setCartOrderId] = useState(0);
  const [paymentMessage, setPaymentMessage] = useState("Please don't close this window while we process your payment.")
  const [paymentError, setPaymentError] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorHappendAt, setErrorHappendAt] = useState('close');
  const cart = useSelector<AppState, Cart>(state => state.cart);
  const checkout = useSelector((state: AppState) => state.checkout);
  const userData = useSelector((state: AppState) => state.user);
  const userLocation = useSelector<AppState, UserLocation>(state => state.userLocation);
  const couponData = useSelector<AppState, ProductCoupon[]>(state => state.coupon.data || []);
  const shippingCost = useSelector<AppState, CustomerShippment>(state => state.customerShippment.data || {} as CustomerShippment);
  const paymentLoadingRef = useRef<HTMLButtonElement>(null);
  const [containerIsCard, setContainerIsCard] = useState(false);
  const [ukSticky, setUkSicky] = useState({});
  const [showCodContainer, setShowCodContainer] = useState(false);
  const [noAddressError, setNoAddressError] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState('');
  const [didPriceChanged, setDidPriceChanged] = useState(false);
  const [timeForShowPriceChange, setTimeForShowPriceChange] = useState(5);
  let timer: NodeJS.Timer;

  useEffect(() => {
    let cartPrice = 0;
    if (cart.data && cart.data.length > 0) {
      cart.data.forEach(({ totalPrice }) => {
        cartPrice += Number(totalPrice)
      });
      setCartTotalPrice(cartPrice);
      props.setCartTotal(cartPrice);
      if (couponData.length === 1) {
        let discountPrice = calculateUserDiscountPrice(userData.data?.discount || '0', cartPrice.toString());
        let priceAfterDiscount = calculateUserDiscount(userData.data?.discount || '0', cartPrice.toString());
        let couponPrice = calculateUserDiscountPrice(couponData[0].value, priceAfterDiscount.toString());
        let priceAfterCoupon = calculateUserDiscount(couponData[0].value || '0', priceAfterDiscount.toString());
        setDiscountedTotal(priceAfterDiscount);
        setUserDiscountTotal(discountPrice);
        setUserCouponTotal(couponPrice);
        setTotalAfterDiscount(priceAfterCoupon);
        calculateShippingCost(cart.data, priceAfterCoupon);

      } else {
        let discountPrice = calculateUserDiscountPrice(userData.data?.discount || '0', cartPrice.toString());
        let priceAfterDiscount = calculateUserDiscount(userData.data?.discount || '0', cartPrice.toString());
        setUserDiscountTotal(discountPrice);
        setTotalAfterDiscount(priceAfterDiscount);
        calculateShippingCost(cart.data, priceAfterDiscount);
      }
      setCartOrderId(Number(cart.data[0].orderId));
    } else {
      setCartTotalPrice(0);
      setUserDiscountTotal('0');
      setTotalAfterDiscount('0');
      setPriceAfterShipping('0')
      props.setCartTotal(0);
    }
    if (didPriceChanged) {
      setDidPriceChanged(false);
      if (timeForShowPriceChange === 0) {
        paymentLoadingRef.current?.click();
      } else {
        clearTimeout(timer);
        timer = setTimeout(() => {
          paymentLoadingRef.current?.click();
          clearTimeout(timer);
        }, 5000)
      }
    }
  }, [cart.data, userData.data, props.shippingType]);

  useEffect(() => {
    if (userLocation.data === 'IN') {
      if (checkout.data && checkout.data.orderId && props.paymentMode === 'online') {
        const {
          key,
          currency,
          orderId,
          name
        } = checkout.data
        var options = {
          "key": key,
          "currency": currency,
          "name": name,
          "description": "",
          "order_id": orderId,
          "handler": function (response: any) {
            paymentLoadingRef.current?.click();
            successRazorPay(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature)
          },
          "modal": {
            "ondismiss": function () {
              setPaymentError(true);
              dispatch(errorCheckout(''));
            }
          },
          "prefill": {
            "name": userData.data?.firstName || '' + userData.data?.lastName,
            "email": userData.data?.emailAddress,
            "contact": userData.data?.mobile
          },
          "notes": {
            "address": "Razorpay Corporate Office"
          },
          "theme": {
            "color": "#F37254"
          }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response: any) {
          setErrorHappendAt('failed');
          console.log('code', response.error.code);
          console.log('desc', response.error.description);
          console.log('source', response.error.source);
          console.log('step', response.error.step);
          console.log('reason', response.error.reason);
          console.log('metadata', response.error.metadata);
        });
        rzp1.open();
      } else if (checkout.data && checkout.data.otp && props.paymentMode === 'cod') {
        setShowCodContainer(true);
      }
    }
  }, [checkout.data]);

  useEffect(() => {
    if (checkout._priceChanged && (props.paymentMode === 'online' || props.paymentMode === 'cod')) {
      setPaymentMessage(checkout.message || '');
      dispatch(getCart());
      paymentLoadingRef.current?.click();
      setDidPriceChanged(true);
      timer = setInterval(() => {
        if (timeForShowPriceChange > 0) {
          setTimeForShowPriceChange(timeForShowPriceChange - 1);
        }
      }, 1000);
    }
  }, [checkout._priceChanged]);

  useEffect(() => {
    if (paymentError && props.paymentMode === 'online') {
      if (errorHappendAt === 'failed') {
        setPaymentMessage('Payment failure from Razorpay, please try again.');
        paymentLoadingRef.current?.click();
      } else if (errorHappendAt === 'close') {
        setPaymentMessage('Payment incomplete, please try again.');
        paymentLoadingRef.current?.click();
      }
    }
  }, [paymentError]);

  useEffect(() => {
    if (checkout._isPaymentSucceess &&
      (props.paymentMode === 'online' || props.paymentMode === 'cod')) {
        if(props.paymentMode === 'cod'){
          setPaymentMessage('Order placed !!');
        }else{
          setPaymentMessage('Payment is successful !!');
        }
      setPaymentSuccess(true);
      setPaymentError(false);
      dispatch(getCart());
      setShowCodContainer(false);
      setTimeout(() => {
        dispatch(defaultCheckout());
        paymentLoadingRef.current?.click();
        history.push('userinformation/orders');
      }, 5000);
    }
  }, [checkout._isPaymentSucceess]);

  useEffect(() => {
    if (!paymentError) {
      if (checkout._isError && props.paymentMode === 'online') {
        setPaymentMessage(checkout.message || '');
        setPaymentSuccess(false);
        setPaymentError(true);
        setErrorHappendAt('DB');
      } else if (checkout._isError && props.paymentMode === 'cod') {
        setPaymentMessage(checkout.message || '');
        setPaymentSuccess(false);
        setPaymentError(true);
        setShowCodContainer(true);
      }
    }
  }, [checkout._isError])

  useEffect(()=>{
    if(props.paymentMode !== 'cod'){
      setShowCodContainer(false)
    }
  },[props.paymentMode])
  const successRazorPay = (razorpayPaymentId: string, razorpayOrderId: string, razorpaySignature: string) => {
    dispatch(saveRazorPayOrder({
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      orderId: cartOrderId,
      orderNumber: checkout.data && checkout.data.receipt || '',
      addressId: userData.data && userData.data.addressId || '',
      couponId: couponData && couponData[0] && couponData[0].couponId
    }));
  }
  const proceedWithPayment = () => {
    if(userData.data?.addressId){
      if (props.paymentMode === 'online') {
        setPaymentError(false);
        dispatch(getRazorPayOrder(totalAfterDiscount.toString(), cartOrderId, couponData && couponData[0] && couponData[0].couponId))
      } else if (props.paymentMode === 'cod') {
        setPaymentError(false);
        dispatch(getCodOrder(totalAfterDiscount.toString(), cartOrderId, couponData && couponData[0] && couponData[0].couponId));
      }
    } else{
      setNoAddressError(true);
      setTimeout(() => {
        setNoAddressError(false);
      },3000) 
    }
  }

  useEffect(() => {
    if (containerIsCard) {
      setUkSicky({});
    } else {
      setUkSicky({
        'uk-sticky': "offset: 60; bottom: true; media: @m;"
      })
    }
  }, [containerIsCard])

  const successCod = () => {
    dispatch(saveCodOrder({
      otp: enteredOTP,
      orderId: cartOrderId,
      addressId: userData.data && userData.data.addressId || '',
      couponId: couponData && couponData[0] && couponData[0].couponId
    }));
    setPaymentMessage("Please don't close this window while we process your payment.");
    setPaymentSuccess(false);
    setPaymentError(false);
    paymentLoadingRef.current?.click();
  }

  const calculateShippingCost = (cartData: CustomerCart[], totalAfterDiscount: string) => {
    let itemCount = cartData.reduce((accumulator, cart) => ({ 'productQuantity': (Number(accumulator.productQuantity) + Number(cart.productQuantity)).toString() } as CustomerCart));
    setQuantityCount(Number(itemCount.productQuantity));
    if (props.shippingType === 'standard') {
      if (Number(itemCount.productQuantity) > 1) {
        const cost = (10 + ((Number(itemCount.productQuantity) - 1) * 6));
        dispatch(setShippingPrice({ 'shippmentPrice': cost.toString() } as CustomerShippment));
        setPriceAfterShipping((Number(totalAfterDiscount) + cost).toString());
      } else {
        dispatch(setShippingPrice({ 'shippmentPrice': '10' } as CustomerShippment));
        setPriceAfterShipping((Number(totalAfterDiscount) + 10).toString());
      }
    } else {
      if (Number(itemCount.productQuantity) > 1) {
        const cost = (18 + ((Number(itemCount.productQuantity) - 1) * 10));
        dispatch(setShippingPrice({ 'shippmentPrice': cost.toString() } as CustomerShippment));
        setPriceAfterShipping((Number(totalAfterDiscount) + cost).toString());
      } else {
        dispatch(setShippingPrice({ 'shippmentPrice': '18' } as CustomerShippment));
        setPriceAfterShipping((Number(totalAfterDiscount) + 18).toString());
      }
    }
  }
  return (
    <>
      <div className="uk-width-1-1 uk-width-1-4@m tm-aside-column">

        <div className="uk-card uk-card-default uk-card-small tm-ignore-container"
          {
          ...(
            ukSticky
          )
          }
        >
          <section className="uk-card-body">
            <h4>Items in order</h4>
            {
              cart.data && cart.data.map((cartItem: CustomerCart, index: number) => {
                return (
                  <div key={index} className="uk-grid-small" uk-grid="true">
                    <div className="uk-width-expand">
                      <div className="uk-text-small">{cartItem.productName}</div>
                      <div className="uk-text-meta">{cartItem.productQuantity} × {getCurrencyIcon(userLocation.data || 'IN')} {cartItem.productPrice}</div>
                    </div>
                    <div className="uk-text-right"><div>{getCurrencyIcon(userLocation.data || 'IN')} {cartItem.totalPrice}</div></div>
                  </div>
                )
              })
            }
          </section>
          {
            userData.data?.discount && userData.data?.discount !== '0' &&
            <section className="uk-card-body">
              <div className="uk-grid-small" uk-grid="true">
                <div className="uk-width-expand"><div className="uk-text-muted">Subtotal</div></div>
                <div className="uk-text-right"><div>{getCurrencyIcon(userLocation.data || 'IN')} {cartTotalPrice || 0}</div></div>
              </div>
              <div className="uk-grid-small" uk-grid="true">
                <div className="uk-width-expand"><div className="uk-text-muted">Discount ({userData.data?.discount}%)</div></div>
                <div className="uk-text-right"><div className="uk-text-danger">- {getCurrencyIcon(userLocation.data || 'IN')} {userDiscountTotal}</div></div>
              </div>
            </section>

          }
          {
            couponData.length === 1 &&
            <section className="uk-card-body">
              <div className="uk-grid-small" uk-grid="true">
                <div className="uk-width-expand"><div className="uk-text-muted">Discounted Total</div></div>
                <div className="uk-text-right"><div>{getCurrencyIcon(userLocation.data || 'IN')} {discountedTotal}</div></div>
              </div>
              <div className="uk-grid-small" uk-grid="true">
                <div className="uk-width-expand"><div className="uk-text-muted">Coupon ({couponData[0] && couponData[0].value}%)</div></div>
                <div className="uk-text-right"><div className="uk-text-danger">- {getCurrencyIcon(userLocation.data || 'IN')} {userCouponTotal}</div></div>
              </div>
            </section>
          }
          {
            userLocation.data !== 'IN' &&
            <section className="uk-card-body">
              <div className="uk-grid-small" uk-grid="true">
                <div className="uk-width-expand"><div className="uk-text-muted">Subtotal</div></div>
                <div className="uk-text-right"><div>{getCurrencyIcon(userLocation.data || 'IN')} {totalAfterDiscount}</div></div>
              </div>
              <div className="uk-grid-small" uk-grid="true">
                <div className="uk-width-expand"><div className="uk-text-muted">Shipping</div></div>
                <div className="uk-text-right"><div className="uk-text-success">+ {getCurrencyIcon(userLocation.data || 'IN')} {shippingCost.shippmentPrice}</div></div>
              </div>
            </section>
          }

          {
            showCodContainer && props.paymentMode==='cod' &&
            <CashOnDeliveryPayment showOtpContainer={showCodContainer} setEnteredOTP={setEnteredOTP} />
          }
          <section className="uk-card-body">
            {
              <div className="uk-grid-small uk-flex-middle" uk-grid="true">
                <div className="uk-width-expand"><div className="uk-text-muted">Total</div></div>
                {
                  userLocation.data === 'IN' ?
                    <div className="uk-text-right"><div className="uk-text-lead uk-text-bolder">{getCurrencyIcon(userLocation.data || 'IN')} {totalAfterDiscount}</div></div>
                    : <div className="uk-text-right"><div className="uk-text-lead uk-text-bolder">{getCurrencyIcon(userLocation.data || 'IN')} {priceAfterShipping}</div></div>
                }

              </div>
            }

            {
              props.paymentMode === 'paypal' &&
              cartTotalPrice !== 0 &&
              <PayPalPayment
                cartTotalPrice={totalAfterDiscount}
                cartTotalWithShipping={priceAfterShipping}
                quantityCount={quantityCount}
                isStandard={props.shippingType === 'standard'}
                paymentMode={props.paymentMode}
                setContainerIsCard={setContainerIsCard}
                cartOrderId={cartOrderId} />
            }
            {
              noAddressError && 
              <div className="login-error-message">
                    <span className="uk-notification-message-danger"> Please add contact and shipping information </span>
              </div>
            }
            {
              props.paymentMode !== 'paypal' && !showCodContainer &&
              <>
              {
                  !checkout._isFetchCodCodeSuccess && checkout._isError &&
                  <div className="login-error-message">
                    <span className="uk-notification-message-danger"> {checkout.message} </span>
                  </div>
                }
                <button
                  disabled={checkout._isLoading || cartTotalPrice === 0}
                  className="uk-button uk-button-primary uk-margin-small uk-width-1-1"
                  onClick={() => proceedWithPayment()}
                >{checkout._isLoading && <div uk-spinner="true"></div>}
              checkout</button>
                
              </>
            } {
              showCodContainer &&
              <button className="uk-button uk-button-primary uk-margin-small uk-width-1-1"
                disabled={checkout._isLoading || cartTotalPrice === 0}
                onClick={() => { checkout._isFetchCodCodeSuccess ? successCod() : proceedWithPayment() }}>
                {checkout._isFetchCodCodeSuccess ? 'Place Order' : 'Checkout'}
              </button>
            }
          </section>
        </div>
      </div>
      {
        props.paymentMode !== 'paypal' && 
        <>
        <button ref={paymentLoadingRef} id="payment-loading" uk-toggle="target: #my-id" type="button"></button>
      <div id="my-id" uk-modal="true; esc-close: false; bg-close: false">
        <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
          {
            (paymentSuccess || paymentError) && <button className="uk-modal-close-default" type="button" uk-close="true"></button>
          }
          <div className="uk-modal-body uk-nav-center">
            <p>{paymentMessage}</p>
            {
              !paymentSuccess && !paymentError && <div uk-spinner="true"></div>
            }
            {
              paymentSuccess && !paymentError &&
              <>
                <span className="uk-label uk-label-success">Redirecting to Orders <div uk-spinner="true"></div></span>
              </>
            }
            {
              paymentError && <span className="uk-label uk-label-danger">Payment Failed</span>
            }
          </div>
        </div>
      </div>
        </>
      }
      
    </>
  )
};

export {
  CheckoutPrice
}