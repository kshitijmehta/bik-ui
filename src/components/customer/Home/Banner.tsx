import React from 'react';

const Banner: React.FunctionComponent = () => {
  return (
    <section className="uk-position-relative uk-visible-toggle uk-light" uk-slideshow="min-height: 300; max-height: 500;">
      <ul className="uk-slideshow-items">
        <li style={{ backgroundColor: "#0b0a12" }}>
          <a href="#">
            <figure className="uk-container uk-height-1-1"><img src="/banner.jpg" alt="New Macbook" width="1200" height="500" uk-cover="true" /></figure>
          </a>
        </li>
        <li style={{ backgroundColor: "#0b0a12" }}>
          <a href="#">
            <figure className="uk-container uk-height-1-1"><img src="/banner_2.jpg" alt="New Macbook" width="1200" height="500" uk-cover="true" /></figure>
          </a>
        </li>
        <li style={{ backgroundColor: "#ce071e;" }}>
          <a href="#">
            <figure className="uk-container uk-height-1-1"><img src="/banner_3.jpg" alt="iPhone" width="1200" height="500" uk-cover="true" /></figure>
          </a>
        </li>
      </ul>
      <a className="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slideshow-item="previous" uk-slidenav-previous="true"></a>
      <a className="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slideshow-item="next" uk-slidenav-next="true"></a>
      <div className="uk-position-bottom-center uk-position-small"><ul className="uk-slideshow-nav uk-dotnav"></ul></div>
    </section>
  )
}

export {
  Banner
}