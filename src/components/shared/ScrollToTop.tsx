import React, { useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';

const ScrollToTopComponent: React.FunctionComponent = () => {
  const history = useHistory();
  useEffect(() => {
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