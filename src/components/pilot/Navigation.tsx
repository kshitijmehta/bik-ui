import React from 'react';

const Navigation: React.FunctionComponent = () => {
    return (
        <header>
        <div className="uk-navbar-container tm-navbar-container" uk-sticky="cls-active: tm-navbar-container-fixed">
            <div className="uk-container" uk-navbar="true">
                <div className="uk-navbar-left">
                    <button className="uk-navbar-toggle uk-hidden@m" uk-toggle="target: #nav-offcanvas" uk-navbar-toggle-icon="true"></button>
                    <a className="uk-navbar-item uk-logo" href="index.html"><img src="/logo.png"  alt="Logo" /></a>
                    <nav className="uk-visible@m">
                        <ul className="uk-navbar-nav">
                            <li>
                                <a href="bindi-category.html">Bindi<span className="uk-margin-xsmall-left" uk-icon="icon: chevron-down; ratio: .75;"></span></a>
                                <div
                                    className="uk-navbar-dropdown uk-margin-remove uk-padding-remove-vertical"
                                    uk-drop="pos: bottom-justify;delay-show: 125;delay-hide: 50;duration: 75;boundary: .tm-navbar-container;boundary-align: true;pos: bottom-justify;flip: x"
                                >
                                    <div className="uk-container uk-container-small uk-margin-top uk-margin-bottom">
                                        <ul className="uk-nav uk-nav-default uk-column-1-3">
                                            <li><a href="bindi-category.html">Fancy</a></li>
                                            <li><a href="bindi-category.html">Bridal</a></li>
                                            <li><a href="bindi-category.html">Stone</a></li>
                                            <li><a href="bindi-category.html">Round</a></li>
                                            <li><a href="bindi-category.html">Square</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <a href="footwear-category.html">Footwear<span className="uk-margin-xsmall-left" uk-icon="icon: chevron-down; ratio: .75;"></span></a>
                                <div
                                    className="uk-navbar-dropdown uk-margin-remove uk-padding-remove-vertical"
                                    uk-drop="pos: bottom-justify;delay-show: 125;delay-hide: 50;duration: 75;boundary: .tm-navbar-container;boundary-align: true;pos: bottom-justify;flip: x"
                                >
                                    <div className="uk-container uk-container-small uk-margin-top uk-margin-bottom">
                                        <ul className="uk-nav uk-nav-default uk-column-1-3">
                                            <li><a href="footwear-category.html">Heel</a></li>
                                            <li><a href="footwear-category.html">Flat</a></li>
                                            <li><a href="footwear-category.html">Heeled Sandal</a></li>
                                            <li><a href="footwear-category.html">Flat Sandal</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <a href="home-decor-category.html">Home Decor<span className="uk-margin-xsmall-left" uk-icon="icon: chevron-down; ratio: .75;"></span></a>
                                <div
                                    className="uk-navbar-dropdown uk-margin-remove uk-padding-remove-vertical"
                                    uk-drop="pos: bottom-justify;delay-show: 125;delay-hide: 50;duration: 75;boundary: .tm-navbar-container;boundary-align: true;pos: bottom-justify;flip: x"
                                >
                                    <div className="uk-container uk-container-small uk-margin-top uk-margin-bottom">
                                        <ul className="uk-nav uk-nav-default uk-column-1-3">
                                            <li><a href="home-decor-category.html">Photo Frames</a></li>
                                            <li><a href="home-decor-category.html">Makeup Box</a></li>
                                            <li><a href="home-decor-category.html">Storage Box</a></li>
                                            <li><a href="home-decor-category.html">Laptop Stand</a></li>
                                            <li><a href="home-decor-category.html">Coaster Set</a></li>
                                            <li><a href="home-decor-category.html">Tissue Box</a></li>
                                            <li><a href="home-decor-category.html">Bottle Holder</a></li>
                                            <li><a href="home-decor-category.html">Serving Tray</a></li>
                                            <li><a href="home-decor-category.html">Spoon Holder</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <a href="#">Handicraft<span className="uk-margin-xsmall-left" uk-icon="icon: chevron-down; ratio: .75;"></span></a>
                                <div
                                    className="uk-navbar-dropdown uk-margin-remove uk-padding-remove-vertical"
                                    uk-drop="pos: bottom-justify;delay-show: 125;delay-hide: 50;duration: 75;boundary: .tm-navbar-container;boundary-align: true;pos: bottom-justify;flip: x"
                                >
                                    <div className="uk-container uk-container-small uk-margin-top uk-margin-bottom">
                                        <ul className="uk-nav uk-nav-default uk-column-1-3">
                                            <li><a href="#">Handicraft One</a></li>
                                            <li><a href="#">Handicraft Two</a></li>
                                            <li><a href="#">Handicraft Three</a></li>
                                            <li><a href="#">Handicraft Four</a></li>
                                            <li><a href="#">Handicraft Five</a></li>
                                            <li><a href="#">Handicraft Six</a></li>
                                            <li><a href="#">Handicraft Seven</a></li>
                                            <li><a href="#">Handicraft Eight</a></li>
                                            <li><a href="#">Handicraft Nine</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li><a href="about.html">About</a></li>
                            <li><a href="contacts.html">Contacts</a></li>
                        </ul>
                    </nav>
                </div>
                <div className="uk-navbar-right">
                    <a className="uk-navbar-toggle tm-navbar-button" href="#" uk-search-icon="true"></a>
                    <div className="uk-navbar-dropdown uk-padding-small uk-margin-remove" uk-drop="mode: click;cls-drop: uk-navbar-dropdown;boundary: .tm-navbar-container;boundary-align: true;pos: bottom-justify;flip: x">
                        <div className="uk-container">
                            <div className="uk-grid-small uk-flex-middle" uk-grid="true">
                                <div className="uk-width-expand">
                                    <form className="uk-search uk-search-navbar uk-width-1-1"><input className="uk-search-input" type="search" placeholder="Search…"  /></form>
                                </div>
                                <div className="uk-width-auto"><a className="uk-navbar-dropdown-close" href="#" uk-close="true"></a></div>
                            </div>
                        </div>
                    </div>
                    <a className="uk-navbar-item uk-link-muted tm-navbar-button" href="account.html" uk-icon="user"></a>
                    <div className="uk-padding-small uk-margin-remove" uk-dropdown="pos: bottom-right; offset: -10; delay-hide: 200;" style={{minWidth: '150px'}}>
                        <ul className="uk-nav uk-dropdown-nav">
                            <li>
                                <a href="account.html">Orders <span>(2)</span></a>
                            </li>
                            <li><a href="personal.html">Personal</a></li>
                            <li><a href="settings.html">Settings</a></li>
                            <li className="uk-nav-divider"></li>
                            <li><a href="#">Log out</a></li>
                        </ul>
                    </div>
                    <a className="uk-navbar-item uk-link-muted tm-navbar-button"   href="#" uk-toggle="target: #cart-offcanvas"><span uk-icon="cart"></span><span className="uk-badge">2</span></a>
                </div>
            </div>
        </div>
    </header>
    )
}

export { Navigation };