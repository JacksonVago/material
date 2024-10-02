import React, { useState } from "react";
import { useAuthContext } from "../../contexts";
import { Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Icon, Slide, TextField, Typography } from "@mui/material";
import * as yup from "yup";
import { TransitionProps } from "@mui/material/transitions";
import { IUserPrimAcess } from "../../services/auth/AuthService";
import { useGlobalParams } from "../../../store/GlobalParams";
import { Environment } from "../../environment";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface ILoginProps {
    children: React.ReactNode;
}
const loginSchema = yup.object().shape({
    valPwd: yup.boolean(),
    email: yup.string().email().required(),
    //password: yup.string().required().min(3),
    password: yup.string()
        .when("valPwd", {
            is: true,
            then: (schema) => schema.required().min(3),
        }),
});


export const Login: React.FC<ILoginProps> = ({ children }) => {

    const glb_params = useGlobalParams();

    const { isAuthenticated, login, firstAccess, updfirstAccess } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [openCodAccess, setOpenCodAccess] = React.useState(false);
    const [question, setQuestion] = React.useState(false);

    const [email, setEmail] = useState('');
    const [qtdPwdErr, setQtdPwdErr] = useState<number>(4);
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [codAccessServ, setCodAccessServ] = useState('');
    const [codAccess, setCodAccess] = useState('');
    const [codAccessError, setCodAccessError] = useState('');
    const [primAccess, setPrimAccess] = useState('');

    const [titulo, setTitulo] = useState('');
    const [msg, setMsg] = useState('');

    const [classAnim, setclassAnim] = useState<string>('scale-in-center');
    const [showPrimAccess, setShowPrimAccess] = useState<boolean>(false);

    const loginCodAccess = yup.object().shape({
        isValidCode: yup.boolean(),
        codAccess: yup.string()
            .test('validator-custom-name', (value, { createError, path }) => {
                if (value !== codAccessServ) return createError({
                    path,
                    message: "Código de acesso inválido.",
                })
                else return true;
            }),
        /*.when("isValidCode", {
            is: true,
            then: (schema) => schema.required('Código de Acesso inválido.'),
            otherwise: (schema) => schema.required('Código Correto.'),
        }),
        /*.when(['int_cod_access',],{
                is: (val:string) => val !== codAccess,
                then: (schema) => schema.required('Código de Acesso inválido.'),
            }),
            /*.when(
                "int_cod_access",
                {
                    is: (codServ:string) => {
                        console.log('na validação');
                        console.log('cod ', codServ);
                        console.log('codAccess ', codAccess);
                        console.log(codServ !== codAccess);
                        return (codServ === codAccess ? codServ : codAccess);
                    },
                    then: (schema) => schema.required('Código de Acesso inválido.'),
                }
            ),
            /*.test(
                'is-validCode',
                'Código de acesso inválido',
                (value) => value != codAccess,
            ),*/

    });

    const handleChangeEmail = (e: any) => {
        setEmail(e);
        if (email.length > 0) {
            setclassAnim('scale-in-center');
            setShowPrimAccess(true);
        }
        else {
            setclassAnim('scale-out-center');
            //setShowPrimAccess(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFirstAccess = () => {
        console.log('Primeiro acesso');
        loginSchema
            .validate({ valPwd: false, email: email, password: "" }, { abortEarly: false })
            .then(dadosVal => {
                console.log('Validou');
                firstAccess(email)
                    .then((data) => {
                        console.log('voltou do acesso');
                        console.log(data);
                        if (data != undefined) {
                            let str_result = JSON.stringify(data);
                            if (str_result.indexOf('Erro : ') > -1) {
                                console.log('Erro dentro do retorno :', str_result);
                            }
                            else {
                                //Chama tela de código de autenticação
                                let primcces: IUserPrimAcess[] = JSON.parse(data);
                                setCodAccessServ(primcces[0].int_cod_acesso.toString());
                                setPrimAccess(JSON.stringify(primcces[0]));
                                setOpen(false);
                                setOpenCodAccess(true);
                                console.log(str_result);
                            }
                        }
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.log('Erro exception');
                        console.log(error);
                    });

            })
            .catch((errors: yup.ValidationError) => {
                setIsLoading(false);
                let bol_erro = false;
                console.log('Erro validação ', errors.inner);
                errors.inner.forEach(error => {
                    if (error.path === 'email') {
                        console.log(error.message);
                        setEmailError(error.message);
                        bol_erro = true;
                    }
                    else {
                        setPasswordError(error.message);
                    }
                });
            });
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleCrateUser = () => {
        setOpen(false);
        login(email, password, true)
            .then((data) => {
                console.log('handleCrateUser', JSON.stringify(data));
                if (data != undefined) {
                    let str_result = JSON.stringify(data);
                    if (str_result.indexOf('Erro : ')> -1) {
                        setTitulo('Problemas no Login (novo)');
                        console.log(str_result);
                        if (str_result.indexOf('Senha ') > -1) {
                            let qtd_err_pwd = qtdPwdErr;
                            qtd_err_pwd--;
                            if (qtd_err_pwd < 0) {
                                qtd_err_pwd = 0;
                            }
                            setQtdPwdErr(qtd_err_pwd);
                            if (qtd_err_pwd == 0) {
                                setQuestion(false);
                                setMsg("Desculpe, número de tentativa excedido. Favor contact o administrador do sistema.")
                            }
                            else {
                                setQuestion(false);
                                setMsg("Senha não confere. Favor informar novamente. (faltam " + qtd_err_pwd.toString() + " tentativas.")
                            }
                        }
                        else {
                            setQuestion(false);
                            setMsg(str_result)
                        }
                        setOpen(true);

                    }
                    else {
                        //Atualiza dados globais quando ocorrer o primeiro acesso.
                        let prim_aux: IUserPrimAcess = JSON.parse(primAccess);
                        console.log('id empresa: ', prim_aux.id_empresa.toString());
                        glb_params.updId_empresa(prim_aux.id_empresa.toString());
                        glb_params.updsuperUser(parseInt(localStorage.getItem(Environment.APP_USER_TIPO)!) < 0);
                        localStorage.setItem(Environment.APP_EMP_ID, prim_aux.id_empresa.toString());
                        localStorage.setItem(Environment.APP_USER_ID, '0');
                    }
                }
                setIsLoading(false);
            })
            .catch((error) => {
                console.log('erro no login');
                console.log(error);
            })
            ;
    };

    const handleSubmit = () => {
        setIsLoading(true);
        loginSchema
            .validate({ valPwd: true, email: email, password: password }, { abortEarly: false })
            .then(dadosVal => {
                console.log(dadosVal);
                login(dadosVal.email, dadosVal.password, false)
                    .then((data) => {
                        if (data != undefined) {
                            let str_result = JSON.stringify(data);
                            if (str_result.indexOf('Erro : ')) {
                                setTitulo('Problemas no Login');
                                console.log(str_result);
                                if (str_result.indexOf('Senha ') > -1) {
                                    let qtd_err_pwd = qtdPwdErr;
                                    qtd_err_pwd--;
                                    if (qtd_err_pwd < 0) {
                                        qtd_err_pwd = 0;
                                    }
                                    setQtdPwdErr(qtd_err_pwd);
                                    if (qtd_err_pwd == 0) {
                                        setQuestion(false);
                                        setMsg("Desculpe, número de tentativa excedido. Favor contact o administrador do sistema.")
                                    }
                                    else {
                                        setQuestion(false);
                                        setMsg("Senha não confere. Favor informar novamente. (faltam " + qtd_err_pwd.toString() + " tentativas.")
                                    }
                                }
                                else {
                                    setQuestion(true);
                                    setMsg("Usuário não cadastrado.\nDeseja se cadastrar e aproveitar nossa plataforma ?")
                                }
                                setOpen(true);

                            }
                        }
                        else {
                            //Atualiza dados globais somente quando ocorrer o LOGIN  já cadastrado.
                            glb_params.updId_empresa(localStorage.getItem(Environment.APP_EMP_ID)!);
                            glb_params.updsuperUser(parseInt(localStorage.getItem(Environment.APP_USER_TIPO)!) < 0);
                        }
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.log('erro no login');
                        console.log(error);
                    })
                    ;
            })
            .catch((errors: yup.ValidationError) => {
                setIsLoading(false);

                errors.inner.forEach(error => {
                    if (error.path === 'email') {
                        setEmailError(error.message);
                    }
                    else {
                        setPasswordError(error.message);
                    }
                });
            });
    }

    const handleConfCodAccess = () => {
        setIsLoading(true);
        console.log(codAccessServ);
        console.log(codAccess);
        loginCodAccess
            .validate({ isValidCode: false, codAccess: codAccess })
            .then(dadosVal => {
                console.log('Validou cosacess');
                console.log(dadosVal);
                setOpenCodAccess(false);
                setIsLoading(false);
                console.log(primAccess);
                let prim_aux: IUserPrimAcess = JSON.parse(primAccess);
                console.log('id empresa: ', prim_aux.id_empresa.toString());
                updfirstAccess(primAccess);
                handleCrateUser();
            })
            .catch((errors: yup.ValidationError) => {
                setIsLoading(false);
                console.log('Erro cosacess', errors.message);
                console.log('Erro validação ', errors.inner);
                setCodAccessError(errors.message);
            });

    }
    const handleCancelCodAccess = () => {
        setOpen(false);
    };


    if (isAuthenticated) {
        return (<>{children}</>);
    }
    else {
        return (
            <Box display='flex' justifyContent='center' alignItems='center' sx={{ width: '100% !important', height: '100%  !important' }}>
                <Card sx={{ display: 'flex', flexDirection: 'row', width: '100% !important', height: '100%  !important' }}>
                    <CardContent sx={{ width: '100% !important', height: '100%  !important' }}>
                        <Box display='flex' flexDirection='column' gap={2} justifyContent='center' alignItems='center'>
                            <Box width={250}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image="/forfood.jpg"
                                />
                            </ Box>
                            <Typography variant='h6' align="center"
                                component="span">
                                Identifique-se
                            </Typography>
                            <Grid container direction="column" gap={1}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label='Email'
                                        type='email'
                                        value={email}
                                        disabled={isLoading}
                                        error={!!emailError}
                                        helperText={emailError}
                                        onChange={e => handleChangeEmail(e.target.value)}
                                        onKeyDown={() => setEmailError('')}
                                        sx={{ width: '100%' }}
                                    >

                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label='Senha'
                                        type='password'
                                        value={password}
                                        disabled={isLoading}
                                        error={!!passwordError}
                                        helperText={passwordError}
                                        onChange={e => setPassword(e.target.value)}
                                        onKeyDown={() => setPasswordError('')}
                                        sx={{ width: '100%' }}
                                    >

                                    </TextField>
                                </Grid>
                            </Grid>
                        </Box>
                        <CardActions>
                            <Grid container direction="row" gap={1}>
                                <Grid item xs={12}>
                                    <Box width='100%' display='flex' justifyContent='center'>
                                        <Button variant='contained'
                                            onClick={handleSubmit}
                                            disabled={isLoading}
                                            endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}
                                        >
                                            Entrar
                                        </Button>
                                    </Box>
                                </Grid>
                                {showPrimAccess && (
                                    <Grid container direction="row">
                                        <Box width='100%' display='flex' justifyContent='center'
                                            className={classAnim}
                                        >
                                            <Button variant='contained'
                                                onClick={handleFirstAccess}
                                                disabled={isLoading}
                                                endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}
                                            >
                                                <Typography>
                                                    Primeiro Acesso
                                                </Typography>
                                            </Button>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </CardActions>
                    </CardContent>
                </Card>


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
                                        error
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
                        {question && (
                            <>
                                <Button onClick={handleFirstAccess}>Sim</Button>
                                <Button onClick={handleCancel}>Nao</Button>
                            </>
                        )}
                        {!question && (
                            <>
                                <Button onClick={handleClose}>OK</Button>
                            </>
                        )}
                    </DialogActions>
                </Dialog>

                {/*Tela de código de confirmação */}
                <Dialog
                    open={openCodAccess}
                    TransitionComponent={Transition}
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle display='flex' alignItems='center' justifyContent='center'>
                        <Typography
                            fontFamily='Poppins-Bold'
                            fontSize={'1.3rem'}
                            component='span'
                        >
                            Código de Acesso
                        </Typography>

                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description" display='flex' alignContent='center' alignItems='center' justifyContent='center'>
                            <Grid container direction='row' rowSpacing={2}>
                                <Grid item xs={12}>
                                    <Typography
                                        fontFamily='Poppins-Regular'
                                        fontSize={'1.1rem'}
                                        component='span'
                                    >
                                        Favor informar o código de acesso enviado para seu e-mail/celular.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Código de Acesso"
                                        value={codAccess}
                                        disabled={isLoading}
                                        error={!!codAccessError}
                                        helperText={codAccessError}
                                        onChange={e => setCodAccess(e.target.value)}
                                        onKeyDown={() => setCodAccessError('')}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            </Grid>

                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleConfCodAccess}>Confirma</Button>
                        <Button onClick={handleCancelCodAccess}>Cancela</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }
}