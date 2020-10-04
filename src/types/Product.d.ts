interface ProductItem {
  readonly productId: string,
  readonly name: string;
  readonly description?: string;
  readonly productCategoryId?: number;
  readonly productCategoryName?: string;
  readonly subCategory?: number;
  readonly quantity?: string;
  readonly size?: string;
  readonly colour?: string;
  readonly sizeId?: number;
  readonly colourId?: number;
  readonly priceINR: string;
  readonly priceUSD: string;
  readonly productImageBlob?: FileList | null;
  readonly updatedImageName?: string[];
  readonly deletedImagePath?: string[];
  readonly imageNames?: string;
  readonly imagePaths?: string;
  readonly code: string,
  readonly value: string
}

export {
  ProductItem
}