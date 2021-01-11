import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from 'reducers';
import { ProductItem } from 'types';
import { TrendingLatestProducts } from '.';

const LatestContainer: React.FunctionComponent = () => {

  const latestProducts = useSelector<AppState, ProductItem[]>(state => state.latestProduct.data || []);
  return (
    <>
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
  LatestContainer
}