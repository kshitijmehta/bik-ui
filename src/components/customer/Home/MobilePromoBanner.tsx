import { LoadingProductArticle } from 'components/shared';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { LatestContainer, TrendingContainer } from './trendingLatest';

const MobilePromoBanner: React.FunctionComponent = () => {
  const history = useHistory();
  return (
    <section  id="mobile-banner"  className="uk-section uk-section-small">
      <div className="uk-container">
        <h2 className="uk-text-center"></h2>
        {/* <div uk-scrollspy="cls: trends; repeat: false"> */}
          <TrendingContainer />
        {/* </div> */}
        <h2 className="uk-text-center">Browse products by category</h2>
        <div className="uk-child-width-1-2 tm-ignore-container promo-banner-no-padding" uk-grid="true">
          <div uk-parallax="opacity: 0,1; x: 50,0; viewport: 0.3">
            <div className="uk-card uk-card-hover padding-three">
              <div className="uk-card-media-top">
                <a onClick={() => history.push('/product/footwear')}>
                  <img src="/mobile-footwear.jpg" alt="promo-footwear" height="280"/>
                </a>
              </div>
            </div>
          </div>
          <div uk-parallax="opacity: 0,1; x: -50,0; viewport: 0.3">
            <div className="uk-card uk-card-hover padding-three">
              <div className="uk-card-media-top">
                <a onClick={() => history.push('/product/lingerie')}>
                  <img src="/mobile-lingerie.jpg" alt="promo-lingerie" height="280" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="uk-child-width-1-2 tm-ignore-container promo-banner-no-padding" uk-grid="true">
          <div uk-parallax="opacity: 0,1; x: 50,0; viewport: 0.3">
            <div className="uk-card uk-card-hover padding-three">
              <a onClick={() => history.push('/product/bindi')}>
                <img src="/mobile-bindi-new.jpg" alt="promo-bindi" height="280"/>
              </a>
            </div>
          </div>
          <div uk-parallax="opacity: 0,1; x: -50,0; viewport: 0.3">
            <div className="uk-card uk-card-hover padding-three">
              <div className="uk-card-media-top">
                <a onClick={() => history.push('/product/home essential')}>
                  <img src="/mobile-home-essential.jpg" alt="promo-home-essential" height="280"/>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="uk-child-width-1-2 tm-ignore-container promo-banner-no-padding" uk-grid="true">
          <div uk-parallax="opacity: 0,1; x: 50,0; viewport: 0.3">
            <div className="uk-card uk-card-hover padding-three">
              <a onClick={() => history.push('/product/cosmetics')}>
                <img src="/mobile-cosmetics-new.jpg" alt="cosmetic_promo"  height="280"/>
              </a>
            </div>
          </div>
          <div uk-parallax="opacity: 0,1; x: -50,0; viewport: 0.3">
            <div className="uk-card uk-card-hover padding-three">
              <div className="uk-card-media-top">
                <a onClick={() => history.push('/product/fashion accessories')}>
                  <img src="/mobile-fashion-accessories-new.jpg" alt="heel_promo" height="280"/>
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
        

        {/* <div className="uk-child-width-1-2@m tm-ignore-container promo-banner-no-padding" uk-grid="true">
          <div>
            <div className="uk-card uk-card-hover">
              <a onClick={() => history.push('/product/cosmetics')}>
                <img src="/new-cosmetic-promo.jpg" alt="cosmetic_promo" />
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
        </div> */}
        <div uk-scrollspy="cls: trends; repeat: true">
          <LatestContainer />
        </div>
        
        {/* <div className="uk-child-width-1-2@m tm-ignore-container promo-banner-no-padding" uk-grid="true">
          <div>
            <div className="uk-card uk-card-hover">
              <a onClick={() => history.push('/product/bindi/round%20bindi')}>
                <img src="/new-fashion-accessories-promo.jpg" alt="round_bindi_promo" />
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
        </div> */}
      </div>
    </section>
  )
}

export {
  MobilePromoBanner
}