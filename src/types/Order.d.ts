import { User } from "./UserInformation";
import { OrderUpdateAdmin } from './Shipment';

interface OrderItems{
  orderDetailId: string,
  productDetailId: string,
  productName: string,
  productId: string,
  quantity: string,
  currency: string,
  productPrice: string,
  productImage: string,
  categoryId: string,
  shipmentDetails?: OrderUpdateAdmin,
  size?: string,
}

interface Order{
  orderId: string,
  totalPrice: string,
  paymentDate: string,
  paymentMode: string,
  orderNumber: string,
  userDetails?: User,
  razorpayPaymentId?: string,
  paypalResponse?: Object,
  standardShipping?: boolean,
  orderItems: OrderItems[],
  couponDiscount?: string,
  userDiscount?: string,
}

export {
  Order,
  OrderItems
}