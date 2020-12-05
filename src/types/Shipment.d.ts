interface OrderUpdateAdmin {
  trackingNumber?: string,
  shippingDate?: string,
  deliveryDate?: string,
  shipper?: string,
  shipmentId?: string,
  returnStatus?: string,
  paymentReturned?: string,
  orderDetailId?: string,
  orderNumber?: string,
  customerEmail?: string,
  customerName?:string,
}

export {
  OrderUpdateAdmin
}