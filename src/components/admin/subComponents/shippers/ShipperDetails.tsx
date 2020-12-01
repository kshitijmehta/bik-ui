import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { NotificationContainer } from 'components/shared';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, Shipper, saveShipper } from 'reducers';
import { OrderShipper } from 'types';

const ShipperDetails: React.FunctionComponent = () => {

  const dispatch = useDispatch();
  const shipperActionStatus = useSelector<AppState, Shipper>(state => state.shipper);
  const shipperFormik = useFormik({
    initialValues: {
      shipperName: '',
      trackingLink: '',
      shipperId: '0'
    },
    validationSchema: Yup.object({
      shipperName: Yup.string().required('Required'),
      trackingLink: Yup.string().required('Required')
    }),
    onSubmit: (values: OrderShipper) => {
      dispatch(saveShipper(values));
    }
  });

  useEffect(() => {
    if (shipperActionStatus._isSuccess) {
      shipperFormik.resetForm();
    }
  }, [shipperActionStatus._isSuccess])
  return (
    <form onSubmit={shipperFormik.handleSubmit} className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
        <div className="uk-card-body">
          <div className="uk-form-stacked">
            <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
              <fieldset className="uk-fieldset">
                <legend className="uk-h4">Shipper</legend>
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">Shipper Name</div>
                      <input className="uk-input " id="shipperName" type="input"
                        {...shipperFormik.getFieldProps('shipperName')} />
                      {
                        shipperFormik.touched.shipperName && shipperFormik.errors.shipperName ? (
                          <span className="uk-text-danger">{shipperFormik.errors.shipperName}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Tracking Link</div>
                      <input className="uk-input " type="input"
                        {...shipperFormik.getFieldProps('trackingLink')} />
                      {
                        shipperFormik.touched.trackingLink && shipperFormik.errors.trackingLink ? (
                          <span className="uk-text-danger">{shipperFormik.errors.trackingLink}</span>
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
          <NotificationContainer {...shipperActionStatus} />
          <button disabled={shipperActionStatus._isLoading} type="submit" className="uk-button uk-button-primary ">
            {
              shipperActionStatus._isLoading &&
              <img className="login-button-padding" src="tail-spin.svg" />
            }
            <span>Save</span>
          </button>
        </div>
      </div>
    </form>
  )
}

export {
  ShipperDetails
}