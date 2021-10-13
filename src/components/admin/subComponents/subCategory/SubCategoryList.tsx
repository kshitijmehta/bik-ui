import React from 'react';
import { AdminProductList } from 'components/admin/AdminProductList';
import { SubProducts } from 'appConstants';
import { ProductSubCategory } from 'types';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, updateColour, Colour, addUpdateSize, Size, SubCategory, addUpdateSubCategory } from 'reducers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NotificationContainer } from 'components/shared';

const SubCategoryList: React.FunctionComponent = () => {

  const stateData = useSelector<AppState, ProductSubCategory[]>(state => state.subCategory.data || []);
  const productColumns = [
    {
      name: 'SubCategoryId',
      selector: 'subCategoryId',
      sortable: false,
    },
    {
      name: 'Product Category',
      selector: 'productCategoryName',
      sortable: true,
    },
    {
      name: 'Product CategoryID',
      selector: 'productCategoryId',
      sortable: true,
    },
    {
      name: 'Subcategory',
      selector: 'code',
      sortable: true,
    },
    {
      name: 'Subcategory Description',
      selector: 'value',
      sortable: true,
    },
  ]

  return (
    <AdminProductList
      productColumns={productColumns}
      productType={SubProducts.SUB_PRODUCT}
      ExpandableComponent={ExpandableComponent}
      stateData={stateData}
      searchPlaceholder="Search Subcategory Value"
      expandableRows={true} />
  )
}

const ExpandableComponent: React.FunctionComponent<any> = ({ data }) => {
  const dispatch = useDispatch();
  const { code, value, subCategoryId, productCategoryId }: ProductSubCategory = data;
  const subCategoryActionStatus = useSelector<AppState, SubCategory>(state => state.subCategory);

  const subCategoryQuickViewFormik = useFormik({
    initialValues: {
      code,
      value,
      subCategoryId,
      productCategoryId
    },
    validationSchema: Yup.object({
      code: Yup.string().required('Required'),
      value: Yup.string().required('Required'),
      productCategoryId: Yup.number().required('Required')
    }),
    onSubmit: (value: ProductSubCategory) => {
      dispatch(addUpdateSubCategory(value))
    }
  });
  return (
    <form onSubmit={subCategoryQuickViewFormik.handleSubmit} className="quick-edit-admin uk-grid-medium uk-child-width-1-1" uk-grid="true">
      <fieldset className="uk-fieldset">
        <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-4@s" uk-grid="true">
          <div>
            <label>
              <div className="uk-form-label">Product Category</div>
              <select className="uk-select" id="productCategoryId"
                {...subCategoryQuickViewFormik.getFieldProps('productCategoryId')}>
                <option key='1' value={1}>Lingerie</option>
                <option key='2' value={2}>Footwear</option>
                <option key='3' value={3}>Bindi</option>
                <option key='4' value={8}>Home Essential</option>
                <option key='5' value={9}>Cosmetics</option>
                <option key='6' value={10}>Fashion Accessories</option>
              </select>
              {
                subCategoryQuickViewFormik.touched.productCategoryId && subCategoryQuickViewFormik.errors.productCategoryId ? (
                  <span className="uk-text-danger">{subCategoryQuickViewFormik.errors.productCategoryId}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">SubCategory Name</div>
              <input className="uk-input " id="code" type="input"
                {...subCategoryQuickViewFormik.getFieldProps('code')} />
              {
                subCategoryQuickViewFormik.touched.code && subCategoryQuickViewFormik.errors.code ? (
                  <span className="uk-text-danger">{subCategoryQuickViewFormik.errors.code}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">SubCategory Description</div>
              <input className="uk-input " type="input"
                {...subCategoryQuickViewFormik.getFieldProps('value')} />
              {
                subCategoryQuickViewFormik.touched.value && subCategoryQuickViewFormik.errors.value ? (
                  <span className="uk-text-danger">{subCategoryQuickViewFormik.errors.value}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">SubCategory Update</div>
              <button type="submit" className="uk-button uk-button-primary ">
                {
                  subCategoryActionStatus._isLoading &&
                  <img className="login-button-padding" src="tail-spin.svg" />
                }
                <span>Save</span>
              </button>
            </label>
          </div>
        </div>
        <div className="extended-component-notification">
          {subCategoryQuickViewFormik.isSubmitting && <NotificationContainer {...subCategoryActionStatus} />}
        </div>
      </fieldset>
    </form>
  )
}

export {
  SubCategoryList,
  ExpandableComponent
}