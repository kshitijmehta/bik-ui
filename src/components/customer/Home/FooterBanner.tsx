import React from 'react';
import { useHistory } from 'react-router-dom';

const FooterBanner: React.FunctionComponent = () => {
  const history = useHistory();

  return (
    <section className="uk-section uk-section-default uk-section-small">
      <figure className="align-center"><img src="/long-banner-2-1.jpg" alt="footwear" /></figure>
    </section>
  )
}

export {
  FooterBanner
}