import { LoadingProductArticle } from 'components/shared';
import React from 'react';

const PromoBanner : React.FunctionComponent = () => {
  return (
    <section className="uk-section uk-section-small">
    <div className="uk-container">
      <h2 className="uk-text-center"></h2>
      <div className="uk-card uk-card-default tm-ignore-container">
<div className="uk-grid-collapse uk-child-width-custom tm-products-grid" uk-grid="true">
      {
        Array(4).fill(1).map((product) => {
          return (
            <article key={product.productId} className="tm-product-card">
              <div className="tm-product-card-media">
                <div className="tm-ratio tm-ratio-4-3">
                  <a className="tm-media-box" >
                    <figure className="tm-media-box-wrap"><img src='/promo_1.jpeg' /></figure>
                  </a>
                </div>
              </div>
              {/* <div className="tm-product-card-body">
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
              </div> */}
            </article>
          )
        })
      }
    </div>
    </div>
        </div>
      </section>
  )
}

export {
  PromoBanner
}