import React from 'react';
import * as Yup from 'yup';

import { User } from 'types';
import { useDispatch } from 'react-redux';
import { UserInformation as UserInfo, saveUser } from 'reducers';
import { useFormik } from 'formik';
import { CountryCodes } from 'appConstants';


interface Props {
  user?: UserInfo;
  fromCart? : boolean
};


const UserInformation: React.FunctionComponent<Props> = (props: Props) => {

  const dispatch = useDispatch();
  const userData = props.user;
  const isLoading = props.user?._isLoading;

  const userInformationFormik = useFormik({
    initialValues: {
      firstName: userData?.data?.firstName || '',
      lastName: userData?.data?.lastName || '',
      mobile: userData?.data?.mobile || '',
      dob: userData?.data?.dob || '',
      gender: userData?.data?.gender || '',
      country: userData?.data?.country || CountryCodes.filter(country => country.default)[0].countryCode,
      state: userData?.data?.state || '',
      city: userData?.data?.city || '',
      pincode: userData?.data?.pincode || '',
      addressLineOne: userData?.data?.addressLineOne || '',
      addressLineTwo: userData?.data?.addressLineTwo || '',
      addressLineThree: userData?.data?.addressLineThree || '',
      addressId: userData?.data?.addressId || ''
    },

    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      mobile: Yup.string().required('Required').matches(/^((\+)(\d{1,4}[-]))(\d{10}){1}?$/, 'Valid Format e.g., +91-9876543210'),
      country: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      pincode: Yup.string().required('Required'),
      addressLineOne: Yup.string().required('Required')
    }),

    onSubmit: (value: User) => {
      dispatch(saveUser({...value, discount: userData?.data?.discount}));
    },

    enableReinitialize: true
  });

  return (
    <form onSubmit={userInformationFormik.handleSubmit} className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
        {
          !props.fromCart && <header className="uk-card-header"><h1 className="uk-h2">Personal Information</h1></header>
        }
        <div className="uk-card-body">
          <div className="uk-form-stacked">
            <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
              <fieldset className="uk-fieldset">
                <legend className="uk-h4">Contact</legend>
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">First Name <span className="uk-text-danger">*</span></div>
                      <input className="uk-input" type="text" id="firstName"
                        {...userInformationFormik.getFieldProps("firstName")} />
                      {
                        userInformationFormik.touched.firstName && userInformationFormik.errors.firstName ? (
                          <span className="uk-text-danger">{userInformationFormik.errors.firstName}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Last Name <span className="uk-text-danger">*</span></div>
                      <input className="uk-input" type="text" id="lastName"
                        {...userInformationFormik.getFieldProps("lastName")} />
                    </label>
                  </div>
                </div>
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-3@s" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">Phone Number <span className="uk-text-danger">*</span></div>
                      <input className="uk-input" type="tel" id="mobile"
                        {...userInformationFormik.getFieldProps('mobile')} />
                      {
                        userInformationFormik.touched.mobile && userInformationFormik.errors.mobile ? (
                          <span className="uk-text-danger">{userInformationFormik.errors.mobile}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Date of Birth</div>
                      <input className="uk-input" type="date" id="dob"
                        {...userInformationFormik.getFieldProps('dob')} />
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Gender</div>
                      <select className="uk-select" id="gender"
                        {...userInformationFormik.getFieldProps('gender')}>
                        <option value="">Select</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="O">Other</option>
                      </select>
                    </label>
                  </div>
                </div>
              </fieldset>
              <fieldset className="uk-fieldset">
                <legend className="uk-h4">Address</legend>
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">Country <span className="uk-text-danger">*</span></div>
                      <select className="uk-select" id="country"
                        {...userInformationFormik.getFieldProps('country')}>
                        {
                          CountryCodes.map((country, index) => {
                            return <option key={index} value={country.countryCode}>{country.name}</option>
                          })
                        }
                      </select>
                      {
                        userInformationFormik.touched.country && userInformationFormik.errors.country ? (
                          <span className="uk-text-danger">{userInformationFormik.errors.country}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">State <span className="uk-text-danger">*</span></div>
                      <input className="uk-input" type="text" id="state"
                        {...userInformationFormik.getFieldProps('state')} />
                      {
                        userInformationFormik.touched.state && userInformationFormik.errors.state ? (
                          <span className="uk-text-danger">{userInformationFormik.errors.state}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                </div>
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">City <span className="uk-text-danger">*</span></div>
                      <input className="uk-input" type="text" id="city"
                        {...userInformationFormik.getFieldProps('city')} />
                      {
                        userInformationFormik.touched.city && userInformationFormik.errors.city ? (
                          <span className="uk-text-danger">{userInformationFormik.errors.city}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">PIN code</div>
                      <input className="uk-input" type="text" id="pincode"
                        {...userInformationFormik.getFieldProps('pincode')} />
                      {
                        userInformationFormik.touched.pincode && userInformationFormik.errors.pincode ? (
                          <span className="uk-text-danger">{userInformationFormik.errors.pincode}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                </div>
                <div className="uk-grid-small" uk-grid="true">
                  <div className="uk-width-1-1">
                    <label>
                      <div className="uk-form-label">Flat, House no., Building, Company, Apartment  <span className="uk-text-danger">*</span></div>
                      <input className="uk-input" type="text" id="addressLineOne"
                        {...userInformationFormik.getFieldProps('addressLineOne')} />
                      {
                        userInformationFormik.touched.addressLineOne && userInformationFormik.errors.addressLineOne ? (
                          <span className="uk-text-danger">{userInformationFormik.errors.addressLineOne}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                </div>
                <div className="uk-grid-small" uk-grid="true">
                  <div className="uk-width-1-1">
                    <label>
                      <div className="uk-form-label">Area, Colony, Street, Sector, Village</div>
                      <input className="uk-input" type="text" id="addressLineTwo"
                        {...userInformationFormik.getFieldProps('addressLineTwo')} />
                    </label>
                  </div>
                </div>
                <div className="uk-grid-small" uk-grid="true">
                  <div className="uk-width-1-1">
                    <label>
                      <div className="uk-form-label">Landmark</div>
                      <input className="uk-input" type="text" id="addressLineThree"
                        {...userInformationFormik.getFieldProps('addressLineThree')} />
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <div className="uk-card-footer uk-text-center">
          <button disabled={isLoading} type="submit" className="uk-button uk-button-primary ">
            {
              isLoading &&
              <img className="login-button-padding" src="/tail-spin.svg" />
            }
            <span>Save</span>
          </button>
        </div>
      </div>
    </form>
  )
}

export {
  UserInformation
}
