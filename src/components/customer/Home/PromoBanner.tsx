import { LoadingProductArticle } from 'components/shared';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { LatestContainer, TrendingContainer } from './trendingLatest';

const PromoBanner: React.FunctionComponent = () => {
  const history = useHistory();
  return (
    <section className="uk-section uk-section-small">
      <div className="uk-container">
        <h2 className="uk-text-center"></h2>
        <div className="uk-child-width-1-2@m tm-ignore-container promo-banner-no-padding" uk-grid="true">
          <div>
            <div className="uk-card uk-card-hover">
              <div className="uk-card-media-top">
                <a onClick={() => history.push('/product/footwear')}>
                  <img src="/footwear_promo.jpg" alt="promo-footwear" />
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-hover">
              <div className="uk-card-media-top">
                <a onClick={() => history.push('/product/lingerie')}>
                  <img src="/lingerie_promo.jpg" alt="promo-lingerie" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="uk-child-width-1-2@m tm-ignore-container promo-banner-no-padding" uk-grid="true">
          <div>
            <div className="uk-card uk-card-hover">
              <a onClick={() => history.push('/product/bindi')}>
                <img src="/bindi_promo.jpg" alt="promo-bindi" />
              </a>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-hover">
              <div className="uk-card-media-top">
                <a onClick={() => history.push('/product/home essential')}>
                  <img src="/home_essential_promo.jpg" alt="promo-home-essential" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="uk-child-width-1-1@m tm-ignore-container promo-banner-no-padding" uk-grid="true">
          <div>
            <div className="uk-card uk-card-hover">
            <div className="uk-card-media-top">
              <a onClick={() => history.push('/product/cosmetics')}>
                <img src="/cosmetic_promo.jpg" alt="promo-cosmetic" />
              </a>
              </div>
            </div>
          </div>
        </div> */}
        <TrendingContainer />

        <div className="uk-child-width-1-2@m tm-ignore-container promo-banner-no-padding" uk-grid="true">
          <div>
            <div className="uk-card uk-card-hover">
              <a onClick={() => history.push('/product/cosmetics')}>
                <img src="/cosmetic_promo_2.jpg" alt="cosmetic_promo" />
              </a>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-hover">
              <div className="uk-card-media-top">
                <a onClick={() => history.push('/product/footwear/heel')}>
                  <img src="/heel_promo.jpg" alt="heel_promo" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <LatestContainer />
        <div className="uk-child-width-1-2@m tm-ignore-container promo-banner-no-padding" uk-grid="true">
          <div>
            <div className="uk-card uk-card-hover">
              <a onClick={() => history.push('/product/bindi/round%20bindi')}>
                <img src="/round_bindi_promo.jpg" alt="round_bindi_promo" />
              </a>
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-hover">
              <div className="uk-card-media-top">
                <a onClick={() => history.push('/product/home%20essential/home%20decor')}>
                  <img src="/home_decore_promo_2.jpg" alt="home_decore_promo_2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export {
  PromoBanner
}