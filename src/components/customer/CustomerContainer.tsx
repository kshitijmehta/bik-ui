import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { CustomerProductFilter } from '.';
import { AppState, ProductCount, getActiveProductCount } from 'reducers';
import { SubCategory, getSubCategory } from 'reducers/SubCategory';
import { ProductSubCategory, ProductSize, ProductColor, Search } from 'types';
import { filterSubcategories } from 'services';
import { SubCategories } from 'appConstants';
import { CustomerProductList } from './CustomerProductList';
import { setDefaulState } from 'reducers/Product';
import { getSize, Size } from 'reducers/Size';
import { getColour, Colour } from 'reducers/Colour';




const CustomerContainer: React.FunctionComponent = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const {product, filterOn} = useParams();
  const [colourId, setColourId] = useState<number[]>([]);
  const [sizeId, setSizeId] = useState<number[]>([]);
  const [subCategoryId, setSubCategoryId] = useState<number[]>([]);
  const [startPrice, setStartPrice] = useState('');
  const [endPrice, setEndPrice] = useState('');
  const [categoryId, setcategoryId] = useState<number[]>([]);
  const [subCategoryQueryParam, setSubCategoryQueryParam] = useState<ProductSubCategory[]>([]);
  const productSize = useSelector<AppState, ProductSize[]>(state => state.size.data || []);
  const productColour = useSelector<AppState, ProductColor[]>(state => state.colour.data || []);
  const search = useSelector<AppState, Search>(state => state.search.data || {} as Search);

  useEffect(()=> {
    dispatch(getSubCategory());
    dispatch(getSize());
    dispatch(getColour());
  },[]);


  useEffect(() => {
    dispatch(setDefaulState());
    const filteredKey = Object.keys(SubCategories).filter((key) => key.toLowerCase() === product.toLowerCase());
    if(filteredKey[0]){
      setcategoryId([SubCategories[filteredKey[0]]]);
    } else {
      const subCateId : number[] = [];
      for(let key in SubCategories){
        subCateId.push(SubCategories[key])
      }
      setcategoryId(subCateId)
    }
    if(!filterOn){
      setSubCategoryId([]);
    }

  }, [product]);

  const subCategories = useSelector<AppState, SubCategory>(state => state.subCategory);
  const activeProductCount = useSelector<AppState, ProductCount>(state => state.productCount);
  const productKey = Object.keys(SubCategories).find((subcategory) => subcategory.toLowerCase() === product.toLowerCase()) || '';
  let filteredSubcategories = filterSubcategories(subCategories, SubCategories[productKey]);;
  if(product.toLowerCase() === 'search'){
    filteredSubcategories = subCategories.data || []
  }
  

  useEffect(()=> {
    if(filterOn &&  !subCategories._isLoading && subCategories.data && subCategories.data.length >0){
      setSubCategoryId([Number(subCategories.data?.filter(({code}) => code.toLowerCase() === filterOn.toLowerCase())[0].subCategoryId)]);
    setSubCategoryQueryParam(subCategories.data?.filter(({code}) => code.toLowerCase() === filterOn.toLowerCase()) || [])
    }
  },[filterOn, subCategories._isLoading])

  const getTotalProductCount = () => {
    let count = 0;
    const activeProducts = activeProductCount.data
    if(activeProducts){
      const selectedSubCat = subCategoryId.length>0 ? subCategoryId : filteredSubcategories.map(({subCategoryId}) => Number(subCategoryId));
      const selectedColour = colourId.length > 0 ? colourId : productColour.length> 0 ?  productColour.map(({colourId}) => Number(colourId)) : [];
      const selectedSize = sizeId.length > 0 ? sizeId : productSize.length > 0 ? productSize.map(({sizeId}) => Number(sizeId)) : [];
      selectedSubCat.forEach((subCategory) => {
        const activeSubCat = activeProducts[subCategory];
        if(activeSubCat){
          selectedColour.forEach((colour) => {
            const activeColour = activeSubCat[colour];
            if(activeColour){
              selectedSize.forEach((size) => {
                const activeSize = activeColour[size];
                if(activeSize) {
                  count+= activeSize.quantity;
                }
                
              })
            }
          })
        }
      });
    }
    return count;
  };

  // const getIdsForfilter = () => {
  //   const filteredKey = Object.keys(SubCategories).filter((key) => key.toLowerCase() === product.toLowerCase());
  //   if(filteredKey[0]){
  //     setcategoryId(Number(SubCategories[filteredKey[0]]));
  //   }
  // }

  // getIdsForfilter()
  return (
    <main>
    <section className="uk-section uk-section-small">
        <div className="uk-container">
            <div className="uk-grid-medium uk-child-width-1-1" uk-grid="true">
                <div className="uk-text-center">
                    <ul className="uk-breadcrumb uk-flex-center uk-margin-remove">
                        <li><a onClick={() => history.push('/')}>Home</a></li>
                        <li><span>Product</span></li>
                    </ul>
                    <h1 className="uk-margin-small-top uk-margin-remove-bottom customer-product">{product}</h1>
                    {
                      search.searchText === '' && <div className="uk-text-meta uk-margin-xsmall-top">{ getTotalProductCount()} items</div>
                    }
                </div>
                <div>
                    <div className="uk-grid-medium" uk-grid="true">
                        {
                          <CustomerProductFilter 
                          subCategories= {filteredSubcategories}
                          activeProductCount= {activeProductCount}
                          filterSelected={subCategoryQueryParam}
                          categoryId={categoryId}
                          setColourId={setColourId}
                          setSizeId={setSizeId}
                          setSubCategoryId={setSubCategoryId}
                          setStartPrice={setStartPrice}
                          setEndPrice={setEndPrice}
                          />
                        }
                        {
                        <CustomerProductList 
                          categoryId={categoryId}
                          colourId={colourId}
                          sizeId={sizeId}
                          subCategoryId={subCategoryId}
                          startPrice={startPrice}
                          endPrice={endPrice}
                          />
                        }
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>
  )
}

export {
  CustomerContainer
}