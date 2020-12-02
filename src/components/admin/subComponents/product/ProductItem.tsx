import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationContainer } from 'components/shared';
import {
  AppState, SubCategory, getSubCategory, getSize, getColour, Size,
  Colour, Product, addUpdateProduct, setDefaulState, getProduct
} from 'reducers';
import { ProductSubCategory, ProductSize, ProductItem as ProductItemType, sizeColourQuantityComboObject } from 'types';
import { serverImagePath, SubCategories } from 'appConstants';
import { filterSubcategories } from 'services';
import { useHistory } from 'react-router-dom';

const ProductItem: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [sizeColourQuantity, setSizeColourQuantity] = useState<sizeColourQuantityComboObject[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Array<string>>([]);
  const [sizeColourQuantityErrorMessage, setSizeColourQuantityErrorMessage] = useState('')

  const {
    name, description, productCategoryId,
    subCategory, quantity, productDetailId,
    priceINR, priceUSD, productId, productCategoryName,
    sizeId, colourId, imageNames, imagePaths, size, colour, sizeColourQuantityCombo
  } = useSelector<AppState, ProductItemType>(state => state.product.singleData || {} as ProductItemType)

  const checkForProductCategory = (subCategory: string) => {
    const filteredKey = Object.keys(SubCategories).filter((key) => key === subCategory);
    if (filteredKey[0]) {
      return Number(SubCategories[filteredKey[0]])
    }
    return 0;
  }

  const productItemFormik = useFormik({
    initialValues: {
      name: name || '',
      description: description || '',
      productCategoryId: productCategoryId || productCategoryName ? checkForProductCategory(productCategoryName || '') : 0,
      subCategory: subCategory || 0,
      size: sizeId ? sizeId.toString() : '0',
      colour: colourId ? colourId.toString() : '',
      quantity: quantity || '',
      priceINR: priceINR ? priceINR.split(',')[0] : '',
      priceUSD: priceUSD ? priceUSD.split(',')[0] : '',
      productImageBlob: null,
      productId: productId || '0',
      deletedImagePath: [],
      updatedImageName: [],
      code: '',
      value: '',
      imagePaths: imagePaths || '',
      imageNames: imageNames || '',
      adminProductCombo: sizeId ? sizeId.split(',').length : 1,
      deletedProductDetailIds: [],
      productDetailIdArray: productDetailId ? productDetailId.split(',') : [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      productCategoryId: Yup.number().required('Required').moreThan(0, 'Required'),
      subCategory: Yup.number().required('Required').moreThan(0, 'Required'),
      //size: Yup.string().required('Required').matches(/[^0]/, 'Required'),
      //colour: Yup.string().required('Required'),
      // quantity: Yup.string().required('Required'),
      priceINR: Yup.string().required('Required'),
      priceUSD: Yup.string().required('Required'),
      // productImageBlob: Yup.mixed().required('Required'),
    }),
    onSubmit: (values: ProductItemType) => {
      if(sizeColourQuantity.length === 0  || sizeColourQuantity.some((item) => Object.keys(item).length < 3)){
        setSizeColourQuantityErrorMessage('Please enter data for all the row(s)');
        setTimeout(()=>{
          setSizeColourQuantityErrorMessage('');
        },3000);
      }else {
        dispatch(addUpdateProduct(values, 0, sizeColourQuantity));
      }
    },
    enableReinitialize: true
  });
  const subCategories = useSelector<AppState, SubCategory>(state => state.subCategory);
  const productSize = useSelector<AppState, Size>(state => state.size);
  const productColour = useSelector<AppState, Colour>(state => state.colour);
  const productActionStatus = useSelector<AppState, Product>(state => state.product);
  useEffect(() => {
    dispatch(getSubCategory());
    dispatch(getSize());
    dispatch(getColour());
  }, []);

  useEffect(() => {
    if (productActionStatus._isSuccess) {
      setTimeout(()=>{
        dispatch(setDefaulState());
      productItemFormik.resetForm();
      setSizeColourQuantity([]);
      history.push("/admin");
      },2000)
    }
  }, [productActionStatus._isSuccess]);

  useEffect(() => {
    if(sizeId && colourId && quantity && sizeId.length > 0){
      const sizeArray = sizeId.split(',');
      const colourArray = colourId.split(',');
      const quantityArray = quantity.split(',');

      const editSizeColourQuantityCombo : sizeColourQuantityComboObject[] = sizeArray.map((sizeItem, index) => {
        return {
          size: sizeItem,
          colour: colourArray[index],
          quantity: quantityArray[index]
        }
      });

      setSizeColourQuantity(editSizeColourQuantityCombo);
      setSelectedSizes(sizeArray);
    }
  },[sizeId, colourId, quantity])

  const filteredSubcategories: ProductSubCategory[] = filterSubcategories(subCategories, productItemFormik.values.productCategoryId);

  const filteredProductSize: ProductSize[] = (productSize.data &&
    productSize.data.filter((size) => {
      return size.productCategory === Number(productItemFormik.values.productCategoryId)
    })) || [];

  const checkForMaxFileUpload = (files: FileList | null) => {
    let currentNumberOfFile = 0;
    if (productItemFormik.values.productId !== '0' && productItemFormik.values.imagePaths) {
      currentNumberOfFile += productItemFormik.values.imagePaths.split(', ').length;
    }
    if (files && Array.from(productItemFormik.values.productImageBlob || []).length + currentNumberOfFile !== 5) {
      const currentFiles = Array.from(productItemFormik.values.productImageBlob || []);
      let filesArray = Array.from(files);
      filesArray.splice(5 - (currentFiles.length + currentNumberOfFile), filesArray.length - 1);
      productItemFormik.setFieldValue("productImageBlob", [...currentFiles, ...filesArray]);
    }
  };

  const removeImage = (name: string) => {
    const productImageBlob = Array.from(productItemFormik.values.productImageBlob || []);
    productItemFormik.setFieldValue("productImageBlob",
      productImageBlob.filter((img: File) => {
        return img.name != name
      })
    )
  };

  const removeCurrentImage = (name: string, path: string) => {
    if (productItemFormik.values.deletedImagePath && productItemFormik.values.imagePaths && productItemFormik.values.imageNames) {
      productItemFormik.setFieldValue("deletedImagePath", [...productItemFormik.values.deletedImagePath, path]);
      productItemFormik.setFieldValue("imagePaths",
        productItemFormik.values.imagePaths.split(',').filter((imagePath) => imagePath != path).join(',')
      );
      productItemFormik.setFieldValue("imageNames",
        productItemFormik.values.imageNames.split(',').filter((imageName) => imageName != name).join(',')
      )
    }
  };

  const getFileNameAndPath = (fileName?: string, filePath?: string) => {
    if (fileName && filePath && fileName.length > 0 && filePath.length > 0) {
      const fileNames = fileName.split(',');
      const filePaths = filePath.split(',');

      return filePaths.map((path: string, index: number) => {
        return <div key={index} className="uk-inline product-uploader-container">
          <img key={index} src={serverImagePath + path} alt={fileNames[index]} />
          <div className="uk-overlay-primary uk-position-cover">
            <div className="uk-position-center">
              <span uk-icon="icon: close" onClick={() => removeCurrentImage(fileNames[index], path)} />
            </div>
          </div>
        </div>
      })
    }
  }

  const addProductComboLength = () => {
    const availableSizes = filteredProductSize.filter(({sizeId}) => selectedSizes.indexOf(sizeId?.toString() || '') === -1);
    if(availableSizes.length > 0 && productItemFormik.values.adminProductCombo){
      productItemFormik.setFieldValue('adminProductCombo', 
      productItemFormik.values.adminProductCombo + 1)
    } else if(availableSizes.length === 0){
      setSizeColourQuantityErrorMessage('No more sizes available');
      setTimeout(()=>{
        setSizeColourQuantityErrorMessage('');
      },3000);
    }
  }

  const reduceProductComboLength = (index: number) => {
    if(productItemFormik.values.deletedProductDetailIds && productItemFormik.values.productDetailIdArray){
      productItemFormik.setFieldValue('deletedProductDetailIds', 
      [...productItemFormik.values.deletedProductDetailIds,productItemFormik.values.productDetailIdArray[index]])
    }
    selectedSizes.splice(index,1);
    sizeColourQuantity.splice(index,1);
    const newPDArray = [...productItemFormik.values.productDetailIdArray];
    newPDArray.splice(index,1)
    productItemFormik.setFieldValue('productDetailIdArray', [...newPDArray]);
    setSelectedSizes([...selectedSizes]);
    setSizeColourQuantity([...sizeColourQuantity]);
    if(productItemFormik.values.adminProductCombo && productItemFormik.values.adminProductCombo > 1) {
      productItemFormik.setFieldValue('adminProductCombo', 
      productItemFormik.values.adminProductCombo - 1)
    }
  }

  const updatedSizeColourQuantityArray = (index: number, field: string, value: string) => {
    // let currentItem = productItemFormik.values.sizeColourQuantityCombo || [];
    let currentItem  = [...sizeColourQuantity] as sizeColourQuantityComboObject[];
    if(!currentItem[index]){
      currentItem[index] = {} as sizeColourQuantityComboObject
    }
        if(field === 'size') {
          if(currentItem[index].size){
            selectedSizes.splice(selectedSizes.indexOf(value), 1);
          }
            currentItem[index].size = value;
            setSelectedSizes([...selectedSizes, value]);
        } else if (field === 'colour') {
          currentItem[index].colour = value;
          // currentItem.forEach((item) => item.colour = value);
        } else if (field === 'quantity') {
          currentItem[index].quantity = value;
        }

        if(currentItem.length> 1){
          if(field === 'colour'){
            currentItem.forEach((item) => item.colour = value);
          } else {
            currentItem.forEach((item) => item.colour = currentItem[0].colour);
          }
        }

        if(productItemFormik.values.productDetailIdArray[index]){
          currentItem[index].productDetailId  = productItemFormik.values.productDetailIdArray[index];
        } else {
          currentItem[index].productDetailId = '0'
        }
      setSizeColourQuantity(currentItem);
  }

// console.log(sizeColourQuantity)
  // if(Object.keys(sizeColourQuantity).length > 0){console.log(sizeColourQuantity)}
  return (
    <form onSubmit={productItemFormik.handleSubmit} className="uk-width-1-1 uk-width-expand@m">
      <div className="uk-card uk-card-default uk-card-small tm-ignore-container">
        <div className="uk-card-body">
          <div className="uk-form-stacked">
            <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
              <fieldset className="uk-fieldset">
                <legend className="uk-h4">Product</legend>
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-1@s" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">Name</div>
                      <input className="uk-input " id="name" type="input"
                        {...productItemFormik.getFieldProps('name')} />
                      {
                        productItemFormik.touched.name && productItemFormik.errors.name ? (
                          <span className="uk-text-danger">{productItemFormik.errors.name}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Description</div>
                      <textarea className="uk-textarea" id="description" cols={30}
                        {...productItemFormik.getFieldProps('description')} />
                      {
                        productItemFormik.touched.description && productItemFormik.errors.description ? (
                          <span className="uk-text-danger">{productItemFormik.errors.description}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                </div>
              </fieldset>
              <fieldset className="uk-fieldset">
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">Product Category</div>
                      <select className="uk-select" id="productCategoryId"
                        onChange={(e) => { productItemFormik.handleChange(e); productItemFormik.setFieldValue('subCategory', 0); setSizeColourQuantity([]); setSelectedSizes([]); productItemFormik.setFieldValue('adminProductCombo',1)}}
                        onBlur={productItemFormik.handleBlur}
                        value={productItemFormik.values.productCategoryId}
                      >
                        {/* {...productItemFormik.getFieldProps('productCategoryId')} */}
                        <option key='0' value={0}>Select</option>
                        <option key='1' value={1}>Lingerie</option>
                        <option key='2' value={2}>Footwear</option>
                        <option key='3' value={3}>HomeDecore</option>
                        <option key='4' value={4}>Handicraft</option>
                      </select>
                      {
                        productItemFormik.touched.productCategoryId && productItemFormik.errors.productCategoryId ? (
                          <span className="uk-text-danger">{productItemFormik.errors.productCategoryId}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">SubCategory</div>
                      <select className="uk-select" id="subCategory"
                        onChange={(e) => { productItemFormik.handleChange(e)}} // productItemFormik.setFieldValue('size', 0) 
                        onBlur={productItemFormik.handleBlur}
                        value={productItemFormik.values.subCategory}>
                        <option key='0' value={0}>Select</option>
                        {
                          filteredSubcategories.map((subCategory, index) => {
                            return <option key={index} value={subCategory.subCategoryId}>{subCategory.code}</option>
                          })
                        }
                      </select>
                      {
                        productItemFormik.touched.subCategory && productItemFormik.errors.subCategory ? (
                          <span className="uk-text-danger">{productItemFormik.errors.subCategory}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                </div>
              </fieldset>
              <fieldset className="uk-fieldset">
                <div className="uk-placeholder uk-text-center">
                  {
                    Array(productItemFormik.values.adminProductCombo).fill(1).map((value, index) => {
                      return (
                        <div key={index} className="uk-grid-small uk-child-width-1-1 uk-child-width-1-4@s" uk-grid="true">
                          <div>
                            <label>
                              <div className="uk-form-label">Size</div>
                              <select className="uk-select" id="size"  
                              value = {sizeColourQuantity[index] ? sizeColourQuantity[index].size : 0}
                              onChange={(e) => {updatedSizeColourQuantityArray(index, 'size', e.currentTarget.value)}}>
                                {/* {...productItemFormik.getFieldProps('size')}> */}
                                <option key='0' value={0}>Select</option>
                                {
                                  filteredProductSize.filter((size) => {
                                    return size.sizeId && index === selectedSizes.indexOf(size.sizeId.toString()) ? true : size.sizeId && selectedSizes.indexOf(size.sizeId.toString()) === -1
                                           
                                  })
                                    .map((size, index) => {
                                    return <option key={index} value={size.sizeId} >{size.value}</option>
                                  })
                                }
                              </select>
                              {/* {
                                productItemFormik.touched.size && productItemFormik.errors.size ? (
                                  <span className="uk-text-danger">{productItemFormik.errors.size}</span>
                                ) : ''
                              } */}
                            </label>
                          </div>
                          <div>
                            <label>
                              <div className="uk-form-label">Colour</div>
                              <select className="uk-select" id="colour" 
                              value={sizeColourQuantity && sizeColourQuantity[0] && sizeColourQuantity[0].colour || '0'}
                              onChange={(e) => {updatedSizeColourQuantityArray(index, 'colour', e.currentTarget.value)}}>
                                {/* {...productItemFormik.getFieldProps('colour')}> */}
                                <option key='0' value={0}>Select</option>
                                {
                                  Array.isArray(productColour.data) &&
                                  productColour.data.map((colour, index) => {
                                    return <option key={index} value={colour.colourId}>{colour.value}</option>
                                  })
                                }
                              </select>
                            </label>
                          </div>
                          <div>
                            <label>
                              <div className="uk-form-label">Quantity</div>
                              <input className="uk-input " id="quantity" type="number"
                              value ={sizeColourQuantity[index] ? sizeColourQuantity[index].quantity : ''}
                              onChange={(e) => {updatedSizeColourQuantityArray(index, 'quantity', e.currentTarget.value)}}/>
                                {/* {...productItemFormik.getFieldProps('quantity')} /> */}
                              {/* {
                                productItemFormik.touched.quantity && productItemFormik.errors.quantity ? (
                                  <span className="uk-text-danger">{productItemFormik.errors.quantity}</span>
                                ) : ''
                              } */}
                            </label>
                          </div>
                          <div>
                            <label>
                              <div className="uk-form-label"></div>
                              <button disabled={productItemFormik.values.adminProductCombo === 1} className="uk-button uk-button-danger admin-add-more-combo" onClick={() => reduceProductComboLength(index)}>Delete</button>
                            </label>
                          </div>
                        </div>
                      )
                    })
                  }
                  <div className="uk-nav-center admin-add-more-combo">
                  <span className="uk-text-danger ">{sizeColourQuantityErrorMessage}</span>
                  </div>
                  
                  <button className="uk-button uk-button-primary" disabled={sizeColourQuantity.length === 0 || sizeColourQuantity.length !== productItemFormik.values.adminProductCombo  } onClick={(e) => {e.preventDefault(); addProductComboLength()}}>Add More</button>
                </div>
              </fieldset>
              <fieldset className="uk-fieldset">
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-2@s" uk-grid="true">
                  <div>
                    <label>
                      <div className="uk-form-label">Price INR</div>
                      <input className="uk-input " id="priceINR" type="input"
                        {...productItemFormik.getFieldProps('priceINR')} />
                      {
                        productItemFormik.touched.priceINR && productItemFormik.errors.priceINR ? (
                          <span className="uk-text-danger">{productItemFormik.errors.priceINR}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                  <div>
                    <label>
                      <div className="uk-form-label">Price USD</div>
                      <input className="uk-input " id="priceUSD" type="input"
                        {...productItemFormik.getFieldProps('priceUSD')} />
                      {
                        productItemFormik.touched.priceUSD && productItemFormik.errors.priceUSD ? (
                          <span className="uk-text-danger">{productItemFormik.errors.priceUSD}</span>
                        ) : ''
                      }
                    </label>
                  </div>
                </div>
              </fieldset>
              <fieldset className="uk-fieldset">
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-1@s" uk-grid="true">
                  <label id="product-upload" htmlFor="productImageBlob" className="uk-placeholder uk-text-center">
                    <span className="upload-icon-margin" uk-icon="icon: cloud-upload; ratio: 1.25;" />
                     Click this banner to upload the images <input id="productImageBlob" type="file" multiple={true}
                      onChange={(event) => { checkForMaxFileUpload(event.currentTarget.files) }} />
                    {
                      productItemFormik.touched.productImageBlob && productItemFormik.errors.productImageBlob ? (
                        <span className="uk-text-danger">{productItemFormik.errors.productImageBlob}</span>
                      ) : ''
                    }
                  </label>
                </div>
              </fieldset>
              {
                 productItemFormik.values.productId !== '0' &&
                 <fieldset className="uk-fieldset">
                <div className="uk-form-label">Current Images</div>
                <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-5@s" uk-grid="true">

                  {
                    getFileNameAndPath(productItemFormik.values.imageNames, productItemFormik.values.imagePaths)
                  }
                  {/* {
                      productItemFormik.values.imagePaths &&
                      productItemFormik.values.imagePaths.split(',').map((path, i) => {
                      return <div className="uk-inline product-uploader-container">
                      <img key={i} src={apiServerHost+path} alt={file.name} />
                      <div className="uk-overlay-primary uk-position-cover">
                        <div className="uk-position-center">
                          <span uk-icon="icon: close" onClick={() => removeImage(file.name)}/>
                        </div>
                      </div>
                    </div>
                     })
                    [].map.call(productItemFormik.values.imagePaths, (file: any, i) => {
                      return <div className="uk-inline product-uploader-container">
                        <img key={i} src={URL.createObjectURL(file)} alt={file.name} />
                        <div className="uk-overlay-primary uk-position-cover">
                          <div className="uk-position-center">
                            <span uk-icon="icon: close" onClick={() => removeImage(file.name)}/>
                          </div>
                        </div>
                      </div>
                    }) */}

                  {/* <img src={'http://127.0.0.1:5000/images/1c508610-eee5-4360-8f76-f0e70fa5ca92.png'} alt={"a"} /> */}
                </div>
              </fieldset>
              }
              
              {
                <fieldset className="uk-fieldset">
                  <div className="uk-form-label">New Images</div>
                  <div className="uk-grid-small uk-child-width-1-1 uk-child-width-1-5@s" uk-grid="true">
                    {/* <div> */}
                    {/* <label> */}
                    {productItemFormik.values.productImageBlob &&
                      [].map.call(productItemFormik.values.productImageBlob, (file: any, i) => {
                        return <div className="uk-inline product-uploader-container">
                          <img key={i} src={URL.createObjectURL(file)} alt={file.name} />
                          <div className="uk-overlay-primary uk-position-cover">
                            <div className="uk-position-center">
                              <span uk-icon="icon: close" onClick={() => removeImage(file.name)} />
                            </div>
                          </div>
                        </div>
                      })
                    }
                    {/* <img src={'http://127.0.0.1:5000/images/1c508610-eee5-4360-8f76-f0e70fa5ca92.png'} alt={"a"} /> */}
                    {/* </label> */}
                    {/* </div> */}
                  </div>
                </fieldset>
              }

            </div>
          </div>
        </div>
        <div className="uk-card-footer uk-text-center">
          <NotificationContainer {...productActionStatus} />
          <button disabled={productActionStatus._isLoading} type="submit" className="uk-button uk-button-primary ">
            {
              productActionStatus._isLoading &&
              <img className="login-button-padding" src="/tail-spin.svg" />
            }
            <span>Save</span>
          </button>
        </div>
      </div>
    </form>
  )
}

export {
  ProductItem
}