import { ThemeProvider } from "@emotion/react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DarkTheme, LightTheme } from "../themes";
import { Box } from "@mui/system";


interface IThemeContextData {
    themeName: 'dark' | 'light';
    toggleTheme: () => void;
}


const ThemeContext = createContext({} as IThemeContextData);

interface IAppThemeProviderProps {
    children: React.ReactNode
}

export const useAppThemeContext = () => {
    return useContext(ThemeContext);
}
export const AppThemeProvider: React.FC<IAppThemeProviderProps> = ({children}) => {
    const [themeName, setThemeName] = useState<'dark' | 'light'>('light');

    const toggleTheme = useCallback(() =>{
        setThemeName(oldThemeName => oldThemeName === 'light' ? 'dark' : 'light');
    }, []);
    
    const theme = useMemo(()=>{
        if (themeName === 'light') return LightTheme;
        return DarkTheme;
    }, [themeName]);

    return(
        <ThemeContext.Provider value={{themeName, toggleTheme}}>
            <ThemeProvider theme={theme}>
                <Box width="100vm" height="100vh" bgcolor={theme.palette.background.default}>
                {children}
                </Box>               
            </ThemeProvider>            
        </ThemeContext.Provider>
        
    )
}