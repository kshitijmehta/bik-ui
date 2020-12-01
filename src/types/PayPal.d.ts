interface PayPalButtonProps {
  amount?: number|string,
  currency?: number|string,
  shippingPreference?: "NO_SHIPPING" | "GET_FROM_FILE" | "SET_PROVIDED_ADDRESS",
  onSuccess?: Function,
  catchError?: Function,
  onError?: Function,
  onCancel?: Function,
  createOrder?: Function,
  createSubscription?: Function,
  onApprove?: Function,
  style?: object,
  options?: PaypalOptions,
  onButtonReady?: Function,
}

interface PayPalButtonState {
  isSdkReady: boolean
}

interface PaypalOptions {
  clientId?: string,
  merchantId?: string,
  currency?: number|string,
  intent?: string,
  commit?: boolean|string,
  vault?: boolean|string,
  component?: string,
  disableFunding?: string,
  disableCard?: string,
  integrationDate?: string,
  locale?: string,
  buyerCountry?: string,
  debug?: boolean|string
}

export {
  PayPalButtonProps,
  PayPalButtonState,
  PaypalOptions
}