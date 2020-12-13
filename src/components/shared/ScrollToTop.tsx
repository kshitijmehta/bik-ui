import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useHistory, useLocation, useParams } from 'react-router-dom';
import { AppState, defaultPreSelectedFitler, PreSelectedFilters } from 'reducers';

const ScrollToTopComponent: React.FunctionComponent = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    // scrolling to top
    const unlisten = history.listen(() => {
      if(window.location.pathname.indexOf('product') === -1){
        dispatch(defaultPreSelectedFitler());
      }
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