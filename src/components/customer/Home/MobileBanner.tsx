import React from 'react';

const MobileBanner: React.FunctionComponent = () => {
  return (
    <section id="mobile-banner" className="uk-position-relative uk-visible-toggle uk-light" uk-slideshow="animation: pull; min-height:450;autoplay: true;autoplay-interval: 3000">
      <ul className="uk-slideshow-items">
        <li style={{ backgroundColor: "#0b0a12" }}>
          <a>
            <figure className="uk-container uk-height-1-1"><img src="/mobile-bk-banner-1.png" alt="New Macbook"  uk-cover="true" /></figure>
          </a>
        </li>
        <li style={{ backgroundColor: "#0b0a12" }}>
          <a>
            <figure className="uk-container uk-height-1-1"><img src="/mobile-bk-banner-2.jpg" alt="New Macbook"  uk-cover="true" /></figure>
          </a>
        </li>
        <li style={{ backgroundColor: "#ce071e;" }}>
          <a>
            <figure className="uk-container uk-height-1-1"><img src="/mobile-bk-banner-3.jpg" alt="iPhone"  uk-cover="true" /></figure>
          </a>
        </li>
      </ul>
      <a className="uk-position-center-left uk-position-small uk-hidden-hover" uk-slideshow-item="previous" uk-slidenav-previous="true"></a>
      <a className="uk-position-center-right uk-position-small uk-hidden-hover" uk-slideshow-item="next" uk-slidenav-next="true"></a>
      <div className="uk-position-bottom-center uk-position-small"><ul className="uk-slideshow-nav uk-dotnav"></ul></div>
    </section>
  )
}

export {
  MobileBanner
}