import { TransitionProps } from "@mui/material/transitions";
import {
    Autocomplete, Box, Button, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Divider, Grid, Icon, Input, InputAdornment, LinearProgress,
    Paper, Slide, TextField, Typography, useTheme
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';

import { Grupo, GrupoService } from "../../shared/services/grupos/GruposService";
import { FerramentaDetalhes } from "../../shared/components";
import { LayoutBasePage } from "../../shared/layouts";
import styled from 'styled-components';
import { Environment } from "../../shared/environment";


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const DetalheGrupo: React.FC = () => {

    const id_emp = parseFloat(localStorage.getItem(Environment.APP_EMP_ID)!);
    
    const [open, setOpen] = React.useState(false);

    const initialValues: Grupo = {
        id: 0,
        id_empresa: id_emp,
        str_descricao: '',
        str_foto: '',
        dtm_inclusao: new Date(),
        dtm_alteracao: new Date(),
        int_situacao: 0,
        id_app:0,
        id_user_man: 0,
        reg:0,
    };

    const validationSchema = Yup.object().shape({
        id: Yup.string().required('Campo obrigatório'),
        id_empresa: Yup.number().required('Campo obrigatório'),
        str_descricao: Yup.string().required('Campo obrigatório'),
        dtm_inclusao: Yup.date().required('Campo obrigatório'),
        dtm_alteracao: Yup.date().required('Campo obrigatório'),
        int_situacao: Yup.number().required('Campo obrigatório'),
    });

    const { id = '0' } = useParams<'id'>();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [titulo, setTitulo] = useState('');
    const [msg, setMsg] = useState('');
    const [textCancel, setTextCancel] = useState('Cancelar');
    const [showCancel, setShowCancel] = useState(true);
    const [textOk, setTextOk] = useState('Ok');
    const [showOk, setShowOk] = useState(true);
    const [back, setBack] = useState(false);

    const [row, setRow] = useState<Grupo>({
        id: 0,
        id_empresa: id_emp,
        str_descricao: '',
        str_foto: '',
        dtm_inclusao: new Date(),
        dtm_alteracao: new Date(),
        int_situacao: 0,
        id_app:0,
        id_user_man: 0,
        reg:0,
    });

      
    const handleSubmit = async (values: Grupo) => {
        console.log('submit');
        // try {
        //     console.log('handleSubmit');
        //     console.log('id empo: ', id_emp);
        //     console.log(values);
        //     setRow(values);
        //     setTitulo('Manutenção de Grupos');
        //     setMsg(`Confirma a ${(row.id === 0 ? " inclusão " : " alteração ")} do Grupo ${values.str_descricao} ?`)
        //     setShowOk(true);
        //     setShowCancel(true);
        //     setTextCancel("Cancelar");
        //     setOpen(true);

        // } catch (error) {
        //     // Handle form submission error
        //     console.error(error);
        // }
    };

    const handleSaveClose = () => {
        let str_json = JSON.stringify(row);
        str_json = str_json.substring(0, str_json.lastIndexOf(',')) + "}";

        console.log('json');
        console.log(str_json);

        GrupoService.maintenece(str_json, (row.id === 0 ? "I" : "U"))
            .then(result => {
                console.log('result :', result);
                if (result instanceof Error) {
                    setOpen(false);
                    setTitulo('Erro: Manutenção de Grupos');
                    setShowOk(false);
                    setShowCancel(true);
                    setTextCancel("Ok");
                    setMsg(result.message);
                    setOpen(true);
                }
                else {
                    setTitulo('Manutenção de Grupos');
                    setMsg("Registro " + (row.id === 0 ? " incluído " : " alterado ") + " com sucesso!");
                    setShowOk(false);
                    setShowCancel(true);
                    setTextCancel("Ok");
                    setOpen(true);
                    setBack(true);
                }
            });
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
        if (back) {
            navigate('/grupos');
        }
    };

    const formik = useFormik({
        initialValues: row,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    useEffect(() => {
        console.log(location.state);
        if (id !== '0') {
            setRow(JSON.parse(location.state));
            //formik.setValues(row);
            console.log(row);
        }
        setIsLoading(false);
  
    }, []);

    const handleBack = () => {
        navigate('/grupos');
    }

    const handleSave = (back: boolean = false) => {
        console.log('Save');
        console.log(formik.errors);
        setBack(back);
        formik.handleSubmit();
    }

    const handleDelete = () => {
        if (window.confirm("Deseja excluir o registro ?")) {

            GrupoService
                .maintenece(JSON.stringify(row), "D")
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    }
                    else {
                        alert('Registro excluido com sucesso!');
                        navigate('/usuario');
                    }
                });
        }
    }

    const theme = useTheme();

    return (

        <LayoutBasePage
            titulo={id === '0' ? 'Novo Grupo' : formik.values.str_descricao}
            barraFeramentas={
                <FerramentaDetalhes
                    textoBtnAdd="Novo"

                    showBtnAdd={id !== '0'}
                    showBtnDel={id !== '0'}

                    OnClickBtnAdd={() => navigate('/grupos/detalhe/0')}
                    OnClickBtnBack={() => handleBack()}
                    OnClickBtnDel={() => handleDelete()}
                    OnClickBtnSave={() => handleSave(false)}
                    OnClickBtnSaveBack={() => handleSave(true)}
                />
            }
            isNew={id === '0' ? true : false}

        >
            <form onSubmit={formik.handleSubmit} >
                <Box gap={1}
                    marginX={1}
                    padding={1}
                    paddingX={2}
                    display="flex"
                    flexDirection="column"
                    component={Paper}>

                    <Grid container direction="column" rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        {
                            isLoading && (

                                <Grid item>
                                    <LinearProgress variant="indeterminate"></LinearProgress>
                                </Grid>
                            )
                        }
                        <Grid item>
                            <Typography variant="h6">Geral</Typography>
                        </Grid>

                        <Grid item xs={6} md={8} sm={12}>
                            <TextField
                                fullWidth
                                id="str_descricao"
                                name="str_descricao"
                                label="Descrição"
                                value={formik.values.str_descricao}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.str_descricao && Boolean(formik.errors.str_descricao)}
                                helperText={formik.touched.str_descricao && formik.errors.str_descricao}
                                margin="normal"
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={6} md={8} sm={12}>
                        </Grid>
                        <Grid container item>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    id="int_situacao"
                                    name="int_situacao"
                                    label="Situação"
                                    value={formik.values.int_situacao}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.int_situacao && Boolean(formik.errors.int_situacao)}
                                    helperText={formik.touched.int_situacao && formik.errors.int_situacao}
                                    margin="normal"
                                    sx={{ display: 'none' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    id="id"
                                    name="id"
                                    label="ID"
                                    value={formik.values.id}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.id && Boolean(formik.errors.id)}
                                    helperText={formik.touched.id && formik.errors.id}
                                    margin="normal"
                                    sx={{ display: 'none' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    id="id_empresa"
                                    name="id_empresa"
                                    label="id_empresa"
                                    value={formik.values.id_empresa}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.id_empresa && Boolean(formik.errors.id_empresa)}
                                    helperText={formik.touched.id_empresa && formik.errors.id_empresa}
                                    margin="normal"
                                    sx={{ display: 'none' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    id="id_user_man"
                                    name="id_user_man"
                                    label="ID userman"
                                    value={formik.values.id_user_man}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.id_user_man && Boolean(formik.errors.id_user_man)}
                                    helperText={formik.touched.id_user_man && formik.errors.id_user_man}
                                    margin="normal"
                                    sx={{ display: 'none' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    id="dtm_inclusao"
                                    name="dtm_inclusao"
                                    label="Data de Inclusão"
                                    value={formik.values.dtm_inclusao}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.dtm_inclusao && Boolean(formik.errors.dtm_inclusao)}
                                    helperText={formik.touched.dtm_inclusao && Boolean(formik.errors.dtm_inclusao)}
                                    margin="normal"
                                    sx={{ display: 'none' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    id="dtm_alteracao"
                                    name="dtm_alteracao"
                                    label="Data de Alteração"
                                    value={formik.values.dtm_alteracao}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.dtm_alteracao && Boolean(formik.errors.dtm_alteracao)}
                                    helperText={formik.touched.dtm_alteracao && Boolean(formik.errors.dtm_alteracao)}
                                    margin="normal"
                                    sx={{ display: 'none' }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle display='flex' alignItems='center'>
                        <Grid container>
                            <Grid container item direction='row' columnSpacing={5}>
                                <Grid item xs={1}>
                                    <Icon>
                                        person
                                    </Icon>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography variant="h6">
                                        {titulo}
                                    </Typography>

                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {msg}
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        {showCancel && (<Button onClick={handleClose}>{textCancel}</Button>)}
                        {showOk && (<Button onClick={handleSaveClose}>{textOk}</Button>)}
                    </DialogActions>
                </Dialog>
            </form>
        </LayoutBasePage>
    )
}


