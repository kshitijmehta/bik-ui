import React, { useEffect, useState, Fragment } from 'react';
import { Order, OrderUpdateAdmin } from 'types';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, getShippers, Shipper, Shipment, updateOrderAdmin } from 'reducers';
import { scaledServerImagePath } from 'appConstants';
import { useHistory } from 'react-router-dom';
import { NotificationContainer } from 'components/shared';
import { calculateUserDiscount, getPaypalTransactionId } from 'services';


const OrderDetails: React.FunctionComponent = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  // const [productItemCount, setProductItemCount] = useState(0);
  const [adminShipmentData, setAdminShipmentData] = useState<OrderUpdateAdmin[]>([]);
  const [orginalTrackingLink, setOrginalTrackingLink] = useState<string[]>([]);
  const stateData = useSelector<AppState, Order>(state => state.customerOrders.singleData || {} as Order);
  const shippers = useSelector<AppState, Shipper>(state => state.shipper || {} as Shipper);
  const shipmentStatus = useSelector<AppState, Shipment>(state => state.shipment);
  useEffect(() => {
    if (stateData && stateData.orderItems) {
      let tempShipmentData: OrderUpdateAdmin[] = [];
      let tempTrackingLink: string[] = [];
      stateData.orderItems.forEach(orderItems => {
        tempShipmentData.push(
          {
            orderDetailId: orderItems.orderDetailId,
            deliveryDate: orderItems.shipmentDetails?.deliveryDate,
            paymentReturned: orderItems.shipmentDetails?.paymentReturned,
            returnStatus: orderItems.shipmentDetails?.returnStatus,
            shipmentId: orderItems.shipmentDetails?.shipmentId || '0',
            shipper: orderItems.shipmentDetails?.shipper,
            shippingDate: orderItems.shipmentDetails?.shippingDate,
            trackingNumber: orderItems.shipmentDetails?.trackingNumber
          } as OrderUpdateAdmin);
        tempTrackingLink.push(orderItems.shipmentDetails?.trackingNumber || '')
      });
      setAdminShipmentData(tempShipmentData);
      setOrginalTrackingLink(tempTrackingLink);
    }
  }, [stateData]);

  useEffect(() => {
    dispatch(getShippers());
  }, [])

  const updateShipmentData = (index: number, key: string, value: string) => {
    let shipmentDataCopy = [...adminShipmentData];
    const shipmentDataToUpdate = shipmentDataCopy.splice(index, 1);
    const updatedShipmentData = { ...shipmentDataToUpdate[0], [key]: value };
    shipmentDataCopy.splice(index, 0, updatedShipmentData)
    setAdminShipmentData(shipmentDataCopy);
  };

  const updateOrderStatus = (index: number) => {
    const isTrackingChanged = adminShipmentData[index].trackingNumber !== orginalTrackingLink[index];
    if(isTrackingChanged){
      let orginalTrackingLinkCopy = [...orginalTrackingLink];
      orginalTrackingLinkCopy[index] = adminShipmentData[index].trackingNumber || '';
      setOrginalTrackingLink(orginalTrackingLinkCopy);
    }
    dispatch(updateOrderAdmin(
      {...adminShipmentData[index], 
        orderNumber: stateData.orderNumber,
        customerEmail: stateData.userDetails?.emailAddress,
        customerName: stateData.userDetails?.firstName
      }, isTrackingChanged))
  }

  const userOrderDiscountPrice = (totalPrice: string, quantity: string, userDiscount?: string, couponDiscount?: string)=> {
    let mainTotal = Number(totalPrice) * Number(quantity);
    if(userDiscount){
      mainTotal = Number(calculateUserDiscount(userDiscount,mainTotal.toString()))
    } 
    if(couponDiscount){
      mainTotal = Number(calculateUserDiscount(couponDiscount,mainTotal.toString()))
    }
    return mainTotal
  }
  return (
    <form className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
        <header className="uk-card-header"><h1 className="uk-h2">Order Summay</h1></header>
        <div className="uk-card-body">
          <div className="uk-form-stacked">
            <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
              <fieldset className="uk-fieldset">
                <legend className="uk-h4">#Order Details</legend>
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-4@s" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">Order Number</div>
                      <span className="uk-text-small">{stateData.orderNumber}</span>
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Order Date</div>
                      <span className="uk-text-small">{stateData.paymentDate}</span>
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Order Cost</div>
                      <span className="uk-text-small">{stateData.paymentMode && stateData.paymentMode.toLowerCase() === 'paypal' ? '$' : '₹'}{stateData.totalPrice}</span>
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Payment Mode</div>
                      <span className="uk-text-small">{stateData.paymentMode}</span>
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Applied User Discount</div>
                      <span className="uk-text-small">{stateData.userDiscount || 0}%</span>
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Applied Coupon Discount</div>
                      <span className="uk-text-small">{stateData.couponDiscount || 0}%</span>
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Payment Transaction Id</div>
                      <span className="uk-text-small">{stateData.paymentMode && stateData.paymentMode.toLowerCase() === 'paypal' ? getPaypalTransactionId(stateData.paypalResponse) : stateData.razorpayPaymentId}</span>
                    </label>
                  </div>
                  {
                    stateData.paymentMode && stateData.paymentMode.toLowerCase() === 'paypal' &&
                    <div>
                      <label>
                        <div className="uk-form-label">Shippment Type</div>
                        <span className="uk-text-small">{stateData.standardShipping === false ? 'Express' : 'Standard'}</span>
                      </label>
                    </div>
                  }

                </div>
                <div className="uk-divider-icon"></div>
              </fieldset>
              {
                stateData.userDetails &&
                <fieldset className="uk-fieldset">
                  <legend className="uk-h4">#User Details</legend>
                  <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-4@s" uk-grid="true">
                    <div>
                      <label>
                        <div className="uk-form-label">Name</div>
                        <span className="uk-text-small">
                          {stateData.userDetails.firstName + ' ' + stateData.userDetails.lastName}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">Mobile</div>
                        <span className="uk-text-small">{stateData.userDetails.mobile}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">Email</div>
                        <span className="uk-text-small">{stateData.userDetails.emailAddress}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">Current Discount</div>
                        <span className="uk-text-small">{stateData.userDetails.discount || 0}%</span>
                      </label>
                    </div>
                    {/* <div>
                      <label>
                        <div className="uk-form-label">Gender</div>
                        <span className="uk-text-small">{stateData.userDetails.gender}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">Date of birth</div>
                        <span className="uk-text-small">{stateData.userDetails.dob}</span>
                      </label>
                    </div> */}
                  </div>
                  <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-4@s" uk-grid="true">
                    <div>
                      <label>
                        <div className="uk-form-label">Country</div>
                        <span className="uk-text-small">{stateData.userDetails.country}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">State</div>
                        <span className="uk-text-small">{stateData.userDetails.state}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">City</div>
                        <span className="uk-text-small">{stateData.userDetails.city}</span>
                      </label>
                    </div>
                    <div>
                      <label>
                        <div className="uk-form-label">Pincode</div>
                        <span className="uk-text-small">{stateData.userDetails.pincode}</span>
                      </label>
                    </div>
                  </div>
                  <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-1@s" uk-grid="true">
                    <div>
                      <label>
                        <div className="uk-form-label">Address</div>
                        <span className="uk-text-small">
                          {
                            stateData.userDetails.addressLineOne
                            + ' ' +
                            stateData.userDetails.addressLineTwo
                            + ' ' +
                            stateData.userDetails.addressLineThree
                          }
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="uk-divider-icon"></div>
                </fieldset>
              }
              {
                stateData.orderItems && stateData.orderItems.length > 0 &&
                <fieldset className="uk-fieldset">
                  <legend className="uk-h4">#Order Items</legend>
                  {
                    stateData.orderItems.map((product, index) => {
                      return (
                        <Fragment key={index}>
                          <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-4@s" uk-grid="true">
                            <div className="uk-divider-vertical">
                              <label>
                                <div className="uk-form-label">Product Image</div>
                                <div className="tm-ratio tm-ratio-16-9">
                                  <a className="tm-media-box" onClick={() => history.push('/productDetails/' + product.productId)}>
                                    <figure className="tm-media-box-wrap"><img src={scaledServerImagePath + product.productImage} alt={product.productImage} /></figure>
                                  </a>
                                </div>
                                {/* <img src={scaledServerImagePath + product.productImage} alt={product.productImage} /> */}
                              </label>
                            </div>

                            <div className="uk-divider-vertical">
                              <label>
                                <div className="uk-form-label">Name-(Size)</div>
                                <span className="uk-text-small">{product.productName} - ({product.size})</span>
                              </label>
                            </div>
                            <div className="uk-divider-vertical">
                              <label>
                                <div className="uk-form-label">Quantity</div>
                                <span className="uk-text-small">{product.quantity}</span>
                              </label>
                            </div>
                            <div>
                              <label>
                                <div className="uk-form-label">Price</div>
                                <span className="uk-text-small">
                                  {product.quantity} X {product.productPrice} =  {product.currency.toString() !== '1' ? '$' : '₹'}
                                  {Number(product.productPrice) * Number(product.quantity)}
                                  {/* {userOrderDiscountPrice(product.productPrice,product.quantity,stateData.userDiscount, stateData.couponDiscount)} */}
                                </span>
                              </label>
                            </div>
                          </div>
                          <div uk-grid="true" className="uk-grid-small uk-child-width-1-1 uk-child-width-1-4@s" >
                            <div className="uk-divider-vertical">
                              <label>
                                <div className="uk-form-label">Shipper</div>
                                <select className="uk-select shipper-max-width" name="shipper" id="shipper"
                                  value={adminShipmentData[index] && adminShipmentData[index].shipper || '0'}
                                  onChange={(e) => updateShipmentData(index, 'shipper', e.currentTarget.value)}
                                >
                                  <option key='0' value={0}>Select</option>
                                  {
                                    shippers.data?.map((shipper, index) => {
                                      return <option key={index} value={shipper.shipperId}>{shipper.shipperName}</option>
                                    })
                                  }
                                </select>
                              </label>
                            </div>
                            <div className="uk-divider-vertical">
                              <label>
                                <div className="uk-form-label">Tracking Number</div>
                                <input className="uk-input shipper-max-width" id="trackingNumber" type="text"
                                  value={adminShipmentData[index] && adminShipmentData[index].trackingNumber || ''}
                                  onChange={(e) => updateShipmentData(index, 'trackingNumber', e.currentTarget.value)}
                                />
                              </label>
                            </div>
                            <div className="uk-divider-vertical">
                              <label>
                                <div className="uk-form-label">Shipping Date</div>
                                <input className="uk-input shipper-max-width" id="shippingDate" type="date"
                                  value={adminShipmentData[index] && adminShipmentData[index].shippingDate || ''}
                                  onChange={(e) => updateShipmentData(index, 'shippingDate', e.currentTarget.value)} />
                              </label>
                            </div>
                            <div>
                              <label>
                                <div className="uk-form-label">Delivery Date</div>
                                <input className="uk-input shipper-max-width" id="deliveryDate" type="date"
                                  value={adminShipmentData[index] && adminShipmentData[index].deliveryDate || ''}
                                  onChange={(e) => updateShipmentData(index, 'deliveryDate', e.currentTarget.value)}
                                />
                              </label>
                            </div>
                          </div>
                          <div uk-grid="true" className="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s" >
                            <div className="uk-divider-vertical">
                              <label>
                                <div className="uk-form-label">Return Status</div>
                                <select className="uk-select shipper-max-width" name="returnStatus" id="returnStatus"
                                  value={adminShipmentData[index] && adminShipmentData[index].returnStatus || ''}
                                  onChange={(e) => updateShipmentData(index, 'returnStatus', e.currentTarget.value)}
                                >
                                  <option key='0' value={0}>Select</option>
                                  <option key='1' value='In Progress'>In Progress</option>
                                  <option key='2' value='Accepted'>Accepted</option>
                                  <option key='3' value='Declined'>Declined</option>
                                </select>
                              </label>
                            </div>
                            <div>
                              <label>
                                <div className="uk-form-label">Payment Returned</div>
                                <select className="uk-select shipper-max-width" name="paymentReturned" id="paymentReturned"
                                  value={adminShipmentData[index] && adminShipmentData[index].paymentReturned || ''}
                                  onChange={(e) => updateShipmentData(index, 'paymentReturned', e.currentTarget.value)}
                                >
                                  <option key='0' value={0}>Select</option>
                                  <option key='1' value='No'>No</option>
                                  <option key='2' value='Yes'>Yes</option>
                                </select>
                              </label>
                            </div>
                            {/* <div>
                            </div> */}

                          </div>
                          <div uk-grid="true" className="uk-grid-small uk-child-width-1-1 uk-child-width-1-1@s" >
                            <div className="uk-nav-center">
                              {
                                shipmentStatus.data?.orderDetailId?.toString() === product.orderDetailId.toString() &&
                                <NotificationContainer {...shipmentStatus} />
                              }
                              <label>
                                {/* <div className="uk-form-label">Save Details</div> */}
                                <button className="uk-button uk-button-primary "
                                  disabled={shipmentStatus.data?.orderDetailId?.toString() === product.orderDetailId.toString() && shipmentStatus._isLoading}
                                  onClick={(e) => { updateOrderStatus(index); e.preventDefault() }}>
                                  {
                                    shipmentStatus.data?.orderDetailId?.toString() === product.orderDetailId.toString() &&
                                    shipmentStatus._isLoading &&
                                    <img className="login-button-padding" src="tail-spin.svg" />
                                  }
                                    Submit
                                </button>
                              </label>
                            </div>
                          </div>
                          <div className="uk-divider-order-items"></div>
                        </Fragment>
                      )
                    })
                  }
                </fieldset>
              }
            </div>
          </div>
        </div>
        <div className="uk-card-footer uk-text-center">
          {/* <NotificationContainer {...sizeActionStatus} />
          <button disabled={sizeActionStatus._isLoading} type="submit" className="uk-button uk-button-primary ">
            {
              sizeActionStatus._isLoading &&
              <img className="login-button-padding" src="tail-spin.svg" />
            }
            <span>Save</span>
          </button> */}
        </div>
      </div>
    </form>
  )
}

export {
  OrderDetails
}