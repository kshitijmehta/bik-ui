import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'reducers';
import { ProductItem } from 'types';
import { TrendingLatestProducts } from '.';

const TrendingLatestContainer: React.FunctionComponent = () => {

  const latestProducts = useSelector<AppState, ProductItem[]>(state => state.latestProduct.data || []);
  const trendingProducts = useSelector<AppState, ProductItem[]>(state => state.trendingProduct.data || []);

  return (
    <>
      <section className="uk-section uk-section-small">
        <div className="uk-container">
          <h2 className="uk-text-center">Trending Items</h2>
          <div className="uk-card uk-card-default tm-ignore-container">
           <TrendingLatestProducts productList={trendingProducts} />
          </div>
        </div>
      </section>
      <section className="uk-section uk-section-small">
        <div className="uk-container">
          <h2 className="uk-text-center">Latest Items</h2>
          <div className="uk-card uk-card-default tm-ignore-container">
           <TrendingLatestProducts productList={latestProducts} />
          </div>
        </div>
      </section>
    </>
  )
}
export {
  TrendingLatestContainer
}