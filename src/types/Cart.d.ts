interface CustomerCart {
  orderId?: number;
  productDetailId: string;
  productImage?: string;
  productImagePath?: string;
  productName?: string;
  productQuantity: string;
  productPrice: string;
  totalPrice?: string;
  subcategory?: string;
  availableQuantity?: string;
  cartId: string;
  currencyType?: number;
  productId: string;
}

export {
  CustomerCart
}