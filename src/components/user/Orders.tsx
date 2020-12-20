import React, { useEffect, useState, useRef } from 'react';
import { CustomerOrders, getCustomerOrders, customerProductReturn, defaulOrderReturn } from 'reducers/Order';
import { useSelector, useDispatch } from 'react-redux';
import jsPDF from 'jspdf';

import { AppState, UserLocation, getShippers, UserInformation } from 'reducers';
import InfiniteScroll from 'react-infinite-scroll-component';
import { pageSize, serverImagePath, AllowReturn } from 'appConstants';
import { Invoice, Order, OrderItems, OrderShipper } from 'types';
import { useHistory } from 'react-router-dom';
import { calculateUserDiscount, getCurrencyIcon, returnInvoiceHtml } from 'services';

const Orders: React.FunctionComponent = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [hasMoreOrders, setHasMoreOrders] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [showOrderDetailIndex, setShowOrderDetailIndex] = useState<number[]>([]);
  const [returnOrderDetailId, setReturnOrderDetailId] = useState('');
  const [returnOrderNumber, setReturnOrderNumber] = useState('');
  const [returnProductName, setReturnProductName] = useState('');
  const [showReturnError, setShowReturnError] = useState(false);
  const returnModalRef = useRef<HTMLDivElement>(null);
  const returnButtonRef = useRef<HTMLButtonElement>(null);
  const orders = useSelector<AppState, CustomerOrders>(state => state.customerOrders || []);
  const userLocation = useSelector<AppState, UserLocation>(state => state.userLocation);
  const shipperData = useSelector<AppState, OrderShipper[]>(state => state.shipper.data || []);
  const userData = useSelector<AppState, UserInformation>(state => state.user);

  useEffect(() => {
    dispatch(getCustomerOrders(orders.data?.length || 0, pageSize));
    dispatch(getShippers());
  }, [])
  const fetchNextOrders = () => {
    dispatch(getCustomerOrders(orders.data?.length || 0, pageSize));
  };

  useEffect(() => {
    if (orders._isOrderUpdate && returnModalRef.current?.getBoundingClientRect().top !== 0) {
      const that = returnButtonRef.current;
      setTimeout(() => {
        that?.click();
      }, 1000);
    }
  }, [orders._isOrderUpdate])

  useEffect(() => {
    setHasMoreOrders(orders._hasMoreOrders || false);
  }, [orders._hasMoreOrders]);


  const toggleShowOrderDetails = (orderId: number) => {
    if (showOrderDetailIndex.indexOf(orderId) > -1) {
      setShowOrderDetailIndex(showOrderDetailIndex.filter((id) => id !== orderId))
    } else {
      setShowOrderDetailIndex([...showOrderDetailIndex, orderId]);
    }
  }

  const getShipmentLink = (shipper?: string, trackingNumber?: string) => {
    if (shipper && trackingNumber) {
      const shipperInfo = shipperData.filter(({ shipperId }) => shipperId === shipper);
      if (shipperInfo[0]) {
        return <a target="_blank" href={shipperInfo[0].trackingLink + trackingNumber}>Track Package</a>
      }
    }
    return 'Order Recived'
  }

  const checkReturnEligibilty = (deliveryDate: string, categoryId: string) => {
    if (AllowReturn.indexOf(categoryId.toString()) > -1) {
      const dateDifference = (new Date()).getTime() - (new Date(deliveryDate)).getTime();
      const differenceInDays = dateDifference / (1000 * 3600 * 24);
      return Math.ceil(differenceInDays) <= 30;
    }
    return false;
  };

  const returnOrder = (orderDetailId?: string, reason?: string,
    orderNumber?: string, productName?: string) => {
    if (selectedReason || reason) {
      setShowReturnError(false);
      dispatch(customerProductReturn(Number(orderDetailId) || Number(returnOrderDetailId),
        reason || selectedReason, orderNumber || returnOrderNumber, productName || returnProductName, userData.data?.firstName));
    } else {
      setShowReturnError(true);
    }
  }

  const downloadInvoice = async (invoiceNumber: string, productName: string, quantity: string, totalAmount: string, userDiscount?: string, couponDiscount?: string) => {
    var doc = new jsPDF('l', 'px', 'a4', true)
    const invoiceData: Invoice = {
      clientName: userData.data?.firstName + ' ' + userData.data?.lastName,
      invoiceDate: (new Date).toLocaleDateString("en-US"),
      clientAddress: userData.data?.addressLineOne + ' ' + userData.data?.addressLineTwo + ' ' +
        userData.data?.addressLineThree + ' ' + userData.data?.city + ' ' + userData.data?.state +
        ' ' + userData.data?.pincode + ' ' + userData.data?.country,
      invoiceNumber,
      productName,
      quantity,
      totalAmount: (userOrderDiscountPrice(totalAmount,quantity, userDiscount, couponDiscount)).toString(),
      rate: Math.ceil(((userOrderDiscountPrice(totalAmount,quantity, userDiscount, couponDiscount))) / Number(quantity)).toString()
    }
    await doc.html(returnInvoiceHtml(invoiceData), { x: 10, y: 10 })
    doc.save( invoiceNumber+".pdf")
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
    <div className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card  uk-card-small tm-ignore-container">
        {
          orders.data && orders.data.length === 0 ?
            <div className="uk-card uk-card-default uk-grid-collapse uk-child-width-1-1@s uk-margin" uk-grid="true">
              <div>
                <div className="uk-card-body uk-nav-center">
                  <p>You haven't ordered anything. Start some shopping now !!</p>
                </div>
              </div>
            </div>
            :
            <InfiniteScroll
              dataLength={orders.data && orders.data.length || 0}
              next={fetchNextOrders}
              hasMore={hasMoreOrders}
              loader={
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  <h4>Loading...</h4>
                </div>
              }
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>That's all for now !</b>
                </p>
              }
            >
              {
                orders && orders.data &&
                orders.data.map((order: Order, index: number) => {
                  return (
                    <div key={index} className="uk-card uk-card-hover uk-card-default uk-width-1-1@m">
                      <div className="uk-card-header">
                        <div className="uk-grid-small uk-flex-middle" uk-grid="true">
                          <div className="uk-width-expand">
                            <div className="uk-float-left">
                              <h3 className="uk-card-title uk-margin-remove-bottom">#{order.orderNumber}</h3>
                              <p className="uk-text-meta uk-margin-remove-top"><time>Ordered on {order.paymentDate.split(' ')[0]}</time></p>
                            </div>
                            <p className="uk-text-normal uk-margin-remove-top uk-float-right"><time>Order Cost: {getCurrencyIcon(userLocation.data || 'IN')} {order.totalPrice}</time></p>
                          </div>
                        </div>
                      </div>

                      {
                        showOrderDetailIndex.indexOf(Number(order.orderId)) === -1 &&
                        <div className="uk-card uk-grid-collapse uk-child-width-1-3@s uk-margin uk-margin-remove-top" uk-grid="true">
                          <div className="uk-card-media-left">
                            <div className="tm-ratio tm-ratio-16-9">
                              <a className="tm-media-box" onClick={() => history.push('/productDetails/' + order.orderItems[0].productId)}>
                                <figure className="tm-media-box-wrap"><img src={serverImagePath + order.orderItems[0].productImage} alt={order.orderItems[0].productImage} /> </figure>
                              </a>
                            </div>
                          </div>
                          <div>
                            <div className="uk-card-body">
                              {/* <h3 className="uk-card-title">Media Left</h3> */}
                              <ul className="uk-list">
                                <li>Product : <a onClick={() => history.push('/productDetails/' + order.orderItems[0].productId)}>{order.orderItems[0].productName}</a></li>
                                <li>Quantity: {order.orderItems[0].quantity}</li>
                                <li>Price: {getCurrencyIcon(userLocation.data || 'IN')} 
                                {' ' + userOrderDiscountPrice(order.orderItems[0].productPrice, order.orderItems[0].quantity, order.userDiscount, order.couponDiscount)}</li>
                              </ul>
                            </div>
                          </div>
                          <div>
                            <div className="uk-card-body">
                              {
                                (order.orderItems[0].shipmentDetails?.returnStatus ||
                                  order.orderItems[0].shipmentDetails?.paymentReturned) ?
                                  <ul className="uk-list">
                                    {
                                      order.orderItems[0].shipmentDetails?.paymentReturned === 'Yes' ?
                                        <li>Return Status: <span className="uk-label uk-label-success">Retured</span></li>
                                        : order.orderItems[0].shipmentDetails?.paymentReturned === 'No' ?
                                          <li>Return Status: <span className="uk-label uk-label-danger">Declined</span></li>
                                          : <li>Return Status: <span className="uk-label uk-label-warning">{order.orderItems[0].shipmentDetails?.returnStatus}</span></li>
                                    }
                                  </ul>
                                  :
                                  order.orderItems[0].shipmentDetails?.deliveryDate ?
                                    <ul className="uk-list">
                                      <li>Status : <span className="uk-label uk-label-success">Delivered</span></li>
                                      <li>Delivery Date: <span>{order.orderItems[0].shipmentDetails?.deliveryDate}</span></li>
                                      {
                                        checkReturnEligibilty(order.orderItems[0].shipmentDetails?.deliveryDate, order.orderItems[0].categoryId) &&
                                        <li><button className="uk-button uk-button-primary uk-button-small" uk-toggle="target: #return-modal"
                                          onClick={() => {
                                            setSelectedReason('');
                                            dispatch(defaulOrderReturn());
                                            setReturnOrderDetailId(order.orderItems[0].orderDetailId);
                                            setReturnProductName(order.orderItems[0].productName);
                                            setReturnOrderNumber(order.orderNumber);
                                          }}>Return</button></li>
                                      }
                                      <li>Invoice : <a onClick={() => downloadInvoice(order.orderNumber,order.orderItems[0].productName,order.orderItems[0].quantity,order.orderItems[0].productPrice, order.userDiscount, order.couponDiscount)}>Download</a></li>
                                    </ul>
                                    :
                                    <ul className="uk-list">
                                      <li>Status : {getShipmentLink(order.orderItems[0].shipmentDetails?.shipper, order.orderItems[0].shipmentDetails?.trackingNumber)}</li>
                                      <li>Shipment Date: <span>{order.orderItems[0].shipmentDetails?.shippingDate ? order.orderItems[0].shipmentDetails?.shippingDate : 'Awaited'}</span></li>
                                      <li>
                                        <button className="uk-button uk-button-primary uk-button-small"
                                          disabled={orders._isLoading}
                                          {...(order.orderItems[0].shipmentDetails?.shippingDate && 'uk-toggle="target: #return-modal"')}
                                          onClick={() => {
                                            if (order.orderItems[0].shipmentDetails?.shippingDate) {
                                              setSelectedReason('');
                                              dispatch(defaulOrderReturn())
                                              setReturnOrderDetailId(order.orderItems[0].orderDetailId);
                                              setReturnProductName(order.orderItems[0].productName);
                                              setReturnOrderNumber(order.orderNumber);
                                            } else {
                                              setSelectedReason('Order Canceled before shipping');
                                              setReturnOrderDetailId(order.orderItems[0].orderDetailId);
                                              setReturnProductName(order.orderItems[0].productName);
                                              setReturnOrderNumber(order.orderNumber);
                                              returnOrder(order.orderItems[0].orderDetailId,
                                                'Order Canceled before shipping', order.orderNumber, order.orderItems[0].productName);
                                            }

                                          }}>
                                          {
                                            orders._isLoading && <img className="login-button-padding" src="/tail-spin.svg" />
                                          }
                                          {order.orderItems[0].shipmentDetails?.shippingDate ? 'Return' : 'Cancel'}
                                        </button></li>
                                    </ul>
                              }
                            </div>
                          </div>

                        </div>
                      }
                      {
                        order.orderItems.length > 1 &&
                        <ul uk-accordion="true">
                          <li>
                            <a
                              className="uk-accordion-title uk-nav-center uk-padding-bottom"
                              onClick={() => toggleShowOrderDetails(Number(order.orderId))}>
                              {showOrderDetailIndex.indexOf(Number(order.orderId)) === -1 ? "View More" : "View Less"}</a>
                            <div className="uk-accordion-content">
                              {
                                order.orderItems.map((orderItem: OrderItems, index: number) => {
                                  return (
                                    <div key={index} className="uk-card uk-grid-collapse uk-child-width-1-3@s uk-margin uk-margin-remove-top" uk-grid="true">
                                      <div className="uk-card-media-left">
                                        <div className="tm-ratio tm-ratio-16-9">
                                          <a className="tm-media-box" onClick={() => history.push('/productDetails/' + orderItem.productId)}>
                                            <figure className="tm-media-box-wrap"><img src={serverImagePath + orderItem.productImage} alt={orderItem.productImage} /> </figure>
                                          </a>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="uk-card-body">
                                          <ul className="uk-list">
                                            <li>Product : <a onClick={() => history.push('/productDetails/' + orderItem.productId)}>{orderItem.productName}</a></li>
                                            <li>Quantity: {orderItem.quantity}</li>
                                            <li>Price: {getCurrencyIcon(userLocation.data || 'IN')} 
                                            {' ' +userOrderDiscountPrice(orderItem.productPrice, orderItem.quantity, order.userDiscount, order.couponDiscount)}</li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="uk-card-body">
                                          {
                                            (orderItem.shipmentDetails?.returnStatus ||
                                              orderItem.shipmentDetails?.paymentReturned) ?
                                              <ul className="uk-list">
                                                {
                                                  orderItem.shipmentDetails?.paymentReturned === 'Yes' ?
                                                    <li>Return Status: <span className="uk-label uk-label-success">Retured</span></li>
                                                    : orderItem.shipmentDetails?.paymentReturned === 'No' ?
                                                      <li>Return Status: <span className="uk-label uk-label-danger">Declined</span></li>
                                                      : <li>Return Status: <span className="uk-label uk-label-warning">{orderItem.shipmentDetails?.returnStatus}</span></li>
                                                }
                                              </ul>
                                              :
                                              orderItem.shipmentDetails?.deliveryDate ?
                                                <ul className="uk-list">
                                                  <li>Status : <span className="uk-label uk-label-success">Delivered</span></li>
                                                  <li>Delivery Date: <span>{orderItem.shipmentDetails?.deliveryDate}</span></li>
                                                  {
                                                    checkReturnEligibilty(orderItem.shipmentDetails?.deliveryDate, order.orderItems[0].categoryId) &&
                                                    <li><button className="uk-button uk-button-primary uk-button-small" uk-toggle="target: #return-modal"
                                                      onClick={() => {
                                                        setSelectedReason('');
                                                        dispatch(defaulOrderReturn());
                                                        setReturnOrderDetailId(orderItem.orderDetailId);
                                                        setReturnProductName(orderItem.productName);
                                                        setReturnOrderNumber(order.orderNumber);
                                                      }}>Return</button></li>
                                                  }
                                                  <li>Invoice : <a onClick={() => downloadInvoice(order.orderNumber,orderItem.productName,orderItem.quantity,orderItem.productPrice, order.userDiscount, order.couponDiscount)}>Download</a></li>
                                                </ul>
                                                :
                                                <ul className="uk-list">
                                                  <li>Status : {getShipmentLink(orderItem.shipmentDetails?.shipper, orderItem.shipmentDetails?.trackingNumber)}</li>
                                                  <li>Shipment Date: <span>{orderItem.shipmentDetails?.shippingDate ? orderItem.shipmentDetails?.shippingDate : 'Awaited'}</span></li>
                                                  <li>
                                                    <button className="uk-button uk-button-primary uk-button-small"
                                                      disabled={orders._isLoading}
                                                      {...(orderItem.shipmentDetails?.shippingDate && 'uk-toggle="target: #return-modal"')}
                                                      onClick={() => {
                                                        if (orderItem.shipmentDetails?.shippingDate) {
                                                          setSelectedReason('');
                                                          setReturnOrderDetailId(orderItem.orderDetailId);
                                                          setReturnProductName(orderItem.productName);
                                                          setReturnOrderNumber(order.orderNumber);
                                                          dispatch(defaulOrderReturn())
                                                        } else {
                                                          setSelectedReason('Order Canceled before shipping');
                                                          setReturnOrderDetailId(orderItem.orderDetailId);
                                                          setReturnProductName(orderItem.productName);
                                                          setReturnOrderNumber(order.orderNumber);
                                                          returnOrder(orderItem.orderDetailId, 'Order Canceled before shipping',
                                                            order.orderNumber, orderItem.productName);
                                                        }
                                                      }
                                                      }>
                                                      {
                                                        orders._isLoading && <img className="login-button-padding" src="/tail-spin.svg" />
                                                      }
                                                      {orderItem.shipmentDetails?.shippingDate ? 'Return' : 'Cancel'}</button></li>
                                                </ul>
                                          }
                                        </div>
                                      </div>

                                    </div>
                                  )
                                })
                              }
                            </div>
                          </li>
                        </ul>
                      }

                    </div>
                  )
                })

              }
            </InfiniteScroll>
        }

      </div>
      <button ref={returnButtonRef} uk-toggle="target: #return-modal" style={{ visibility: "hidden" }}></button>
      <div id="return-modal" uk-modal="true">
        <div className="uk-modal-dialog uk-modal-body">
          <button className="uk-modal-close-default" type="button" uk-close="true"></button>
          <h2 className="uk-modal-title">Thank you for ordering!</h2>
          <p>Please choose the correct reason for return. This information will help us to improve our site</p>
          <div ref={returnModalRef} className="uk-form-stacked">
            <div className="uk-margin">
              <div className="uk-form-controls">
                <label className="uk-display-block" onClick={() => setSelectedReason('Defective product')}><input className="uk-radio" type="radio" name="returnReason" value="Defective product" checked={selectedReason === 'Defective product'} /><span className="coupon-message">Defective product</span></label>
                <label className="uk-display-block" onClick={() => setSelectedReason('Image shown did not match the actual product')}><input className="uk-radio" type="radio" name="returnReason" value="Image shown did not match the actual product" checked={selectedReason === 'Image shown did not match the actual product'} /><span className="coupon-message">Image shown did not match the actual product</span></label>
                <label className="uk-display-block" onClick={() => setSelectedReason('Quality Issues')}><input className="uk-radio" type="radio" name="returnReason" value="Quality Issues" checked={selectedReason === 'Quality Issues'} /><span className="coupon-message">Quality Issues</span></label>
                <label className="uk-display-block" onClick={() => setSelectedReason('I changed my mind')}><input className="uk-radio" type="radio" name="returnReason" value="I changed my mind" checked={selectedReason === 'I changed my mind'} /><span className="coupon-message">I changed my mind</span></label>
                <label className="uk-display-block" onClick={() => setSelectedReason('Size or fit issues')}><input className="uk-radio" type="radio" name="returnReason" value="Size or fit issues" checked={selectedReason === 'Size or fit issues'} /><span className="coupon-message">Size or fit issues</span></label>
                <label className="uk-display-block" onClick={() => setSelectedReason('Other')}><input className="uk-radio" type="radio" name="returnReason" value="Other" checked={selectedReason === 'Other'} /><span className="coupon-message">Other</span></label>
              </div>
            </div>
          </div>
          <p><span className="uk-badge">Note:</span> You confirm that the product is unused with the original tags intact.</p>
          {
            showReturnError &&
            <p className="uk-text-danger">Please select one of the above reason.</p>
          }
          <p className="uk-text-right">
            {
              !orders._isOrderUpdate ?
                <button disabled={orders._isLoading}
                  className="uk-button uk-button-primary" type="button" onClick={() => returnOrder()}>
                  {
                    orders._isLoading &&
                    <img className="login-button-padding" src="/tail-spin.svg" />
                  }
               Confirm Return</button>
                :
                <button disabled={orders._isOrderUpdate}
                  className="uk-button uk-label-success" type="button" >
                  <span uk-icon="icon:check" />
                Return Initaled.</button>
            }

          </p>
        </div>
      </div>
    </div>
  )
}

export {
  Orders
}