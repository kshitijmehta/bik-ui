import React from 'react';
import { useHistory } from 'react-router-dom';

const SubBanner: React.FunctionComponent = () => {
  const history = useHistory();

  return (
    <section className="uk-section uk-section-default uk-section-small">
      <figure className="align-center"><img src="/long-banner_1.jpg" alt="footwear" /></figure>
      {/* <div className="uk-container">
        <div className="uk-grid-small uk-child-width-1-1" uk-grid="true">
        <figure><img src="/long-banner.jpg" alt="footwear" /></figure>
          <div>
            <a onClick={()=>history.push('/product/bindi')} className="uk-link-muted uk-text-center uk-display-block uk-padding-small uk-box-shadow-hover-large">
              <div className="tm-ratio tm-ratio-4-3">
                <div className="tm-media-box">
                  <figure className="tm-media-box-wrap"><img className="item-brand" src="/sb_2.png" alt="footwear" /></figure>
                </div>
              </div>
              <div className="uk-margin-small-top">
                <div className="uk-text-truncate">Bindi</div>
              </div>
            </a>
          </div>
          <div>
            <a onClick={()=>history.push('/product/footwear')}  className="uk-link-muted uk-text-center uk-display-block uk-padding-small uk-box-shadow-hover-large" >
              <div className="tm-ratio tm-ratio-4-3">
                <div className="tm-media-box">
                  <figure className="tm-media-box-wrap"><img className="item-brand" src="/sb_1.png" alt="Bindi" /></figure>
                </div>
              </div>
              <div className="uk-margin-small-top">
                <div className="uk-text-truncate">Footwear</div>
              </div>
            </a>
          </div>
          <div>
            <a className="uk-link-muted uk-text-center uk-display-block uk-padding-small uk-box-shadow-hover-large" href="#">
              <div className="tm-ratio tm-ratio-4-3">
                <div className="tm-media-box">
                  <figure className="tm-media-box-wrap"><img className="item-brand" src="/sb_3.png" alt="Accessories" /></figure>
                </div>
              </div>
              <div className="uk-margin-small-top">
                <div className="uk-text-truncate">Homedecore</div>
              </div>
            </a>
          </div>
          <div>
            <a onClick={()=>history.push('/product/lingerie')}  className="uk-link-muted uk-text-center uk-display-block uk-padding-small uk-box-shadow-hover-large">
              <div className="tm-ratio tm-ratio-4-3">
                <div className="tm-media-box">
                  <figure className="tm-media-box-wrap"><img className="item-brand" src="/sb_4.png" alt="Home Decor" /></figure>
                </div>
              </div>
              <div className="uk-margin-small-top">
                <div className="uk-text-truncate">Lingerie</div>
              </div>
            </a>
          </div>
          <div>
            <a className="uk-link-muted uk-text-center uk-display-block uk-padding-small uk-box-shadow-hover-large" href="#">
              <div className="tm-ratio tm-ratio-4-3">
                <div className="tm-media-box">
                  <figure className="tm-media-box-wrap"><img className="item-brand" src="/test.jpg" alt="Home Decor" /></figure>
                </div>
              </div>
              <div className="uk-margin-small-top">
                <div className="uk-text-truncate">Cosmetics</div>
              </div>
            </a>
          </div>
        </div>
      </div> */}
    </section>
  )
}

export {
  SubBanner
}