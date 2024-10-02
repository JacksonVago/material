import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthService } from "../services/auth/AuthService";
import { useNewUserStore } from "../../store/NewUser";
import { Environment } from "../environment";


interface IAuthContextData {
    isAuthenticated: boolean;
    logout: () => void;
    login: (email: string, password?: string, newUser?: boolean) => Promise<string | void>;
    firstAccess: (email: string) => Promise<string | void>;
    updfirstAccess: (json_primAccess: string) => Promise<string | void>;
}

const AuthContext = createContext({} as IAuthContextData);

interface IAuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {

    const [accessToken, setAccessToken] = useState<string>();

    const useNewUser = useNewUserStore();

    useEffect(() => {
        //updEmail('jjjjjj@jj.com');        
        console.log('passou no provider');
        const access_token = localStorage.getItem(Environment.APP_ACCESS_TOKEN);
        console.log(access_token);
        if (access_token) {
            setAccessToken(access_token);
        }
        else {
            console.log('setou indefined');
            setAccessToken(undefined);
        }
    }, []);

    const handleLogin = useCallback(async (email: string, password?: string, newUser?: boolean) => {
        console.log('callback handleLogin inicio');
        if (!newUser) {
            useNewUser.updNewUser(false);
            const result = await AuthService.auth(email, password!);
            console.log('callback handleLogin', result)
            if (result instanceof Error) {
                return result.message;
            }
            else {
                console.log('Token: ', result.token.access_token);
                localStorage.setItem(Environment.APP_ACCESS_TOKEN, result.token.access_token);
                localStorage.setItem(Environment.APP_USER_LOGIN, email);
                localStorage.setItem(Environment.APP_USER_PWD, password!);
                localStorage.setItem(Environment.APP_USER_ID, result.user.id.toString());
                localStorage.setItem(Environment.APP_EMP_ID, result.user.id_empresa.toString());
                localStorage.setItem(Environment.APP_USER_TIPO, result.user.int_tipo.toString());
                setAccessToken(result.token.access_token)
            }
            return JSON.stringify(result);
        }
        else {
            useNewUser.updNewUser(true);
            const resultNew = await AuthService.newUserAuth(email, password!);
            console.log('callback handleLogin new user', resultNew)
            if (resultNew instanceof Error) {
                return resultNew.message;
            }
            else {
                console.log('newUser Token: ', resultNew.token.access_token);
                localStorage.setItem(Environment.APP_ACCESS_TOKEN, resultNew.token.access_token);
                localStorage.setItem(Environment.APP_USER_LOGIN, email);
                localStorage.setItem(Environment.APP_USER_PWD, password!);
                localStorage.setItem(Environment.APP_USER_ID, resultNew.user.id.toString());
                localStorage.setItem(Environment.APP_EMP_ID, resultNew.user.id_empresa.toString());
                localStorage.setItem(Environment.APP_USER_TIPO, resultNew.user.int_tipo.toString());
                useNewUser.updEmail(email);
                useNewUser.updPwd(password!);
                //window.location.href = "http://localhost:3000/empresas/detalhe/0";
                setAccessToken(resultNew.token.access_token)
            }
            return JSON.stringify(resultNew);

        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem(Environment.APP_ACCESS_TOKEN);
        localStorage.removeItem(Environment.APP_USER_LOGIN);
        localStorage.removeItem(Environment.APP_USER_PWD);
        localStorage.removeItem(Environment.APP_USER_ID);
        localStorage.removeItem(Environment.APP_EMP_ID);
        localStorage.removeItem(Environment.APP_USER_TIPO);
        setAccessToken(undefined);
    }, []);

    const handleFirstAccess = useCallback(async (email: string) => {
        const resultFirst = await AuthService.firstAccess(email);
        if (resultFirst instanceof Error) {
            return resultFirst.message;
        }
        else {
            useNewUser.updEmail(email);
            return JSON.stringify(resultFirst);
        }
    }, []);

    const handleUpdFirstAccess = useCallback(async (json_primAccess: string) => {
        const resultFirst = await AuthService.updFirstAccess(json_primAccess);
        if (resultFirst instanceof Error) {
            return resultFirst.message;
        }
        else {
            return JSON.stringify(resultFirst);
        }
    }, []);

    //const isAuthenticated = useMemo(()=> accessToken !== undefined,[accessToken]);
    const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            login: handleLogin, 
            logout: handleLogout, 
            firstAccess: handleFirstAccess,
            updfirstAccess: handleUpdFirstAccess }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);