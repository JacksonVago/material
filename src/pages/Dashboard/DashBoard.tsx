import { Box, Card, CardContent, Grid, Theme, Typography, useMediaQuery } from "@mui/material";

import { FerramentaDetalhes, FerramentasListagem } from "../../shared/components";
import { UsuariosService } from "../../shared/services/usuarios/UsuariosService";
import { LayoutBasePage } from "../../shared/layouts";
import { useEffect, useState } from "react";
import { useGlobalParams } from "../../store/GlobalParams";
import { Environment } from "../../shared/environment";
import { useNavigate } from "react-router";

export const DashBoard = () => {
    /*Global  params*/
    const glb_params = useGlobalParams();

    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const xlDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('xl'));
    const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

    const [totalCount, setTotalCount] = useState(0);
    const [isLoadingUsuario, setIsLoadingUsuario] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoadingUsuario(true);
        let id_emp = parseFloat(localStorage.getItem(Environment.APP_EMP_ID)!);
        let id_user = parseFloat(localStorage.getItem(Environment.APP_USER_ID)!);
        if (id_emp > 0 && id_user === 0){
            navigate('/empresas/detalhe/' + id_emp.toString());
        }

        UsuariosService.getAll(parseFloat(glb_params.id_empresa), 0, 1, totalCount, "")
            //Quando tem promisse e demora podemos utilhar o then para fazer algo após o retorno
            .then((result) => {
                if (result instanceof Error) {
                    alert(result.message);
                }
                else {
                    if (totalCount === 0) {
                        setTotalCount(result.length);
                        setIsLoadingUsuario(false);
                    }
                }
            });
    }, []);

    const onClickDelAdd = () => {
        UsuariosService.getById(parseFloat(glb_params.id_empresa), 0);
    }

    const onClickBtAdd = () => {
        //UsuariosService.getById();
        let str_ret = UsuariosService.maintenece("", "I");
    }

    return (
        <LayoutBasePage titulo="DashBoard"
            barraFeramentas={<FerramentasListagem mostraBtAdd={false} />
            }>
            <Box width='100%' display='flex'>
                <Grid container margin={2}>
                    <Grid item container spacing={2}>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" align="center">
                                        Total de usuarios
                                    </Typography>
                                    <Box padding={6} justifyContent="center" alignItems="center" display="flex">
                                        {!isLoadingUsuario && (<Typography variant='h1'>
                                            {totalCount}
                                        </Typography>)}                                        
                                        {isLoadingUsuario && (
                                            <Typography variant='h6' >
                                                Careggando...
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" align="center">
                                        Total de Empresas
                                    </Typography>
                                    <Box padding={6} justifyContent="center" alignItems="center" display="flex">
                                        <Typography variant="h1">
                                            25
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </LayoutBasePage>
    );
};