interface SelectedFilters {
  coloudId: number[];
  sizeId: number[];
  subcategoryId: number[];
  startPrice: string;
  endPrice: string;
  subcategoryname : string;
  searchText : string;
  scrollTill?: string;
  lastViewedProductId?: string;
}

export {
  SelectedFilters
}