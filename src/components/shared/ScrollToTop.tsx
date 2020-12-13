import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useHistory, useLocation, useParams } from 'react-router-dom';
import { AppState, defaultPreSelectedFitler, PreSelectedFilters } from 'reducers';

const ScrollToTopComponent: React.FunctionComponent = () => {
  const history = useHistory();
  useEffect(() => {
        /**
     * Removing PreSelectedFilter
     * if route other than 
     * productDetails
     */

    // scrolling to top
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    }
  }, []);

  return (null);
}

const ScrollToTop = withRouter(ScrollToTopComponent);

export {
  ScrollToTop
} 