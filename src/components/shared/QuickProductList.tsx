import React from 'react';
import { ProductItem, CustomerCart } from 'types';
import { useHistory } from 'react-router-dom';
import { serverImagePath } from 'appConstants';
import { getCurrencyIcon, calculateUserDiscount, showINRUSD } from 'services';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, UserLocation, Cart, addUpdateCart } from 'reducers';

interface Props {
  productList: ProductItem[]
}

const QuickProductList: React.FunctionComponent<Props> = (props: Props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userLocation = useSelector<AppState, UserLocation>(state => state.userLocation);
  const userData = useSelector((state: AppState) => state.user);
  const cart = useSelector<AppState, Cart>(state => state.cart);

  const addToCart = (product: ProductItem)=> {
    if(!userData.data?.userId){
      const cartData = {
        productDetailId: product.productDetailId,
        productQuantity: '1',
        currencyType: userLocation.data === 'IN' ? 1 : 2,
        cartId: product.productDetailId,
        productImage: product.imageNames,
        productImagePath: product.imagePaths,
        productName: product.name,
        subcategory: product.productCategoryName,
        productPrice: showINRUSD(userLocation.data || 'IN', product),
        productId: product.productId,
      } as CustomerCart;
  
      dispatch(addUpdateCart(cartData, false))
    } else {
      const cartData = {
        productDetailId: product.productDetailId,
        productQuantity: '1',
        currencyType: userLocation.data === 'IN' ? 1 : 2,
        cartId: '0',
        productImage: product.imageNames,
        productImagePath: product.imagePaths,
        productName: product.name,
        subcategory: product.productCategoryName,
        productPrice: '0',
        productId: product.productId,
      } as CustomerCart;
  
      dispatch(addUpdateCart(cartData, true))
    }
  }

  return (
    <section>
      <div uk-slider="finite: true">
        <div className="uk-grid-small uk-flex-middle uk-margin-bottom" uk-grid="true">
          <h2 className="uk-width-expand uk-text-center uk-text-left@s">Related Products</h2>
          <div className="uk-visible@s">
            <a className="tm-slidenav" href="#" uk-slider-item="previous" uk-slidenav-previous="true"></a>
            <a className="tm-slidenav" href="#" uk-slider-item="next" uk-slidenav-next="true"></a>
          </div>
        </div>
        <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
          <div className="uk-position-relative">
            <div className="uk-slider-container">
              <div className="uk-slider-items uk-grid-collapse uk-child-width-custom tm-products-grid">
                {
                  props.productList.map((product, index) => {
                    return (
                      <article key={index} className="tm-product-card">
                        <div className="tm-product-card-media">
                          <div className="tm-ratio tm-ratio-4-3">
                            <a className="tm-media-box" onClick={() => {window.scrollTo({top:0, behavior:'smooth'}); history.push('/productDetails/' + product.productId)}}>
                              <figure className="tm-media-box-wrap"><img src={serverImagePath + product.imagePaths} alt={product.imageNames} /></figure>
                            </a>
                          </div>
                        </div>
                        <div className="tm-product-card-body">
                          <div className="tm-product-card-info">
                            <div className="uk-text-meta uk-margin-xsmall-bottom">{product.productCategoryName}</div>
                            <h3 className="tm-product-card-title"><a className="uk-link-heading" onClick={() => history.push('/productDetails/' + product.productId)}>{product.name}</a></h3>
                          </div>
                          <div className="tm-product-card-shop">
                            <div className="tm-product-card-prices">
                              {
                                userData.data?.discount && userData.data?.discount !== '0' &&
                                <del className="uk-text-meta">{getCurrencyIcon(userLocation.data || 'IN')} {showINRUSD(userLocation.data || 'IN', product)}</del>
                              }
                              <div className="tm-product-card-price">
                                {getCurrencyIcon(userLocation.data || 'IN')} {calculateUserDiscount(userData.data?.discount || '0', showINRUSD(userLocation.data || 'IN', product))}
                              </div>
                            </div>
                            <div className="tm-product-card-add">
                              <button className="uk-button uk-button-primary tm-product-card-add-button tm-shine js-add-to-cart">
                                {
                                  cart._isLoading && <span uk-spinner="true"></span>
                                }
                                {
                                  !cart._isLoading && (
                                    <>
                                      <span className="tm-product-card-add-button-icon" uk-icon="cart" onClick={() => addToCart(product)}></span>
                                      <span className="tm-product-card-add-button-text">add to cart</span>
                                    </>
                                  )
                                }

                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    )
                  })
                }

              </div>
            </div>
            <ul className="uk-slider-nav uk-dotnav uk-flex-center uk-margin-top uk-hidden@s"></ul>
          </div>
        </div>
      </div>

    </section>
  )
}

export {
  QuickProductList
}