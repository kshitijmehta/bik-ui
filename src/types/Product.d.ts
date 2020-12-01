interface ProductItem {
  readonly productId: string,
  readonly name: string;
  readonly description?: string;
  readonly productCategoryId?: number;
  readonly productCategoryName?: string;
  readonly subCategory?: number;
  readonly subCategoryName?: string;
  readonly quantity?: string;
  readonly size?: string;
  readonly colour?: string;
  readonly sizeId?: string;
  readonly colourId?: string;
  readonly priceINR: string;
  readonly priceUSD: string;
  readonly productImageBlob?: FileList | null;
  readonly updatedImageName?: string[];
  readonly deletedImagePath?: string[];
  readonly imageNames?: string;
  readonly imagePaths?: string;
  readonly code: string;
  readonly value: string;
  readonly adminProductCombo?: number;
  readonly sizeColourQuantityCombo?: sizeColourQuantityComboObject[];
  readonly productDetailId?: string;
  readonly productDetailIdArray: string[];
  readonly deletedProductDetailIds?: string[];
  readonly latest?: boolean;
  readonly trending?: boolean;
  readonly highlight?: string;
}

interface sizeColourQuantityComboObject {
  size: string;
  colour: string;
  quantity: string;
  productDetailId?: string;
}
export {
  ProductItem,
  sizeColourQuantityComboObject
}