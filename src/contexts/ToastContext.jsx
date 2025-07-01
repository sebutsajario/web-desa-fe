import { useState } from "react";
import { createContext } from "react";

const ToastContext = createContext();

const ToastContextProvider = (props) => {
    const {children} = props;
    const [isShow, setIsShow] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [status, setStatus] = useState(null);

    const showToast = (message, status) => {
        if(!message) {
            return;
        }
        setIsShow(true);
        setToastMessage(message);
        setStatus(status);
        const timeout = setTimeout(() => {
            setToastMessage('');
            setIsShow(false);
            setStatus(null);
        }, 5000);
        return () => clearTimeout(timeout);
    }
    return(
        <ToastContext.Provider value={{showToast, isShow, toastMessage, status}}>{children}</ToastContext.Provider>
    );
};

export const Toast = ToastContext;
export default ToastContextProvider;