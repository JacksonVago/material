import { Environment } from "../../environment";
import { Api } from "../api/axios-config"

export interface Usuario {
    id: number;
    id_empresa: number;
    str_nome: string;
    str_login: string;
    str_senha: string;
    str_email: string;
    int_telefone: number;
    int_tipo: number;
    dtm_inclusao: Date;
    dtm_saida: Date;
    int_situacao: number;
    str_foto: string;
    id_app: number;
    id_user_man: number;
}

const getAll = async (id_empresa:number, pagina:number, qtdregs:number, totpags:number, filter:string): Promise<Usuario[] | Error>  => {
    try {
        let str_json = "";
        let filtros = "";

        filtros = "{ \"nome\":\"id\", \"valor\":\"0\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"id_empresa\", \"valor\":\"" + id_empresa.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"login\", \"valor\":\"" + (filter !== "" ? "%"  + filter + "%" : "") + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"email\", \"valor\":\"" + (filter !== "" ? "%"  + filter + "%" : "") + "\", \"tipo\":\"string\"}," +
            "{ \"nome\":\"situacao\", \"valor\":\"0\", \"tipo\":\"Int16\"}," +
            "{ \"nome\":\"pagina\", \"valor\":\""+ pagina.toString() + "\", \"tipo\":\"Int16\"}, " +
            "{ \"nome\":\"qtdregs\", \"valor\":\""+ qtdregs.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"totpags\", \"valor\":\"" + totpags.toString() + "\", \"tipo\":\"Int64\"}";


        str_json = "{";
        str_json += "\"generico\":\"S\",";
        str_json += "\"dllnome\":\"\",";
        str_json += "\"classe\":\"\",";
        str_json += "\"metodo\":\"\",";
        str_json += "\"procedure\":\"p_sel_usuario\",";
        str_json += "\"parametros\":[";
        str_json += filtros;
        str_json += "]";
        str_json += "}"

        //console.log(str_json);
        //const {data} = await Api.get('/api/AppPraia/Token/v1/ValidUser/jackson@natividadesolucoes.com.br')
        const { data } = await Api.post('/api/AppPraia/v1/ExecutaProcessoGen', 
                                        str_json, 
                                        { 
                                            headers: { 
                                                "Content-Type": "application/json;",
                                                'Authorization': `Bearer ${localStorage.getItem(Environment.APP_ACCESS_TOKEN)}`,
                                            },
                                        
                                            transformResponse: [function transformResponse(data) { 
                                                /*eslint no-param-reassign:0*/ 
                                                if (typeof data === 'string') { 
                                                  try { 
                                                    data = JSON.parse(data); 
                                                  } catch (e) { /* Ignore */ } 
                                                } 
                                                return data; 
                                              }], 
                                        })
        //const {data} = await Api.get('/api/AppPraia/Token/v1/ok')
        console.log(data);
        if (data) {
            //let usuario:Usuario[] = JSON.parse(data);
            let usuario:Usuario[] = data;
            return usuario;
        }

        return new Error("Não existem registros para essa consulta.");
    }
    catch (error) {
        console.log('PessoaService: erro');
        console.log(error);
        return new Error((error as {cause:string}).cause || "Erro na consulta.");
    }
}

const getById = async (id_empresa:number, id:number): Promise<Usuario[] | Error> => {
    try {
        let str_json = "";
        let filtros = "";

        filtros = "{ \"nome\":\"id\", \"valor\":\"" + id.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"id_empresa\", \"valor\":\"" + id_empresa.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"login\", \"valor\":\"0\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"email\", \"valor\":\"\", \"tipo\":\"string\"}," +
            "{ \"nome\":\"situacao\", \"valor\":\"0\", \"tipo\":\"Int16\"}," +
            "{ \"nome\":\"download\", \"valor\":\"0\", \"tipo\":\"Int16\"}, " +
            "{ \"nome\":\"id_app\", \"valor\":\"0\", \"tipo\":\"Int64\"}";

        str_json = "{";
        str_json += "\"generico\":\"S\",";
        str_json += "\"dllnome\":\"\",";
        str_json += "\"classe\":\"\",";
        str_json += "\"metodo\":\"\",";
        str_json += "\"procedure\":\"ntv_p_sel_tbl_usuario\",";
        str_json += "\"parametros\":[";
        str_json += filtros;
        str_json += "]";
        str_json += "}"

        console.log(str_json);
        //const {data} = await Api.get('/api/AppPraia/Token/v1/ValidUser/jackson@natividadesolucoes.com.br')
        const { data } = await Api.post('/api/AppPraia/v1/ExecutaProcessoGen', 
                                        str_json, 
                                        { 
                                            headers: { 
                                                "Content-Type": "application/json;",
                                                'Authorization': `Bearer ${localStorage.getItem(Environment.APP_ACCESS_TOKEN)}`,
                                            },
                                            transformResponse: [function transformResponse(data) { 
                                                /*eslint no-param-reassign:0*/ 
                                                if (typeof data === 'string') { 
                                                  try { 
                                                    data = JSON.parse(data); 
                                                  } catch (e) { /* Ignore */ } 
                                                } 
                                                return data; 
                                              }], 
                                        })
        //const {data} = await Api.get('/api/AppPraia/Token/v1/ok')
        console.log(data);
        if (data) {
            //let usuario:Usuario[] = JSON.parse(data);
            let usuario:Usuario[] = data;
            return usuario;
        }

        return new Error("Não existem registros para essa consulta.");
    }
    catch (error) {
        console.log('erro');
        console.log(error);
        return new Error((error as {message:string}).message || "Erro na consulta.");
    }

}

//Manutenção das tabelas 
const maintenece = async (dados:string, operacao:string ): Promise<any> => {
    try {
        let str_json = "";        

        /*
        let filtros = "";
        filtros = "{ 'id':'1'," +
            " 'id_empresa' :'1'," +
            " 'str_descricao' :'Teste'," +
            " 'dtm_inclusao' :'2024-08-12 20:00:00'," +
            " 'dtm_alteracao' :'2024-08-12 20:00:00'," +
            " 'int_situacao' :'1'," +
            " 'id_app' :'1'," +
            " 'id_user_man' :'1'" +
            "}," +
            "{ 'id':'0'," +
            " 'id_empresa' :'11'," +
            " 'str_descricao' :'Teste 11'," +
            " 'dtm_inclusao' :'2024-08-12 20:00:00'," +
            " 'dtm_alteracao' :'2024-08-12 20:00:00'," +
            " 'int_situacao' :'1'," +
            " 'id_app' :'1'," +
            " 'id_user_man' :'1'" +
            "}";*/

        str_json = "{";
        str_json += "\"classe\":\"Repositories.FormaPagRepository\",";
        str_json += "\"metodo\":\"GravarDados\",";
        str_json += "\"operacao\":\""+ operacao + "\",";
        str_json += "\"dados\":\"";
        str_json += dados.replaceAll("\"", "'");
        str_json += "\"";
        str_json += "}"

        //console.log(str_json);
        //const {data} = await Api.get('/api/AppPraia/Token/v1/ValidUser/jackson@natividadesolucoes.com.br')
        const { data,  } = await Api.post('/api/AppPraia/v1/Maintenence', str_json, { 
            headers: { 
                "Content-Type": "application/json;",
                'Authorization': `Bearer ${localStorage.getItem(Environment.APP_ACCESS_TOKEN)}`,
            },
})
        //const {data} = await Api.get('/api/AppPraia/Token/v1/ok')
        if (data){
            try {
                console.log('Verifica valor do retorno');
                console.log(data);
                //let id_ret:number = Number(data.replaceAll(";",""));

                console.log('Retorno');
                console.log(data);
                        
            } catch (error) {
                console.log('Retornou erro');
                return new Error('Erro: ' + data.result);    
            }
        }
        else{
            return new Error("Erro na execução.");
        }
    }
    catch (error) {
        console.log('erro');
        console.log(error);
        return new Error(error?.toString());
    }

}

const update = async (): Promise<any> => {

}

const updateById = async (): Promise<any> => {

}

export const FormaPagtoService = {
    getAll,
    getById,
    maintenece,
    update,
    updateById,
}