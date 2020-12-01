import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCart, AppState, Cart, deleteCartItem, addUpdateCart, UserLocation, validateCoupon, Coupon, updateCartQuantity } from 'reducers';
import { serverImagePath } from 'appConstants';
import { CustomerCart } from 'types';
import { useHistory } from 'react-router-dom';
import { getCurrencyIcon } from 'services';


interface Quantity {
  [key: string]: string
}
const CartDetails: React.FunctionComponent = () => {


  const dispatch = useDispatch();
  const history = useHistory();
  const [quantity, setQuantity] = useState<Quantity>();
  const [enteredCoupon, setEnteredCoupon] = useState('');
  const [quantityCheckMessage, setQuantityCheckMessage] = useState('Getting your data.');
  const userLocation = useSelector<AppState, UserLocation>(state => state.userLocation);
  const couponStatus = useSelector<AppState, Coupon>(state => state.coupon);
  const [deboucedId, setDeboucedId] = useState('');
  const [quantityChanged, setQuantityChanged] = useState(false);
  const [quantityChangedProductId, setQuantityChangedProductId] = useState('');
  const orderQuantityCheckButtonRef = useRef<HTMLButtonElement>(null);
  const orderQuantityCheckModalRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    dispatch(getCart());
    if (couponStatus.data?.length === 1) {
      setEnteredCoupon(couponStatus.data[0].code);
    }
  }, []);

  const cart = useSelector<AppState, Cart>(state => state.cart);

  useEffect(() => {
    let qt: Quantity = {};
    if (cart.data && cart.data.length > 0) {
      cart.data.forEach((product: CustomerCart) => {
        qt[product.productDetailId] = product.productQuantity || '0';
      });
      setQuantity(qt);
      checkForAvailableQuantity(cart.data)
    }
  }, [cart.data]);
  const deleteCart = (cartItem: CustomerCart) => {
    dispatch(deleteCartItem(cartItem));
  };

  const checkForAvailableQuantity = (cartData: CustomerCart[]) => {
    const orderDetailId = cartData.map((cartItem) => {
      if (Number(cartItem.availableQuantity) < Number(cartItem.productQuantity)) {
        setQuantityChanged(true);
        return cartItem.cartId
      } else {
        return 0
      }
    })
    setQuantityChangedProductId(orderDetailId.toString());
  }

  useEffect(() => {
    if(quantityChanged){
      orderQuantityCheckButtonRef.current?.click();
      dispatch(updateCartQuantity(quantityChangedProductId));
    }
  },[quantityChanged])

  useEffect(() => {
    if(cart._quantityUpdate && orderQuantityCheckModalRef.current?.getBoundingClientRect().top !== 0) {
      dispatch(getCart());
      setQuantityCheckMessage('We updated your cart based on the product availability.');
      setTimeout(() => {
        orderQuantityCheckButtonRef.current?.click();
      },5000)
      
    }
  },[cart._quantityUpdate])

  const updateCart = (cartId: string, quantity: string, productDetailId: string) => {
    dispatch(addUpdateCart({
      productDetailId,
      productQuantity: quantity,
      currencyType: userLocation.data === 'IN' ? 1 : 2,
      cartId,
      productPrice: '',
      productId: ''
    }, true));
  };

  const updateQantity = (cartId: string, productDetailId: string, availableQuantity: string, isIncrement: boolean, changedQuantity?: string) => {
    if (quantity) {
      if (changedQuantity) {
        let chqty = changedQuantity
        if (Number(chqty) > Number(availableQuantity)) {
          chqty = availableQuantity
        }
        const newQuantity = { ...quantity, ...{ [productDetailId]: chqty.toString() } };
        setDeboucedId(cartId + '-' + window.setTimeout(() => {
          updateCart(cartId, chqty.toString(), productDetailId)
        }, 500).toString());
        setQuantity(newQuantity);
      } else if (isIncrement) {
        let updatedQuantity = Number(quantity[productDetailId]) + 1;
        if (updatedQuantity > Number(availableQuantity)) {
          updatedQuantity = Number(availableQuantity)
        }
        const newQuantity = { ...quantity, ...{ [productDetailId]: updatedQuantity.toString() } };
        setDeboucedId(cartId + '-' + window.setTimeout(() => {
          updateCart(cartId, updatedQuantity.toString(), productDetailId)
        }, 500).toString());
        setQuantity(newQuantity);
      } else {
        let updatedQuantity = Number(quantity[productDetailId]) - 1;
        if (updatedQuantity < 0) {
          updatedQuantity = 0
        }
        const newQuantity = { ...quantity, ...{ [productDetailId]: updatedQuantity.toString() } };
        setDeboucedId(cartId + '-' + window.setTimeout(() => {
          updateCart(cartId, updatedQuantity.toString(), productDetailId)
        }, 500).toString());
        setQuantity(newQuantity);
      }

      if (deboucedId !== '' && deboucedId.split('-')[0] === cartId.toString()) {
        window.clearTimeout(Number(deboucedId.split('-')[1]));
      }
    }
  };

  const checkCouponValidity = () => {
    dispatch(validateCoupon(enteredCoupon));
  }
  return (
    <div className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
        <header className="uk-card-header uk-text-uppercase uk-text-muted uk-text-center uk-text-small uk-visible@m">
          <div className="uk-grid-small uk-child-width-1-2" uk-grid="true">
            <div>product</div>
            <div>
              <div className="uk-grid-small uk-child-width-expand" uk-grid="true">
                <div>price</div>
                <div className="tm-quantity-column">quantity</div>
                <div>sum</div>
                <div className="uk-width-auto"><div style={{ width: "20px" }}></div></div>
              </div>
            </div>
          </div>
        </header>
        {
          cart.data && cart.data.map((cartItem: CustomerCart, index: number) => {
            return <div className="uk-card-body" key={index}>
              <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@m uk-flex-middle" uk-grid="true">
                <div>
                  <div className="uk-grid-small" uk-grid="true">
                    <div className="uk-width-1-3">
                      <div className="tm-ratio tm-ratio-4-3">
                        <a className="tm-media-box" onClick={() => history.push('/productDetails/' + cartItem.productId)}>
                          <figure className="tm-media-box-wrap"><img src={serverImagePath + cartItem.productImagePath} alt='Apple MacBook Pro 15" Touch Bar MPTU2LL/A 256GB (Silver)' /></figure>
                        </a>
                      </div>
                    </div>
                    <div className="uk-width-expand">
                      <div className="uk-text-meta">{cartItem.subcategory}</div>
                      <a className="uk-link-heading" onClick={() => history.push('/productDetails/' + cartItem.productId)}>{cartItem.productName}</a>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="uk-grid-small uk-child-width-1-1 uk-child-width-expand@s uk-text-center" uk-grid="true">
                    <div>
                      <div className="uk-text-muted uk-hidden@m">Price</div>
                      <div>{getCurrencyIcon(userLocation.data || 'IN')} {cartItem.productPrice}</div>
                    </div>
                    <div>
                      <label className="uk-text-center">
                        <div className="cart-quantity cart-margin-auto">
                          <div className="uk-inline">
                            <a className="uk-form-icon" uk-icon="icon: minus"
                              onClick={() => {
                                updateQantity(cartItem.cartId, cartItem.productDetailId, cartItem.availableQuantity || '0', false)
                              }}>
                            </a>
                            <a className="uk-form-icon uk-form-icon-flip" uk-icon="icon: plus"
                              onClick={() => {
                                updateQantity(cartItem.cartId, cartItem.productDetailId, cartItem.availableQuantity || '0', true)
                              }}>
                            </a>
                            <input className="uk-input uk-text-center"
                              type="number"
                              value={quantity && quantity[cartItem.productDetailId] || 0}
                              onChange={(e) => {
                                updateQantity(cartItem.cartId, cartItem.productDetailId, cartItem.availableQuantity || '0', false, e.currentTarget.value)
                              }} />
                          </div>
                        </div>
                        <div className="uk-form-label"><span className="uk-text-meta uk-text-primary">(Max {cartItem.availableQuantity})</span></div>
                      </label>
                    </div>

                    <div>
                      <div className="uk-text-muted uk-hidden@m">Sum</div>
                      <div>{getCurrencyIcon(userLocation.data || 'IN')} {cartItem.totalPrice}</div>
                    </div>
                    <div className="uk-width-auto@s">
                      {cart._isLoading && <span uk-spinner="true"></span>}
                      {!cart._isLoading && <a className="uk-text-danger" onClick={() => deleteCart(cartItem)} uk-tooltip="Remove"><span uk-icon="trash"></span></a>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          })
        }
        <div className="uk-card-footer">
          <label>
            <span className="uk-form-label uk-margin-small-right">Promo Code</span>
            <div className="uk-inline">
              <a className="uk-form-icon uk-form-icon-flip" onClick={() => checkCouponValidity()} uk-icon="arrow-right"></a>
              <input className="uk-input uk-form-width-small" type="text"
                value={enteredCoupon}
                onChange={(e) => setEnteredCoupon(e.currentTarget.value)}
              />
            </div>
            {couponStatus._isSuccess && <span className="login-error-message coupon-message uk-label uk-label-success"><span uk-icon="check"></span> Coupon is valid !</span>}
            {couponStatus._isError && <span className="login-error-message coupon-message uk-label uk-label-danger"><span uk-icon="ban"></span> Coupon is Invalid.</span>}
          </label>
        </div>
        <button ref={orderQuantityCheckButtonRef} id="payment-loading" uk-toggle="target: #my-id" type="button"></button>
        <div id="my-id" uk-modal="true; esc-close: false; bg-close: false">
          <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
            {
              !cart._isLoading && <button className="uk-modal-close-default" type="button" uk-close="true"></button>
            }
            <div ref={orderQuantityCheckModalRef}  className="uk-modal-body uk-nav-center">
              <p>{quantityCheckMessage}</p>
              {
                cart._isLoading && <div uk-spinner="true"></div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export {
  CartDetails
}