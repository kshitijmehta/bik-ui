import React from 'react';

const CustomerProductDetailsLoading: React.FunctionComponent = () => {
  return (
    <main>
      <section className="uk-section uk-section-small">
        <div className="uk-container">
          <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
            <div className="uk-text-center">
              <ul className="uk-breadcrumb uk-flex-center uk-margin-remove">
                <li><a href="#">Home</a></li>
                <li><span>Product</span></li>
              </ul>
              <h1 className="uk-margin-small-top uk-margin-remove-bottom"></h1>
            </div>
            <div>
              <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
                <div>
                  <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
                    <div className="uk-grid-small uk-grid-collapse uk-grid-match" uk-grid="true">
                      <div className="uk-width-1-1 uk-width-expand@m">
                        <div className="uk-grid-collapse uk-child-width-1-1" uk-slideshow="finite: true; ratio: 4:3;" uk-grid="true">
                          <div>
                            {/* <div className="ph-item">
                            <div className="ph-col-12">
                              <div className="ph-picture-big"></div>
                            </div>
                          </div> */}
                            <ul className="uk-slideshow-items" uk-lightbox="true">
                              <li>
                                <div className="ph-item">
                                  <div className="ph-col-12">
                                    <div className="ph-picture-big"></div>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="ph-item">
                                  <div className="ph-col-12">
                                    <div className="ph-picture-big"></div>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="ph-item">
                                  <div className="ph-col-12">
                                    <div className="ph-picture-big"></div>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="ph-item">
                                  <div className="ph-col-12">
                                    <div className="ph-picture-big"></div>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="ph-item">
                                  <div className="ph-col-12">
                                    <div className="ph-picture-big"></div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div>
                            <div className="uk-card-body uk-flex uk-flex-center">
                              <div className="uk-width-1-2 uk-visible@s">
                                <div uk-slider="finite: true">
                                  <div className="uk-position-relative">
                                    <div className="uk-slider-container">
                                      <ul className="tm-slider-items uk-slider-items uk-child-width-1-4 uk-grid uk-grid-small loading-small-slider">
                                        <li uk-slideshow-item="0">
                                          <div className="tm-ratio tm-ratio-1-1">
                                            <div className="ph-item">
                                              <div className="ph-col-12">
                                                <div className="ph-picture"></div>
                                              </div>
                                            </div>
                                          </div>
                                        </li>
                                        <li uk-slideshow-item="1">
                                          <div className="tm-ratio tm-ratio-1-1">
                                            <div className="ph-item">
                                              <div className="ph-col-12">
                                                <div className="ph-picture"></div>
                                              </div>
                                            </div>
                                          </div>
                                        </li>
                                        <li uk-slideshow-item="2">
                                          <div className="tm-ratio tm-ratio-1-1">
                                            <div className="ph-item">
                                              <div className="ph-col-12">
                                                <div className="ph-picture"></div>
                                              </div>
                                            </div>
                                          </div>
                                        </li>
                                        <li uk-slideshow-item="3">
                                          <div className="tm-ratio tm-ratio-1-1">
                                            <div className="ph-item">
                                              <div className="ph-col-12">
                                                <div className="ph-picture"></div>
                                              </div>
                                            </div>
                                          </div>
                                        </li>
                                        <li uk-slideshow-item="4">
                                          <div className="tm-ratio tm-ratio-1-1">
                                            <div className="ph-item">
                                              <div className="ph-col-12">
                                                <div className="ph-picture"></div>
                                              </div>
                                            </div>
                                          </div>
                                        </li>
                                      </ul>
                                      {/* {
                                        <div className="ph-item">
                                          <div className="ph-col-12">
                                            <div className="ph-picture"></div>
                                          </div>
                                        </div>
                                        // getFileNameAndPathSmall(imageNames, imagePaths)
                                      } */}
                                      <div>
                                        <a className="uk-position-center-left-out uk-position-small" href="#" uk-slider-item="previous" uk-slidenav-previous="true"></a>
                                        <a className="uk-position-center-right-out uk-position-small" href="#" uk-slider-item="next" uk-slidenav-next="true"></a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <ul className="uk-slideshow-nav uk-dotnav uk-hidden@s"></ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="uk-width-1-1 uk-width-1-3@m tm-product-info">
                        <div className="uk-card-body">
                          {/* <div className="uk-margin">
                            <div className="uk-grid-small" uk-grid="true">
                              <div><span className="uk-label uk-label-warning uk-margin-xsmall-right">top selling</span><span className="uk-label uk-label-danger uk-margin-xsmall-right">trade-in</span></div>
                            </div>
                          </div> */}
                          <div className="uk-margin">
                            <div className="uk-padding-small uk-background-primary-lighten uk-border-rounded">
                              <div className="uk-grid-small uk-child-width-1-1" uk-grid="true">
                                <div>
                                  {/* <del className="uk-text-meta">$1899.00</del> */}
                                  <div className="tm-product-price"></div>
                                </div>
                                <div>
                                  <div className="uk-grid-small" uk-grid="true">
                                    <div>
                                      <a uk-icon="icon: minus; ratio: .75"></a>
                                      <input className="uk-input tm-quantity-input" id="product-1" type="text" onChange={()=>{}} value="1" />
                                      <a uk-icon="icon: plus; ratio: .75"></a>
                                    </div>
                                    <div><button className="uk-button uk-button-primary tm-product-add-button tm-shine js-add-to-cart" disabled={true}>add to cart</button></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="uk-margin">
                            <div className="uk-padding-small uk-background-muted uk-border-rounded">
                              <div className="uk-grid-small uk-child-width-1-1 uk-text-small" uk-grid="true">
                                <div>
                                  <div className="uk-grid-collapse" uk-grid="true">
                                    <span className="uk-margin-xsmall-right" uk-icon="cart"></span>
                                    <div>
                                      <div className="uk-text-bolder">Delivery</div>
                                      <div className="uk-text-xsmall uk-text-muted">In stock, free, tomorrow</div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="uk-grid-collapse" uk-grid="true">
                                    <span className="uk-margin-xsmall-right" uk-icon="location"></span>
                                    <div>
                                      <div className="uk-text-bolder">Pick up from store</div>
                                      <div className="uk-text-xsmall uk-text-muted">In stock, free, tomorrow</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="uk-width-1-1 tm-product-description" id="description">
                        <header>
                          <nav className="tm-product-nav" uk-sticky="offset: 60; bottom: #description; cls-active: tm-product-nav-fixed;">
                            <ul className="uk-subnav uk-subnav-pill js-product-switcher" uk-switcher="connect: .js-tabs">
                              <li><a className="js-scroll-to-description" href="#description">Overview</a></li>
                            </ul>
                          </nav>
                        </header>
                        <div className="uk-card-body">
                          <div className="uk-switcher js-product-switcher js-tabs">
                            <section>
                              <article className="uk-article">
                                <div className="uk-article-body">
                                  <p>

                                  </p>

                                </div>
                              </article>
                            </section>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export {
  CustomerProductDetailsLoading
}