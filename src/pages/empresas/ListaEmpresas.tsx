import React, { useEffect, useMemo, useState } from "react";
import { Box, Card, CardActions, CardContent, CardHeader, CardMedia, Grid, Icon, IconButton, LinearProgress, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Theme, Typography, useMediaQuery } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import { UsuariosService, Usuario } from "../../shared/services/usuarios/UsuariosService";
import { FerramentasListagem } from "../../shared/components";
import { LayoutBasePage } from "../../shared/layouts";
import { useDebounce } from "../../shared/hooks";
import { Environment } from "../../shared/environment";
import { Empresa, EmpresaService } from "../../shared/services/empresas/EmpresasService";
import { useGlobalParams } from "../../store/GlobalParams";

export const ListaEmpresas: React.FC = () => {
    const xsDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    /*Global  params*/
    const glb_params = useGlobalParams();

    const id_emp = parseFloat(localStorage.getItem(Environment.APP_EMP_ID)!);

    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<Empresa[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [pagina, setPagina] = useState(0);

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    const toComponentB = (id: string, reg: Usuario) => {
        navigate(`/empresas/detalhe/${id}`, { state: JSON.stringify(reg) });
    }

    useEffect(() => {

        let id_emp = parseFloat(localStorage.getItem(Environment.APP_EMP_ID)!);
        let id_user = parseFloat(localStorage.getItem(Environment.APP_USER_ID)!);
        if (id_emp > 0 && id_user === 0){
            navigate('/empresas/detalhe/' + id_emp.toString());
        }

        setIsLoading(true);

        debounce(() => {
            EmpresaService.getAll(id_emp, pagina, Environment.LIMITE_DE_LINHAS, totalCount, busca)
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

                            EmpresaService.getAll(id_emp, 1, Environment.LIMITE_DE_LINHAS, 1, busca)
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
        })

    }, [busca, pagina]);

    const handleDelete = (id: number) => {
        if (window.confirm("Deseja excluir o registro ?")) {
            let row = rows.filter(row => row.id === id);

            //console.log(JSON.stringify(row));

            EmpresaService.maintenece(JSON.stringify(row), "D")
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
        <LayoutBasePage titulo="Empresas"
            barraFeramentas={
                <FerramentasListagem
                    textoBtAdd=""
                    mostraBtAdd={glb_params.superUser}
                    mostraInputBusca={glb_params.superUser}
                    textoBusca={busca}
                    changeTextBusca={(texto) => {
                        setTotalCount(0);
                        setPagina(1);
                        setSearchParams({ busca: texto }, { replace: true });
                    }
                    }
                    onClickBtAdd={() => navigate('/empresas/detalhe/0')}
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
                    <Grid item xl={4} lg={5} md={6} sm={6} xs={12} key={row.id} >
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
                                    image="./avatar_jackson.jpg"
                                    alt="Jackson"
                                />
                                <CardContent>
                                    <Typography gutterBottom
                                        fontFamily='Poppins-semibold'
                                        fontSize={(xsDown ? '1rem' : mdDown ? '1.1rem' : smDown ? '1rem' : '1.3rem')}
                                        component="span">
                                        {row.str_nome}
                                    </Typography>
                                    <Box display='flex' alignItems='center' gap={2}>
                                        <Icon>
                                            person
                                        </Icon>
                                        <Typography 
                                            fontFamily='Poppins-regular'
                                            fontSize={(xsDown ? '1rem' : mdDown ? '1rem' : '1rem')}
                                        sx={{ color: 'text.secondary' }}
                                        component='span'>
                                            {row.str_fantasia}
                                        </Typography>
                                    </Box>
                                    <Box display='flex' alignItems='center' gap={2}>
                                        <Icon>
                                            mailoutline
                                        </Icon>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {row.str_email}
                                        </Typography>
                                    </Box>
                                    <Box display='flex' alignItems='center' gap={2}>
                                        <img src="./whatsapp.png" />

                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {row.int_telefone}
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Box display='flex' flexDirection='row' justifyContent='end' flex={1}>
                                        {glb_params.superUser && (
                                            <IconButton size="small" onClick={() => { handleDelete(row.id) }}>
                                                <Icon>delete</Icon>
                                            </IconButton>)
                                        }
                                        <IconButton size="small" onClick={() => { navigate(`/empresas/detalhe/${row.id}`, { state: JSON.stringify(row) }); }}>
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
