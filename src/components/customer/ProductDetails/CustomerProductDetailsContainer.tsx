import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from 'reducers/Product';
import { AppState, Cart, getRelatedProduct } from 'reducers';
import { ProductItem } from 'types';
import { serverImagePath } from 'appConstants';
import { CustomerProductDetails } from './CustomerProductDetails';
import { CustomerProductDetailsLoading } from './CustomerProductDetailsLoading';

interface cartQuantity {
  [key: string]: string;
};

const CustomerProductDetailsConstainer: React.FunctionComponent = () => {

  const { product, queryProductId } = useParams();
  const [ mainSlider, setMainSlider] = useState<JSX.Element[] | undefined>(undefined);
  const [ smallSlider, setSmallSlider] = useState<JSX.Element[] | undefined>(undefined);
  const [cartProductQuantity, setCartProductQuantity] = useState<cartQuantity>({});
  const [cartProductFlag, setCartProductFlag] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProduct(Number(queryProductId)));
    setSmallSlider(undefined);
  }, [queryProductId]);

  const {
    name, description, productCategoryId,
    subCategory, quantity,
    priceINR, priceUSD, productId, productCategoryName,
    sizeId, size, colourId, imageNames, imagePaths, productDetailId, isActive
  } = useSelector<AppState, ProductItem>(state => state.product.singleData || {} as ProductItem);
  const cart = useSelector<AppState, Cart>(state => state.cart);

  useEffect(()=>{
      if (imageNames && imagePaths && imageNames.length > 0 && imagePaths.length > 0) {
        const imageName = imageNames.split(',');
        const imagePath = imagePaths.split(',');
  
        setMainSlider(imagePath.map((path: string, index: number) => {
          return <li key={index}>
            <a className="uk-card-body tm-media-box tm-media-box-zoom" href={serverImagePath + path}>
              <figure className="tm-media-box-wrap"><img src={serverImagePath + path} alt={imageName[index]} /></figure>
            </a>
          </li>
        }))

        setSmallSlider(imagePath.map((path: string, index: number) => {
          return <li uk-slideshow-item={index} tabIndex={-1} key={index}>
            <div className="tm-ratio tm-ratio-1-1">
              <a className="tm-media-box tm-media-box-frame" href="#">
                <figure className="tm-media-box-wrap">
                  <img src={serverImagePath + path} alt={imageName[index]} />
                </figure>
              </a>
            </div>
          </li>
        }))
      }
  },[imageNames,imagePaths])

  useEffect(()=>{
    if(cart.data){
      const cartProductCount = {} as cartQuantity;
      cart.data.forEach(({productDetailId,productQuantity}) => {
        cartProductCount[productDetailId] = productQuantity;
      });
      setCartProductQuantity(cartProductCount);
      setCartProductFlag(true);
    }
  },[cart.data]);

  useEffect(() => {
    if(subCategory && queryProductId){
      dispatch(getRelatedProduct(subCategory, Number(queryProductId)));
    }
  },[subCategory, queryProductId]);

  return (
    smallSlider && cartProductFlag  ? 
    <CustomerProductDetails 
      smallSlider={smallSlider}
      mainSlider={mainSlider}
      description={description || ''}
      name={name || ''}
      priceINR={priceINR || ''}
      priceUSD={priceUSD || ''}
      productCategoryName={productCategoryName || ''}
      quantity={quantity || ''}
      sizeId={sizeId || ''}
      size={size || ''}
      productId={productId || ''}
      productDetailId={productDetailId || ''}
      imageName={imageNames && imageNames.split(',')[0] || ''}
      imagePath={imagePaths && imagePaths.split(',')[0] || ''}
      cartProductQuantity={cartProductQuantity}
      isActive={isActive || false}
      subCategory={subCategory || 0}
      /> 
    : <CustomerProductDetailsLoading/>
  )
};

export {
  CustomerProductDetailsConstainer
}