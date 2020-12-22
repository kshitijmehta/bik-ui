import React from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ContactUs as ContactUsType } from 'types';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, sendContactUsQuery, ContactUs as ContactUsState } from 'reducers';
import { NotificationContainer } from '.';

const ContactUs: React.FunctionComponent = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const contactUsStatus = useSelector<AppState, ContactUsState>(state => state.contactUs);


  const contactUsFormik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().required('Required'),
      message: Yup.string().required('Required'),
    }),
    onSubmit: (values: ContactUsType) => {
      console.log(values)
      dispatch(sendContactUsQuery(values))
    },
  });

  return (
    <main>
      <section className="uk-section uk-section-small">
        <div className="uk-container">
          <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
            <div className="uk-text-center">
              <ul className="uk-breadcrumb uk-flex-center uk-margin-remove">
                <li><a onClick={() => history.push('/')}>Home</a></li>
                <li><span>Contact Us</span></li>
              </ul>
              <h1 className="uk-margin-small-top uk-margin-remove-bottom">Contact Us</h1>
              <h3 className="uk-margin-small-top uk-margin-remove-bottom">We are here to help!!</h3>
            </div>
            <div>
              <div className="uk-grid-medium" uk-grid="true">
                <section className="uk-width-1-1 uk-width-expand@m">
                  <article className="uk-card uk-card-default uk-card-small uk-card-body uk-article tm-ignore-container">
                    <div className="uk-child-width-1-1 uk-child-width-1-1@s uk-margin-top" uk-grid="true">
                      <section>
                        <h3>Email</h3>
                        <ul className="uk-list">
                          <li>
                            <div><span className="uk-margin-small-right" uk-icon="bookmark"></span><span>“Email has the ability many channels don’t: creating valuable, personal touches at scale” – David Newman</span></div>
                            {/* <span uk-icon="bookmark">“Email has the ability many channels don’t: creating valuable, personal touches at scale” – David Newman</span>  */}
                          </li>
                          <li>
                            <div><span className="uk-margin-small-right" uk-icon="mail"></span><span>For all the queries either fill the form below or write to us at: <a className="uk-link-muted" href="mailto:support@basickart.com">support@basickart.com</a></span></div>

                          </li>
                          {/* <li>
                            <a className="uk-link-heading" href="#"><span className="uk-margin-small-right" uk-icon="receiver"></span><span className="tm-pseudo">8 800 799 99 99</span></a>
                          </li>
                          <li>
                            <a className="uk-link-heading" href="#"><span className="uk-margin-small-right" uk-icon="mail"></span><span className="tm-pseudo">example@example.com</span></a>
                          </li> */}
                          {/* <li>
                            <div><span className="uk-margin-small-right" uk-icon="location"></span><span>Karol Bagh Market, Delhi</span></div>
                          </li>
                          <li>
                            <div><span className="uk-margin-small-right" uk-icon="clock"></span><span>Daily 10:00–20:00</span></div>
                          </li> */}
                        </ul>
                      </section>
                      <section>
                        <h3>Location</h3>
                        <ul className="uk-list">
                          <li>
                            <div><span className="uk-margin-small-right" uk-icon="location"></span><span>B-1/32 Karol Bagh New Delhi-110005</span></div>
                          </li>
                        </ul>
                        {/* <dl className="uk-description-list">
                          <dt>Support</dt>
                          <dd><a className="uk-link-muted" href="mailto:support@basickart.com">support@basickart.com</a></dd>
                        </dl> */}
                      </section>
                      <section>
                        <h4>Thanks,
                          <br />Team BasicKart</h4>
                      </section>
                      <section className="uk-width-1-1">
                        <h3 className="uk-text-center">For bulk enquiries:-</h3>
                        <h3 className="uk-text-center">Leave us your details and we will get back to you</h3>
                        <form onSubmit={contactUsFormik.handleSubmit}>
                          <div className="uk-grid-small uk-child-width-1-1" uk-grid="true">
                            <div>
                              <label>
                                <div className="uk-form-label uk-form-label-required">Name</div>
                                <input className="uk-input" type="text" id="name" 
                                {...contactUsFormik.getFieldProps('name')}/>
                                {
                                          contactUsFormik.touched.name && contactUsFormik.errors.name ? (
                                            <span className="uk-text-danger">{contactUsFormik.errors.name}</span>
                                          ) : ''
                                        }
                              </label>
                            </div>
                            <div>
                              <label>
                                <div className="uk-form-label uk-form-label-required">Email</div>
                                <input className="uk-input" type="email" id="email" 
                                {...contactUsFormik.getFieldProps('email')}/>
                                {
                                          contactUsFormik.touched.email && contactUsFormik.errors.email ? (
                                            <span className="uk-text-danger">{contactUsFormik.errors.email}</span>
                                          ) : ''
                                        }
                              </label>
                            </div>
                            {/* <div>
                              <label>
                                <div className="uk-form-label">Topic</div>
                                <select className="uk-select">
                                  <option>Customer service</option>
                                  <option>Tech support</option>
                                  <option>Other</option>
                                </select>
                              </label>
                            </div> */}
                            <div>
                              <label>
                                <div className="uk-form-label uk-form-label-required">Message</div>
                                <textarea className="uk-textarea" id="message" 
                                {...contactUsFormik.getFieldProps('message')}/>
                                {
                                          contactUsFormik.touched.message && contactUsFormik.errors.message ? (
                                            <span className="uk-text-danger">{contactUsFormik.errors.message}</span>
                                          ) : ''
                                        }
                              </label>
                            </div>
                            <NotificationContainer {...contactUsStatus}/>
                            <div className="uk-text-center"><button type="submit" className="uk-button uk-button-primary">Send</button></div>
                          </div>
                        </form>
                      </section>
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