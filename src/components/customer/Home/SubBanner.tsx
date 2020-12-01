import React from 'react';

const SubBanner: React.FunctionComponent = () => {
  return (
    <section className="uk-section uk-section-default uk-section-small">
      <div className="uk-container">
        <div className="uk-grid-small uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-5@m" uk-grid="true">
          <div>
            <a className="uk-link-muted uk-text-center uk-display-block uk-padding-small uk-box-shadow-hover-large" href="footwear-category.html">
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
            <a className="uk-link-muted uk-text-center uk-display-block uk-padding-small uk-box-shadow-hover-large" href="bindi-category.html">
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
            <a className="uk-link-muted uk-text-center uk-display-block uk-padding-small uk-box-shadow-hover-large" href="home-decor-category.html">
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
            <a className="uk-link-muted uk-text-center uk-display-block uk-padding-small uk-box-shadow-hover-large" href="home-decor-category.html">
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
      </div>
    </section>
  )
}

export {
  SubBanner
}