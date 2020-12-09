interface ActiveProductCount {
  subcategoryId: number;
  subcategoryName: string;
  colourId: number;
  colourName: string;
  sizeId: number;
  sizeName: string;
  count: number;
}

interface ActiveProductCountNew {
  subcategoryId: number;
  subcategoryName: string;
  colourId: number;
  colourName: string;
  sizeId: string[];
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
};

interface ProductCountList {
  [key: number]:{
    [key: number]:{
      name: string,
      count: number,
      size:{
        [key: number]: number
      }
    }
    name: string
  }
};

export {
  ActiveProductCount,
  ProductSubcategoryProperty,
  ProductColourProperty,
  ProductSizeProperty,
  ProductCountList,
  ActiveProductCountNew
}