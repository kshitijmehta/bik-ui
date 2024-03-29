import React from 'react';

const Banner: React.FunctionComponent = () => {
  return (
    <section id="regular-banner" className="uk-position-relative uk-visible-toggle uk-light" uk-slideshow="animation: scale;ratio: 8.2:3; min-height:175;autoplay: true;autoplay-interval: 3000">
      <ul className="uk-slideshow-items">
        <li style={{ backgroundColor: "#0b0a12" }}>
          <a>
            <figure className="uk-container uk-height-1-1"><img src="/banner_first.jpg" alt="New Macbook"  uk-cover="true" /></figure>
          </a>
        </li>
        <li style={{ backgroundColor: "#0b0a12" }}>
          <a>
            <figure className="uk-container uk-height-1-1"><img src="/banner_two.jpg" alt="New Macbook"  uk-cover="true" /></figure>
          </a>
        </li>
        <li style={{ backgroundColor: "#ce071e;" }}>
          <a>
            <figure className="uk-container uk-height-1-1"><img src="/banner_three.jpg" alt="iPhone"  uk-cover="true" /></figure>
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
  Banner
}