import { useState } from "react";
import { createContext } from "react";

const LoadingContext = createContext();

const LoadingContextProvider = (props) => {
    const {children} = props;
    const [isPageLoading, setIsPageLoading] = useState(true);
    return(
        <LoadingContext.Provider value={{isPageLoading, setIsPageLoading}}>{children}</LoadingContext.Provider>
    );
};

export const Loading = LoadingContext;
export default LoadingContextProvider;