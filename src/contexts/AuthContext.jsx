import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const {children} = props;
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;

    const getUser = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${apiUrl}/v1/auth/login`, {withCredentials: true})
        const data = res.data;
        const loggedInUser = {id: data.id, userName: data.userName, name: data.name, role: data.role}
          setUser(loggedInUser);
        return loggedInUser;
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      };
    };
    
    const logout = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${apiUrl}/v1/auth/logout`, {withCredentials: true});
        if(res) {
          setUser(null);
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
       
    };

    const login = async (userName, password) => {
        if(!userName || !password) {
          return;
        };
        const form = new FormData();
        form.append('userName', userName);
        form.append('password', password);
        try {
            setIsLoading(true)
            const res = await axios.post(`${apiUrl}/v1/auth/login`, form, {withCredentials: true});
            const data = res.data;
            const loggedInUser = {id: data.id, userName: data.userName, name: data.name, role: data.role}
            setUser(loggedInUser);
            return loggedInUser;
        } catch (err) {
          console.log(err)
          setErrorMessage(err.response.data.message);
          setTimeout(() => setErrorMessage(''), 5000)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{user, setUser, getUser, errorMessage, setErrorMessage, logout, login, isLoading, setIsLoading}}>{children}</AuthContext.Provider>
    )
};

export const Auth = AuthContext;
export default AuthContextProvider;