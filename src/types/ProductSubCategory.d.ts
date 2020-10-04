interface ProductSubCategory {
  readonly subCategoryId?: string,
  readonly code: string,
  readonly value: string,
  readonly productCategoryId?: number,
  readonly productCategoryName?: string
}

export {
  ProductSubCategory
}