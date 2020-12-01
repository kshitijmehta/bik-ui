import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from "react-infinite-scroll-component";

import { getCustomerProducts, Product, setDefaulState } from 'reducers/Product';
import { AppState, SubCategory, Size, Colour, addUpdateCart, Cart, UserLocation } from 'reducers';
import { serverImagePath, pageSize } from 'appConstants';
import { useHistory, useLocation } from 'react-router-dom';
import { ProductItem, CustomerCart, Search } from 'types';
import { calculateUserDiscount, getCurrencyIcon, showINRUSD } from 'services';
import { LoadingProductArticle } from 'components/shared';
import { setSearch } from 'reducers/Search';


interface Props {
  categoryId: number[];
  colourId?: number[];
  sizeId?: number[];
  subCategoryId?: number[];
  startPrice?: string;
  endPrice?: string;
}

const CustomerProductList: React.FunctionComponent<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [hasMoreProducts, setHasMoreProducts] = useState(false);

  const subCategories = useSelector<AppState, SubCategory>(state => state.subCategory);
  const productSize = useSelector<AppState, Size>(state => state.size);
  const productColour = useSelector<AppState, Colour>(state => state.colour);
  const cart = useSelector<AppState, Cart>(state => state.cart);
  const userLocation = useSelector<AppState, UserLocation>(state => state.userLocation);
  const userData = useSelector((state: AppState) => state.user);
  const search = useSelector<AppState, Search>(state => state.search.data || {} as Search);

  // useEffect(() => {
  //   if (props.categoryId !== 0) {
  //     console.log('effect list')
  //     dispatch(getCustomerProducts(0, pageSize, props.categoryId, props.subCategoryId || [], [], []));
  //     setHasMoreProducts(true);
  //   }
  // }, [props.categoryId]);

  useEffect(() => {
    if(!products._isLoading && props.categoryId.length >0  && !subCategories._isLoading && !productSize._isLoading && !productColour._isLoading){
      dispatch(setDefaulState());
      dispatch(getCustomerProducts(0, pageSize, props.categoryId, props.subCategoryId || [], props.colourId || [], props.sizeId || [], props.startPrice || '', props.endPrice||'', userLocation.data || 'IN',search.searchText || '' , true));
      dispatch(setSearch({
        categoryId: props.categoryId,
        colourId: props.colourId || [],
        currency: userLocation.data || 'IN',
        endPrice: props.endPrice||'',
        sizeId: props.sizeId || [],
        startPrice: props.startPrice || '',
        subCategoryId: props.subCategoryId || [],
        searchText: search.searchText || ''
      }));
    }
  },[props.sizeId,props.categoryId,props.colourId,props.subCategoryId,props.startPrice,props.endPrice, subCategories._isLoading, productSize._isLoading, productColour._isLoading])

  useEffect(()=> {
    return () => {
      dispatch(setSearch({
        categoryId: [],
        colourId: [],
        currency: userLocation.data || 'IN',
        endPrice: '',
        sizeId:  [],
        startPrice: '',
        subCategoryId:  [],
        searchText: search.searchText || ''
      }));
    }
  },[]);

  const fetchNextProducts = () => {
    if (!products._isLoading && stateData && props.categoryId.length >0 ) {
      dispatch(getCustomerProducts(stateData.length, pageSize, props.categoryId, props.subCategoryId || [], props.colourId || [], props.sizeId || [], props.startPrice || '', props.endPrice||'', userLocation.data || 'IN',search.searchText || ''));
      dispatch(setSearch({
        categoryId: props.categoryId,
        colourId: props.colourId || [],
        currency: userLocation.data || 'IN',
        endPrice: props.endPrice||'',
        sizeId: props.sizeId || [],
        startPrice: props.startPrice || '',
        subCategoryId: props.subCategoryId || [],
        searchText: search.searchText || ''
      }));
    }
  }

  const products = useSelector<AppState, Product>(state => state.product || []);
  useEffect(() => {
    setHasMoreProducts(products._hasMoreProducts || false);
  }, [products._hasMoreProducts]);


  const stateData = products.data;

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
    }else {
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
    <div className="uk-width-expand">
      <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
        <div>
          <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
            <div className="uk-grid-collapse uk-child-width-1-1" id="products" uk-grid="true">
              <div className="uk-card-header uk-hidden@m">
                <div className="uk-grid-small uk-flex-middle uk-flex-center" uk-grid="true">
                  <div className="uk-width-1-1 uk-width-auto@s uk-flex uk-flex-center uk-flex-middle">
                    <button className="uk-button uk-button-default uk-button-small uk-hidden@m" uk-toggle="target: #filters">
                      <span className="uk-margin-xsmall-right" uk-icon="icon: settings; ratio: .75;"></span>Filters
                    </button>
                  </div>
                </div>
              </div>
              <div>

                <InfiniteScroll
                  dataLength={stateData && stateData.length || 0}
                  next={fetchNextProducts}
                  hasMore={hasMoreProducts}
                  loader={
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                      <h4>Loading...</h4>
                    </div>
                  }
                  endMessage={
                    <p style={{ textAlign: "center" }}>
                      <b>That's all for now. Do check back after some time for more products.</b>
                    </p>
                  }
                >
                  <div className="uk-grid-collapse uk-child-width-custom tm-products-grid js-products-grid" uk-grid="true">
                    {
                       stateData && stateData.length > 0 ? stateData.map((product, index) => {
                        return (
                          <article className="tm-product-card" key={index}>
                            <div className="tm-product-card-media">
                              <div className="tm-ratio tm-ratio-4-3">
                                <a className="tm-media-box" onClick={()=> history.push('/productDetails/'+ product.productId)}>
                                  
                                  <figure className="tm-media-box-wrap"><img src={serverImagePath + product.imagePaths} alt={product.imageNames}/></figure>
                                </a>
                              </div>
                            </div>
                            <div className="tm-product-card-body">
                              <div className="tm-product-card-info">
                                <div className="uk-text-meta uk-margin-xsmall-bottom">{product.productCategoryName}</div>
                                <h3 className="tm-product-card-title"><a className="uk-link-heading" onClick={()=> history.push('/productDetails/'+ product.productId)}>{product.name}</a></h3>
                              </div>
                              <div className="tm-product-card-shop">
                                <div className="tm-product-card-prices">
                                  {
                                    userData.data?.discount && userData.data?.discount !== '0' &&
                                    <del className="uk-text-meta">{getCurrencyIcon(userLocation.data || 'IN')} {showINRUSD(userLocation.data || 'IN', product)}</del>
                                  }
                                  <div className="tm-product-card-price">
                                    {getCurrencyIcon(userLocation.data || 'IN')} {calculateUserDiscount(userData.data?.discount ||'0', showINRUSD(userLocation.data || 'IN', product))}
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
                      }) : products._hasMoreProducts  && Array(pageSize).fill(1).map((value, index) => <LoadingProductArticle key={index} keyIndex={index}/>)
                    }
                  </div>
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {
  CustomerProductList
}