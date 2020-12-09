import { ProductSubCategory, ActiveProductCount, ProductSubcategoryProperty, ProductItem, OrderItems, ProductCountList, ActiveProductCountNew } from "types";
import { SubCategory, Size } from "reducers";

const getSubCategoryFromId = (id: Number) => {
  switch (id) {
    case 1:
      return "Lingerie";
    case 2:
      return "Footwear";
    case 3:
      return "Bindi";
    case 4:
      return "Handicraft";
  }
};

const filterSubcategories = (subCategories: SubCategory, categoryId = 0) => {
  return (subCategories.data &&
    subCategories.data.filter((subCategory) => {
      return subCategory.productCategoryId === Number(categoryId)
    })) || [];
};

const filterSize = (sizes: Size, categoryId: number[]) => {
  return (sizes.data &&
    sizes.data.filter((size) => {
      return  categoryId.indexOf((size.productCategory || 0)) > -1
    })) || [];
};

const calculateUserDiscount = (discount: string, price: string) => {
  return Math.ceil(Number(price) - (Number(price) * (Number(discount) / 100))).toString();
};

const calculateUserDiscountPrice = (discount: string, price: string) => {
  return Math.ceil(Number(price) * (Number(discount)) / 100).toString();
};

const getCurrencyIcon = (currency: string) => {
  return currency === 'IN' ? '₹' : '$'
};

const showINRUSD = (userLocation: string, price : {priceINR: string, priceUSD: string}) => {
  return userLocation === 'IN' ? price.priceINR : price.priceUSD;
}

const sizeCheck = (sizeObj : { [key: string]: number},sizeArray: string[])=> {
  let resultSize = {} as { [key: string]: number};
  sizeArray.forEach((size: string)=>{
    if(sizeObj[size]){
      resultSize[size] = sizeObj[size] + 1
    }
  });
  return resultSize;
}

const createActiveProductCountList = (activeProducts: ActiveProductCountNew[]) => {
  let resultList = {} as ProductCountList;
  activeProducts.forEach((product: ActiveProductCountNew) => {
    if(!resultList[product.subcategoryId]){
      resultList[product.subcategoryId] = {
        [product.colourId] : {
          name: product.colourName,
          count: 1,
          size : product.sizeId.reduce((a,b)=> (a[b]=1,a),{} as {[key: string]: number})
        },
        name: product.subcategoryName
      }
    } else {
      if(!resultList[product.subcategoryId][product.colourId]){
        resultList[product.subcategoryId][product.colourId] ={
          name: product.colourName,
          count: 1,
          size : product.sizeId.reduce((a,b)=> (a[b]=1,a),{} as {[key: string]: number})
        }
      } else {
        resultList[product.subcategoryId][product.colourId].count += 1;
        resultList[product.subcategoryId][product.colourId].size = 
          sizeCheck(resultList[product.subcategoryId][product.colourId].size,product.sizeId)
      }
    }
  });
  return resultList;
}

const createProductCountList = (activeProducts: ActiveProductCount[]) => {
  let productCountList = {} as ProductSubcategoryProperty;
  activeProducts.forEach((product: ActiveProductCount) => {
    if(!productCountList[product.subcategoryId]) {
      productCountList[product.subcategoryId] = {
        name: product.subcategoryName,
        [product.colourId] : {
          name: product.colourName,
          [product.sizeId] : {
            name: product.sizeName,
            quantity: product.count
          }
        }
      }
    } else {
      if(!productCountList[product.subcategoryId][product.colourId]) {
        productCountList[product.subcategoryId][product.colourId] = {
          name: product.colourName,
          [product.sizeId] : {
            name: product.sizeName,
            quantity: product.count
          }
        }
      } else {
        productCountList[product.subcategoryId][product.colourId][product.sizeId] = {
          name: product.sizeName,
          quantity: product.count
        }
      }
    }
  });
  console.log(productCountList)
  return productCountList;
};

const countHighlightProducts = (products: ProductItem[], isTrending: boolean) => {
  if(isTrending){
    return products.filter(({trending}) => trending).length;
  } else {
    return products.filter(({latest}) => latest).length;
  }
  
};

const getIconForAdminOrder = (orderItems: OrderItems[]) => {
  const orderLength = orderItems.length;
  let icon = '';
  for(var i = 0 ; i< orderLength; i++){
    const shipmentDetails = orderItems[i].shipmentDetails;
    if(shipmentDetails){
      if(shipmentDetails.paymentReturned && shipmentDetails.paymentReturned.toLowerCase() === 'yes'){
        icon = 'lifesaver';
        break;
      } else if(shipmentDetails.paymentReturned && shipmentDetails.paymentReturned.toLowerCase() === 'no'){
        icon = 'warning';
        break;
      } else if(shipmentDetails.returnStatus && shipmentDetails.returnStatus.toLowerCase() === 'in progress'){
        icon = 'history';
        break;
      } else if(shipmentDetails.returnStatus && shipmentDetails.returnStatus.toLowerCase() === 'accepted'){
        icon = 'plus-circle';
        break;
      } else if(shipmentDetails.returnStatus && shipmentDetails.returnStatus.toLowerCase() === 'declined'){
        icon = 'minus-circle';
        break;
      } else if(shipmentDetails.shipper){
        icon = 'cart';
        break;
      } else if(shipmentDetails.deliveryDate){
        icon = 'check';
        break;
      }
    }
  }
  return icon;
};

const getPaypalTransactionId = (payaplResponse: any) =>{
  let transactionId = '';
  if(payaplResponse.paymentData){
    if(payaplResponse.paymentData.purchase_units){
      if(payaplResponse.paymentData.purchase_units[0]){
        if(payaplResponse.paymentData.purchase_units[0].payments){
          if(payaplResponse.paymentData.purchase_units[0].payments.captures){
            if(payaplResponse.paymentData.purchase_units[0].payments.captures[0]){
              if(payaplResponse.paymentData.purchase_units[0].payments.captures[0].id){
                transactionId = payaplResponse.paymentData.purchase_units[0].payments.captures[0].id;
              }
            }
          }
        }
      }
    }
  }
  return transactionId;
}

export {
  getSubCategoryFromId,
  filterSubcategories,
  filterSize,
  calculateUserDiscount,
  getCurrencyIcon,
  calculateUserDiscountPrice,
  createProductCountList,
  showINRUSD,
  countHighlightProducts,
  getIconForAdminOrder,
  getPaypalTransactionId,
  createActiveProductCountList
}