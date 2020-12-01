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
            <p>
              We are in the market since 1947. The first shop was opened up at the heart of Delhi, Sadar Bazar. Everysince then our production has grown exponentially. Currently we are the biggest supplier of
              Traditional wear in India
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