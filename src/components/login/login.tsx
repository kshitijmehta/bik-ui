import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Login, CustomerCart } from 'types'
import { CountryCodes } from 'appConstants';
import { useDispatch, useSelector, } from 'react-redux';
import { userLogin, AppState, defaultLoginRegister, userRegister, getUser, getCart, forgetPassword, addUpdateCart } from 'reducers';
import { Redirect } from 'react-router-dom';


const UserLogin: React.FunctionComponent = () => {

  const dispatch = useDispatch();
  const isLoading = useSelector<AppState, boolean>(state => state.userLogin._isLoading);
  const isError = useSelector<AppState, boolean>(state => state.userLogin._isError);
  const _isSuccess = useSelector<AppState, boolean>(state => state.userLogin._isSuccess);
  const responseMessage = useSelector<AppState, string | undefined>(state => state.userLogin.message);
  const [loginRedirect, setLoginRedirect] = useState(false)

  const loginFormik = useFormik({
    initialValues: {
      email: '',
      password: '',
      mobile: '+91-',
      isRegistration: false,
      forgetPassword: false,
      countryCode: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Required')
        .email('Invalid email address'),
      password: Yup.string().when('forgetPassword',{
        is: false,
        then: Yup.string()
        .required('Required')
      }),
      mobile: Yup.string().when('isRegistration', {
        is: true,
        then: Yup.string().required('Required')
          .matches(/^((\+)(\d{1,4}[-]))(\d{10}){1}?$/
            , 'Valid Format e.g., +91-9876543210')
      })
    }),
    onSubmit: (values: Login) => {
      if (!loginFormik.values.isRegistration) {
        if(loginFormik.values.forgetPassword){
          dispatch(forgetPassword(values));
        } else {
          dispatch(userLogin({ email: values.email, password: values.password }));
        }
      } else {
        dispatch(userRegister({ email: values.email, password: values.password, mobile: values.mobile }));
      }
    },
  });

  const onCountryChange = (event: React.FormEvent<HTMLSelectElement>): void => {
    loginFormik.setFieldValue('mobile', event.currentTarget.value + '-')
  };

  const toggleLoginRegister = (isRegistration: boolean): void => {
    loginFormik.resetForm();
    loginFormik.setFieldValue('isRegistration', isRegistration);
    loginFormik.setFieldValue('forgetPassword', false);
    dispatch(defaultLoginRegister());
  }

  const onForgetPassword = () => {
    loginFormik.setFieldValue('forgetPassword', true);
  };

  const addToDBCartAfterLogin = () => {
    const cartData = JSON.parse(localStorage.getItem("basicKart-loggedOutCart") || '[]');
    cartData.forEach((cart: CustomerCart) => {
      dispatch(addUpdateCart({
        productDetailId: cart.productDetailId,
        productQuantity: cart.productQuantity,
        currencyType: cart.currencyType,
        cartId: '0',
        productImage: cart.productImage,
        productImagePath: cart.productImagePath,
        productName: cart.productName,
        subcategory: cart.subcategory,
        productPrice: '0',
        productId: cart.productId,
      },true))
    });
    localStorage.setItem('basicKart-loggedOutCart','[]');
  }

  useEffect(() => {
    if (loginFormik.values.isRegistration) {
      loginFormik.setFieldValue('isRegistration', false);
      loginFormik.setFieldValue('email', '');
      loginFormik.setFieldValue('password', '');
      loginFormik.touched.password = false;
      loginFormik.touched.email = false;
    } else {
      if (_isSuccess) {
        if(!loginFormik.values.forgetPassword){
          setLoginRedirect(true);
          dispatch(getUser());
          dispatch(getCart());
          addToDBCartAfterLogin();
        }
      }
    }
  }, [_isSuccess])

  if (loginRedirect) {
    return <Redirect to="/" />
  }

  return (
    <form onSubmit={loginFormik.handleSubmit} className="uk-form-stacked">
      <main>
        <section className="uk-section uk-section-small">
          <div className="uk-container">
            <div className="uk-grid-medium justify-content-center " uk-grid="true">
              <div className="uk-width-1-1 uk-width-1-3@m tm-aside-column user-nave-sticky">
                <div className="uk-card uk-card-default uk-card-small tm-ignore-container" uk-sticky="offset: 80; bottom: true;">
                  <div className="uk-card-header">
                    <div className="uk-grid-small uk-child-width-1-1" uk-grid="true">
                      <div>
                        <div className="uk-grid-small uk-flex-center" uk-grid="true">
                          <div>
                            <a className={'uk-button uk-button-default uk-button-small ' + (!loginFormik.values.isRegistration ? 'login-register-active-button uk-active' : '')} onClick={(): void => toggleLoginRegister(false)}>
                              <span className="uk-margin-xsmall-right" uk-icon="icon: sign-in; ratio: .75;"></span>
                              <span>Login</span>
                            </a>
                          </div>
                          <div>
                            <a className={'uk-button uk-button-default uk-button-small ' + (loginFormik.values.isRegistration ? 'login-register-active-button uk-active' : '')} onClick={(): void => toggleLoginRegister(true)}>
                              <span className="uk-margin-xsmall-right" uk-icon="icon: pencil; ratio: .75;"></span>
                              <span>Register</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {
                      isError &&
                      <div className="login-error-message">
                        <span className="uk-notification-message-danger"> {responseMessage} </span>
                      </div>
                    }
                    {
                      _isSuccess &&
                      <div className="forget-password-message">
                        <span className="uk-notification-message-success"> {responseMessage} </span>
                      </div>
                    }
                    <nav>
                      <ul className="uk-nav uk-nav-default tm-nav">
                        <li>
                          <div className="uk-card-body">
                            <div className="uk-form-stacked">
                              <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
                                <fieldset className="uk-fieldset">
                                  <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-1@s" uk-grid="true">
                                    <div>
                                      <label>
                                        <div className="uk-form-label">Email</div>
                                        <input className="uk-input" id="email" type="text"
                                          {...loginFormik.getFieldProps('email')} />
                                        {
                                          loginFormik.touched.email && loginFormik.errors.email ? (
                                            <span className="uk-text-danger">{loginFormik.errors.email}</span>
                                          ) : ''
                                        }
                                      </label>
                                    </div>
                                  </div>
                                </fieldset>
                                {loginFormik.values.isRegistration &&
                                  <fieldset className="uk-fieldset">
                                    <div className="uk-grid-small" uk-grid="true">
                                      <div className="uk-width-1-3 uk-width-1-3@s">
                                        <label>
                                          <div className="uk-form-label">Country</div>
                                          <select className="uk-select" id="countryCode"
                                            onChange={onCountryChange}>
                                            {
                                              CountryCodes.map((country, index) => {
                                                return <option key={index} value={country.Iso} selected={country.default}>{country.name}</option>
                                              })
                                            }
                                          </select>
                                        </label>
                                      </div>
                                      <div className="uk-width-expand">
                                        <label>
                                          <div className="uk-form-label">Mobile Number</div>
                                          <input className="uk-input" type="text" id="mobile"
                                            {...loginFormik.getFieldProps('mobile')} />
                                          {
                                            loginFormik.touched.mobile && loginFormik.errors.mobile ? (
                                              <span className="uk-text-danger">{loginFormik.errors.mobile}</span>
                                            ) : ''
                                          }
                                        </label>
                                      </div>
                                    </div>
                                  </fieldset>
                                }
                                {
                                  !loginFormik.values.forgetPassword &&
                                  <fieldset className="uk-fieldset">
                                    <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-1@s" uk-grid="true">
                                      <div>
                                        <label>
                                          <div className="uk-form-label">Password</div>
                                          <input className="uk-input" type="password" id="password"
                                            {...loginFormik.getFieldProps('password')} />
                                          {
                                            loginFormik.touched.password && loginFormik.errors.password ? (
                                              <span className="uk-text-danger">{loginFormik.errors.password}</span>
                                            ) : ''
                                          }
                                        </label>
                                      </div>
                                    </div>
                                  </fieldset>
                                }

                              </div>
                              {
                                !loginFormik.values.isRegistration &&
                                <div className="uk-text-right uk-margin-xsmall-top">
                                  <a className="uk-text-danger" onClick={() => onForgetPassword()}> Forget Password ?</a>
                                </div>
                              }

                              <div className="uk-card-footer uk-text-center top-border-none">
                                <button id="loginbtn" disabled={isLoading} type="submit" className="uk-button uk-button-primary ">
                                  {
                                    isLoading &&
                                    <img className="login-button-padding" src="tail-spin.svg" />
                                  }
                                  <span>Submit</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </form>
  )
}

export {
  UserLogin
}