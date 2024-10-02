import { createContext, useCallback, useContext, useState } from "react";


interface IDrawerOptions{
    path:string;
    icon:string;
    label:string;
}

interface IDrawerContextData {
    isDrawerOpen: boolean;
    drawerOptions: IDrawerOptions[];
    toggleDrawerOpen: () => void;
    setDrawerOptions: (newDrawerOptions:IDrawerOptions[]) => void;
}


const DrawerContext = createContext({} as IDrawerContextData);

interface IAppDrawerProviderProps {
    children: React.ReactNode
}

export const useDrawerContext = () => {
    return useContext(DrawerContext);
}
export const DrawerProvider: React.FC<IAppDrawerProviderProps> = ({children}) => {
    const [drawerOptions, setDrawerOptions] = useState<IDrawerOptions[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawerOpen = useCallback(() =>{
        setIsDrawerOpen(oldDrawerOpen => !oldDrawerOpen);
    }, []);

    const handleSetDrawerOptions = useCallback((newDrawerOptions:IDrawerOptions[]) =>{
        setDrawerOptions(newDrawerOptions);
    }, []);


    return(
        <DrawerContext.Provider value={{isDrawerOpen, drawerOptions, toggleDrawerOpen, setDrawerOptions:handleSetDrawerOptions }}>
                {children}
        </DrawerContext.Provider>
        
    )
}