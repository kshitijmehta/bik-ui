import React, { useEffect, useState } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { CustomerProductFilter } from '.';
import { AppState, ProductCount, getActiveProductCount, defaultPreSelectedFitler, PreSelectedFilters, setPreSelectedFilter } from 'reducers';
import { SubCategory, getSubCategory } from 'reducers/SubCategory';
import { ProductSubCategory, ProductSize, ProductColor, Search } from 'types';
import { filterSubcategories } from 'services';
import { SubCategories } from 'appConstants';
import { CustomerProductList } from './CustomerProductList';
import { setDefaulState } from 'reducers/Product';
import { getSize, Size } from 'reducers/Size';
import { getColour, Colour } from 'reducers/Colour';
import queryString from 'query-string';




const CustomerContainer: React.FunctionComponent = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const { product, filterOn } = useParams();
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
  const preSelectedFilter = useSelector<AppState, PreSelectedFilters>(state => state.preSelectedFilters);
  let querySearch = useLocation().search; 
  useEffect(() => {
    dispatch(getSubCategory());
    dispatch(getSize());
    dispatch(getColour());
  }, []);

  // useEffect(() => {
  //   return () => {
  //     dispatch(defaultPreSelectedFitler());
  //   }
  // })

  useEffect(() => {
    dispatch(setDefaulState());
    const filteredKey = Object.keys(SubCategories).filter((key) => key.toLowerCase() === product.toLowerCase());
    if (filteredKey[0]) {
      setcategoryId([SubCategories[filteredKey[0]]]);
    } else {
      const subCateId: number[] = [];
      for (let key in SubCategories) {
        subCateId.push(SubCategories[key])
      }
      setcategoryId(subCateId)
    }
    if(preSelectedFilter.data?.subcategoryname.toString() !=="" &&product.toString().toLowerCase() !== preSelectedFilter.data?.subcategoryname.toLowerCase()){
      setColourId([])
      setSizeId([])
      setStartPrice('')
      setEndPrice('')
      // dispatch(defaultPreSelectedFitler());
      // dispatch(setPreSelectedFilter('subcategoryname',product));
    }

    const queryPramas = querySearch.split('?')[1];
    const filterPrams = queryString.parse(queryPramas);
    if (!filterOn && preSelectedFilter.data?.subcategoryId.length === 0 && !filterPrams['subCategoryId']?.toString()) {
      setSubCategoryId([]);
    }

  }, [product]);

  const subCategories = useSelector<AppState, SubCategory>(state => state.subCategory);
  const activeProductCount = useSelector<AppState, ProductCount>(state => state.productCount);
  const productKey = Object.keys(SubCategories).find((subcategory) => subcategory.toLowerCase() === product.toLowerCase()) || '';
  let filteredSubcategories = filterSubcategories(subCategories, SubCategories[productKey]);;
  if (product.toLowerCase() === 'search') {
    filteredSubcategories = subCategories.data || []
  }


  useEffect(() => {
    if (filterOn && !subCategories._isLoading && subCategories.data && subCategories.data.length > 0) {
      setSubCategoryId([Number(subCategories.data?.filter(({ code }) => code.toLowerCase() === filterOn.toLowerCase())[0].subCategoryId)]);
      setSubCategoryQueryParam(subCategories.data?.filter(({ code }) => code.toLowerCase() === filterOn.toLowerCase()) || [])
    }
  }, [filterOn, subCategories._isLoading])

  const getTotalProductCount = () => {
    let count = 0;
    const activeProducts = activeProductCount.data
    if (activeProducts) {
      const selectedSubCat = subCategoryId.length > 0 ? subCategoryId : filteredSubcategories.map(({ subCategoryId }) => Number(subCategoryId));
      const selectedColour = colourId.length > 0 ? colourId : productColour.length > 0 ? productColour.map(({ colourId }) => Number(colourId)) : [];
      const selectedSize = sizeId.length > 0 ? sizeId : [];
      // const selectedColour = colourId.length > 0 ? colourId : productColour.length> 0 ?  productColour.map(({colourId}) => Number(colourId)) : [];
      // const selectedSize = sizeId.length > 0 ? sizeId : productSize.length > 0 ? productSize.map(({sizeId}) => Number(sizeId)) : [];
      if (selectedSize.length === 0) {
        selectedSubCat.forEach((subCategory) => {
          if(activeProducts[subCategory]){
            selectedColour.forEach((colour) => {
              if(activeProducts[subCategory][colour] && activeProducts[subCategory][colour].count){
                count += activeProducts[subCategory][colour].count
              }
            })
          }
        })
      } else {
        selectedSubCat.forEach((subCategory) => {
          if(activeProducts[subCategory]){
            selectedColour.forEach((colour) => {
              if(activeProducts[subCategory][colour]){
                let localCount = 0;
                for(var i =0; i< selectedSize.length; i++){
                  if(activeProducts[subCategory][colour].size[selectedSize[i]]){
                    if(activeProducts[subCategory][colour].size[selectedSize[i]] === activeProducts[subCategory][colour].count){
                      localCount = activeProducts[subCategory][colour].count;
                      break;
                    }else{
                      localCount +=activeProducts[subCategory][colour].size[selectedSize[i]];
                    }
                  }
                }
                count+=localCount;
              }
            })
          }
        })
      }
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
                search.searchText === '' && <div className="uk-text-meta uk-margin-xsmall-top">{getTotalProductCount()} items</div>
              }
            </div>
            <div>
              <div className="uk-grid-medium" uk-grid="true">
                {
                  <CustomerProductFilter
                    subCategories={filteredSubcategories}
                    activeProductCount={activeProductCount}
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