import axios from "axios";
import { Api } from "../api/axios-config";

export interface IAuthService {
    token : {
        access_token: string;
        token_type: string;
        expires_in: number;
    }
    user : {
        id:number;
        id_empresa:number;
        int_tipo:number;
        username:string;
        password:string;
        validade:Date;

    }
}

export interface IUserPrimAcess
{
    id:number;
    id_empresa:number;
    id_emp_serv:number;
    id_user_app:number;
    str_email:string;
    dtm_acesso:Date;
    int_cod_acesso:number;
    dtm_confirma?:Date;
    int_situacao:number;
}


const auth = async (login: string, password: string): Promise<IAuthService | Error> => {
    try {
        let str_json = "";
        str_json = "{ \"username\":\"" + login + "\"," +
            " \"password\":\"" + password + "\"}";
        const {data } = await Api.post('/api/AppPraia/Token',
            str_json,
            {
                headers: { "Content-Type": "application/json;" },
                transformResponse: [function transformResponse(data) {
                    /*eslint no-param-reassign:0*/
                    if (typeof data === 'string') {
                        try {
                            //console.log('Data :', data);
                            data = JSON.parse(data);
                        } catch (e) { /* Ignore */ }
                    }
                    return data;
                }],
            });
        return data;
    } catch (error) {
        let str_erro = "";
        if (axios.isAxiosError(error)) {
            str_erro = 'Erro : ' + error.response?.status + ' - ' + error.response?.data;
        }
        //return new Error((error as {mensagem:string}).mensagem || 'Exception erro ao criar token');
        return new Error(str_erro);
    }
};

const newUserAuth = async (login: string, password: string): Promise<IAuthService | Error> => {
    try {
        let int_year = new Date().getFullYear() * -1;
        let str_json = "";
        str_json = "{ \"id\":\"" + int_year.toString() + "\"," +
                    " \"username\":\"" + login + "\"," +
                    " \"password\":\"" + password + "\"," +
                    " \"validade\":\"\"}";
        const {data } = await Api.post('/api/AppPraia/Token/newUserCreaterToken',
            str_json,
            {
                headers: { "Content-Type": "application/json;" },
                transformResponse: [function transformResponse(data) {
                    /*eslint no-param-reassign:0*/
                    if (typeof data === 'string') {
                        try {
                            //console.log('Data :', data);
                            data = JSON.parse(data);
                        } catch (e) { /* Ignore */ }
                    }
                    return data;
                }],
            });
        return data;
    } catch (error) {
        let str_erro = "";
        if (axios.isAxiosError(error)) {
            str_erro = 'Erro : ' + error.response?.status + ' - ' + error.response?.data;
        }
        //return new Error((error as {mensagem:string}).mensagem || 'Exception erro ao criar token');
        return new Error(str_erro);
    }
};

const firstAccess = async (email: string): Promise<IUserPrimAcess[] | Error> => {
    try {
        const {data } = await Api.get('/api/AppPraia/Token/v1/FirstAcess/' + email,
            {
                headers: { "Content-Type": "application/json;" },
                transformResponse: [function transformResponse(data) {
                    /*eslint no-param-reassign:0*/
                    if (typeof data === 'string') {
                        try {
                            //console.log('Data :', data);
                            data = JSON.parse(data);
                        } catch (e) { /* Ignore */ }
                    }
                    return data;
                }],
            });
        return data;
    } catch (error) {
        let str_erro = "";
        if (axios.isAxiosError(error)) {
            str_erro = 'Erro : ' + error.response?.status + ' - ' + error.response?.data;
        }
        //return new Error((error as {mensagem:string}).mensagem || 'Exception erro ao criar token');
        return new Error(str_erro);
    }
};

const updFirstAccess = async (jsonPrimAcess: string): Promise<IUserPrimAcess[] | Error> => {
    try {
        const {data } = await Api.post('/api/AppPraia/Token/v1/UpdPrimAcess/',
            jsonPrimAcess,
            {
                headers: { "Content-Type": "application/json;" },
                transformResponse: [function transformResponse(data) {
                    /*eslint no-param-reassign:0*/
                    if (typeof data === 'string') {
                        try {
                            //console.log('Data :', data);
                            data = JSON.parse(data);
                        } catch (e) { /* Ignore */ }
                    }
                    return data;
                }],
            });
        return data;
    } catch (error) {
        let str_erro = "";
        if (axios.isAxiosError(error)) {
            str_erro = 'Erro : ' + error.response?.status + ' - ' + error.response?.data;
        }
        //return new Error((error as {mensagem:string}).mensagem || 'Exception erro ao criar token');
        return new Error(str_erro);
    }
};

export const AuthService = {
    auth,
    newUserAuth,
    firstAccess,
    updFirstAccess,
};
