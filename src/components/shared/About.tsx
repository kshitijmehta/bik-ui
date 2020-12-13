import React from 'react';


const About: React.FunctionComponent = () => {
  return (
    <main>
      <section className="uk-section uk-section-small">
        <div className="uk-container">
          <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
            <section className="uk-text-center">
              <ul className="uk-breadcrumb uk-flex-center uk-margin-remove">
                <li><a href="index.html">Home</a></li>
                <li><span>About</span></li>
              </ul>
            </section>
            <section>
              <div>
                <article className="uk-card uk-card-default uk-card-body uk-article tm-ignore-container">
                  <header className="uk-text-center"><h1 className="uk-article-title">About</h1></header>
                  <div className="uk-article-body">
                    <p>
                    Your style is your statement,nail it with class at Basickart.
We have curated a range of premium products to cast an impression everytime you choose us.Our focus is to bring together Multi-brand showcasing good quality products.
From women’s bindis,shoes,lingerie to high end home accessories under one roof .
You don’t have to worry about the latest fashion trends anymore as we update our catalog every week to keep you one step ahead.
                                            </p>
                    <p>
                      We are in the market since 1947. The first shop was opened up at the heart of Delhi, Sadar Bazar. Everysince then our production has grown exponentially. Currently we are the biggest supplier of
                      Traditional wear in India
                                            </p>
                    <h2 className="uk-text-center">Happy Shopping At Basickart</h2>
                    {/* <ul className="uk-list uk-list-bullet">
                      <li>
                        We will provide the best quality. Our quality will be top notch, we use traditonal method of handcraft.
                        This gives the best result.
                                                </li>
                      <li>
                        The rates will the cheapest you can ever get. Since we have our own production house, we are direct producer
                        of each item sold here. You can expect further discount for bulk order.
                                                </li>
                      <li>
                        We want you to grow your business and be happy. Happiness is all that we want. So, buy without any thought
                        and enjoy the happiness.
                                                </li>
                    </ul> */}
                    {/* <h2 className="uk-text-center">Our team</h2>
                    <div className="uk-child-width-1-1 uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid>
                      <div>
                        <div className="uk-grid-small uk-flex-middle" uk-grid>
                          <div><img src="images/about/thomas.svg" alt="Thomas Bruns" width="80" height="80" /></div>
                          <div className="uk-width-expand">
                            <div>Tarun Batra</div>
                            <div className="uk-text-meta">Co-founder & CEO</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="uk-grid-small uk-flex-middle" uk-grid>
                          <div><img src="images/about/george.svg" alt="George Clanton" width="80" height="80" /></div>
                          <div className="uk-width-expand">
                            <div>Tarun Batra</div>
                            <div className="uk-text-meta">Co-founder & President</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="uk-grid-small uk-flex-middle" uk-grid>
                          <div><img src="images/about/martin.svg" alt="Martin Cade" width="80" height="80" /></div>
                          <div className="uk-width-expand">
                            <div>Tarun Batra</div>
                            <div className="uk-text-meta">Co-founder & CTO</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h2 className="uk-text-center">Some stats</h2>
                    <div className="uk-child-width-1-1 uk-child-width-1-3@s uk-text-center" uk-grid>
                      <div>
                        <div className="uk-heading-primary uk-text-warning">5+</div>
                        <div className="uk-margin-small-top">years on the market</div>
                      </div>
                      <div>
                        <div className="uk-heading-primary uk-text-warning">150+</div>
                        <div className="uk-margin-small-top">orders per day</div>
                      </div>
                      <div>
                        <div className="uk-heading-primary uk-text-warning">75000+</div>
                        <div className="uk-margin-small-top">clients</div>
                      </div>
                    </div> */}
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>
      </section>

    </main>
  )
}

export {
  About
}