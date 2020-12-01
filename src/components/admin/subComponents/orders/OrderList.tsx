import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, Coupon, updateCoupon } from 'reducers';
import { CustomerOrders, singleOrder } from 'reducers/Order';
import { AdminProductList } from 'components/admin/AdminProductList';
import { SubProducts } from 'appConstants';
import { ProductCoupon, Order, OrderItems } from 'types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { NotificationContainer } from 'components/shared';
import { getIconForAdminOrder } from 'services';

interface Props{
  addEditToggle: Function;
}

const OrderList: React.FunctionComponent<Props> = (props: Props) => {
  const dispatch = useDispatch();
  // const deleteCoupon = (couponId: number, code: string, value: string) => {
  //   const input = window.confirm('Sure want to delete?');
  //   if (input) dispatch(updateCoupon({ couponId, value, code }, true));
  // }
  const stateData = useSelector<AppState, Order[]>(state => state.customerOrders.data || []);
  const productColumns = [
    {
      name: 'Order Number',
      sortable: true,
      wrap: true,
      cell: (row: { orderItems: OrderItems[], orderNumber: string}) => {
        const icon = getIconForAdminOrder(row.orderItems);
        return (
          icon !== '' ?
          <>
            {icon === 'lifesaver' ?  <span style={{ color: "green" }} uk-icon="icon: lifesaver;" /> 
            : icon === 'plus-circle' ? <span style={{ color: "green" }} uk-icon="icon: plus-circle;" /> 
            : icon === 'check' ? <span style={{ color: "green" }} uk-icon="icon: check;" />
            : icon === 'cart' ? <span style={{ color: "green" }} uk-icon="icon: cart;" /> 
            : icon === 'history' ? <span style={{ color: "orange" }} uk-icon="icon: history;" />
            : icon === 'minus-circle' ? <span style={{ color: "red" }} uk-icon="icon: minus-circle;" />
            : icon === 'warning' ? <span style={{ color: "red" }} uk-icon="icon: warning;" />
            : ''
          }
            <span style={{marginLeft:"5px", whiteSpace:"nowrap"}}>
              {row.orderNumber}
            </span>
          </> :
          <span  style={{marginLeft:"25px"}}>
          {row.orderNumber}
        </span>
        )
      }
    },
    {
      name: 'Order Date',
      selector: 'paymentDate',
      sortable: true,
    },
    {
      name: 'Total Price-Mode',
      sortable: false,
      cell: (row: { totalPrice: string, paymentMode: string}) => {
      return  <span>{row.paymentMode === 'PAYPAL'? '$' : '₹'} {row.totalPrice} ({row.paymentMode})</span>
      }
    },
    {
      name: 'View Details',
      sortable: false,
      cell: (row: Order) => {
        return <button type="submit" className="uk-button-small uk-button-primary" onClick={() => {dispatch(singleOrder(row)) ;props.addEditToggle(true)}}>
          <span>View</span>
        </button>
      }
    },
  ]

  return (
    <AdminProductList
      productColumns={productColumns}
      productType={SubProducts.ORDERS}
      stateData={stateData}
      searchPlaceholder="Search Order Number"
      expandableRows={false}
      sortByColumn="paymentDate" 
      defaultSortAsc={false}/>
  )
}
export {
  OrderList
}