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
};

interface PayPalPayment {
  paypalResponse: { orderData: string; paymentData: string; };
  orderId: number;
  addressId: string;
  quantity: number;
  couponId?: number; 
  isStandard: boolean;
};

interface CodPayment {
  otp: string;
  orderId: number;
  addressId: string;
  couponId?: number; 
}

export {
  CustomerCheckout,
  RazorpayPayment,
  PayPalPayment,
  CodPayment
}