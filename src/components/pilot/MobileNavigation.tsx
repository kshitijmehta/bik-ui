import { SubCategories } from 'appConstants';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { AppState, SubCategory } from 'reducers';
import { filterSubcategories } from 'services';
import { ProductSubCategory } from 'types';

const MobileNavigation: React.FunctionComponent = () => {

  const history = useHistory();
  const subCategories = useSelector<AppState, SubCategory>(state => state.subCategory);
  const navigateTo = (event: React.SyntheticEvent, categoryPath: string, subcategoryPath?: string) => {
    event.preventDefault();
    history.push('/product/' + categoryPath.toLowerCase() + (subcategoryPath ? '/' + subcategoryPath.toLowerCase() : ''));
  }

  const getCategoryAndSubCategory = () => {
    return Object.keys(SubCategories).map((key: string, index: number) => {
      return (
        <li className="uk-parent" key={index}>
          <a onClick={(e) => e.preventDefault()}>{key}</a>
          <ul className="uk-nav-sub uk-list-divider">
            {
              filterSubcategories(subCategories, Number(SubCategories[key])).map((subcategory: ProductSubCategory, index: number) => {
                return <li key={index}><a onClick={(e) => navigateTo(e, key, subcategory.code)}>{subcategory.code}</a></li>
              })
            }
            <li className="uk-text-center">
                    <a onClick={(e) => navigateTo(e, key)} className="uk-link-muted uk-text-uppercase tm-link-to-all"><span>entire ranage</span><span uk-icon="icon: chevron-right; ratio: .75;"></span></a>
                  </li>
          </ul>
        </li>
      )
    });
  }

  return (
    <div id="nav-offcanvas" uk-offcanvas="overlay: true">
      <aside className="uk-offcanvas-bar uk-padding-remove">
        <div className="uk-card uk-card-default uk-card-small tm-shadow-remove">
          <header className="uk-card-header uk-flex uk-flex-middle">
            <div>
              <a className="uk-link-muted uk-text-bold" onClick={(e) => e.preventDefault()}>Basic Kart</a>
              {/* <div className="uk-text-xsmall uk-text-muted" style={{ marginTop: "-2px" }}>
                <div>Basic Kart</div>
              </div> */}
            </div>
          </header>
          <nav className="uk-card-small uk-card-body">
            <ul className="uk-nav-default uk-nav-parent-icon uk-list-divider" uk-nav="true">
              {/* <li className="uk-parent">
                <a href="#">Bindi</a>
                <ul className="uk-nav-sub uk-list-divider">
                  <li><a href="bindi-category.html">Fancy</a></li>
                  <li><a href="bindi-category.html">Bridal</a></li>
                  <li><a href="bindi-category.html">Stone</a></li>
                  <li><a href="bindi-category.html">Round</a></li>
                  <li><a href="bindi-category.html">Square</a></li>
                  <li className="uk-text-center">
                    <a className="uk-link-muted uk-text-uppercase tm-link-to-all" href="bindi-category.html"><span>entire ranage</span><span uk-icon="icon: chevron-right; ratio: .75;"></span></a>
                  </li>
                </ul>
              </li> */}
              {getCategoryAndSubCategory()}
              <li><a href="#">About</a></li>
              <li><a onClick={()=> history.push('/contactus')}>Contact</a></li>
            </ul>
          </nav>
          <nav className="uk-card-body">
            <ul className="uk-iconnav uk-flex-center">
              <li><a href="#" title="Facebook" uk-icon="facebook"></a></li>
              <li><a href="#" title="Twitter" uk-icon="twitter"></a></li>
              <li><a href="#" title="YouTube" uk-icon="youtube"></a></li>
              <li><a href="#" title="Instagram" uk-icon="instagram"></a></li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  )
}

export {
  MobileNavigation
}