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

import { Empresa, EmpresaService } from "../../shared/services/empresas/EmpresasService";
import { FerramentaDetalhes } from "../../shared/components";
import { useAuthContext } from "../../shared/contexts";
import { LayoutBasePage } from "../../shared/layouts";
import { useNewUserStore } from "../../store/NewUser";
import { Usuario, UsuariosService } from "../../shared/services/usuarios/UsuariosService";
import { useGlobalParams } from "../../store/GlobalParams";
import { Environment } from "../../shared/environment";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface empForm extends Empresa {
    str_login: string;
    str_pwd: string;
}
export const DetalheEmpresa: React.FC = () => {
    let currentIcon: string = "";

    /*Global  params*/
    const glb_params = useGlobalParams();

    const newUser = useNewUserStore();
    const { logout } = useAuthContext();
    const [open, setOpen] = React.useState(false);

    const initialValues: empForm = {
        id: 0,
        int_cgccpf: 0,
        str_nome: '',
        str_fantasia: '',
        str_email: '',
        int_telefone: 0,
        int_local_atend: 0,
        int_id_user_adm: 0,
        dtm_inclusao: new Date(),
        int_situacao: 0,
        int_sitpag: 0,
        dtm_ultpag: new Date(),
        id_user_man: 0,
        str_login: '',
        str_pwd: '',
    };

    const validationSchema = Yup.object().shape({
        id: Yup.string().required('Campo obrigatório'),
        int_cgccpf: Yup.number().required('Campo obrigatório'),
        str_nome: Yup.string().required('Campo obrigatório'),
        str_email: Yup.string().required('Campo obrigatório'),
        int_telefone: Yup.number().required('Campo obrigatório'),
        int_local_atend: Yup.number().required('Campo obrigatório'),
        int_id_user_adm: Yup.string().required('Campo obrigatório'),
        dtm_inclusao: Yup.date().required('Campo obrigatório'),
        int_situacao: Yup.number().required('Campo obrigatório'),
        str_login: Yup.string().required('Campo obrigatório'),
        str_pwd: Yup.string().required('Campo obrigatório').min(4),
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
    const [valueLocal, setValueLocal] = React.useState<{ label: string; id: number, icon: string }>({ label: "", id: 0, icon: "" });

    const [row, setRow] = useState<empForm>({
        id: 0,
        int_cgccpf: 0,
        str_nome: '',
        str_fantasia: '',
        str_email: newUser.email,
        int_telefone: 0,
        int_local_atend: 0,
        int_id_user_adm: 0,
        dtm_inclusao: new Date(),
        int_situacao: 0,
        int_sitpag: 0,
        dtm_ultpag: new Date(),
        id_user_man: 0,
        str_login: newUser.email,
        str_pwd: newUser.pwd,
    });

    /*Inicilização */
    useEffect(() => {
        console.log(glb_params.superUser);
        if (id !== '0') {
            console.log('state ',location.state);
            if (location.state !== '' && location.state !== null) {
                setRow(JSON.parse(location.state));
                //formik.setValues(row);
                console.log(row);
                let emp: Empresa = JSON.parse(location.state);
                const selectedValue = tipoLocal.find((o, i) => o.id === emp.int_local_atend) || { id: 0, label: "", icon: "" };
                console.log(selectedValue);
                setValueLocal(selectedValue);
            }
            else{
                //Consulta empresa                
                console.log('id emp ',id);
                EmpresaService.getById(parseFloat(id))
                //Quando tem promisse e demora podemos utilzar o then para fazer algo após o retorno
                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    }
                    else{
                        console.log('resilt emp ',result);
                        let emp:Empresa[] = result;
                        setRow(JSON.parse(JSON.stringify(emp[0])));
                    }
                });                
            }
        }
        setIsLoading(false);
    }, []);

    const handleSubmit = async (values: empForm) => {
        console.log('submit');
        try {
            console.log('handleSubmit');
            console.log(values);
            setRow(values);
            setTitulo('Manutenção de Empresas');
            setMsg(`Confirma a ${(row.id === 0 ? " inclusão " : " alteração ")} da empresa ${row.str_nome} ?`)
            setShowOk(true);
            setShowCancel(true);
            setTextCancel("Cancelar");
            setOpen(true);

        } catch (error) {
            // Handle form submission error
            console.error(error);
        }
    };

    const handleSaveClose = () => {
        let str_json = JSON.stringify(row);
        str_json = str_json.substring(0, str_json.lastIndexOf(',')) + "}";

        console.log('json');
        console.log(str_json);

        EmpresaService.maintenece(str_json, (row.id === 0 ? "I" : "U"))
            .then(result => {
                console.log('result :', result);
                if (result instanceof Error) {
                    setOpen(false);
                    setTitulo('Erro: Manutenção de Empresas');
                    setShowOk(false);
                    setShowCancel(true);
                    setTextCancel("Ok");
                    setMsg(result.message);
                    setOpen(true);
                }
                else {
                    //Verifica se é um novo usuário
                    let id_emp = parseFloat(localStorage.getItem(Environment.APP_EMP_ID)!);
                    let id_user = parseFloat(localStorage.getItem(Environment.APP_USER_ID)!);
            
                    //if (newUser.newUser) {
                    if (id_emp > 0 && id_user === 0){
                        //Gera usuário administrador
                        let emp: Empresa = JSON.parse(result.result);
                        formik.values.id = emp.id;
                        glb_params.updId_empresa(emp.id.toString());

                        let usuAdm: Usuario = {
                            id: 0,
                            id_empresa: emp.id,
                            str_nome: row.str_login,
                            str_login: row.str_login,
                            str_senha: row.str_pwd,
                            str_email: row.str_login,
                            int_telefone: 0,
                            int_tipo: 1,
                            dtm_inclusao: new Date(),
                            dtm_saida: new Date(),
                            int_situacao: 1,
                            str_foto: emp.id.toString(),
                            id_app: 0,
                            id_user_man: 0,
                        }

                        UsuariosService.maintenece(JSON.stringify(usuAdm), "I")
                            .then((resulUser) => {
                                //Limpa variável de Novo usuário
                                newUser.updNewUser(false);
                                console.log('grava user adm',resulUser);
                                let usuAdm_aux: Usuario = JSON.parse(resulUser.result);
                                console.log('id: ',usuAdm_aux);
                                console.log('NOME: ',usuAdm_aux.str_nome);
                                let str_aux = usuAdm_aux.id;
                                console.log('id: ',str_aux);
                                localStorage.setItem(Environment.APP_USER_ID, str_aux.toString());
                                //Alimenta informaçõe do localstorage

                            });
                    }

                    setTitulo('Manutenção de Empresas');
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
            navigate('/empresas');
        }
    };

    const formik = useFormik({
        initialValues: row,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });


    const handleBack = () => {
        if (newUser.newUser) {
            console.log('Voltando quando novo.')
            logout();
        }
        else {
            navigate('/empresas');
        }
    }

    const handleSave = (back: boolean = false) => {
        console.log('Save');
        console.log(formik.errors);
        setBack(back);

        formik.handleSubmit();
    }

    const handleDelete = () => {
        if (window.confirm("Deseja excluir o registro ?")) {

            EmpresaService
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
            titulo={id === '0' ? 'Nova Empresa' : formik.values.str_nome}
            barraFeramentas={
                <FerramentaDetalhes
                    textoBtnAdd="Novo"

                    showBtnAdd={glb_params.superUser}
                    showBtnDel={glb_params.superUser}

                    OnClickBtnAdd={() => navigate('/empresas/detalhe/0')}
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
                            <Typography variant="h6" component="span">Geral</Typography>
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
                        <Grid container item direction="row" columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={12} md={8} lg={6}>
                                <TextField
                                    fullWidth
                                    id="str_fantasia"
                                    name="str_fantasia"
                                    label="Nome Fantasia"
                                    value={formik.values.str_fantasia}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.str_fantasia && Boolean(formik.errors.str_fantasia)}
                                    helperText={formik.touched.str_fantasia && formik.errors.str_fantasia}
                                    margin="normal"
                                    disabled={isLoading}
                                />
                            </Grid>
                            <Grid item xs={12} md={8} sm={12} lg={6} xl={6}>
                                <TextField
                                    fullWidth
                                    id="int_cgccpf"
                                    name="int_cgccpf"
                                    label="CNPJ/CPF"
                                    value={formik.values.int_cgccpf}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.int_cgccpf && Boolean(formik.errors.int_cgccpf)}
                                    helperText={formik.touched.int_cgccpf && formik.errors.int_cgccpf}
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

                                    options={tipoLocal}
                                    getOptionLabel={option => option.label}
                                    value={valueLocal}
                                    onChange={(event, value) => {
                                        formik.values.int_local_atend = value?.id!;
                                        setValueLocal(tipoLocal.find((o, i) => o.id === value?.id) || { label: "", id: 0, icon: "" });
                                        console.log(value?.icon);
                                        currentIcon = value?.icon || "";
                                    }}
                                    renderOption={(props, option) => {
                                        const { key, ...optionProps } = props;
                                        return (
                                            <Box
                                                key={key}
                                                component="li"
                                                {...optionProps}

                                            >
                                                <Icon>
                                                    {option.icon}
                                                </Icon>
                                                <Typography marginLeft={1}
                                                component="span">
                                                    {option.label}
                                                </Typography>
                                            </Box>
                                        );
                                    }}
                                    renderInput={(params): JSX.Element => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            label="Local de atendimento"
                                            name="Local"
                                            error={Boolean(
                                                formik.touched.int_local_atend && formik.errors.int_local_atend
                                            )}
                                            helperText={formik.touched.int_local_atend && formik.errors.int_local_atend}
                                            onBlur={formik.handleBlur}
                                            InputProps={{
                                                ...params.InputProps,
                                                startAdornment: (
                                                    <>
                                                        <InputAdornment position="start">
                                                            <Icon>{valueLocal.icon}</Icon>
                                                        </InputAdornment>
                                                        {params.InputProps.startAdornment}
                                                    </>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item direction="row" columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={12} md={8} sm={12} lg={6} xl={6}>
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
                            <Grid item xs={12} md={8} sm={12} lg={6} xl={6}>
                                <TextField
                                    fullWidth
                                    id="str_login"
                                    name="str_login"
                                    label="Usuário ADM"
                                    value={formik.values.str_login}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.str_login && Boolean(formik.errors.str_login)}
                                    helperText={formik.touched.str_login && formik.errors.str_login}
                                    margin="normal"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item xs={12} md={8} sm={12} lg={6} xl={6}>
                                <TextField
                                    type="password"
                                    fullWidth
                                    id="str_pwd"
                                    name="str_pwd"
                                    label="Senha"
                                    value={formik.values.str_pwd}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.str_pwd && Boolean(formik.errors.str_pwd)}
                                    helperText={formik.touched.int_id_user_adm && formik.errors.str_pwd}
                                    margin="normal"
                                    disabled={isLoading}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item xs={12} md={8} sm={12} lg={6} xl={6}>
                                <TextField
                                    fullWidth
                                    id="int_id_user_adm"
                                    name="int_id_user_adm"
                                    label="Usuário ADM"
                                    value={formik.values.int_id_user_adm}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.int_id_user_adm && Boolean(formik.errors.int_id_user_adm)}
                                    helperText={formik.touched.int_id_user_adm && formik.errors.int_id_user_adm}
                                    margin="normal"
                                    sx={{ display: 'none' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    id="dtm_ultpag"
                                    name="dtm_ultpag"
                                    label="Data do ùltimo Pagamento"
                                    value={formik.values.dtm_ultpag}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.dtm_ultpag && Boolean(formik.errors.dtm_ultpag)}
                                    helperText={formik.touched.dtm_ultpag && Boolean(formik.errors.dtm_ultpag)}
                                    margin="normal"
                                    sx={{ display: 'none' }}
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
                                    id="int_sitpag"
                                    name="int_sitpag"
                                    label="Situação de pagamento"
                                    value={formik.values.int_sitpag}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.int_sitpag && Boolean(formik.errors.int_sitpag)}
                                    helperText={formik.touched.int_sitpag && formik.errors.int_sitpag}
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
                                    <Typography variant="h6"
                                    component="span">
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

const tipoLocal = [
    {
        label: 'Mesa',
        id: 1,
        icon: 'table_bar',
    },
    {
        label: 'Gaurda Sol',
        id: 2,
        icon: 'beach_access',
    },
    {
        label: 'Delivery',
        id: 3,
        icon: 'delivery_dining',
    },
    {
        label: 'Comanda',
        id: 4,
        icon: 'receiptlong',
    }

];