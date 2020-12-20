interface CustomerCheckout {
  key: string;
  amount: string;
  currency: string;
  name: string;
  orderId: string;
  receipt: string;
  otp: string;
};

interface RazorpayPayment {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  orderId: number;
  orderNumber: string;
  addressId: string;
  couponId?: number;
  userName?: string;
  userAddress?: string;
};

interface PayPalPayment {
  paypalResponse: { orderData: string; paymentData: string; };
  orderId: number;
  addressId: string;
  quantity: number;
  couponId?: number; 
  isStandard: boolean;
  userName?: string;
  userAddress?: string;
};

interface CodPayment {
  otp: string;
  orderId: number;
  addressId: string;
  couponId?: number; 
  userName?: string;
  userAddress?: string;
}

export {
  CustomerCheckout,
  RazorpayPayment,
  PayPalPayment,
  CodPayment
}