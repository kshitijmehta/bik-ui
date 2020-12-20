import React from 'react';

const HomeAboutUs: React.FunctionComponent = () => {
  return (
    <section className="uk-section uk-section-default uk-section-small">
      <div className="uk-container">
        <div className="uk-grid-medium uk-child-width-1-1 uk-child-width-1-1@s" uk-grid="true">
          <section>
            <h2 className="uk-text-center uk-text-left@s">About</h2>
            <p>
              We are the Bindi tycoon of North India. We supply Bindi to all over India. Our catalog has the complete range of Bindi for every occasion. Apart from Bindi we also have a large collection of footwear,
              Homedecor, Accessories.
                                </p>

          </section>
        </div>
      </div>
    </section>
  )
}

export {
  HomeAboutUs
}