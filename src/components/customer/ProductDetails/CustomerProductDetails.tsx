import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct, setDefaulState } from 'reducers/Product';
import { AppState, addUpdateCart, Cart, UserLocation } from 'reducers';
import { ProductItem, CustomerCart } from 'types';
import { scaledServerImagePath } from 'appConstants';
import { CustomerProductDetailsLoading } from '.';
import { calculateUserDiscount, getCurrencyIcon, showINRUSD } from 'services';
import { QuickProductList } from 'components/shared';

interface cartQuantity {
  [key: string]: string;
};


interface Props {
  mainSlider: JSX.Element[] | undefined;
  smallSlider: JSX.Element[] | undefined;
  productCategoryName: string;
  name: string;
  priceINR: string;
  priceUSD: string;
  description: string;
  size: string;
  sizeId: string;
  quantity: string;
  productId: string;
  productDetailId: string;
  imageName: string;
  imagePath: string;
  cartProductQuantity: cartQuantity;
  isActive: boolean;
  subCategory: number
};

const CustomerProductDetails: React.FunctionComponent<Props> = (props: Props) => {
  const {
    priceINR,
    priceUSD,
    quantity,
    size,
    sizeId,
    productId,
    productDetailId,
    imageName,
    imagePath,
    productCategoryName,
    name,
    cartProductQuantity,
    isActive
  } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const userData = useSelector((state: AppState) => state.user);
  const userLocation = useSelector<AppState, UserLocation>(state => state.userLocation);
  const relatedProducts = useSelector<AppState, ProductItem[]>(state => state.relatedProduct.data || []);

  const [pINR, setPINR] = useState('0');
  const [pUSD, setPUSD] = useState('0');
  const [pQuantity, setPQuantity] = useState(['']);
  const [pSize, setPSize] = useState(['']);
  const [pSizeId, setPSizeId] = useState(['']);
  const [pDetailId, setPDetailId] = useState(['']);
  const [selectedSize, setSelectedSize] = useState('0');
  const [selectedQuantity, setSelectedQuantity] = useState('1');
  const [selectedProductDetailId, setSelectedProductDetailId] = useState('0');
  const [maxQuantity, setMaxQuantity] = useState('0');
  const [showInch, setShowInch] = useState(false);

  useEffect(() => {
    setPINR(priceINR.split(',')[0]);
    setPUSD(priceUSD.split(',')[0]);
  }, [priceINR, priceUSD]);


  useEffect(() => {
    setPQuantity(quantity.split(','));
    setPSize(size.split(','));
    setPSizeId(sizeId.split(','));
    setSelectedSize(sizeId.split(',')[0].toString());
    const defaultProductDetail = productDetailId.split(',')[0];
    setMaxQuantity((Number(quantity.split(',')[0]) - Number(cartProductQuantity[defaultProductDetail.toString()] || 0)).toString());
    setPDetailId(productDetailId.split(','));
    setSelectedProductDetailId(defaultProductDetail);
  }, [quantity, size, sizeId, productDetailId]);

  useEffect(() => {
    if (maxQuantity !== '0') {
      const productIndex = pDetailId.indexOf(selectedProductDetailId);
      setMaxQuantity((Number(pQuantity[productIndex]) - Number(cartProductQuantity[selectedProductDetailId] || '0')).toString());
      onChangeQuantity(cartProductQuantity[selectedProductDetailId] || '0', Number(pQuantity[productIndex]) - Number(cartProductQuantity[selectedProductDetailId]));
    }
  }, [cartProductQuantity]);

  const toggleQuantity = (isIncrement: boolean) => {
    if (isIncrement) {
      if (Number(selectedQuantity) <= Number(maxQuantity)) {
        setSelectedQuantity((Number(selectedQuantity) + 1).toString());
      }
    } else {
      if (selectedQuantity !== '1') {
        setSelectedQuantity((Number(selectedQuantity) - 1).toString());
      }
    }
  }

  const setSize = (sizeId: string) => {
    setSelectedSize(sizeId);
    const selectedIndex = pSizeId.indexOf(sizeId);
    const maxQ = pQuantity[selectedIndex];
    const pdId = pDetailId[selectedIndex];
    setSelectedProductDetailId(pdId);
    setMaxQuantity((Number(maxQ) - Number(cartProductQuantity[pdId] || 0)).toString());
    if (Number(selectedQuantity) > Number(maxQ)) {
      setSelectedQuantity(maxQ);
    }
  }

  const onChangeQuantity = (quantity: string, maxQaun = -1) => {
    if (Number(quantity) > Number(maxQaun !== -1 ? maxQaun : maxQuantity)) {
      setSelectedQuantity(Number(maxQaun !== -1 ? maxQaun : maxQuantity).toString())
    } else {
      setSelectedQuantity(Number(quantity).toString())
    }
  };

  const onBlurQuantity = (quantity: string) => {
    if (quantity === '' || Number(quantity) === 0) {
      setSelectedQuantity('1')
    }
  };

  const addToCart = () => {
    if (!userData.data?.userId) {
      const cartData = {
        productDetailId: selectedProductDetailId,
        productQuantity: selectedQuantity,
        currencyType: userLocation.data === 'IN' ? 1 : 2,
        cartId: selectedProductDetailId.toString(),
        productImage: imageName,
        productImagePath: imagePath,
        productName: name,
        subcategory: productCategoryName,
        productPrice: showINRUSD(userLocation.data || 'IN', { priceINR: pINR, priceUSD: pUSD }),
        productId: productId,
      } as CustomerCart;

      dispatch(addUpdateCart(cartData, false))
    } else {
      const cartData = {
        productDetailId: selectedProductDetailId,
        productQuantity: selectedQuantity,
        currencyType: userLocation.data === 'IN' ? 1 : 2,
        cartId: '0',
        productImage: imageName,
        productImagePath: imagePath,
        productName: name,
        subcategory: productCategoryName,
        productPrice: '0',
        productId: productId,
      } as CustomerCart;

      dispatch(addUpdateCart(cartData, true))
    }
  }

  const checkForDefaultSize = (sizeList: string[]) => {
    return sizeList.length === 1 && sizeList[0].toLowerCase() === 'default';
  }
  return (
    <main>
      <section className="uk-section uk-section-small">
        <div className="uk-container">
          <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
            <div className="uk-text-center">
              <ul className="uk-breadcrumb uk-flex-center uk-margin-remove">
                <li><a onClick={() => history.push('/')}>Home</a></li>
                <li><a onClick={() => history.push('/product/' + props.productCategoryName)}>{props.productCategoryName}</a></li>
                <li className="visibility-none"></li>
              </ul>
              <h1 className="uk-margin-small-top uk-margin-remove-bottom">{props.name}</h1>
            </div>
            <div>
              <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
                <div>
                  <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
                    <div className="uk-grid-small uk-grid-collapse uk-grid-match" uk-grid="true">
                      <div className="uk-width-1-1 uk-width-expand@m">
                        <div className="uk-grid-collapse uk-child-width-1-1" uk-slideshow="finite: true; ratio: 4:3;" uk-grid="true">
                          <div>
                            <ul className="uk-slideshow-items" uk-lightbox="true">
                              {
                                props.mainSlider
                              }
                            </ul>
                          </div>
                          <div>
                            <div className="uk-card-body uk-flex uk-flex-center">
                              <div className="uk-width-1-2 uk-visible@s">
                                <div uk-slider="finite: true">
                                  <div className="uk-position-relative">
                                    <div className="uk-slider-container">
                                      <ul className="tm-slider-items uk-slider-items uk-child-width-1-4 uk-grid uk-grid-small">
                                        {
                                          props.smallSlider
                                        }
                                      </ul>
                                      <div>
                                        <a className="uk-position-center-left-out uk-position-small" href="#" uk-slider-item="previous" uk-slidenav-previous="true"></a>
                                        <a className="uk-position-center-right-out uk-position-small" href="#" uk-slider-item="next" uk-slidenav-next="true"></a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <ul className="uk-slideshow-nav uk-dotnav uk-hidden@s"></ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="uk-width-1-1 uk-width-1-3@m tm-product-info">
                        <div className="uk-card-body">
                          <div className="uk-margin">
                            <div className="uk-grid-small" uk-grid="true">
                            </div>
                          </div>
                          <div className="uk-margin">
                            <div className="uk-padding-small uk-background-primary-lighten uk-border-rounded">
                              <div className="uk-grid-small uk-child-width-1-1" uk-grid="true">
                                <div>
                                  {
                                    userData.data?.discount && userData.data?.discount !== '0' &&
                                    <del className="uk-text-meta">{getCurrencyIcon(userLocation.data || 'IN')} {showINRUSD(userLocation.data || 'IN', { priceINR: pINR, priceUSD: pUSD })}</del>
                                  }
                                  <div className="tm-product-price">{getCurrencyIcon(userLocation.data || 'IN')} {calculateUserDiscount(userData.data?.discount || '0', showINRUSD(userLocation.data || 'IN', { priceINR: pINR, priceUSD: pUSD }))}</div>
                                </div>
                                <div>
                                  <div className="uk-grid-small uk-child-width-1-2" uk-grid="true">
                                    <div className={`${checkForDefaultSize(pSize) ? 'default-product-size' : ''}`}>
                                      <label>
                                        <div className="uk-form-label">Size</div>
                                        <select className="uk-select"
                                          value={selectedSize}
                                          id="selectedSize"
                                          onChange={(e) => { setSize(e.currentTarget.value) }}>
                                          {
                                            pSize.map((size, index) => {
                                              return <option key={index} value={pSizeId[index]}>{size}</option>
                                            })
                                          }

                                        </select>
                                      </label>
                                    </div>
                                    <div>
                                      <label>
                                        <div className="uk-form-label">Quantity {selectedSize !== '0' && <span className="uk-notification-message-danger uk-text-meta">(Max {isActive ? maxQuantity : 0})</span>}</div>
                                        <div>
                                          <div className="uk-inline">
                                            {Number(maxQuantity) > 0 && isActive &&
                                              <>
                                                {Number(selectedQuantity) === 1 && <a className="uk-form-icon"></a>}
                                                {Number(selectedQuantity) > 1 && <a className="uk-form-icon" onClick={() => toggleQuantity(false)} uk-icon="icon: minus"></a>}
                                                {Number(selectedQuantity) < Number(maxQuantity) && <a className="uk-form-icon uk-form-icon-flip" onClick={() => toggleQuantity(true)} uk-icon="icon: plus"></a>}
                                                {Number(selectedQuantity) === Number(maxQuantity) && <a className="uk-form-icon uk-form-icon-flip"></a>}
                                              </>
                                            }

                                            <input className="uk-input uk-text-center"
                                              onChange={(e) => onChangeQuantity(e.currentTarget.value)}
                                              onBlur={(e) => onBlurQuantity(e.currentTarget.value)}
                                              type="number"
                                              disabled={Number(maxQuantity) === 0 || !isActive}
                                              value={selectedQuantity} />
                                          </div>
                                        </div>
                                      </label>
                                    </div>
                                    <div className={`${checkForDefaultSize(pSize) ? 'single-size-cart-button' : ''}`}>
                                      <button
                                        disabled={Number(maxQuantity) === 0 || !isActive}
                                        className="uk-button uk-button-primary tm-product-add-button tm-shine js-add-to-cart"
                                        onClick={() => addToCart()}>
                                        {Number(maxQuantity) === 0 || !isActive ? 'out of stock' : 'add to cart'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  {
                                    props.productCategoryName.toLowerCase() === 'footwear'&&
                                    <a uk-toggle="target: #product-footwear-size-model" className="uk-margin-xsmall-right uk-notification-message-danger"><span uk-icon="file-text"></span> Size Chart </a>
                                  }
                                  {
                                    props.subCategory.toString() === '1' &&
                                    <a uk-toggle="target: #product-bra-size-model" className="uk-margin-xsmall-right uk-notification-message-danger"><span uk-icon="file-text"></span> Size Chart </a>
                                  }
                                  {
                                    props.subCategory.toString() === '3' &&
                                    <a uk-toggle="target: #product-camisole-size-model" className="uk-margin-xsmall-right uk-notification-message-danger"><span uk-icon="file-text"></span> Size Chart </a>
                                  }

                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="uk-margin">
                            <div className="uk-padding-small uk-background-muted uk-border-rounded">
                              <div className="uk-grid-small uk-child-width-1-1 uk-text-small" uk-grid="true">
                                <div>
                                  <div className="uk-grid-collapse" uk-grid="true">
                                    {/* <span className="uk-margin-xsmall-right" uk-icon="chevron-right"></span> */}
                                    <div>
                                      <div className="uk-text-bolder">Product Details</div>
                                      <div className="uk-text-small uk-text-muted">
                                        {props.description}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="uk-width-1-1 tm-product-description" id="description">
                        <header>
                          <nav className="tm-product-nav" uk-sticky="offset: 60; bottom: #description; cls-active: tm-product-nav-fixed;">
                            <ul className="uk-subnav uk-subnav-pill js-product-switcher" uk-switcher="connect: .js-tabs">
                              <li><a className="js-scroll-to-description" href="#description">Overview</a></li>
                            </ul>
                          </nav>
                        </header>
                        <div className="uk-card-body">
                          <div className="uk-switcher js-product-switcher js-tabs">
                            <section>
                              <article className="uk-article">
                                <div className="uk-article-body">
                                  <p>
                                    {props.description}
                                  </p>

                                </div>
                              </article>
                            </section>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
                {
                  relatedProducts.length > 0 &&
                  <QuickProductList productList={relatedProducts} />
                }

              </div>
            </div>
          </div>
        </div>
      </section>
      {
        props.subCategory.toString() === '1' &&
        <div id="product-bra-size-model" uk-modal="true">
          <div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical size-chart-width lingerie-modal-big'>
            <button className="uk-modal-close-default" type="button" uk-close="true"></button>

                <ul className="uk-subnav uk-subnav-pill" uk-switcher="true">
                  <li><a onClick={() => setShowInch(false)}>cm</a></li>
                  <li><a onClick={() => setShowInch(true)}>in</a></li>
                </ul>
                {
                  showInch ?
                    <>
                      <img className="uk-hidden@s" src="/mobile-bra-in-measure.jpg" alt="mobile-bra-in-measure" />
                      <img className="uk-visible@s" src="/big-bra-in-measure-combo.jpg" alt="big-bra-in-measure-combo" />
                    </>
                    : <>
                      <img className="uk-hidden@s" src="/mobile-bra-cm-measure.jpg" alt="mobile-bra-cm-measure" />
                      <img className="uk-visible@s" src="/big-bra-cm-measure-combo.jpg" alt="big-bra-cm-measure-combo" />
                    </>

                }

                <img className="uk-hidden@s" src="/mobile-bra-measure.jpg" alt="mobile-bra-measure" />

          </div>
        </div>
      }
      {
        props.productCategoryName.toLowerCase() === 'footwear' &&
        <div id="product-footwear-size-model" uk-modal="true">
          <div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical size-chart-width'>
            <button className="uk-modal-close-default" type="button" uk-close="true"></button>
          
                <img className="uk-visible@s" src="/footwear_size_chart.jpg" alt="footwear-size-chart" />
                <img className="uk-hidden@s" src="/footwear_size_chart_mobile_1.jpg" alt="footwear-size-chart" />
                <img className="uk-hidden@s" src="/footwear_size_chart_mobile_2.jpg" alt="footwear-size-chart" />
              

          </div>
        </div>
      }
      {
        props.subCategory.toString() === '3' &&
        <div id="product-camisole-size-model" uk-modal="true">
          <div className='uk-modal-dialog uk-modal-body uk-margin-auto-vertical size-chart-width'>
            <button className="uk-modal-close-default" type="button" uk-close="true"></button>
          
                <img className="uk-visible@s" src="/big-camisole.jpg" alt="footwear-size-chart" />
                <img className="uk-hidden@s" src="/mobile-camisole-size-measure.jpg" alt="footwear-size-chart" />
                <img className="uk-hidden@s" src="/mobile-camisole-measure.jpg" alt="footwear-size-chart" />
              

          </div>
        </div>
      }

    </main>
  )
}

export {
  CustomerProductDetails
}