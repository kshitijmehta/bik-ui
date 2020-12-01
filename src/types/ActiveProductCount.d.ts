interface ActiveProductCount {
  subcategoryId: number;
  subcategoryName: string;
  colourId: number;
  colourName: string;
  sizeId: number;
  sizeName: string;
  count: number;
}

interface ProductSizeProperty {
    name: string;
    quantity: number;
};

interface ProductColourProperty {
    name: string;
    [key: number] : ProductSizeProperty
};

interface ProductSubcategoryProperty {
  [key: number] : {
    name: string;
    [key: number] : ProductColourProperty;
  }
}

export {
  ActiveProductCount,
  ProductSubcategoryProperty,
  ProductColourProperty,
  ProductSizeProperty
}