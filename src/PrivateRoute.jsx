import React, { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { Auth } from './contexts/AuthContext';
import LoadingLayout from './assets/layouts/LoadingLayout';

const PrivateRoute = () => {
    const {getUser, isLoading, user} = useContext(Auth);
    const [isAuth, setIsAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchUser = async()=> {
        const isLoggedIn = await getUser();
        if(isLoggedIn) {
          setIsAuth(true);
        } else {
          navigate('/login')
        }
      };
      fetchUser();
    }, []);

    if(isLoading) return <LoadingLayout />;

    return isAuth && <Outlet />
}

export default PrivateRoute