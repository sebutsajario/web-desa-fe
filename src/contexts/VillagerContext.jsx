import { createContext, useState } from "react";

const VillagerContext = createContext();

const VillagerContextProvider = (props) => {
    const {children} = props;
    const [villager, setVillager] = useState(null);

    return (
        <VillagerContext.Provider value={{setVillager, villager}}>{children}</VillagerContext.Provider>
    )
}

export const Villager = VillagerContext;
export default VillagerContextProvider;