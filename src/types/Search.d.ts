interface Search {
 readonly categoryId: number[],
 readonly subCategoryId: number[],
 readonly colourId: number[],
 readonly sizeId: number[],
 readonly startPrice: string,
 readonly endPrice: string,
 readonly currency: string,
 readonly searchText: string,
}

export {
  Search
}