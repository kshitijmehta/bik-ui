import React, { useEffect, useState } from 'react';
import { CustomerCart, ProductCoupon } from 'types';
import { serverImagePath } from 'appConstants';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartItem, AppState, UserLocation } from 'reducers';
import { getCurrencyIcon, calculateUserDiscount, calculateUserDiscountPrice } from 'services';

interface Props {
  cartData: CustomerCart[];
}

const SideCart: React.FunctionComponent<Props> = (props: Props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [mainTotal, setMainTotal] = useState(0);
  const [userDiscountTotal, setUserDiscountTotal] = useState('0');
  const [totalAfterDiscount, setTotalAfterDiscount] = useState('0');
  const [discountedTotal, setDiscountedTotal] = useState('0');
  const [userCouponTotal, setUserCouponTotal] = useState('0');
  const userLocation = useSelector<AppState, UserLocation>(state => state.userLocation);
  const couponData = useSelector<AppState, ProductCoupon[]>(state => state.coupon.data || []);
  const userData = useSelector((state: AppState) => state.user);
  const {
    cartData
  } = props;

  useEffect(() => {
    let cartPrice = 0;
    cartData.forEach(({ totalPrice }) => {
      cartPrice += Number(totalPrice)
    });
    setMainTotal(cartPrice);
    if (couponData.length === 1) {
      let discountPrice = calculateUserDiscountPrice(userData.data?.discount || '0', cartPrice.toString());
      let priceAfterDiscount = calculateUserDiscount(userData.data?.discount || '0', cartPrice.toString());
      let couponPrice = calculateUserDiscountPrice(couponData[0].value, priceAfterDiscount.toString());
      let priceAfterCoupon = calculateUserDiscount(couponData[0].value || '0', priceAfterDiscount.toString());
      setDiscountedTotal(priceAfterDiscount);
      setUserDiscountTotal(discountPrice);
      setUserCouponTotal(couponPrice);
      setTotalAfterDiscount(priceAfterCoupon);
    } else {
      let discountPrice = calculateUserDiscountPrice(userData.data?.discount || '0', cartPrice.toString());
      let priceAfterDiscount = calculateUserDiscount(userData.data?.discount || '0', cartPrice.toString());
      setUserDiscountTotal(discountPrice);
      setTotalAfterDiscount(priceAfterDiscount);
    }
    // setUserDiscountTotal(calculateUserDiscountPrice(userData.data?.discount || '0', cartPrice.toString()));
    // setTotalAfterDiscount(calculateUserDiscount(userData.data?.discount || '0', cartPrice.toString()))
  }, [cartData, userData.data,couponData])

  const deleteCart = (cartItem: CustomerCart) => {
    dispatch(deleteCartItem(cartItem));
  };

  return (
    <div id="cart-offcanvas" uk-offcanvas="overlay: true; flip: true">
      <aside className="uk-offcanvas-bar uk-padding-remove">
        <div className="uk-card uk-card-default uk-card-small uk-height-1-1 uk-flex uk-flex-column tm-shadow-remove">
          <header className="uk-card-header uk-flex uk-flex-middle">
            <div className="uk-grid-small uk-flex-1" uk-grid="true">
              <div className="uk-width-expand"><div className="uk-h3">Cart</div></div>
              <button className="uk-offcanvas-close" type="button" uk-close="true"></button>
            </div>
          </header>
          <div className="uk-card-body uk-overflow-auto">
            <ul className="uk-list uk-list-divider">
              {
                cartData.map((cart: CustomerCart, index: number) => {
                  return (
                    <li key={index} className="uk-visible-toggle">
                      <article>
                        <div className="uk-grid-small" uk-grid="true">
                          <div className="uk-width-1-4">
                            <div className="tm-ratio tm-ratio-4-3">
                              <a className="tm-media-box" onClick={() => history.push('/productDetails/' + cart.productId)}>
                                <figure className="tm-media-box-wrap"><img src={serverImagePath + cart.productImagePath} alt={cart.productImage} /></figure>
                              </a>
                            </div>
                          </div>
                          <div className="uk-width-expand">
                            <div className="uk-text-meta uk-text-xsmall">{cart.subcategory}</div>
                            <a className="uk-link-heading uk-text-small" onClick={() => history.push('/productDetails/' + cart.productId)}>{cart.productName}</a>
                            <div className="uk-margin-xsmall uk-grid-small uk-flex-middle" uk-grid="true">
                              <div className="uk-text-bolder uk-text-small">{getCurrencyIcon(userLocation.data || 'IN')} {cart.totalPrice}</div>
                              {/* <del className="uk-text-bolder uk-text-small uk-text-meta">123</del> */}
                              <div className="uk-text-meta uk-text-xsmall">{cart.productQuantity} × {getCurrencyIcon(userLocation.data || 'IN')} {cart.productPrice}</div>
                            </div>
                          </div>
                          {/* <div>
                            <a className="uk-icon-link uk-text-danger uk-invisible-hover"
                              uk-icon="icon: close; ratio: .75"
                              uk-tooltip="Remove"
                              onClick={() => { deleteCart(cart) }}></a></div> */}
                        </div>
                      </article>
                    </li>
                  )
                })
              }
              {
                cartData.length === 0 &&
                <li className="uk-visible-toggle">
                  <article>
                    <div className="uk-grid-small" uk-grid="true">
                      <div className="uk-width-1-4">
                        <div className="tm-ratio tm-ratio-4-3">
                          {/* <a className="tm-media-box">
                            <figure className="tm-media-box-wrap"><img src={serverImagePath + cart.productImagePath} alt={cart.productImage} /></figure>
                          </a> */}
                        </div>
                      </div>
                      <div className="uk-width-expand">
                        {/* <div className="uk-text-meta uk-text-xsmall">{cart.subcategory}</div> */}
                        <span className="uk-link-heading uk-text-small" >Cart is empty.</span>
                        <div className="uk-margin-xsmall uk-grid-small uk-flex-middle" uk-grid="true">
                          <div className="uk-text-bolder uk-text-small">Add in some good stuff !!</div>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              }
            </ul>
          </div>
          <footer className="uk-card-footer">
            {
              (userData.data?.discount && userData.data?.discount !== '0' || couponData.length === 1) &&
              <>
                <div className="uk-grid-small" uk-grid="true">
                  <div className="uk-width-expand uk-text-muted uk-text-small">Subtotal</div>
                  <div className="uk-text-muted">{getCurrencyIcon(userLocation.data || 'IN')} {mainTotal}</div>
                </div>
                {
                  userData.data?.discount && userData.data?.discount !== '0' &&
                  <div className="uk-grid-small" uk-grid="true">
                    <div className="uk-width-expand uk-text-muted uk-text-small">Discount ({userData.data?.discount}%)</div>
                    <div className="uk-text-danger">- {getCurrencyIcon(userLocation.data || 'IN')} {userDiscountTotal}</div>
                  </div>
                }
              </>
            }
            {
              couponData.length === 1 &&
              <>
                {
                  userData.data?.discount && userData.data?.discount !== '0' &&
                  <div className="uk-grid-small" uk-grid="true">
                    <div className="uk-width-expand uk-text-muted">Discounted Total</div>
                    <div>{getCurrencyIcon(userLocation.data || 'IN')} {discountedTotal}</div>
                  </div>
                }

                <div className="uk-grid-small" uk-grid="true">
                  <div className="uk-width-expand uk-text-muted">Coupon ({couponData[0] && couponData[0].value}%)</div>
                  <div className="uk-text-danger">− {getCurrencyIcon(userLocation.data || 'IN')} {userCouponTotal}</div>
                </div>
              </>
            }

            <div className="uk-grid-small" uk-grid="true">
              <div className="uk-width-expand uk-text-muted uk-h4">Total</div>
              <div className="uk-h4 uk-text-bolder">{getCurrencyIcon(userLocation.data || 'IN')} {totalAfterDiscount}</div>
            </div>
            <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@m uk-margin-small" uk-grid="true">
             <div></div>
              <div >
                <button className="uk-button  uk-button-primary uk-button-default uk-margin-small uk-width-1-1"
                  onClick={() => { userData.data?.userId ? history.push('/cart') :  history.push('/login')}}
                  disabled={mainTotal === 0}
                >
                  Continue
                </button>
              </div>
              {/* <div>
                <button className="uk-button uk-button-primary uk-margin-small uk-width-1-1"
                  onClick={() => { history.push('/checkout') }}
                  disabled={mainTotal === 0}>
                  checkout
                </button>
              </div> */}
            </div>
          </footer>
        </div>
      </aside>
    </div>
  )
}

export {
  SideCart
}