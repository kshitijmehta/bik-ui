import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState, Cart, UserLocation } from 'reducers';
import { CustomerCart, ProductCoupon } from 'types';
import { useHistory } from 'react-router-dom';
import { getCurrencyIcon, calculateUserDiscountPrice, calculateUserDiscount } from 'services';

const CartPrice: React.FunctionComponent = () => {

  const [cartTotal, setCartTotal] = useState(0);
  const [userDiscountTotal, setUserDiscountTotal] = useState('0');
  const [userCouponTotal, setUserCouponTotal] = useState('0');
  const [totalAfterDiscount, setTotalAfterDiscount] = useState('0');
  const [discountedTotal, setDiscountedTotal] = useState('0');
  const cart = useSelector<AppState, Cart>(state => state.cart);
  const userData = useSelector((state: AppState) => state.user);
  const userLocation = useSelector<AppState, UserLocation>(state => state.userLocation);
  const couponData = useSelector<AppState, ProductCoupon[]>(state => state.coupon.data || []);

  const history = useHistory();

  useEffect(() => {
    if (cart.data && cart.data.length > 0) {
      let total = 0;
      cart.data.forEach((cart: CustomerCart) => {
        if (cart.totalPrice) {
          total += Number(cart.totalPrice);
        }
      });
      setCartTotal(total);
      if (couponData.length === 1) {
        let discountPrice = calculateUserDiscountPrice(userData.data?.discount || '0', total.toString());
        let priceAfterDiscount = calculateUserDiscount(userData.data?.discount || '0', total.toString());
        let couponPrice = calculateUserDiscountPrice(couponData[0].value, priceAfterDiscount.toString());
        let priceAfterCoupon = calculateUserDiscount(couponData[0].value || '0', priceAfterDiscount.toString());
        setDiscountedTotal(priceAfterDiscount);
        setUserDiscountTotal(discountPrice);
        setUserCouponTotal(couponPrice);
        setTotalAfterDiscount(priceAfterCoupon);
      } else {
        let discountPrice = calculateUserDiscountPrice(userData.data?.discount || '0', total.toString());
        let priceAfterDiscount = calculateUserDiscount(userData.data?.discount || '0', total.toString());
        setUserDiscountTotal(discountPrice);
        setTotalAfterDiscount(priceAfterDiscount);
      }
    } else {
      setCartTotal(0);
      setUserDiscountTotal('0');
      setTotalAfterDiscount('0');
      setDiscountedTotal('0');
      setUserCouponTotal('0');
    }
  }, [cart.data,couponData]);

  return (
    <div className="uk-width-1-1 tm-aside-column uk-width-1-4@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container" uk-sticky="offset: 30; bottom: true; media: @m;">
        {
          (userData.data?.discount && userData.data?.discount !== '0' || couponData.length === 1 ) &&
          <div className="uk-card-body">
            <div className="uk-grid-small" uk-grid="true">
              <div className="uk-width-expand uk-text-muted">Subtotal</div>
              <div>{getCurrencyIcon(userLocation.data || 'IN')} {cartTotal}</div>
            </div>
            {
              userData.data?.discount && userData.data?.discount !== '0' &&
              <div className="uk-grid-small" uk-grid="true">
              <div className="uk-width-expand uk-text-muted">Discount ({userData.data?.discount}%)</div>
              <div className="uk-text-danger">− {getCurrencyIcon(userLocation.data || 'IN')} {userDiscountTotal}</div>
            </div>
            }
            
          </div>
        }
        {
          couponData.length === 1 &&
          <div className="uk-card-body">
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
          </div>
        }

        <div className="uk-card-body">
          <div className="uk-grid-small uk-flex-middle" uk-grid="true">
            <div className="uk-width-expand uk-text-muted">Total</div>
            <div className="uk-text-lead uk-text-bolder">{getCurrencyIcon(userLocation.data || 'IN')} {totalAfterDiscount}</div>
          </div>
          <button className="uk-button uk-button-primary uk-margin-small uk-width-1-1"
            disabled={cartTotal === 0}
            onClick={() => { history.push('/checkout') }}
          >
            checkout
          </button>
        </div>
      </div>
    </div>
  )
}

export {
  CartPrice
}