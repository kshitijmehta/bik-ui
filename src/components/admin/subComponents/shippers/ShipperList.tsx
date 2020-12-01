import React from 'react';
import { AdminProductList } from 'components/admin/AdminProductList';
import { SubProducts } from 'appConstants';
import { ProductCoupon, OrderShipper } from 'types';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, updateCoupon, Coupon, Shipper, updateShipper } from 'reducers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NotificationContainer } from 'components/shared';

const ShipperList: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const deleteShipper = (shipperId: string, shipperName:string, trackingLink:string) => {
    const input = window.confirm('Sure want to delete?');
    if(input)dispatch(updateShipper({shipperId,shipperName,trackingLink},true));
  } 
  const stateData = useSelector<AppState, OrderShipper[]>(state => state.shipper.data || []);  
  const productColumns = [
    {
      name: 'Shipper Name',
      selector: 'shipperName',
      sortable: true,
    },
    {
      name: 'Tracking Link',
      selector: 'trackingLink',
      sortable: true,
    },
    {
      name: 'Delete',
      sortable: false,
      cell: (row: { shipperName: string, trackingLink: string, shipperId: string }) => {
        return  <button type="submit" className="uk-button-small uk-button-danger" onClick={() => deleteShipper(row.shipperId, row.shipperName, row.trackingLink)}>
                   <span>Delete</span>
                </button>
      }
    },
  ]

  return(
    <AdminProductList 
      productColumns={productColumns} 
      productType={SubProducts.SHIPPER} 
      ExpandableComponent= {ExpandableComponent}
      stateData={stateData}
      searchPlaceholder="Search Shipper Name"
      expandableRows = {true}
      sortByColumn="shipperName"/>
  )
}

const ExpandableComponent: React.FunctionComponent<any> = ({ data }) => {
  const dispatch = useDispatch();
  const {shipperId,shipperName,trackingLink }: OrderShipper = data;
  const shipperActionStatus = useSelector<AppState, Shipper>(state => state.shipper);

  const shipperQuickViewFormik = useFormik({
    initialValues: {
      shipperId,
      shipperName,
      trackingLink
    },
    validationSchema: Yup.object({
      shipperName: Yup.string().required('Required'),
      trackingLink: Yup.string().required('Required')
    }),
    onSubmit: (value: OrderShipper) => {
      dispatch(updateShipper(value));
    }
  });
  return (
    <form onSubmit={shipperQuickViewFormik.handleSubmit} className="quick-edit-admin uk-grid-medium uk-child-width-1-1" uk-grid="true">
      <fieldset className="uk-fieldset">
        <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-3@s" uk-grid="true">
          <div>
            <label>
              <div className="uk-form-label">Shipper Name</div>
              <input className="uk-input " id="shipperName" type="input"
                {...shipperQuickViewFormik.getFieldProps('shipperName')} />
              {
                shipperQuickViewFormik.touched.shipperName && shipperQuickViewFormik.errors.shipperName ? (
                  <span className="uk-text-danger">{shipperQuickViewFormik.errors.shipperName}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">Tracking Link</div>
              <input className="uk-input " type="input"
                {...shipperQuickViewFormik.getFieldProps('trackingLink')} />
              {
                shipperQuickViewFormik.touched.trackingLink && shipperQuickViewFormik.errors.trackingLink ? (
                  <span className="uk-text-danger">{shipperQuickViewFormik.errors.trackingLink}</span>
                ) : ''
              }
            </label>
          </div>
          <div>
            <label>
              <div className="uk-form-label">Shipper Update</div>
              <button type="submit" className="uk-button uk-button-primary ">
                {
                  shipperActionStatus._isLoading &&
                  <img className="login-button-padding" src="tail-spin.svg" />
                }
                <span>Update</span>
              </button>
            </label>
          </div>
        </div>
        <div className="extended-component-notification">
        {shipperQuickViewFormik.isSubmitting && <NotificationContainer {...shipperActionStatus}/>}
        </div>
      </fieldset>
    </form>
  )
}

export {
  ShipperList,
  ExpandableComponent
}