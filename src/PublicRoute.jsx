import React, { Suspense, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Loading } from './contexts/LoadingContext';
import LoadingLayout from './assets/layouts/LoadingLayout';
import ScrollToTop from './assets/utilities/ScrollToTop';

const PublicRoute = () => {
  const { isPageLoading } = useContext(Loading);

  return (
    <Suspense fallback={<LoadingLayout />}>
      {isPageLoading && <LoadingLayout />}
      {/* Apply scroll only to public pages */}
      <ScrollToTop>
        <Outlet />
      </ScrollToTop>
    </Suspense>
  );
};

export default PublicRoute;
