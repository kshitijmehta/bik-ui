import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, Colour, saveColour } from 'reducers';
import { ProductColor } from 'types';
import { NotificationContainer } from 'components/shared';

const ProductColour: React.FunctionComponent = () => {

  const dispatch = useDispatch();
  const colourFormik = useFormik({
    initialValues: {
      code: '',
      value: ''
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      value: Yup.string().required('Required')
    }),
    onSubmit: (values: ProductColor) => {
      dispatch(saveColour(values));
    }
  });
  const colourActionStatus = useSelector<AppState, Colour>(state => state.colour);
  useEffect(() => {
    if (colourActionStatus._isSuccess) {
      colourFormik.resetForm();
    }
  }, [colourActionStatus._isSuccess])
  return (
    <form onSubmit={colourFormik.handleSubmit} className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
        <div className="uk-card-body">
          <div className="uk-form-stacked">
            <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
              <fieldset className="uk-fieldset">
                <legend className="uk-h4">Colour</legend>
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">Colour Code</div>
                      <input className="uk-input " id="code" type="input"
                        {...colourFormik.getFieldProps('code')} />
                      {
                        colourFormik.touched.code && colourFormik.errors.code ? (
                          <span className="uk-text-danger">{colourFormik.errors.code}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Colour Name</div>
                      <input className="uk-input " type="input"
                        {...colourFormik.getFieldProps('value')} />
                      {
                        colourFormik.touched.value && colourFormik.errors.value ? (
                          <span className="uk-text-danger">{colourFormik.errors.value}</span>
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
          <NotificationContainer {...colourActionStatus}/>
          <button disabled={colourActionStatus._isLoading} type="submit" className="uk-button uk-button-primary ">
            {
              colourActionStatus._isLoading &&
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
  ProductColour
}