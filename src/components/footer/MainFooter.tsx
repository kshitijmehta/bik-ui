import React from 'react';


const MainFooter: React.FunctionComponent = () => {
  return (
    <footer>
      <section className="uk-section uk-section-secondary uk-section-small uk-light">
        <div className="uk-container">
          <div className="uk-grid-medium uk-child-width-1-1 uk-child-width-1-4@m" uk-grid="true">
            <div>
              <a className="uk-logo" href="index.html"><img src="/logo.png" alt="Logo" /></a>
              <p className="uk-text-small"></p>
              <ul className="uk-iconnav">
                <li><a href="#" title="Facebook" uk-icon="facebook"></a></li>
                <li><a href="#" title="Twitter" uk-icon="twitter"></a></li>
                <li><a href="#" title="YouTube" uk-icon="youtube"></a></li>
                <li><a href="#" title="Instagram" uk-icon="instagram"></a></li>
              </ul>
            </div>
            <div>
              <nav className="uk-grid-small uk-child-width-1-2" uk-grid="true">
                <div>
                  <ul className="uk-nav uk-nav-default">
                    <li><a href="bindi-category.html">Bindi</a></li>
                    <li><a href="footwear-category.html">Footwear</a></li>
                    <li><a href="home-decor-category.html">Home Decor</a></li>
                    <li><a href="#">Handicraft</a></li>
                  </ul>
                </div>
                <div>
                  <ul className="uk-nav uk-nav-default">
                    <li><a href="about.html">About</a></li>
                    <li><a href="contacts.html">Contacts</a></li>
                  </ul>
                </div>
              </nav>
            </div>
            <div>
              <ul className="uk-list uk-text-small">
                <li>
                  <a className="uk-link-muted" href="#"><span className="uk-margin-small-right" uk-icon="receiver"></span><span className="tm-pseudo">8 800 799 99 99</span></a>
                </li>
                <li>
                  <a className="uk-link-muted" href="#"><span className="uk-margin-small-right" uk-icon="mail"></span><span className="tm-pseudo">tarunbatra@gmail.com</span></a>
                </li>
                <li>
                  <div className="uk-text-muted"><span className="uk-margin-small-right" uk-icon="location"></span><span>Sadar Bazar, Old Delhi</span></div>
                </li>
                <li>
                  <div className="uk-text-muted"><span className="uk-margin-small-right" uk-icon="clock"></span><span>Daily 10:00–21:00</span></div>
                </li>
              </ul>
            </div>
            <div>
              <div className="uk-margin uk-text-small uk-text-muted">Website by KPWorks</div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}

export {
  MainFooter
};