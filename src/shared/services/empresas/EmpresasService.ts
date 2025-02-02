import { useGlobalParams } from "../../../store/GlobalParams";
import { Environment } from "../../environment";
import { Api } from "../api/axios-config"

export interface Empresa {
    id:number;
    int_cgccpf:number;
    str_nome:string;
    str_fantasia:string;
    str_email:string;
    int_telefone:number;
    int_local_atend:number;
    int_id_user_adm:number;
    dtm_inclusao:Date;
    int_situacao:number;
    int_sitpag:number;
    dtm_ultpag:Date;
    id_user_man:number;
}

const getAll = async (id_empresa:number, pagina:number, qtdregs:number, totpags:number, filter:string): Promise<Empresa[] | Error>  => {
    
    try {
        let str_json = "";
        let filtros = "";

        filtros = "{ \"nome\":\"id\", \"valor\":\"" + id_empresa.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"cgccpf\", \"valor\":\"0\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"situacao\", \"valor\":\"0\", \"tipo\":\"Int16\"}," +
            "{ \"nome\":\"pagina\", \"valor\":\""+ pagina.toString() + "\", \"tipo\":\"Int16\"}, " +
            "{ \"nome\":\"qtdregs\", \"valor\":\""+ qtdregs.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"totpags\", \"valor\":\"" + totpags.toString() + "\", \"tipo\":\"Int64\"}";


        str_json = "{";
        str_json += "\"generico\":\"S\",";
        str_json += "\"dllnome\":\"\",";
        str_json += "\"classe\":\"\",";
        str_json += "\"metodo\":\"\",";
        str_json += "\"procedure\":\"ntv_p_sel_empresa\",";
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
        //console.log(data);
        if (data) {
            //let usuario:Usuario[] = JSON.parse(data);
            let empresa:Empresa[] = data;
            return empresa;
        }

        return new Error("Não existem registros para essa consulta.");
    }
    catch (error) {
        console.log('PessoaService: erro');
        console.log(error);
        return new Error((error as {message:string}).message || "Erro na consulta.");
    }
}

const getById = async (id_empresa:number): Promise<Empresa[] | Error> => {
    try {
        let str_json = "";
        let filtros = "";

        filtros = "{ \"nome\":\"id\", \"valor\":\"" + id_empresa.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"cgccpf\", \"valor\":\"0\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"situacao\", \"valor\":\"0\", \"tipo\":\"Int16\"}," +
            "{ \"nome\":\"pagina\", \"valor\":\"\", \"tipo\":\"Int16\"}, " +
            "{ \"nome\":\"qtdregs\", \"valor\":\"\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"totpags\", \"valor\":\"\", \"tipo\":\"Int64\"}";

        str_json = "{";
        str_json += "\"generico\":\"S\",";
        str_json += "\"dllnome\":\"\",";
        str_json += "\"classe\":\"\",";
        str_json += "\"metodo\":\"\",";
        str_json += "\"procedure\":\"ntv_p_sel_empresa\",";
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
            let empresa:Empresa[] = data;
            console.log('empresa ', empresa);
            return empresa;
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
const maintenece = async (dados:string, operacao:string, dadosUser?:string ): Promise<any> => {
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
        str_json += "\"classe\":\"Repositories.EmpresaRepository\",";
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
                if (data.result.indexOf("Error") > -1){
                    return new Error('Erro: ' + data.result);    
                }
                return data;
                        
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

export const EmpresaService = {
    getAll,
    getById,
    maintenece,
    update,
    updateById,
}