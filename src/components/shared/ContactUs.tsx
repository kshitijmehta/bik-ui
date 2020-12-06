import React from 'react';
import { useHistory } from 'react-router-dom';

const ContactUs: React.FunctionComponent = () => {
  const history = useHistory();
  return (
    <main>
      <section className="uk-section uk-section-small">
        <div className="uk-container">
          <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
            <div className="uk-text-center">
              <ul className="uk-breadcrumb uk-flex-center uk-margin-remove">
                <li><a onClick={()=>history.push('/')}>Home</a></li>
                <li><span>Contacts</span></li>
              </ul>
              <h1 className="uk-margin-small-top uk-margin-remove-bottom">Contacts</h1>
            </div>
            <div>
              <div className="uk-grid-medium" uk-grid="true">
                <section className="uk-width-1-1 uk-width-expand@m">
                  <article className="uk-card uk-card-default uk-card-small uk-card-body uk-article tm-ignore-container">
                    <div className="uk-child-width-1-1 uk-child-width-1-2@s uk-margin-top" uk-grid="true">
                      <section>
                        <h3>Store</h3>
                        <ul className="uk-list">
                          {/* <li>
                            <a className="uk-link-heading" href="#"><span className="uk-margin-small-right" uk-icon="receiver"></span><span className="tm-pseudo">8 800 799 99 99</span></a>
                          </li>
                          <li>
                            <a className="uk-link-heading" href="#"><span className="uk-margin-small-right" uk-icon="mail"></span><span className="tm-pseudo">example@example.com</span></a>
                          </li> */}
                          <li>
                            <div><span className="uk-margin-small-right" uk-icon="location"></span><span>Karol Bagh Market, Delhi</span></div>
                          </li>
                          <li>
                            <div><span className="uk-margin-small-right" uk-icon="clock"></span><span>Daily 10:00–20:00</span></div>
                          </li>
                        </ul>
                      </section>
                      <section>
                        <h3>Feedback</h3>
                        <dl className="uk-description-list">
                          <dt>Support</dt>
                          <dd><a className="uk-link-muted" href="mailto:support@basickart.com">support@basickart.com</a></dd>
                        </dl>
                      </section>
                      {/* <section className="uk-width-1-1">
                        <h2 className="uk-text-center">Contact Us</h2>
                        <form>
                          <div className="uk-grid-small uk-child-width-1-1" uk-grid="true">
                            <div>
                              <label>
                                <div className="uk-form-label uk-form-label-required">Name</div>
                                <input className="uk-input" type="text" required />
                              </label>
                            </div>
                            <div>
                              <label>
                                <div className="uk-form-label uk-form-label-required">Email</div>
                                <input className="uk-input" type="email" required />
                              </label>
                            </div>
                            <div>
                              <label>
                                <div className="uk-form-label">Topic</div>
                                <select className="uk-select">
                                  <option>Customer service</option>
                                  <option>Tech support</option>
                                  <option>Other</option>
                                </select>
                              </label>
                            </div>
                            <div>
                              <label>
                                <div className="uk-form-label">Message</div>
                                <textarea className="uk-textarea"></textarea>
                              </label>
                            </div>
                            <div className="uk-text-center"><button className="uk-button uk-button-primary">Send</button></div>
                          </div>
                        </form>
                      </section> */}
                    </div>
                  </article>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export {
  ContactUs
}