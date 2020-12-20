import React from 'react';
import { AdminProductList } from 'components/admin/AdminProductList';
import { serverImagePath, SubProducts } from 'appConstants';
import { ProductItem } from 'types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { AppState, addUpdateProduct, Coupon, updateProductHighLight, Product, errorProduct, setDefaulState } from 'reducers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NotificationContainer } from 'components/shared';
import { countHighlightProducts } from 'services';

interface Props {
  addEditToggle: Function;
}

const ProductList: React.FunctionComponent<Props> = (props: Props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const deleteProduct = (productId: string, subcategoryId: number) => {
    const input = window.confirm('Sure want to delete?');
    const name = '', code = '', priceINR = '0', priceUSD = '0', value = '', subCategory = subcategoryId, deletedImagePath = [''], productDetailIdArray = [''], deletedProductDetailIds = ['']
    if (input) dispatch(addUpdateProduct({ productId, name, code, priceUSD, priceINR, value, deletedImagePath, subCategory, productDetailIdArray, deletedProductDetailIds }, 1, []));
  }
  const stateData = useSelector<AppState, ProductItem[]>(state => state.product.data || []);
  const productColumns = [
    // {
    //   name: 'ProductId',
    //   selector: 'productId',
    //   sortable: false,
    // },<span className="uk-label uk-label-warning uk-margin-xsmall-right">top selling</span>
    {
      name: 'Category',
      selector: 'productCategoryName',
      sortable: true,
      cell: (row: { trending: boolean, latest: boolean, productCategoryName: string }) => {
        return (
          row.trending ? <>
            <span style={{ color: "green" }} uk-icon="icon: bolt;" />
            <span style={{ marginLeft: "5px" }}>
              {row.productCategoryName}
            </span>
          </> :
            row.latest ? <>
              <span style={{ color: "orange" }} uk-icon="icon: star;" />
              <span style={{ marginLeft: "5px" }}>
                {row.productCategoryName}
              </span>
            </> :
              <span style={{ marginLeft: "25px" }}>
                {row.productCategoryName}
              </span>
        )
      }
    },
    {
      name: 'Product Name',
      selector: 'name',
      sortable: true,
    },
    // {
    //   name: 'Price INR',
    //   selector: 'priceInr',
    //   sortable: true,
    // },
    // {
    //   name: 'Price USD',
    //   selector: 'priceUsd',
    //   sortable: true,
    // },
    {
      name: 'Quantity',
      selector: 'quantity',
      sortable: true,
    },
    // {
    //   name: 'Colour',
    //   selector: 'colour',
    //   sortable: true,
    // },
    // {
    //   name: 'Size',
    //   selector: 'size',
    //   sortable: true,
    // },
    {
      name: 'Delete',
      sortable: false,
      cell: (row: { productId: number, name: string, code: string, priceUSD: string, priceINR: string, value: string, subCategory: number }) => {
        return <button type="submit" className="uk-button-small uk-button-danger" onClick={() => deleteProduct(row.productId.toString(), row.subCategory)}>
          <span>Delete</span>
        </button>
      }
    },
    {
      name: 'Edit',
      sortable: false,
      cell: (row: { productId: number, code: string, value: string }) => {
        return <button type="submit" className="uk-button-small uk-button-danger" onClick={() => { props.addEditToggle(true); history.push("/admin/product/" + row.productId) }}>
          <span>Edit</span>
        </button>
      }
    },
  ]

  return (
    <AdminProductList
      productColumns={productColumns}
      productType={SubProducts.PRODUCT}
      ExpandableComponent={ExpandableComponent}
      stateData={stateData}
      searchPlaceholder="Search Product Name"
      expandableRows={true} />
  )
}

const ExpandableComponent: React.FunctionComponent<any> = ({ data }) => {
  const dispatch = useDispatch();
  const { trending, latest, productId, listSingleImage }: ProductItem = data;
  const productActionStatus = useSelector<AppState, Product>(state => state.product);

  const productQuickViewFormik = useFormik({
    initialValues: {
      productId,
      highlight: trending ? '1' : latest ? '2' : ''
    } as ProductItem,
    onSubmit: (value: ProductItem) => {
      if (value.highlight === '1' && countHighlightProducts(productActionStatus.data || [], true) === 12) {
        dispatch(errorProduct('Max trending product count of 12 reached.'));
        setTimeout(() => {
          productQuickViewFormik.setSubmitting(false)
        }, 2000);
      } else if (value.highlight === '2' && countHighlightProducts(productActionStatus.data || [], false) === 12) {
        dispatch(errorProduct('Max latest product count of 12 reached.'));
        setTimeout(() => {
          productQuickViewFormik.setSubmitting(false)
        }, 2000);
      } else {
        dispatch(updateProductHighLight(value.highlight || '', value.productId))
      }
      // dispatch(updateCoupon(value));
    }
  });
  return (
    <form onSubmit={productQuickViewFormik.handleSubmit} className="quick-edit-admin uk-grid-medium uk-child-width-1-1" uk-grid="true">
      <fieldset className="uk-fieldset">
        <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-3@s" uk-grid="true">
          <div>
            <label>
              <div className="uk-form-label">Product Image</div>
              <div className="tm-product-card-media">
                <div className="tm-ratio tm-ratio-16-9">
                  <div className="tm-media-box">
                  <figure className="tm-media-box-wrap"><img src={serverImagePath + listSingleImage} alt={listSingleImage} /></figure>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">Product Highlight</div>
              <div>
              <select className="uk-select" id="highlight"
                {...productQuickViewFormik.getFieldProps('highlight')}>
                <option key='1' value="">None</option>
                <option key='2' value="1">Trending</option>
                <option key='3' value="2">Latest</option>
              </select>
              {
                productQuickViewFormik.touched.highlight && productQuickViewFormik.errors.highlight ? (
                  <span className="uk-text-danger">{productQuickViewFormik.errors.highlight}</span>
                ) : ''
              }
              </div>
              
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">Product Update</div>
              <button type="submit" className="uk-button uk-button-primary ">
                {
                  productActionStatus._isLoading &&
                  <img className="login-button-padding" src="tail-spin.svg" />
                }
                <span>Save</span>
              </button>
            </label>
          </div>
        </div>
        <div className="extended-component-notification">
          {productQuickViewFormik.isSubmitting && <NotificationContainer {...productActionStatus} />}
        </div>
      </fieldset>
    </form>
  )
}

export {
  ProductList
}