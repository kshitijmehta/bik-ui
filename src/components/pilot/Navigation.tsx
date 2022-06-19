import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getSubCategory, AppState, SubCategory, getActiveProductCount, Cart, getCart, getUser, getUserLocation, getCustomerProducts, UserLocation, setLoggedCart, defaultUser, PreSelectedFilters, defaultPreSelectedFitler } from 'reducers';
import { SubCategories, pageSize } from 'appConstants';
import { filterSubcategories } from 'services';
import { ProductSubCategory, Search } from 'types';
import { MobileNavigation, SideCart } from '.';
import { searchDefault, setSearch } from 'reducers/Search';



const Navigation: React.FunctionComponent = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const [cartCount, setCartCount] = useState(0);
  const [enteredSearchText, setEnteredSearchText] = useState('');
  const [cartCountCssFlag, setCartCountCssFlag] = useState(false);
  const userData = useSelector((state: AppState) => state.user);
  const subCategories = useSelector<AppState, SubCategory>(state => state.subCategory);
  const cart = useSelector<AppState, Cart>(state => state.cart);
  const search = useSelector<AppState, Search>(state => state.search.data || {} as Search);
  const userLocation = useSelector<AppState, UserLocation>(state => state.userLocation);
  const sideCartRef = useRef<HTMLAnchorElement>(null);
  const mobileNavigationRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    dispatch(getSubCategory());
    dispatch(getActiveProductCount());
    if(localStorage.getItem("biktoken")){
      dispatch(getCart());
      dispatch(getUser());
    }
    dispatch(getUserLocation());
    if(localStorage.getItem("basicKart-loggedOutCart")){
      dispatch(setLoggedCart(JSON.parse(localStorage.getItem("basicKart-loggedOutCart") || '[]')))
    }
  }, []);

  useEffect(() => {
    setCartCount(cart.data?.length || 0);
    setCartCountCssFlag(true);
    setTimeout(()=>{
      setCartCountCssFlag(false);
    },400)
  },[cart.data])

  const searchProduct = (searchText: string, doRedirect = true) => {
    
      if(searchText === ''){
        setEnteredSearchText('');
      }
      if(
        (search.categoryId && search.categoryId.length >0) ||
        (search.colourId && search.colourId.length >0) ||
        (search.sizeId && search.sizeId.length >0) ||
        (search.subCategoryId && search.subCategoryId.length >0) ||
         search.endPrice || search.startPrice || searchText
      ){
      dispatch(setSearch({
        categoryId: search.categoryId || 0,
        colourId: search.colourId || [],
        currency: userLocation.data || 'IN',
        endPrice: search.endPrice||'',
        sizeId: search.sizeId || [],
        startPrice: search.startPrice || '',
        subCategoryId: search.subCategoryId || [],
        searchText: searchText
      }));
      dispatch(getCustomerProducts(0, pageSize, search.categoryId || 0, search.subCategoryId || [], search.colourId || [], search.sizeId || [], search.startPrice || '', search.endPrice||'', userLocation.data || 'IN', searchText || '' , true));
      if(doRedirect){
        history.push('/product/search')
      }
    }
    
  }
  const navigateTo = (event: React.SyntheticEvent ,categoryPath: string, subcategoryPath?: string) => {
    event.preventDefault();
    history.push('/product/'+ categoryPath.toLowerCase() + (subcategoryPath ? '/'+ subcategoryPath.toLowerCase() : ''));
  };
  const getCategoryAndSubCategory = () => {
    return Object.keys(SubCategories).map((key: string, index: number) => {
      return (
        SubCategories[key] != 1 &&
        <li key={index}>
          <a className="desktop-nav-padding" onClick={(e) => {navigateTo(e,key);dispatch(searchDefault());setEnteredSearchText('')}}>{key}<span className="uk-margin-xsmall-left" uk-icon="icon: chevron-down; ratio: .75;"></span></a>
          <div
            className="uk-navbar-dropdown uk-margin-remove uk-padding-remove-vertical"
            uk-drop="pos: bottom-justify;delay-show: 125;delay-hide: 50;duration: 75;boundary: .tm-navbar-container;boundary-align: true;pos: bottom-justify;flip: x"
          >
            <div className="uk-container uk-container-small uk-margin-top uk-margin-bottom">
              <ul className="uk-nav uk-nav-default uk-column-1-3">
                {
                  filterSubcategories(subCategories, Number(SubCategories[key])).map((subcategory: ProductSubCategory, index: number) => {
                    return <li key={index}><a onClick={(e) => {navigateTo(e,key,subcategory.code);dispatch(searchDefault());setEnteredSearchText('')}}>{subcategory.code}</a></li>
                  })
                }
              </ul>
            </div>
          </div>
        </li>
      )
    });
  };

  const logout = () => {
    dispatch(defaultUser());
    window.localStorage.removeItem('biktoken');
    history.push('/');
  };
  return (
    <header>
      <MobileNavigation mobileNavigationRef={mobileNavigationRef} setEnteredSearchText={setEnteredSearchText}/>
      <div className="uk-navbar-container tm-navbar-container" uk-sticky="cls-active: tm-navbar-container-fixed">
        <div className="uk-container" uk-navbar="true">
          <div className="uk-navbar-left">
            <button ref={mobileNavigationRef} className="uk-navbar-toggle uk-hidden@m" uk-toggle="target: #nav-offcanvas" uk-navbar-toggle-icon="true"></button>
            <a className="uk-navbar-item uk-logo" onClick={() => {history.push('/'); searchProduct('',false)}}><img src="/logo.png" width="67" alt="Logo" /></a>
            <nav className="uk-visible@m">
              <ul className="uk-navbar-nav">
                {
                  getCategoryAndSubCategory()
                }
                <li><a onClick={()=> {history.push('/about');searchProduct('',false)}}>About</a></li>
                <li><a onClick={()=> {history.push('/contactus');searchProduct('',false)}}>Contact Us</a></li>
                {
                  userData.data?.isAdmin && 
                  <li><a onClick={()=>{history.push('/admin');searchProduct('',false)}}>Admin</a></li>
                }
               
              </ul>
            </nav>
          </div>
          <div className="uk-navbar-right">
            <a className={`${enteredSearchText !== '' ? 'search-color uk-navbar-toggle tm-navbar-button' : 'uk-navbar-toggle tm-navbar-button'}`} href="#" uk-search-icon="true">
            </a>
            <div className="uk-navbar-dropdown uk-padding-small uk-margin-remove" uk-drop="mode: click;cls-drop: uk-navbar-dropdown;boundary: .tm-navbar-container;boundary-align: true;pos: bottom-justify;flip: x">
              <div className="uk-container">
                <div className="uk-grid-small uk-flex-middle" uk-grid="true">
                  <div className="uk-width-expand">
                    <div className="uk-search uk-search-navbar uk-width-1-1">
                      <input className="uk-search-input" type="search" placeholder="Search…"
                        value={enteredSearchText}
                        onChange={(e) => setEnteredSearchText(e.currentTarget.value)}
                        onKeyPress={(e)=> {e.key === 'Enter' &&  searchProduct(e.currentTarget.value)}} />
                    </div>
                  </div>
                  <div className="uk-width-auto" onClick={()=>searchProduct('')}><a className="uk-navbar-dropdown-close" uk-close="true"></a></div>
                </div>
              </div>
            </div>
            <a className="uk-navbar-item uk-link-muted tm-navbar-button"  uk-icon="user"></a>
            <div className="uk-padding-small uk-margin-remove" uk-dropdown="pos: bottom-right; offset: -10; delay-hide: 200;" style={{ minWidth: '150px' }}>
              <ul className="uk-nav uk-dropdown-nav">
                <li>
                  <a onClick={() => userData.data?.userId ?  history.push('/userinformation/orders') : history.push('/login')}>Orders</a>
                </li>
                <li><a onClick={()=> userData.data?.userId ? history.push('/userinformation/default') : history.push('/login')}>Personal</a></li>
                <li><a onClick={()=> userData.data?.userId ? history.push('/userinformation/settings'): history.push('/login')}>Settings</a></li>
                <li className="uk-nav-divider"></li>
                {
                   userData.data?.userId ? 
                   <li><a onClick={()=> logout()}>Log out</a></li> :
                   <li><a onClick={()=>history.push('/login')}>Login</a></li>
                }
                
              </ul>
            </div>
            <a ref={sideCartRef} className="uk-navbar-item uk-link-muted tm-navbar-button" href="#" uk-toggle="target: #cart-offcanvas">
              <span uk-icon="cart"></span>
              {
                cartCount > 0 &&
                <span className={cartCountCssFlag ? "uk-badge  cart-popup" : "uk-badge "}>{cartCount}</span>
              }
            </a>
          </div>
        </div>
      </div>
      <SideCart
      sideCartRef={sideCartRef}
      cartData={cart.data || []}/>
    </header>
  )
}

export { Navigation };