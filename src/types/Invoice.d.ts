interface Invoice {
 readonly clientName: string,
 readonly invoiceDate: string,
 readonly clientAddress: string,
 readonly invoiceNumber: string,
 readonly userDiscount?: string,
 readonly couponDiscount?: string,
 readonly productList: InvoiceItems[],
 readonly isInternaltionalOrder: boolean,
 readonly isInternaltionalOrderStandard: boolean,
}

interface InvoiceItems {
  readonly productName: string,
  readonly quantity: string,
  readonly productPrice: string,
  readonly quantity: string,
}

export {
  Invoice,
  InvoiceItems
}