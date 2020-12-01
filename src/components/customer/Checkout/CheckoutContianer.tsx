import React, { useState, useEffect } from 'react';
import { UserInformation } from 'components/user';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, UserLocation, getUser } from 'reducers';
import { CheckoutPrice } from './CheckoutPrice';
import { useHistory } from 'react-router-dom';


const CheckoutContainer: React.FunctionComponent = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const [paymentMode, setPaymentMode] = useState('online');
  const [cartTotal, setCartTotal] = useState(0);
  const [internationalShipping,setInternationalShipping] = useState('standard');
  const userData = useSelector((state: AppState) => state.user);
  const userLocation = useSelector<AppState, UserLocation>(state => state.userLocation);

  useEffect(() => {
    if (userLocation.data === 'USD') {
      setPaymentMode('paypal');
    }
  }, [userLocation.data]);

  useEffect(() => {
    dispatch(getUser());
  },[])
  return (
    <main>
      <section className="uk-section uk-section-small">
        <div className="uk-container">
          <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
            <section className="uk-text-center">
              <a className="uk-link-muted uk-text-small" onClick={()=> history.push('/cart')}><span className="uk-margin-xsmall-right" uk-icon="icon: arrow-left; ratio: .75;"></span>Return to cart</a>
              <h1 className="uk-margin-small-top uk-margin-remove-bottom">Checkout</h1>
            </section>
            <section>
              <div className="uk-grid-medium" uk-grid="true">
                <div className="uk-form-stacked uk-width-1-1 tm-checkout uk-width-expand@m">
                  <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
                    <section>
                      <h2 className="tm-checkout-title">Contact And Shipping Information</h2>
                      <div className="uk-grid-medium" uk-grid="true">
                        <UserInformation user={userData} fromCart={true} />
                      </div>
                    </section>
                    {
                      userLocation.data === 'IN' &&
                      <section>
                        <h2 className="tm-checkout-title">Payment</h2>
                        <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
                          <div className="uk-card-body">
                            <div className="uk-grid-small uk-grid-match uk-child-width-1-1 uk-child-width-1-2@s uk-flex-center" uk-switcher="toggle: &gt; * &gt; .tm-choose" uk-grid="true">
                              <div onClick={() => setPaymentMode('online')}>
                                <a className={paymentMode === "online" ? "tm-choose uk-active" : "tm-choose"} href="#">
                                  <div className="tm-choose-title">Online (via Razorpay)</div>
                                  <div className="tm-choose-description">Visa, MasterCard, all Other Cards</div>
                                </a>
                              </div>
                              <div onClick={() => setPaymentMode('cod')}>
                                <a className={paymentMode === "cod" ? "tm-choose uk-active" : "tm-choose"} href="#">
                                  <div className="tm-choose-title">Cash On Delivery</div>
                                  <div className="tm-choose-description">Order now pay later</div>
                                </a>
                              </div>
                            </div>
                          </div>

                        </div>
                      </section>
                    }
                    {
                      userLocation.data !== 'IN' &&
                      <section>
                        <h2 className="tm-checkout-title">Shippment</h2>
                        <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
                          <div className="uk-card-body">
                            <div className="uk-grid-small uk-grid-match uk-child-width-1-1 uk-child-width-1-2@s uk-flex-center" uk-switcher="toggle: &gt; * &gt; .tm-choose" uk-grid="true">
                              <div onClick={()=>setInternationalShipping('standard')}>
                                <a className={internationalShipping === "standard" ? "tm-choose uk-active" : "tm-choose"} href="#">
                                  <div className="tm-choose-title">Standard</div>
                                  <div className="tm-choose-description">India Post</div>
                                  <div className="tm-choose-description">Shipping cost $10 first item then $6 on every additional item.</div>
                                </a>
                              </div>
                              <div onClick={()=>setInternationalShipping('express')}>
                                <a className={internationalShipping === "express" ? "tm-choose uk-active" : "tm-choose"} href="#">
                                  <div className="tm-choose-title">Express</div>
                                  <div className="tm-choose-description">Blue Dart/Fedex/DHL/Others</div>
                                  <div className="tm-choose-description">Shipping cost $18 first item then $10 on every additional item.</div>
                                </a>
                              </div>
                            </div>
                          </div>

                        </div>
                      </section>
                    }
                  </div>
                </div>
                <CheckoutPrice paymentMode={paymentMode} shippingType={internationalShipping} setCartTotal={setCartTotal} />
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}

export {
  CheckoutContainer
}