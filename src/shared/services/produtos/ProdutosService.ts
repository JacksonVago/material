import { useGlobalParams } from "../../../store/GlobalParams";
import { Environment } from "../../environment";
import { Api } from "../api/axios-config"

export interface IProdutosAddCombo {
    id_produto: number;
    str_descricao: string;
    str_obs: string;
    dbl_preco: number;
    str_foto: string;
    int_qtd_comp: number;
}

export interface Produto {
    id: number;
    id_empresa: number;
    id_grupo: number;
    str_descricao: string;
    str_obs: number;
    int_qtd_estmin: number;
    int_qtd_combo: number;
    dbl_val_comp: number;
    dbl_val_unit: number;
    dbl_val_desc: number;
    dbl_perc_desc: number;
    dbl_val_combo: number;
    str_foto: string;
    int_tipo: number; // 1 - Normal / 2 - Combo / 3 - Transformado / 4 - Produtos de uso e consumo
    int_unid_med: number; // Unidade de medida 1 - Unidade / 2 - Kilograma / 3 - Litro 
    str_venda: string; //Permite venda
    str_estoque: string; //Controla estoque
    str_nec_prep: string; //Necessita preparo sim ou não (para direcionar o pedido para a preparação
    int_qtd_adic: number; // Quantidade de propdutos que podem ser adicionados
    dtm_inclusao: Date;
    dtm_alteracao: Date;
    int_situacao: number;
    id_app: number;
    id_user_man: number;
}

const getAll = async (id_empresa: number, pagina: number, qtdregs: number, totpags: number, filter: string): Promise<Produto[] | Error> => {

    try {
        let str_json = "";
        let filtros = "";

        filtros = "{ \"nome\":\"id\", \"valor\":\"0\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"id_empresa\", \"valor\":\"" + id_empresa.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"situacao\", \"valor\":\"0\", \"tipo\":\"Int16\"}," +
            "{ \"nome\":\"pagina\", \"valor\":\"" + pagina.toString() + "\", \"tipo\":\"Int16\"}, " +
            "{ \"nome\":\"qtdregs\", \"valor\":\"" + qtdregs.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"totpags\", \"valor\":\"" + totpags.toString() + "\", \"tipo\":\"Int64\"}";


        str_json = "{";
        str_json += "\"generico\":\"S\",";
        str_json += "\"dllnome\":\"\",";
        str_json += "\"classe\":\"\",";
        str_json += "\"metodo\":\"\",";
        str_json += "\"procedure\":\"ntv_p_sel_produto\",";
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
            let produto: Produto[] = data;
            return produto;
        }

        return new Error("Não existem registros para essa consulta.");
    }
    catch (error) {
        console.log('PessoaService: erro');
        console.log(error);
        return new Error((error as { message: string }).message || "Erro na consulta.");
    }
}

const getById = async (id_empresa: number, id: number): Promise<Produto[] | Error> => {
    try {
        let str_json = "";
        let filtros = "";

        filtros = "{ \"nome\":\"id\", \"valor\":\"" + id.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"id_empresa\", \"valor\":\"" + id_empresa.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"situacao\", \"valor\":\"0\", \"tipo\":\"Int16\"}," +
            "{ \"nome\":\"pagina\", \"valor\":\"\", \"tipo\":\"Int16\"}, " +
            "{ \"nome\":\"qtdregs\", \"valor\":\"\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"totpags\", \"valor\":\"\", \"tipo\":\"Int64\"}";

        str_json = "{";
        str_json += "\"generico\":\"S\",";
        str_json += "\"dllnome\":\"\",";
        str_json += "\"classe\":\"\",";
        str_json += "\"metodo\":\"\",";
        str_json += "\"procedure\":\"ntv_p_sel_produto\",";
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
            let produto: Produto[] = data;
            console.log('produto ', produto);
            return produto;
        }

        return new Error("Não existem registros para essa consulta.");
    }
    catch (error) {
        console.log('erro');
        console.log(error);
        return new Error((error as { message: string }).message || "Erro na consulta.");
    }

}


//Consulta lista de produtos para cadastro de combo e produtos transformados
const getListaProduto = async (id: number, 
                               id_empresa: number, 
                               int_tipo:number,
                               str_unid_med:string,
                               str_venda:string,
                               situacao:number,
                               pagina: number, 
                               qtdregs: number, 
                               totpags: number): Promise<IProdutosAddCombo[] | Error> => {

    try {
        let str_json = "";
        let filtros = "";

        filtros = "{ \"nome\":\"id\", \"valor\":\"" + id.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"id_empresa\", \"valor\":\"" + id_empresa.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"int_tipo\", \"valor\":\"" + int_tipo.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"str_unid_med\", \"valor\":\"" + str_unid_med + "\", \"tipo\":\"String\"}," +
            "{ \"nome\":\"str_venda\", \"valor\":\"" + str_venda + "\", \"tipo\":\"String\"}," +
            "{ \"nome\":\"situacao\", \"valor\":\"" + int_tipo.toString() + "\", \"tipo\":\"Int16\"}," +
            "{ \"nome\":\"pagina\", \"valor\":\"" + pagina.toString() + "\", \"tipo\":\"Int16\"}, " +
            "{ \"nome\":\"qtdregs\", \"valor\":\"" + qtdregs.toString() + "\", \"tipo\":\"Int64\"}," +
            "{ \"nome\":\"totpags\", \"valor\":\"" + totpags.toString() + "\", \"tipo\":\"Int64\"}";


        str_json = "{";
        str_json += "\"generico\":\"S\",";
        str_json += "\"dllnome\":\"\",";
        str_json += "\"classe\":\"\",";
        str_json += "\"metodo\":\"\",";
        str_json += "\"procedure\":\"ntv_p_sel_produto_lista\",";
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
            let produto: IProdutosAddCombo[] = data;
            return produto;
        }

        return new Error("Não existem registros para essa consulta.");
    }
    catch (error) {
        console.log('PessoaService: erro');
        console.log(error);
        return new Error((error as { message: string }).message || "Erro na consulta.");
    }
}

//Manutenção das tabelas 
const maintenece = async (dados: string, operacao: string, dadosUser?: string): Promise<any> => {
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
        str_json += "\"classe\":\"Repositories.ProdutoRepository\",";
        str_json += "\"metodo\":\"GravarDados\",";
        str_json += "\"operacao\":\"" + operacao + "\",";
        str_json += "\"dados\":\"";
        str_json += dados.replaceAll("\"", "'");
        str_json += "\"";
        str_json += "}"

        //console.log(str_json);
        //const {data} = await Api.get('/api/AppPraia/Token/v1/ValidUser/jackson@natividadesolucoes.com.br')
        const { data, } = await Api.post('/api/AppPraia/v1/Maintenence', str_json, {
            headers: {
                "Content-Type": "application/json;",
                'Authorization': `Bearer ${localStorage.getItem(Environment.APP_ACCESS_TOKEN)}`,
            },
        })
        //const {data} = await Api.get('/api/AppPraia/Token/v1/ok')
        if (data) {
            try {
                console.log('Verifica valor do retorno');
                console.log(data);
                //let id_ret:number = Number(data.replaceAll(";",""));

                console.log('Retorno');
                console.log(data);
                if (data.result.indexOf("Error") > -1) {
                    return new Error('Erro: ' + data.result);
                }
                return data;

            } catch (error) {
                console.log('Retornou erro');
                return new Error('Erro: ' + data.result);
            }
        }
        else {
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

export const ProdutosService = {
    getAll,
    getById,
    maintenece,
    update,
    updateById,
    getListaProduto,
}