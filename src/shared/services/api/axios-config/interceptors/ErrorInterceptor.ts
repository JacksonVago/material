import { AxiosError } from "axios";

//Identifica os erros e faz tratamento
export const errorInterceptor = (error: AxiosError) =>{

    if (error.message === 'Netework error'){
        Promise.reject(new Error('Erro de conexão.'))
    }

    if (error.response?.status === 401){
        localStorage.removeItem('APP_ACCESS_TOKEN');
        window.location.href = '/dashborard';
        return;        
    }

    
    return Promise.reject(error);
}