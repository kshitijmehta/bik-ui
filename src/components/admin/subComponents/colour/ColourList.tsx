import React from 'react';
import { AdminProductList } from 'components/admin/AdminProductList';
import { SubProducts } from 'appConstants';
import { ProductColor } from 'types';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, updateColour, Colour } from 'reducers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NotificationContainer } from 'components/shared';


const ExpandableComponent: React.FunctionComponent<any> = ({ data }) => {
  const dispatch = useDispatch();
  const { code, value, colourId }: ProductColor = data;
  const colourActionStatus = useSelector<AppState, Colour>(state => state.colour);

  const colourQuickViewFormik = useFormik({
    initialValues: {
      code,
      value,
      colourId
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      value: Yup.string().required('Required')
    }),
    onSubmit: (value: ProductColor) => {
      dispatch(updateColour(value))
    }
  });
  return (
    <form onSubmit={colourQuickViewFormik.handleSubmit} className="quick-edit-admin uk-grid-medium uk-child-width-1-1" uk-grid="true">
      <fieldset className="uk-fieldset">
        <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-3@s" uk-grid="true">
          <div>
            <label>
              <div className="uk-form-label">Colour Code</div>
              <input className="uk-input " id="code" type="input"
                {...colourQuickViewFormik.getFieldProps('code')} />
              {
                colourQuickViewFormik.touched.code && colourQuickViewFormik.errors.code ? (
                  <span className="uk-text-danger">{colourQuickViewFormik.errors.code}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">Colour Name</div>
              <input className="uk-input " type="input"
                {...colourQuickViewFormik.getFieldProps('value')} />
              {
                colourQuickViewFormik.touched.value && colourQuickViewFormik.errors.value ? (
                  <span className="uk-text-danger">{colourQuickViewFormik.errors.value}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">Colour Update</div>
              <button type="submit" className="uk-button uk-button-primary ">
                {
                  colourActionStatus._isLoading &&
                  <img className="login-button-padding" src="tail-spin.svg" />
                }
                <span>Save</span>
              </button>
            </label>
          </div>
        </div>
        <div className="extended-component-notification">
        {colourQuickViewFormik.isSubmitting && <NotificationContainer {...colourActionStatus}/>}
        </div>
      </fieldset>
    </form>
  )
}

const ColourList: React.FunctionComponent = () => {

  const stateData = useSelector<AppState, ProductColor[]>(state => state.colour.data || []);  
  const productColumns = [
    {
      name: 'ColourId',
      selector: 'colourId',
      sortable: false,
    },
    {
      name: 'Colour Code',
      selector: 'code',
      sortable: true,
    },
    {
      name: 'Colour Value',
      selector: 'value',
      sortable: true,
    },
  ]

  return(
    <AdminProductList 
      productColumns={productColumns} 
      productType={SubProducts.COLOUR} 
      ExpandableComponent= {ExpandableComponent}
      stateData={stateData}
      searchPlaceholder="Search Colour Value"
      expandableRows = {true}/>
  )
}



export {
  ColourList,
  ExpandableComponent
}