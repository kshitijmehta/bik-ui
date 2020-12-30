import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { ProductSubCategory, ActiveProductCount, ProductColor, ProductSize } from 'types';
import { ProductCount, AppState, Size, Colour, getCustomerProducts, setPreSelectedFilter, defaultPreSelectedFitler, PreSelectedFilters, setAllFilters } from 'reducers';
import { useSelector, useDispatch } from 'react-redux';
// import { Size } from 'reducers/Size';
// import { Colour } from 'reducers/Colour';
import { filterSize } from 'services';
import { pageSize } from 'appConstants';
import { setDefaulState } from 'reducers/Product';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { Search, setSearch } from 'reducers/Search';
// import { getCustomerProducts } from 'reducers/Product';


interface Props {
  filterSelected: ProductSubCategory[];
  subCategories: ProductSubCategory[];
  activeProductCount: ProductCount;
  categoryId: number[];
  setColourId: Dispatch<SetStateAction<number[]>>;
  setSizeId: Dispatch<SetStateAction<number[]>>;
  setSubCategoryId: Dispatch<SetStateAction<number[]>>;
  setStartPrice: Dispatch<SetStateAction<string>>;
  setEndPrice: Dispatch<SetStateAction<string>>;
}


const CustomerProductFilter: React.FunctionComponent<Props> = (props: Props) => {

  const dispatch = useDispatch();
  const { product } = useParams();
  const preSelectedFilter = useSelector<AppState, PreSelectedFilters>(state => state.preSelectedFilters);
  const search = useSelector<AppState, Search>(state => state.search || {} as Search);
  const [filterColourId, setFilterColourId] = useState<number[]>([]);
  const [filterSizeId, setFilterSizeId] = useState<number[]>([]);
  const [filterSubCategory, setFilterSubCategory] = useState<number[]>([]);
  const [filterStartPrice, setFilterStartPrice] = useState('');
  const [filterEndPrice, setFilterEndPrice] = useState('');
  const [startPriceTimer, setStartPriceTimer] = useState(0);
  const [endPriceTimer, setEndPriceTimer] = useState(0);
  const productSize = useSelector<AppState, Size>(state => state.size);
  const productColour = useSelector<AppState, Colour>(state => state.colour);

  const getProductCount = (id=0) => {
    let count = 0;
    const activeProducts = props.activeProductCount.data
    if(activeProducts){
      const selectedColour = filterColourId.length > 0 ? filterColourId : productColour.data && productColour.data.length> 0 ?  productColour.data.map(({colourId}) => Number(colourId)) : [];
      const selectedSize = filterSizeId.length > 0 ? filterSizeId  : [];
      const selectedSubCat = activeProducts[id];
      if(selectedSubCat){
        if (selectedSize.length === 0) {
            selectedColour.forEach((colour) => {
              if(selectedSubCat[colour]){
                count += selectedSubCat[colour].count
              }
            })
        } else {
            selectedColour.forEach((colour) => {
              let localCount = 0;
              for(var i =0; i< selectedSize.length; i++){
                if(selectedSubCat[colour] && selectedSubCat[colour].size && selectedSubCat[colour].size[selectedSize[i]]){
                  if(selectedSubCat[colour].size[selectedSize[i]] === selectedSubCat[colour].count){
                    localCount = selectedSubCat[colour].count;
                    break;
                  }else{
                    localCount +=selectedSubCat[colour].size[selectedSize[i]];
                  }
                }
              }
              count+=localCount;
            })
        }
      }
    }
    return count
  }

  const toggleAddingRemovingId = (ids: number[], newId: number) => {
    const index = ids.indexOf(newId);
    if (index > -1){
      ids.splice(index,1);
    } else {
      ids.push(newId);
    }
    return ids;
  }
  const getFilteredProduct = (colour: number, size: number, subCategory?: number, startPrice?: string, endPrice?: string) => {
    if(colour != 0){
      const updatedColourFilter = toggleAddingRemovingId(filterColourId, colour);
      setFilterColourId([...updatedColourFilter]);
      props.setColourId([...updatedColourFilter]);
      dispatch(setPreSelectedFilter('coloudId',[...updatedColourFilter]));
    } else if (size != 0){
      const updatedSizeFilter = toggleAddingRemovingId(filterSizeId, size);
      setFilterSizeId([...updatedSizeFilter]);
      props.setSizeId([...updatedSizeFilter]);
      dispatch(setPreSelectedFilter('sizeId',[...updatedSizeFilter]));
    } else if (subCategory && subCategory != 0){
      const updatedSubCategory = toggleAddingRemovingId(filterSubCategory, subCategory);
      setFilterSubCategory([...updatedSubCategory]);
      props.setSubCategoryId([...updatedSubCategory]);
      dispatch(setPreSelectedFilter('subcategoryId',[...updatedSubCategory]));
    } else if(startPrice!=='0' && !endPrice){
      setFilterStartPrice(startPrice || '');
      window.clearTimeout(startPriceTimer);
      setStartPriceTimer(window.setTimeout(() => {
        props.setStartPrice(startPrice || '')
        dispatch(setPreSelectedFilter('startPrice',startPrice|| ''));
      },1000));
    } else if(endPrice || (!endPrice && filterEndPrice)){
      setFilterEndPrice(endPrice || '');
      window.clearTimeout(endPriceTimer);
      setEndPriceTimer(window.setTimeout(() => {
        props.setEndPrice(endPrice || '')
        dispatch(setPreSelectedFilter('endPrice',endPrice || ''));
      },1000));
    }
  }

  const restFilter = () => {
    setFilterColourId([]);
    props.setColourId([]);
    setFilterSizeId([]);
    props.setSizeId([]);
    setFilterSubCategory([]);
    props.setSubCategoryId([]);
    dispatch(defaultPreSelectedFitler());
    setFilterStartPrice('');
    props.setStartPrice('');
    setFilterEndPrice('');
    props.setEndPrice('');
  }

  useEffect(() => {
    if(search._navigationReset){
      restFilter()
    }

  },[search._navigationReset])

  const convertQueryParamsToNumber = (query: string | undefined) => {
    if(query){
      return query.split(',').map((id) => Number(id));
    }
  }

  useEffect(() => {
    if(preSelectedFilter.data?.subcategoryname.toString() !=="" && product.toString().toLowerCase() !== preSelectedFilter.data?.subcategoryname.toLowerCase()){
      restFilter();
      // dispatch(defaultPreSelectedFitler());
      dispatch(setPreSelectedFilter('subcategoryname',product));
    }else {
    const queryPramas = window.location.search.split('?')[1];
    const filterPrams = queryString.parse(queryPramas);
    const colourFilter = convertQueryParamsToNumber(filterPrams['colourId']?.toString()) || preSelectedFilter.data?.coloudId || []
    const sizeFilter = convertQueryParamsToNumber(filterPrams['sizeId']?.toString()) ||preSelectedFilter.data?.sizeId || [];
    const subCategoryFilter = convertQueryParamsToNumber(filterPrams['subCategoryId']?.toString()) ||preSelectedFilter.data?.subcategoryId || [];
    const startPriceFilter = filterPrams['startPrice']?.toString() || preSelectedFilter.data?.startPrice || '';
    const endPriceFilter = filterPrams['endPrice']?.toString() || preSelectedFilter.data?.endPrice || '';
    setFilterColourId(colourFilter);
    setFilterSizeId(sizeFilter);
    setFilterSubCategory(subCategoryFilter);
    setFilterStartPrice(startPriceFilter);
    setFilterEndPrice(endPriceFilter);
    dispatch(setAllFilters({
      subcategoryId:subCategoryFilter,
      coloudId:colourFilter,
      sizeId:sizeFilter,
      startPrice:startPriceFilter,
      endPrice:endPriceFilter,
      subcategoryname: product.toString().toLowerCase(),
      searchText: filterPrams['searchText']?.toString() || '',
      scrollTill: preSelectedFilter.data?.scrollTill || '0',
      lastViewedProductId: preSelectedFilter.data?.lastViewedProductId || '',
    }))
    props.setColourId([...colourFilter]);
    props.setSizeId([...sizeFilter]);
    props.setSubCategoryId([...subCategoryFilter]);
    props.setStartPrice(startPriceFilter);
    props.setEndPrice(endPriceFilter);
    }
  },[product]);
  // useEffect(() => {
  //   console.log('filter on effect')
  //   if(props.filterSelected && props.filterSelected.length > 0){
  //     if(filterSubCategory.length> 0){
  //       setFilterSubCategory([]);
  //     }
  //     const updatedSubCategory = toggleAddingRemovingId(filterSubCategory, Number(props.filterSelected[0].subCategoryId));
  //     setFilterSubCategory([...updatedSubCategory]);
  //   }
  // },[props.filterSelected]);

  useEffect(() => {
    if(props.filterSelected.length>0){
      // const updatedSubCategory = toggleAddingRemovingId(filterSubCategory, Number(props.filterSelected[0].subCategoryId));
      setFilterSubCategory([Number(props.filterSelected[0].subCategoryId)]);
      dispatch(setPreSelectedFilter('subcategoryId',[Number(props.filterSelected[0].subCategoryId)]));
      // props.setSubCategoryId([Number(props.filterSelected[0].subCategoryId)]);
    }
  }, [props.filterSelected]);

  // useEffect(() => {
  //   // dispatch(setDefaulState());
  //   if(props.categoryId != 0){
  //     console.log(filterColourId,filterSizeId, filterSubCategory)
  //     console.log('effect filter')
  //     dispatch(getCustomerProducts(0, pageSize, props.categoryId,filterSubCategory, filterColourId , filterSizeId, true));
  //   }
  // }, [filterColourId,filterSizeId, filterSubCategory,props.categoryId]);

  return (
    <aside className="uk-width-1-4 tm-aside-column tm-filters" id="filters" uk-offcanvas="overlay: true; container: false;">
      <div className="uk-offcanvas-bar uk-padding-remove">
        <div className="uk-card uk-card-default uk-card-small uk-flex uk-flex-column uk-height-1-1">
          <header className="uk-card-header uk-flex uk-flex-middle">
            <div className="uk-grid-small uk-flex-1" uk-grid="true">
              <div className="uk-width-expand"><h3>Filters</h3></div>
              <button className="uk-offcanvas-close" type="button" uk-close="true"></button>
            </div>
          </header>
          <div className="uk-margin-remove uk-flex-1" uk-accordion="multiple: true; targets: &gt; .js-accordion-section" style={{ flexBasis: "auto" }}>
            <section className="uk-card-body uk-open js-accordion-section">
              <h4 className="uk-accordion-title uk-margin-remove">Prices</h4>
              <div className="uk-accordion-content">
                <div className="uk-grid-small uk-child-width-1-2 uk-text-small" uk-grid="true">
                  <div>
                    <div className="uk-inline">
                      <span className="uk-form-icon uk-text-xsmall">from</span>
                      <input className="uk-input" type="number" placeholder="₹₹₹"
                      value={filterStartPrice} 
                      onChange={(e) => getFilteredProduct(0,0,0,e.currentTarget.value)}/>
                    </div>
                  </div>
                  <div>
                    <div className="uk-inline">
                      <span className="uk-form-icon uk-text-xsmall">to</span>
                      <input className="uk-input" type="text" placeholder="₹₹₹" 
                      value={filterEndPrice}
                      onChange={(e) => getFilteredProduct(0,0,0,'0',e.currentTarget.value)}/>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {
              props.subCategories.length > 0 &&
              <section className="uk-card-body js-accordion-section uk-open">
              <h4 className="uk-accordion-title uk-margin-remove">Categories</h4>
              <div className="uk-accordion-content">
                <ul className="uk-list tm-scrollbox">
                  {
                    props.subCategories.map((subcategory: ProductSubCategory) => {
                      return (
                        <li key={subcategory.code}>
                          <input 
                            className="tm-checkbox"
                            id={"subproduct" + subcategory.code}
                            name="subproduct"
                            value={subcategory.code}
                            checked={filterSubCategory.indexOf(Number(subcategory.subCategoryId)) > -1}
                            type="checkbox"
                            onChange={() => getFilteredProduct(0, 0, Number(subcategory.subCategoryId))}
                            />
                          <label htmlFor={"subproduct" + subcategory.code}>
                            <span>{subcategory.code} <span className="uk-text-meta uk-text-small">{getProductCount(Number(subcategory.subCategoryId))}</span></span>
                          </label>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </section>
            }
            
            {
              productColour.data && productColour.data.length > 0 &&
              <section className="uk-card-body js-accordion-section uk-open">
                <h4 className="uk-accordion-title uk-margin-remove">Colour</h4>
                <div className="uk-accordion-content">
                  <ul className="uk-list tm-scrollbox">
                    {
                      productColour.data.map((colour: ProductColor) => {
                        return (
                          <li key={colour.colourId}>
                            <input 
                              className="tm-checkbox" 
                              id={"colour" + colour.colourId} 
                              name="colour" 
                              value={colour.colourId} 
                              type="checkbox"
                              checked={filterColourId.indexOf(Number(colour.colourId)) > -1}
                              onChange={() => getFilteredProduct(Number(colour.colourId), 0, 0)} 
                            />
                            <label htmlFor={"colour" + colour.colourId}>
                              <span>{colour.value} </span>
                            </label>
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
              </section>
            }
            {
              productSize.data && productSize.data.length > 0 &&
              !(filterSize(productSize,props.categoryId).length === 1 && 
              filterSize(productSize,props.categoryId)[0].value.toLowerCase() === 'default') &&
              <section className="uk-card-body js-accordion-section uk-open">
                <h4 className="uk-accordion-title uk-margin-remove">Size</h4>
                <div className="uk-accordion-content">
                  <ul className="uk-list tm-scrollbox">
                    {
                      filterSize(productSize,props.categoryId).map((size: ProductSize) => {
                        return (
                          size.value.toLowerCase() !== 'default' &&
                          <li key={size.sizeId}>
                            <input 
                              className="tm-checkbox"
                              id={"size" + size.sizeId}
                              name="size"
                              value={size.sizeId}
                              type="checkbox"
                              checked={filterSizeId.indexOf(Number(size.sizeId)) > -1}
                              onChange={() => getFilteredProduct(0,Number(size.sizeId), 0)} 
                              />
                            <label htmlFor={"size" + size.sizeId}>
                              <span>{size.value} </span>
                            </label>
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
              </section>
            }
            <div className="uk-card-body">
              <button className="uk-button uk-button-default uk-width-1-1" onClick={() => restFilter()}><span className="uk-margin-xsmall-right" uk-icon="icon: close; ratio: .75;"></span>Reset all filters</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export {
  CustomerProductFilter
}