import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { UserSetting, saveUserSettings } from 'reducers';
import { useDispatch } from 'react-redux';
import { UserSettings as UserSettingType } from 'types';
import { NotificationContainer } from 'components/shared';


interface Props {
  user?: UserSetting;
}

const UserSettings: React.FunctionComponent<Props> = (props: Props) => {

  const user = props.user;
  const isLoading = props.user?._isLoading;
  const dispatch = useDispatch();
  const userSettingFormik = useFormik({
    initialValues: {
      emailAddress: user?.data?.emailAddress || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      emailAddress: Yup.string().required('Required'),
      currentPassword: Yup.string().required('Required'),
      newPassword: Yup.string().required('Required'),
      confirmPassword: Yup.string().required('Required').oneOf([Yup.ref('newPassword'), ''], 'Password should match')
    }),
    onSubmit: (value: UserSettingType) => {
      dispatch(saveUserSettings(value));
      userSettingFormik.resetForm();
    },

    enableReinitialize: true
  });


  return (
    <form onSubmit={userSettingFormik.handleSubmit} className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
        <header className="uk-card-header"><h1 className="uk-h2">Settings</h1></header>
        <div className="uk-card-body">
          <div className="uk-form-stacked">
            <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
              <fieldset className="uk-fieldset">
                <legend className="uk-h4">Email</legend>
                <div className="uk-grid-small uk-child-width-1-1" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">Current Email</div>
                      <input className="uk-input" id="emailAddress" type="email" disabled
                        {...userSettingFormik.getFieldProps('emailAddress')} />
                    </label>
                  </div>
                </div>
              </fieldset>
              <fieldset className="uk-fieldset">
                <legend className="uk-h4">Password</legend>
                <div className="uk-grid-small uk-child-width-1-1" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">Current Password</div>
                      <input className="uk-input " id="currentPassword" type="password"
                        {...userSettingFormik.getFieldProps('currentPassword')} />
                      {
                        userSettingFormik.touched.currentPassword && userSettingFormik.errors.currentPassword ? (
                          <span className="uk-text-danger">{userSettingFormik.errors.currentPassword}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">New Password</div>
                      <input className="uk-input " type="password"
                        {...userSettingFormik.getFieldProps('newPassword')} />
                      {
                        userSettingFormik.touched.newPassword && userSettingFormik.errors.newPassword ? (
                          <span className="uk-text-danger">{userSettingFormik.errors.newPassword}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Confirm Password</div>
                      <input className="uk-input " type="password"
                        {...userSettingFormik.getFieldProps('confirmPassword')} />
                      {
                        userSettingFormik.touched.confirmPassword && userSettingFormik.errors.confirmPassword ? (
                          <span className="uk-text-danger">{userSettingFormik.errors.confirmPassword}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <div className="uk-card-footer uk-text-center">
        {
            props.user &&
            <NotificationContainer {...props.user}/>
          }
          <button disabled={isLoading} type="submit" className="uk-button uk-button-primary ">
            {
              isLoading &&
              <img className="login-button-padding" src="/tail-spin.svg" />
            }
            <span>update password</span>
          </button>
        </div>
      </div>
    </form>
  )
}

export {
  UserSettings
}