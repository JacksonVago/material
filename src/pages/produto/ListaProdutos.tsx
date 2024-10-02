import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "../../shared/hooks";
import { useEffect, useMemo, useState } from "react";
import { Environment } from "../../shared/environment";
import { LayoutBasePage } from "../../shared/layouts";
import { FerramentasListagem } from "../../shared/components";
import { Box, Card, CardActions, CardContent, CardMedia, Grid, Icon, IconButton, Paper, Typography } from "@mui/material";
import { useGlobalParams } from "../../store/GlobalParams";
import { Produto, ProdutosService } from "../../shared/services/produtos/ProdutosService";

export const ListaProdutos: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<Produto[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [pagina, setPagina] = useState(0);

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    useEffect(() => {
        let id_emp = parseFloat(localStorage.getItem(Environment.APP_EMP_ID)!);
        let id_user = parseFloat(localStorage.getItem(Environment.APP_USER_ID)!);
        if (id_emp > 0 && id_user === 0){
            navigate('/empresas/detalhe/' + id_emp.toString());
        }

        setIsLoading(true);

        debounce(() => {
            ProdutosService.getAll(parseFloat(localStorage.getItem(Environment.APP_EMP_ID)!), pagina, Environment.LIMITE_DE_LINHAS, totalCount, busca)
                //Quando tem promisse e demora podemos utilzar o then para fazer algo após o retorno
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    }
                    else {
                        if (totalCount === 0) {
                            setTotalCount(result.length);


                            //Carregga primeira página
                            setPagina(1);

                            ProdutosService.getAll(parseFloat(localStorage.getItem(Environment.APP_EMP_ID)!), 1, Environment.LIMITE_DE_LINHAS, 1, busca)
                                //Quando tem promisse e demora podemos utilhar o then para fazer algo após o retorno
                                .then((result) => {
                                    setIsLoading(false);
                                    if (result instanceof Error) {
                                        alert(result.message);
                                    }
                                    else {
                                        setRows(result);
                                    }
                                });
                        }
                        else {
                            setRows(result);
                        }
                    }
                });
        });

    }, [busca, pagina]);

    const handleDelete = (id: number) => {
        if (window.confirm("Deseja excluir o registro ?")) {
            let row = rows.filter(row => row.id === id);

            //console.log(JSON.stringify(row));

            ProdutosService.maintenece(JSON.stringify(row), "D")
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    }
                    else {
                        setRows(oldRows => [
                            ...oldRows.filter(oldRow => oldRow.id !== id),
                        ]
                        );
                        alert('Registro excluido com sucesso!');
                    }
                });
        }
    }

    return (
        <LayoutBasePage titulo="Produtos"
            barraFeramentas={
                <FerramentasListagem
                    textoBtAdd=""
                    mostraBtAdd={true}
                    mostraInputBusca={true}
                    textoBusca={busca}
                    changeTextBusca={(texto) => {
                        setTotalCount(0);
                        setPagina(1);
                        setSearchParams({ busca: texto }, { replace: true });
                    }
                    }
                    onClickBtAdd={() => navigate('/produtos/detalhe/0')}
                />
            }>

            <Grid container direction="row" rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} padding={1}>
                {rows.length === 0 && !isLoading && (
                    <Grid item>
                            <Typography gutterBottom variant="h5" component="div">
                                {Environment.LISTAGEM_VAZIA}
                            </Typography>
                    </Grid>
                )
                }
                {rows.map(row => (
                    <Grid item xl={2} lg={3} md={4} sm={6} xs={12}  >
                        <Box component={Paper}>
                            <Card>
                                {/* <CardHeader
                                    avatar={
                                        <Box display='flex' flexDirection='column'>
                                        <Icon>person</Icon>                                    
                                    </Box>
    
                                    }
                                /> */}
                                <CardMedia
                                    component="img"
                                    height="194"
                                    image="./hamburguers.jpg"
                                    alt="Jackson"
                                />
                                <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                        {row.str_descricao}
                                    </Typography>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {row.str_obs}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Box display='flex' flexDirection='row' justifyContent='end' flex={1}>
                                        <IconButton size="small" onClick={() => { handleDelete(row.id) }}>
                                            <Icon>delete</Icon>
                                        </IconButton>
                                        <IconButton size="small" onClick={() => { navigate(`/produtos/detalhe/${row.id}`, { state: JSON.stringify(row) }); }}>
                                            <Icon>edit</Icon>
                                        </IconButton>
                                    </Box>
                                </CardActions>
                            </Card>
                        </Box>
                    </Grid>
                ))}
            </Grid>

        </LayoutBasePage>
    )
}
