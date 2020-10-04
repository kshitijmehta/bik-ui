import React, { useState, useEffect } from 'react';
import { useParams } from "react-router";
import { AdminNav } from '.';
import { SubProducts } from 'appConstants';
import { ColourList, ProductColour } from './subComponents/colour';
import { ProductSize, SizeList } from './subComponents/size';
import { ProductSubCategory, SubCategoryList } from './subComponents/subCategory';
import { ProductCoupon, CouponList } from './subComponents/coupon';
import { ProductItem, ProductList } from './subComponents/product';
import { useDispatch } from 'react-redux';
import { getProduct, setDefaulState } from 'reducers';



const MainContainer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const {product, productId} = useParams();

  useEffect(() => {
    if(product == 'product' && productId){
      dispatch(getProduct(Number(productId)));
      setIsOnAdd(true);
    } else {
      dispatch(setDefaulState());
    }
  },[product, productId])

  const [isOnAdd, setIsOnAdd] = useState(false);
  const [subProductId, setSubProductId] = useState(SubProducts.PRODUCT);

  const subProductToggle = (subProductId: number) => {
    setSubProductId(subProductId);
  }
  const addEditToggle = (isOnAdd: boolean) => {
    setIsOnAdd(isOnAdd);
  }

  const showSubProductComponent = () => {
    switch (subProductId) {
      case SubProducts.COLOUR:
        return isOnAdd ? <ProductColour /> : <ColourList/>
      case SubProducts.SIZE:
        return isOnAdd ? <ProductSize/> : <SizeList/>
      case SubProducts.SUB_PRODUCT:
        return isOnAdd ? <ProductSubCategory/> : <SubCategoryList/>
      case SubProducts.COUPONS:
        return isOnAdd ? <ProductCoupon/> : <CouponList/>
      case SubProducts.PRODUCT:
        return isOnAdd ? <ProductItem/> : <ProductList addEditToggle={addEditToggle}/>
    }
  }

  return (
    <main>
      <section className="uk-section uk-section-small">
        <div className="uk-container">
          <div className="uk-grid-medium" uk-grid="true">
            <AdminNav subProductToggle={subProductToggle} addEditToggle={addEditToggle} />
            { showSubProductComponent() }
          </div>
        </div>
      </section>
    </main>
  )
}

export {
  MainContainer
}