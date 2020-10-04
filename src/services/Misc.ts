import { ProductSubCategory } from "types";
import { SubCategory } from "reducers";

const getSubCategoryFromId = (id: Number) => {
  switch(id){
    case 1:
      return "Bindi";
    case 2:
      return "Footwear";
    case 3:
      return "HomeDecore";
    case 4:
      return "Handicraft";
  }
};

const filterSubcategories= (subCategories: SubCategory, categoryId=0) => {
  return (subCategories.data &&
    subCategories.data.filter((subCategory) => {
      return subCategory.productCategoryId === Number(categoryId)
    })) || [];
}

export {
  getSubCategoryFromId,
  filterSubcategories
}