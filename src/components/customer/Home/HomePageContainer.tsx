import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTrendingProduct, getLatestProduct, AppState } from 'reducers';
import { SubBanner } from './SubBanner';
import { Banner } from './Banner';
import { PromoBanner } from './PromoBanner';
import { FooterBanner, MobileBanner, MobilePromoBanner } from '.';


const HomePageContainer: React.FunctionComponent = () => {

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getTrendingProduct());
    dispatch(getLatestProduct());
  },[])
  return (
    <main>
      <Banner/>
      <MobileBanner/>
      {/* <SubBanner/> */}
      <PromoBanner/>
      <MobilePromoBanner/>
      <FooterBanner/>
    </main>
  )
}

export {
  HomePageContainer
}