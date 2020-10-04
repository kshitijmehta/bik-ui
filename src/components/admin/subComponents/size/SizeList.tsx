import React from 'react';
import { AdminProductList } from 'components/admin/AdminProductList';
import { SubProducts } from 'appConstants';
import { ProductSize } from 'types';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, updateColour, Colour, addUpdateSize, Size } from 'reducers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NotificationContainer } from 'components/shared';

const SizeList: React.FunctionComponent = () => {

  const stateData = useSelector<AppState, ProductSize[]>(state => state.size.data || []);
  const productColumns = [
    {
      name: 'SizeId',
      selector: 'sizeId',
      sortable: false,
    },
    {
      name: 'Product Category',
      selector: 'productCategoryName',
      sortable: true,
    },
    {
      name: 'Size Code',
      selector: 'code',
      sortable: true,
    },
    {
      name: 'Size Value',
      selector: 'value',
      sortable: true,
    },
  ]

  return (
    <AdminProductList
      productColumns={productColumns}
      productType={SubProducts.SIZE}
      ExpandableComponent={ExpandableComponent}
      stateData={stateData}
      searchPlaceholder="Search Size Value" 
      expandableRows = {true}/>
  )
}

const ExpandableComponent: React.FunctionComponent<any> = ({ data }) => {
  const dispatch = useDispatch();
  const { code, value, sizeId, productCategory }: ProductSize = data;
  const sizeActionStatus = useSelector<AppState, Size>(state => state.size);

  const sizeQuickViewFormik = useFormik({
    initialValues: {
      code,
      value,
      sizeId,
      productCategory,
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      value: Yup.string().required('Required'),
      productCategory: Yup.number().required('Required')
    }),
    onSubmit: (value: ProductSize) => {
      dispatch(addUpdateSize(value))
    }
  });
  return (
    <form onSubmit={sizeQuickViewFormik.handleSubmit} className="quick-edit-admin uk-grid-medium uk-child-width-1-1" uk-grid="true">
      <fieldset className="uk-fieldset">
        <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-4@s" uk-grid="true">
          <div>
            <label>
              <div className="uk-form-label">Product Category</div>
              <select className="uk-select" id="productCategory"
                {...sizeQuickViewFormik.getFieldProps('productCategory')}>
                <option key='1' value={1}>Bindi</option>
                <option key='2' value={2}>Footwear</option>
                <option key='3' value={3}>HomeDecore</option>
                <option key='4' value={4}>Handicraft</option>
              </select>
              {
                sizeQuickViewFormik.touched.productCategory && sizeQuickViewFormik.errors.productCategory ? (
                  <span className="uk-text-danger">{sizeQuickViewFormik.errors.productCategory}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">Size Code</div>
              <input className="uk-input " id="code" type="input"
                {...sizeQuickViewFormik.getFieldProps('code')} />
              {
                sizeQuickViewFormik.touched.code && sizeQuickViewFormik.errors.code ? (
                  <span className="uk-text-danger">{sizeQuickViewFormik.errors.code}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">Size Value</div>
              <input className="uk-input " type="input"
                {...sizeQuickViewFormik.getFieldProps('value')} />
              {
                sizeQuickViewFormik.touched.value && sizeQuickViewFormik.errors.value ? (
                  <span className="uk-text-danger">{sizeQuickViewFormik.errors.value}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">Size Update</div>
              <button type="submit" className="uk-button uk-button-primary ">
                {
                  sizeActionStatus._isLoading &&
                  <img className="login-button-padding" src="tail-spin.svg" />
                }
                <span>Save</span>
              </button>
            </label>
          </div>
        </div>
        <div className="extended-component-notification">
          {sizeQuickViewFormik.isSubmitting && <NotificationContainer {...sizeActionStatus} />}
          </div>
      </fieldset>
    </form>
  )
}

export {
  SizeList,
  ExpandableComponent
}