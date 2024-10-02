import React, { useEffect, useMemo, useState } from "react";
import { Icon, IconButton, LinearProgress, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Theme, useMediaQuery } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import { UsuariosService, Usuario } from "../../shared/services/usuarios/UsuariosService";
import { FerramentasListagem } from "../../shared/components";
import { LayoutBasePage } from "../../shared/layouts";
import { useDebounce } from "../../shared/hooks";
import { Environment } from "../../shared/environment";

export const ListagemUsuarios_old: React.FC = () => {

    const id_emp = parseFloat(localStorage.getItem(Environment.APP_EMP_ID)!);
    const xsDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
    const xlDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('xl'));

    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();
    const navigate = useNavigate();

    const [rows, setRows] = useState<Usuario[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [pagina, setPagina] = useState(0);

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';
    }, [searchParams]);

    const toComponentB = (id: string, reg: Usuario) => {
        navigate(`/usuarios/detalhe/${id}`, { state: JSON.stringify(reg) });
    }

    console.log('idemp:', id_emp);
    alert('Entrou na lista gemc');
    useEffect(() => {
        setIsLoading(true);

        debounce(() => {
            UsuariosService.getAll(parseFloat(localStorage.getItem(Environment.APP_EMP_ID)!), pagina, Environment.LIMITE_DE_LINHAS, totalCount, busca)
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

                            UsuariosService.getAll(parseFloat(localStorage.getItem(Environment.APP_EMP_ID)!), 1, Environment.LIMITE_DE_LINHAS, 1, busca)
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

            UsuariosService.maintenece(JSON.stringify(row), "D")
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
        <LayoutBasePage titulo="Listagem de Usuários"
            barraFeramentas={
                <FerramentasListagem
                    textoBtAdd="Novo"
                    mostraBtAdd={true}
                    mostraInputBusca={true}
                    textoBusca={busca}
                    changeTextBusca={(texto) => {
                        setTotalCount(0);
                        setPagina(1);
                        setSearchParams({ busca: texto }, { replace: true });
                    }
                    }
                    onClickBtAdd={() => navigate('/usuarios/detalhe/0')}
                />
            }>
            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
                <Table>
                    {rows.length === 0 && !isLoading && (
                        <caption>{Environment.LISTAGEM_VAZIA}</caption>
                    )
                    }
                    <TableHead>
                        <TableRow>
                            {!smDown && (<><TableCell>ID</TableCell></>)}
                            <TableCell>Nome</TableCell>
                            {(lgDown || xlDown) &&  (<TableCell>Login</TableCell>)}
                            <TableCell>Email</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.id}>
                                {lgDown &&  (<TableCell>{row.id}</TableCell>)}
                                <TableCell>{row.str_nome}</TableCell>
                                {(lgDown || xlDown) &&  (<TableCell>{row.str_login}</TableCell>)}
                                <TableCell>{row.str_email}</TableCell>
                                <TableCell>
                                    <IconButton size="small" onClick={() => { handleDelete(row.id) }}>
                                        <Icon>delete</Icon>
                                    </IconButton>
                                    <IconButton size="small" onClick={() => { navigate(`/usuarios/detalhe/${row.id}`, { state: JSON.stringify(row) }); }}>
                                        <Icon>edit</Icon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                    <TableFooter>
                        {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Stack spacing={2}>
                                        <Pagination
                                            page={pagina}
                                            count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                                            variant="outlined"
                                            onChange={(_, newPage) => { setPagina(newPage); }}
                                        />
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        )}
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <LinearProgress variant="indeterminate" />
                                </TableCell>
                            </TableRow>
                        )}

                    </TableFooter>
                </Table>
            </TableContainer>
        </LayoutBasePage>
    )
}
