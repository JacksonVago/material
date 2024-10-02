import { useLocation, useNavigate, useParams } from "react-router";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';

import { UsuariosService, Usuario } from "../../shared/services/usuarios/UsuariosService";
import { FerramentaDetalhes } from "../../shared/components";
import { LayoutBasePage } from "../../shared/layouts";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Icon, Input, LinearProgress, Paper, Slide, TextField, Typography, useTheme } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const DetalheUsuario: React.FC = () => {
    const [open, setOpen] = React.useState(false);


    const initialValues: Usuario = {
        id: 0,
        id_empresa: 0,
        str_nome: '',
        str_login: '',
        str_senha: '',
        str_email: '',
        int_telefone: 0,
        int_tipo: 0,
        dtm_inclusao: new Date(),
        dtm_saida: new Date(),
        int_situacao: 0,
        str_foto: '',
        id_app: 0,
        id_user_man: 0,
    };

    const validationSchema = Yup.object().shape({
        id: Yup.string().required('Campo obrigatório'),
        id_empresa: Yup.number().required('Campo obrigatório'),
        str_nome: Yup.string().required('Campo obrigatório'),
        str_login: Yup.string().required('Campo obrigatório'),
        str_senha: Yup.string().required('Campo obrigatório'),
        str_email: Yup.string().required('Campo obrigatório'),
        int_telefone: Yup.number().required('Campo obrigatório'),
        int_tipo: Yup.string().required('Campo obrigatório'),
        dtm_inclusao: Yup.date().required('Campo obrigatório'),
        dtm_saida: Yup.string().required('Campo obrigatório'),
        int_situacao: Yup.number().required('Campo obrigatório'),
        str_foto: Yup.string().required('Campo obrigatório'),
        id_app: Yup.number().required('Campo obrigatório'),
        id_user_man: Yup.number().required('Campo obrigatório'),
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
    const [valueTipo, setValueTipo] = React.useState<{ label: string; id: number }>({ label: "", id: 0 });

    const [row, setRow] = useState<Usuario>({
        id: 0,
        id_empresa: 0,
        str_nome: '',
        str_login: '',
        str_senha: '',
        str_email: '',
        int_telefone: 0,
        int_tipo: 0,
        dtm_inclusao: new Date(),
        dtm_saida: new Date(),
        int_situacao: 0,
        str_foto: '',
        id_app: 0,
        id_user_man: 0
    });

    const handleSubmit = async (values: Usuario) => {
        try {
            setRow(values);
            setTitulo('Manutenção de Usuários');
            setMsg(`Confirma a ${(row.id === 0 ? " inclusão " : " alteração ")} do usuário ${row.str_nome} ?`)
            setShowOk(true);
            setShowCancel(true);
            setTextCancel("Cancelar");
            setOpen(true);
            /*
            if (window.confirm("Confirma a" + (row.id === 0 ? " inclusão " : " alteração ") + "do registro ?")) {
                let str_json = JSON.stringify(values);
                str_json = str_json.substring(0, str_json.lastIndexOf(',')) + "}";

                UsuariosService.maintenece(str_json, (row.id === 0 ? "I" : "U"))
                    .then(result => {
                        if (result instanceof Error) {
                            alert(result.message);
                        }
                        else {
                            alert("Registro " + (row.id === 0 ? " incluído " : " alterado ") + " com sucesso!");
                            navigate('/usuario');
                        }
                    });
            }*/
        } catch (error) {
            // Handle form submission error
            console.error(error);
        }
    };

    /*const handleClick = async () => {
        const answer = await customConfirm({
          text: "Confirma Inclusão do registro ?",
          title: "Manutenção de Registros",
          options: {
            trueButtonText: "Ok",
            falseButtonText: "Cancelar"
          }
        });
        console.log("The answer is: ", answer);
      };*/

    const handleSaveClose = () => {
        let str_json = JSON.stringify(row);
        str_json = str_json.substring(0, str_json.lastIndexOf(',')) + "}";

        console.log('json');
        console.log(str_json);

        UsuariosService.maintenece(str_json, (row.id === 0 ? "I" : "U"))
            .then(result => {
                if (result instanceof Error) {
                    setOpen(false);
                    setTitulo('Erro: Manutenção de Usuários');
                    setShowOk(false);
                    setShowCancel(true);
                    setTextCancel("Ok");
                    setMsg(result.message);
                    setOpen(true);
                }
                else {
                    setTitulo('Manutenção de Usuários');
                    setMsg("Registro " + (row.id === 0 ? " incluído " : " alterado ") + " com sucesso!");
                    setShowOk(false);
                    setShowCancel(true);
                    setTextCancel("Ok");
                    setOpen(true);                    
                }
            });
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
        if (back){
            navigate('/usuarios');
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
            let user: Usuario = JSON.parse(location.state);
            const selectedValue = tipoUser.find((o, i) => o.id === user.int_tipo) || { id: 0, label: "" };
            console.log(selectedValue);
            setValueTipo(selectedValue);
        }
        setIsLoading(false);
    }, []);

    const handleSave = (back: boolean = false) => {
        console.log('Save');
        setBack(back);
        formik.handleSubmit();
    }

    const handleDelete = () => {
        if (window.confirm("Deseja excluir o registro ?")) {

            UsuariosService
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
            titulo={id === '0' ? 'Novo Usuário' : formik.values.str_nome}
            barraFeramentas={
                <FerramentaDetalhes
                    textoBtnAdd="Novo"

                    showBtnAdd={id !== '0'}
                    showBtnDel={id !== '0'}

                    OnClickBtnAdd={() => navigate('/usuarios/detalhe/0')}
                    OnClickBtnBack={() => navigate('/usuarios')}
                    OnClickBtnDel={() => handleDelete()}
                    OnClickBtnSave={() => handleSave(false)}
                    OnClickBtnSaveBack={() => handleSave(true)}
                />
            }
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
                                id="str_nome"
                                name="str_nome"
                                label="Nome"
                                value={formik.values.str_nome}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.str_nome && Boolean(formik.errors.str_nome)}
                                helperText={formik.touched.str_nome && formik.errors.str_nome}
                                margin="normal"
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={6} md={8} sm={12}>
                            <TextField                                
                                fullWidth
                                id="str_email"
                                name="str_email"
                                label="Email"
                                type="email"
                                value={formik.values.str_email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.str_email && Boolean(formik.errors.str_email)}
                                helperText={formik.touched.str_email && formik.errors.str_email}
                                margin="normal"
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid container item direction="row" columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={12} md={8} lg={6}>
                                <TextField
                                    fullWidth
                                    id="str_login"
                                    name="str_login"
                                    label="Login"
                                    value={formik.values.str_login}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.str_login && Boolean(formik.errors.str_login)}
                                    helperText={formik.touched.str_login && formik.errors.str_login}
                                    margin="normal"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={12} md={8} lg={6}>
                                <TextField
                                    fullWidth
                                    id="str_senha"
                                    name="str_senha"
                                    label="Senha"
                                    type="password"
                                    value={formik.values.str_senha}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.str_senha && Boolean(formik.errors.str_senha)}
                                    helperText={formik.touched.str_senha && formik.errors.str_senha}
                                    margin="normal"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item direction="row" columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={12} md={8} lg={6}>
                                <Autocomplete
                                    openText="Abrir"
                                    closeText="Fechar"
                                    noOptionsText="Sem Opções"
                                    loadingText="Carregando..."
                                    clearText="Limpar"
                                    disablePortal

                                    options={tipoUser}
                                    getOptionLabel={option => option.label}
                                    value={valueTipo}
                                    onChange={(event, value) => { formik.values.int_tipo = value?.id!; setValueTipo(tipoUser.find((o, i) => o.id === value?.id) || { id: 0, label: "" }); }}
                                    renderInput={(params): JSX.Element => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            label="Perfil do usuário"
                                            name="Perfil"
                                            error={Boolean(
                                                formik.touched.int_tipo && formik.errors.int_tipo
                                            )}
                                            helperText={formik.touched.int_tipo && formik.errors.int_tipo}
                                            onBlur={formik.handleBlur}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={8} lg={6}>
                                <TextField
                                    fullWidth
                                    id="int_telefone"
                                    name="int_telefone"
                                    label="Telefone"
                                    value={formik.values.int_telefone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.int_telefone && Boolean(formik.errors.int_telefone)}
                                    helperText={formik.touched.int_telefone && formik.errors.int_telefone}
                                    margin="normal"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    id="str_foto"
                                    name="str_foto"
                                    label="Foto"
                                    value={formik.values.str_foto}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.str_foto && Boolean(formik.errors.str_foto)}
                                    helperText={formik.touched.str_foto && formik.errors.str_foto}
                                    margin="normal"
                                    disabled={isLoading}
                                />
                            </Grid>
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
                                    label="Empresa"
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
                                    id="id_app"
                                    name="id_app"
                                    label="ID app"
                                    value={formik.values.id_app}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.id_app && Boolean(formik.errors.id_app)}
                                    helperText={formik.touched.id_app && formik.errors.id_app}
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
                                    id="dtm_saida"
                                    name="dtm_saida"
                                    label="Data de Saída"
                                    value={formik.values.dtm_saida}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.dtm_saida && Boolean(formik.errors.dtm_saida)}
                                    helperText={formik.touched.dtm_saida && Boolean(formik.errors.dtm_saida)}
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
                            <Grid container item  direction='row' columnSpacing={5}>
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

const tipoUser = [
    {
        label: 'Administrador',
        id: 1
    },
    {
        label: 'Atendente',
        id: 2
    },
    {
        label: 'Cozinha',
        id: 3
    },
    {
        label: 'Caixa',
        id: 4
    }

];