import { ProductSubCategory, ActiveProductCount, ProductSubcategoryProperty, ProductItem, OrderItems, ProductCountList, ActiveProductCountNew, ProductColor, ProductSize, ProductCoupon, Order, OrderShipper, User, Invoice } from "types";
import { SubCategory, Size } from "reducers";
import { type } from "os";

const getSubCategoryFromId = (id: Number) => {
  switch (id) {
    case 1:
      return "Lingerie";
    case 2:
      return "Footwear";
    case 3:
      return "Bindi";
    case 8:
      return "Home Essential";
    case 9:
      return "Cosmetics";
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
};

const convertArrayOfObjectsToCSV = (array : ProductColor[] | ProductSize[] | ProductCoupon[] | ProductSubCategory[] | Order[] | OrderShipper[] | User[]) => {
  let result: any;

  const columnDelimiter = ',';
  const lineDelimiter = '\n';
  let keys = Object.keys(array[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach((item: any) => {
    let ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

const downloadCSV = (array: ProductColor[] | ProductSize[] | ProductCoupon[] | ProductSubCategory[] | Order[] | OrderShipper[] | User[]) => {
  const link = document.createElement('a');
  let csv = convertArrayOfObjectsToCSV(array);
  if (csv == null) return;

  const filename = 'basickartOrders.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }

  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', filename);
  link.click();
  link.remove();
}

const returnInvoiceHtml = ({clientName,invoiceDate,clientAddress,invoiceNumber,productName,quantity,totalAmount, rate} : Invoice) => {
  return `
  <!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Untitled Document</title>
</head>
<body style="padding-left: 20px;">
<table style="border:1px solid #999999;" width="600px" border="0" cellpadding="0" cellspacing="0" class="tb">
  <tbody>
    <tr>
      <td height="35" colspan="4" align="center" class="txt" style="border-bottom:1px solid #ddd; color:#e271a9; font-weight:800; font-family: 'Muli', sans-serif;">BasicKart</td>
    </tr>
    <tr>
      <td>&nbsp;</td>
      <td colspan="2"><table width="600px" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td height="49" valign="bottom" style=" font-size:20px; color:#e271a9; font-weight:800; font-family: 'Muli', sans-serif;">Tax Invoice</td>
            </tr>
          <tr>
            <td style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;" >GSTIN : 07CKLPB3987JIZP</td>
            </tr>
          <!--<tr>
            <td style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Pan No : AA444111FFFF</td>
            </tr> -->
          <tr>
            <td style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Office : B - 1/32, GROUND FLOOR, MAIN ROAD, N.E.A. KAROL BAGH,,<br> &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; DELHI, NORTH DELHI, DELHI, 110005</td>
            </tr>
          <tr>
            <td style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Email : support@basickart.com</td>
            </tr>
        </tbody>
      </table></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td height="20" colspan="4">&nbsp;</td>
    </tr>
    <tr>
      <td width="30px">&nbsp;</td>
      <td colspan="2"><table width="600px" border="0" cellpadding="0" cellspacing="0" class="tb1">
        <tbody>
          <tr>
            <td><table style="border:1px solid #999999;" width="600px" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td width="100px" height="25"><strong><span style=" font-size:12px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Client Name </span></strong></td>
                  <td width="280px"><span style=" font-size:12px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${clientName}</span></td>
                  <td width="120px"><strong><span style=" font-size:12px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Invoice Date</span></strong></td>
                  <td width="120px"><span style=" font-size:12px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${invoiceDate}</span></td>
                </tr>
                <tr>
                  <td height="25"><strong><span style=" font-size:12px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Address</span></strong></td>
                  <td><span style=" font-size:12px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${clientAddress}</span></td>
                  <td><strong><span style=" font-size:12px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">Invoice Number</span></strong></td>
                  <td><span style=" font-size:12px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">${invoiceNumber}</span></td>
                </tr>
                <tr>
                  <!--<td height="25"><strong><span style=" font-size:12px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">GSTIN</span></strong></td>
                  <td><span style=" font-size:12px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">0748MJKKLLL***</span></td>-->
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              </tbody>
            </table></td>
          </tr>
          <tr>
            <td height="55" style="border-top:1px solid #999999;">&nbsp;</td>
          </tr>
          <tr>
            <td><table style="border:1px solid #999999;" width="600px" border="1" cellpadding="0" cellspacing="0" class="tb2">
              <tbody>
                <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                  <td width="50px" height="30" align="center"><strong>S.N</strong></td>
                  <td width="350px" align="center"><strong>Description </strong></td>
                  <td width="30px" align="center"><strong>Qty </strong></td>
                  <td width="50px" align="center"><strong>Rate </strong></td>
                  <td width="50px" align="center"><strong>Amount</strong></td>
                </tr>
                <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                  <td height="30" align="center">1.</td>
                  <td align="center">${productName}</td>
                  <td align="center">${quantity}</td>
                  <td align="center">${rate}</td>
                  <td align="center">${totalAmount}</td>
                </tr>
           <!--     <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                  <td height="30" align="center">&nbsp;</td>
                  <td align="center">&nbsp;</td>
                  <td align="center">&nbsp;</td>
                  <td align="center"><strong>TOTAL</strong></td>
                  <td align="center">${totalAmount}</td>
                </tr> -->
              </tbody>
            </table></td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td><table width="600px" border="1" cellpadding="0" cellspacing="0" class="tb2">
              <tbody>
                <tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                  <td width="55px" height="48" align="center">&nbsp;</td>
                  <td width="369px" align="center">&nbsp;</td>
                  <td align="center">Final Amount <br>(Tax Included) :</td>
                  <td width="52px" align="center">${totalAmount}</td>
                </tr>
                <!--<tr style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;">
                  <td height="31" align="center">&nbsp;</td>
                  <td align="center">&nbsp;</td>
                  <td align="center"><strong>Grand Total</strong></td>
                  <td align="center">&nbsp;</td>-->
                </tr>
              </tbody>
            </table></td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table></td>
      <td width="50px">&nbsp;</td>
    </tr>
    <tr>
      <td colspan="4">&nbsp;</td>
    </tr>
    <tr>
      <td height="32">&nbsp;</td>
      <td style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;" width="300px" height="32"><strong>Date : ${invoiceDate}</strong></td>
      <td style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;" width="300px" align="right"><strong>For : Online Reciept</strong></td>
      <td height="32">&nbsp;</td>
    </tr>
    <tr>
      <td colspan="4">&nbsp;</td>
    </tr>
    <tr>
      <td height="72">&nbsp;</td>
      <td>&nbsp;</td>
      <td style=" font-size:13px; color:#000; padding:5px; font-family: 'Muli', sans-serif;" align="right" valign="bottom"><strong>It is a computer generated invoice and hence does not require any signature note.
</strong></td>
      <td>&nbsp;</td>
    </tr>
    <tr>
      <td colspan="4">&nbsp;</td>
    </tr>
  </tbody>
</table>
</body>
</html>
  `
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
  createActiveProductCountList,
  convertArrayOfObjectsToCSV,
  downloadCSV,
  returnInvoiceHtml
}