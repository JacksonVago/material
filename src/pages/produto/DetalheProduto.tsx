import { NumericFormat, NumericFormatProps } from "react-number-format";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from '@mui/icons-material/Close';
import {
    Autocomplete, Box, Button, Card, CardContent, CardMedia, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Divider, Grid, Icon, IconButton, LinearProgress,
    Paper, Slide, Switch, TextField, Typography, useTheme
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from 'yup';

import { FerramentaDetalhes } from "../../shared/components";
import { LayoutBasePage } from "../../shared/layouts";
import { Camera, CameraType } from "react-camera-pro";
import styled from 'styled-components';
import { Environment } from "../../shared/environment";
import { IProdutosAddCombo, Produto, ProdutosService } from "../../shared/services/produtos/ProdutosService";
import { Grupo, GrupoService } from "../../shared/services/grupos/GruposService";
import { useDebounce } from "../../shared/hooks";


const tipo: ITipo[] = [
    {
        label: 'Normal',
        id: 1,
    },
    {
        label: 'Combo',
        id: 2,
    },
    {
        label: 'Use e Consumo',
        id: 3,
    },
    {
        label: 'Transformado',
        id: 4,
    }

];

const unidade: ITipo[] = [
    {
        label: 'Unidade',
        id: 1,
    },
    {
        label: 'Kilograma',
        id: 2,
    },
    {
        label: 'Litro',
        id: 3,
    }
];

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const Control = styled.div`
  position: fixed;
  display: flex;
  right: 0;
  width: 20%;
  min-width: 130px;
  min-height: 130px;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  box-sizing: border-box;
  flex-direction: column-reverse;

  @media (max-aspect-ratio: 1/1) {
    flex-direction: row;
    bottom: 0;
    width: 100%;
    height: 20%;
  }

  @media (max-width: 400px) {
    padding: 10px;
  }
`;

const ButtonCam = styled.button`
  outline: none;
  color: white;
  opacity: 1;
  background: transparent;
  background-color: transparent;
  background-position-x: 0%;
  background-position-y: 0%;
  background-repeat: repeat;
  background-image: none;
  padding: 0;
  text-shadow: 0px 0px 4px black;
  background-position: center center;
  background-repeat: no-repeat;
  pointer-events: auto;
  cursor: pointer;
  z-index: 2;
  filter: invert(100%);
  border: none;

  &:hover {
    opacity: 0.7;
  }
`;

const TakePhotoButton = styled(ButtonCam)`
  background: url('https://img.icons8.com/ios/50/000000/compact-camera.png');
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border: solid 4px black;
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const TorchButton = styled(ButtonCam)`
  background: url('https://img.icons8.com/ios/50/000000/light.png');
  background-position: center;
  background-size: 50px;
  background-repeat: no-repeat;
  width: 80px;
  height: 80px;
  border: solid 4px black;
  border-radius: 50%;

  &.toggled {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const ChangeFacingCameraButton = styled(ButtonCam)`
  background: url(https://img.icons8.com/ios/50/000000/switch-camera.png);
  background-position: center;
  background-size: 40px;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  padding: 40px;
  &:disabled {
    opacity: 0;
    cursor: default;
    padding: 60px;
  }
  @media (max-width: 400px) {
    padding: 40px 5px;
    &:disabled {
      padding: 40px 25px;
    }
  }
`;

const ImagePreview = styled.div<{ image: string | null }>`
  width: 120px;
  height: 120px;
  ${({ image }) => (image ? `background-image:  url(${image});` : '')}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 400px) {
    width: 50px;
    height: 120px;
  }
`;

const FullScreenImagePreview = styled.div<{ image: string | null }>`
  width: 100%;
  height: 100%;
  z-index: 100;
  position: absolute;
  background-color: black;
  ${({ image }) => (image ? `background-image:  url(${image});` : '')}
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

// const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
//     function NumericFormatCustom(props, ref) {
//         const { onChange, ...other } = props;

//         return (
//             <NumericFormat
//                 {...other}
//                 getInputRef={ref}
//                 onValueChange={(values) => {
//                     onChange({
//                         target: {
//                             name: props.name,
//                             value: values.value,
//                         },
//                     });
//                 }}
//                 thousandSeparator
//                 valueIsNumericString
//                 prefix="$"
//             />
//         );
//     },
// );

interface ITipo {
    label: string,
    id: number,
}

interface IProdutosCombo {
    id_prod_combo: number;
    id_produto: number;
    str_nome: string;
    dbl_preco: number;
    int_qtd_comp: number;
}

export const DetalheProduto: React.FC = () => {

    // const format = (numStr: any) => {
    //     if (numStr === '') return '';
    //     return new Intl.NumberFormat('pt-BR', {
    //         style: 'currency',
    //         currency: 'BRL',
    //         maximumFractionDigits: 0,
    //     }).format(numStr);
    // };

    const id_emp = parseFloat(localStorage.getItem(Environment.APP_EMP_ID)!);

    /*COnst CAM */
    const [numberOfCameras, setNumberOfCameras] = useState(0);
    const [image, setImage] = useState<string | null>(null);
    const [showImage, setShowImage] = useState<boolean>(false);
    const camera = useRef<CameraType>(null);
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [activeDeviceId, setActiveDeviceId] = useState<string | undefined>(undefined);
    const [torchToggled, setTorchToggled] = useState<boolean>(false);
    /*COnst CAM */

    /*Format currency */
    const [values, setValues] = React.useState({
        textmask: '(100) 000-0000',
        numberformat: '1320',
    });

    const [open, setOpen] = React.useState(false);
    //const [grupos, setGrupos] = React.useState<Grupo[]>([]);
    const [grupos, setGrupos] = React.useState<Grupo[]>([{
        id: 0,
        id_empresa: id_emp,
        str_descricao: '',
        str_foto: '',
        dtm_inclusao: new Date(),
        dtm_alteracao: new Date(),
        int_situacao: 0,
        id_app: 0,
        id_user_man: 0,
        reg: 1,
    }]);
    const [tipos, setTipo] = React.useState<ITipo[]>(tipo);
    const [unidades, setUnidades] = React.useState<ITipo[]>(unidade);

    const initialValues: Produto = {
        id: 0,
        id_empresa: id_emp,
        id_grupo: 0,
        str_descricao: '',
        str_obs: 0,
        int_qtd_estmin: 0,
        int_qtd_combo: 0,
        dbl_val_comp: 0,
        dbl_val_unit: 0,
        dbl_val_desc: 0,
        dbl_perc_desc: 0,
        dbl_val_combo: 0,
        str_foto: '',
        int_tipo: 0, // 1 - Normal / 2 - Combo / 3 - Transformado / 4 - Produtos de uso e consumo
        int_unid_med: 0, // Unidade de medida 1 - Unidade / 2 - Kilograma / 3 - Litro 
        str_venda: 'N', //Permite venda
        str_estoque: 'N', //Controla estoque
        str_nec_prep: 'N', //Necessita preparo sim ou não (para direcionar o pedido para a preparação
        int_qtd_adic: 0, // Quantidade de propdutos que podem ser adicionados
        dtm_inclusao: new Date(),
        dtm_alteracao: new Date(),
        int_situacao: 0,
        id_app: 0,
        id_user_man: 0,
    };

    const validationSchema = Yup.object().shape({
        id: Yup.string().required('Campo obrigatório'),
        id_empresa: Yup.number().required('Campo obrigatório'),
        id_grupo: Yup.number().required('Campo obrigatório'),
        str_descricao: Yup.string().required('Campo obrigatório'),
        str_obs: Yup.string().required('Campo obrigatório'),
        int_qtd_estmin: Yup.number().required('Campo obrigatório'),
        int_qtd_combo: Yup.number().required('Campo obrigatório'),
        dbl_val_comp: Yup.number().required('Campo obrigatório'),
        dbl_val_unit: Yup.number().required('Campo obrigatório'),
        dbl_val_desc: Yup.number().required('Campo obrigatório'),
        dbl_perc_desc: Yup.number().required('Campo obrigatório'),
        dbl_val_combo: Yup.number().required('Campo obrigatório'),
        int_tipo: Yup.number().required('Campo obrigatório'),
        int_unid_med: Yup.number().required('Campo obrigatório'),
        str_venda: Yup.string().required('Campo obrigatório'),
        str_estoque: Yup.string().required('Campo obrigatório'),
        str_nec_prep: Yup.string().required('Campo obrigatório'),
        int_qtd_adic: Yup.number().required('Campo obrigatório'),
        dtm_inclusao: Yup.date().required('Campo obrigatório'),
        dtm_alteracao: Yup.date().required('Campo obrigatório'),
        int_situacao: Yup.number().required('Campo obrigatório'),
    });

    const { debounce } = useDebounce();
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

    const [selGrupo, setSelGrupo] = React.useState<Grupo>({
        id: 0,
        id_empresa: id_emp,
        str_descricao: '',
        str_foto: '',
        dtm_inclusao: new Date(),
        dtm_alteracao: new Date(),
        int_situacao: 0,
        id_app: 0,
        id_user_man: 0,
        reg: 1,
    });
    const [selTipo, setSelTipo] = React.useState<ITipo>({ label: "", id: 0 });
    const [selUnid, setSelUnid] = React.useState<ITipo>({ label: "", id: 0 });

    const [row, setRow] = useState<Produto>({
        id: 0,
        id_empresa: id_emp,
        id_grupo: 0,
        str_descricao: '',
        str_obs: 0,
        int_qtd_estmin: 0,
        int_qtd_combo: 0,
        dbl_val_comp: 0,
        dbl_val_unit: 0,
        dbl_val_desc: 0,
        dbl_perc_desc: 0,
        dbl_val_combo: 0,
        str_foto: '',
        int_tipo: 0,
        int_unid_med: 0,
        str_venda: '',
        str_estoque: '',
        str_nec_prep: '',
        int_qtd_adic: 0,
        dtm_inclusao: new Date(),
        dtm_alteracao: new Date(),
        int_situacao: 0,
        id_app: 0,
        id_user_man: 0,
    });

    /*Combo*/
    const [produtosAdd, setProdutosAdd] = React.useState<IProdutosAddCombo[]>([{
        id_produto: 0,
        str_descricao: "",
        str_obs: "",
        dbl_preco: 0,
        str_foto: "",
        int_qtd_comp: 0,
    }]);

    const [openAddCombo, setOpenAddCombo] = useState<boolean>(false);

    /*Botão de adição de quantidade dos itens adicionais */
    const handleprodAdd = (id: number) => {
        let preco = 0;
        let total = 0;

        const nextprodAdd = produtosAdd.map((c, i) => {
            if (id === c.id_produto) {
                c.int_qtd_comp++;
                preco = c.dbl_preco;
                total = total + (preco * c.int_qtd_comp);
                return c;
            } else {
                preco = c.dbl_preco;
                total = total + (preco * c.int_qtd_comp);
                return c;
            }
        });

        //setTotValItemAdd("Adicionar " + real.format(total));
        setProdutosAdd(nextprodAdd);
    }

    /*Botão de menos de quantidade dos itens adicionais */
    const handleprodMinus = (id: number) => {
        let preco = 0;
        let total = 0;

        const nextprodAdd = produtosAdd.map((c, i) => {
            if (id === c.id_produto) {
                if (c.int_qtd_comp > 0) {
                    c.int_qtd_comp--;
                    preco = c.dbl_preco;
                    total = total + (preco * c.int_qtd_comp);
                }
                return c;
            } else {
                preco = c.dbl_preco;
                total = total + (preco * c.int_qtd_comp);
                return c;
            }
        });
        //setTotValItemAdd("Adicionar " + real.format(total));
        setProdutosAdd(nextprodAdd);
    }

    /*Botão de adcionar os items adicionais */
    const handleAdicionaItems = () => {
        setOpenAddCombo(false);
    }


    useEffect(() => {

        //Carrega grupos
        GrupoService.getAll(id_emp, 0, 0, 0, "")
            .then(result => {
                if (result instanceof Error) {
                    alert(result.message);
                }
                else {
                    let grps: Grupo[] = result;
                    let prod: Produto = JSON.parse(location.state);
                    setGrupos(grps);
                    debounce(() => {
                        const selectedValue = grps.find((o, i) => o.id === prod.id_grupo);
                        setSelGrupo(selectedValue || {
                            id: 0,
                            id_empresa: id_emp,
                            str_descricao: '',
                            str_foto: '',
                            dtm_inclusao: new Date(),
                            dtm_alteracao: new Date(),
                            int_situacao: 0,
                            id_app: 0,
                            id_user_man: 0,
                            reg: 1,
                        });
                    });
                }
            });


        if (id !== '0') {
            let prod: Produto = JSON.parse(location.state);

            const selectedTipo = tipos.find((o, i) => o.id === prod.int_tipo);
            const selectedUnid = unidades.find((o, i) => o.id === prod.int_unid_med);


            debounce(() => {
                setSelUnid(selectedUnid || { label: "", id: 0 });
                setSelTipo(selectedTipo || { label: "", id: 0 });
            });

            setRow(JSON.parse(location.state));
            //formik.setValues(row);
        }

        setIsLoading(false);
    }, []);


    const handleSubmit = async (values: Produto) => {
        try {
            setRow(values);
            setTitulo('Manutenção de Produtos');
            setMsg(`Confirma a ${(row.id === 0 ? " inclusão " : " alteração ")} do Produto ${values.str_descricao} ?`)
            setShowOk(true);
            setShowCancel(true);
            setTextCancel("Cancelar");
            setOpen(true);

        } catch (error) {
            console.log(formik.errors);
            console.error(error);
        }
    };

    const formik = useFormik({
        initialValues: row,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true,
    });

    const handleOnChangeTipo = (e: any) => {
        formik.values.int_tipo = e?.id!;
        setSelTipo(tipos.find((o, i) => o.id === e?.id) || { label: "", id: 0 });

        //Carrega produtos adicionais        
        //Carrega produtos adicionais quando necessário (combos e produtos transformados)
        if (e?.id > 0 && (e?.id === 1 || e?.id === 3)) {
            let str_unid_med = "";
            let int_tipo = (e?.id === 1 ? 1 : 4);

            ProdutosService.getListaProduto(0, id_emp, int_tipo, str_unid_med, 'S', 1, 0, 0, 0)
                .then(result => {
                    if (result instanceof Error) {
                        alert(result.message);
                    }
                    else {
                        let prods: IProdutosAddCombo[] = result;                        
                        setProdutosAdd(prods);
                        setOpenAddCombo(true);
                    }
                });
        }
    };

    const handleSaveClose = () => {
        let str_json = JSON.stringify(row);
        str_json = str_json.substring(0, str_json.lastIndexOf(',')) + "}";

        ProdutosService.maintenece(str_json, (row.id === 0 ? "I" : "U"))
            .then(result => {
                if (result instanceof Error) {
                    setOpen(false);
                    setTitulo('Erro: Manutenção de Produtos');
                    setShowOk(false);
                    setShowCancel(true);
                    setTextCancel("Ok");
                    setMsg(result.message);
                    setOpen(true);
                }
                else {
                    setTitulo('Manutenção de Produtos');
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
            navigate('/produtos');
        }
    };

    const handleBack = () => {
        navigate('/produtos');
    }

    const handleSave = (back: boolean = false) => {
        setBack(back);
        formik.handleSubmit();
    }

    const handleDelete = () => {
        if (window.confirm("Deseja excluir o registro ?")) {

            ProdutosService
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
            titulo={id === '0' ? 'Novo Produto' : formik.values.str_descricao}
            barraFeramentas={
                <FerramentaDetalhes
                    textoBtnAdd="Novo"

                    showBtnAdd={id !== '0'}
                    showBtnDel={id !== '0'}

                    OnClickBtnAdd={() => navigate('/produtos/detalhe/0')}
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
                        <Grid item xs={12} md={8} lg={6} marginBottom={1}>
                            <Autocomplete
                                openText="Abrir"
                                closeText="Fechar"
                                noOptionsText="Sem Opções"
                                loadingText="Carregando..."
                                clearText="Limpar"
                                disablePortal

                                options={grupos}
                                getOptionLabel={option => option.str_descricao}
                                value={selGrupo}
                                onChange={(event, value) => {
                                    formik.values.id_grupo = value?.id!; setSelGrupo(grupos.find((o, i) => o.id === value?.id) || {
                                        id: 0,
                                        id_empresa: id_emp,
                                        str_descricao: '',
                                        str_foto: '',
                                        dtm_inclusao: new Date(),
                                        dtm_alteracao: new Date(),
                                        int_situacao: 0,
                                        id_app: 0,
                                        id_user_man: 0,
                                        reg: 1,
                                    });
                                }}
                                renderInput={(params): JSX.Element => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="Grupo do Produto"
                                        name="grupo"
                                        error={Boolean(
                                            formik.touched.id_grupo && formik.errors.id_grupo
                                        )}
                                        helperText={formik.touched.id_grupo && formik.errors.id_grupo}
                                        onBlur={formik.handleBlur}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={8} lg={6}>
                            <Autocomplete
                                openText="Abrir"
                                closeText="Fechar"
                                noOptionsText="Sem Opções"
                                loadingText="Carregando..."
                                clearText="Limpar"
                                disablePortal

                                options={tipos}
                                getOptionLabel={option => option.label}
                                value={selTipo}
                                onChange={(event, value) => { handleOnChangeTipo(value); }}
                                renderInput={(params): JSX.Element => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="Tipo de Produto"
                                        name="tipo"
                                        error={Boolean(
                                            formik.touched.int_tipo && formik.errors.int_tipo
                                        )}
                                        helperText={formik.touched.int_tipo && formik.errors.int_tipo}
                                        onBlur={formik.handleBlur}
                                    />
                                )}
                            />
                        </Grid>

                        {/* <Grid item xs={6} md={8} sm={12}>
                            <Wrapper>
                                {showImage ? (
                                    <FullScreenImagePreview
                                        image={image}
                                        onClick={() => {
                                            setShowImage(!showImage);
                                        }}
                                    />
                                ) : (
                                    <Camera
                                        ref={camera}
                                        aspectRatio="cover"
                                        facingMode="environment"
                                        numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
                                        videoSourceDeviceId={activeDeviceId}
                                        errorMessages={{
                                            noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                                            permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                                            switchCamera:
                                                'It is not possible to switch camera to different one because there is only one video device accessible.',
                                            canvas: 'Canvas is not supported.',
                                        }}
                                        videoReadyCallback={() => {
                                            console.log('Video feed ready.');
                                        }}
                                    />
                                )}
                                <Control>
                                    <select
                                        onChange={(event) => {
                                            setActiveDeviceId(event.target.value);
                                        }}
                                    >
                                        {devices.map((d) => (
                                            <option key={d.deviceId} value={d.deviceId}>
                                                {d.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ImagePreview
                                        image={image}
                                        onClick={() => {
                                            setShowImage(!showImage);
                                        }}
                                    />
                                    <TakePhotoButton
                                        onClick={() => {
                                            if (camera.current) {
                                                const photo = camera.current.takePhoto();
                                                console.log(photo);
                                                setImage(photo as string);
                                            }
                                        }}
                                    />
                                    {camera.current?.torchSupported && (
                                        <TorchButton
                                            className={torchToggled ? 'toggled' : ''}
                                            onClick={() => {
                                                if (camera.current) {
                                                    setTorchToggled(camera.current.toggleTorch());
                                                }
                                            }}
                                        />
                                    )}
                                    <ChangeFacingCameraButton
                                        disabled={numberOfCameras <= 1}
                                        onClick={() => {
                                            if (camera.current) {
                                                const result = camera.current.switchCamera();
                                                console.log(result);
                                            }
                                        }}
                                    />
                                </Control>
                            </Wrapper>
                        </Grid> */}
                        <Grid item xs={6} md={8} sm={12} marginBottom={1}>
                            <TextField
                                fullWidth
                                id="str_obs"
                                name="str_obs"
                                label="Detalhes"
                                value={formik.values.str_obs}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.str_obs && Boolean(formik.errors.str_obs)}
                                helperText={formik.touched.str_obs && formik.errors.str_obs}
                                margin="normal"
                                multiline
                                rows={3}
                                maxRows={10}
                                disabled={isLoading}
                            />
                        </Grid>

                        {formik.values.int_tipo === 2 && (
                            <Grid container item display='flex' flexDirection='row' gap={1} marginBottom={1}>
                                <Grid item xs={3.8}>
                                    <TextField
                                        fullWidth
                                        id="dbl_val_desc"
                                        name="dbl_val_desc"
                                        label="Valor de Desconto"
                                        value={formik.values.dbl_val_desc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.dbl_val_desc && Boolean(formik.errors.dbl_val_desc)}
                                        helperText={formik.touched.dbl_val_desc && formik.errors.dbl_val_desc}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={3.8}>
                                    <TextField
                                        fullWidth
                                        id="dbl_perc_desc"
                                        name="dbl_perc_desc"
                                        label="Percentual de Desconto"
                                        value={formik.values.dbl_perc_desc}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.dbl_perc_desc && Boolean(formik.errors.dbl_perc_desc)}
                                        helperText={formik.touched.dbl_perc_desc && formik.errors.dbl_perc_desc}
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={3.8}>
                                    <TextField
                                        fullWidth
                                        id="dbl_val_combo"
                                        name="dbl_val_combo"
                                        label="Valor do Combo"
                                        value={formik.values.dbl_val_combo}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.dbl_val_combo && Boolean(formik.errors.dbl_val_combo)}
                                        helperText={formik.touched.dbl_val_combo && formik.errors.dbl_val_combo}
                                        margin="normal"
                                    />
                                </Grid>
                            </Grid>
                        )}

                        <Grid item xs={6} md={8} sm={12} marginBottom={1.5}>
                            <NumericFormat
                                customInput={TextField}
                                prefix="R$ "
                                fixedDecimalScale
                                decimalScale={2}
                                decimalSeparator=","
                                thousandSeparator="."
                                label="Preço Unitário"
                                value={formik.values.dbl_val_unit}
                                onChange={(value) => {
                                    formik.values.dbl_val_unit = parseFloat(value.target.value.replace(/([^0-9,])/g, ''));
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.touched.dbl_val_unit && Boolean(formik.errors.dbl_val_unit)}
                                helperText={formik.touched.dbl_val_unit && formik.errors.dbl_val_unit}
                            />
                        </Grid>

                        <Grid item xs={12} md={8} lg={6}>
                            <Autocomplete
                                openText="Abrir"
                                closeText="Fechar"
                                noOptionsText="Sem Opções"
                                loadingText="Carregando..."
                                clearText="Limpar"
                                disablePortal

                                options={unidades}
                                getOptionLabel={option => option.label}
                                value={selUnid}
                                onChange={(event, value) => { formik.values.int_unid_med = value?.id!; setSelUnid(unidades.find((o, i) => o.id === value?.id) || { label: "", id: 0 }); }}
                                renderInput={(params): JSX.Element => (
                                    <TextField
                                        {...params}
                                        fullWidth
                                        label="Unidade de Medida"
                                        name="unidade"
                                        error={Boolean(
                                            formik.touched.int_unid_med && formik.errors.int_unid_med
                                        )}
                                        helperText={formik.touched.int_unid_med && formik.errors.int_unid_med}
                                        onBlur={formik.handleBlur}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item display='flex' flexDirection='row' alignItems='center'>
                            <Grid item lg={6} xs={6}>
                                <Typography>Permite Venda</Typography>
                            </Grid>
                            <Grid item lg={6} xs={6} display='flex' flexDirection='row' justifyContent='end'>
                                <Switch

                                    checked={(formik.values.str_venda === 'S' ? true : false)}
                                    onChange={(event, checked) => {
                                        formik.setFieldValue("str_venda", checked ? "S" : "N")
                                    }}
                                    name="str_venda" />
                            </Grid>
                        </Grid>

                        <Grid container item display='flex' flexDirection='row' alignItems='center'>
                            <Grid item lg={6} xs={6}>
                                <Typography>Controla Estoque</Typography>
                            </Grid>
                            <Grid item lg={6} xs={6} display='flex' flexDirection='row' justifyContent='end'>
                                <Switch

                                    checked={(formik.values.str_estoque === 'S' ? true : false)}
                                    onChange={(event, checked) => {
                                        formik.setFieldValue("str_estoque", checked ? "S" : "N")
                                    }}
                                    name="str_estoque" />
                            </Grid>
                        </Grid>

                        <Grid item display='flex' flexDirection='row' alignItems='center'>
                            <Grid item lg={6} xs={6}>
                                <Typography>Necessita Preparo</Typography>
                            </Grid>
                            <Grid item lg={6} xs={6} display='flex' flexDirection='row' justifyContent='end'>
                                <Switch

                                    checked={(formik.values.str_nec_prep === 'S' ? true : false)}
                                    onChange={(event, checked) => {
                                        formik.setFieldValue("str_nec_prep", checked ? "S" : "N")
                                    }}
                                    name="str_nec_prep" />
                            </Grid>
                        </Grid>

                        <Grid item xs={6} md={8} sm={12}>
                            <TextField
                                fullWidth
                                id="int_qtd_estmin"
                                name="int_qtd_estmin"
                                label="Estoque mínimo"
                                value={formik.values.int_qtd_estmin}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.int_qtd_estmin && Boolean(formik.errors.int_qtd_estmin)}
                                helperText={formik.touched.int_qtd_estmin && formik.errors.int_qtd_estmin}
                                margin="normal"
                                disabled={isLoading}
                            />
                        </Grid>

                        <Grid item xs={6} md={8} sm={12} marginBottom={1.5}>
                            <NumericFormat
                                customInput={TextField}
                                prefix="R$ "
                                fixedDecimalScale
                                decimalScale={2}
                                decimalSeparator=","
                                thousandSeparator="."
                                label="Preço de Compra"
                                value={formik.values.dbl_val_comp}
                                onChange={(value) => {
                                    formik.values.dbl_val_comp = parseFloat(value.target.value.replace(/([^0-9,])/g, ''));
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.touched.dbl_val_comp && Boolean(formik.errors.dbl_val_comp)}
                                helperText={formik.touched.dbl_val_comp && formik.errors.dbl_val_comp}
                            />
                        </Grid>

                        {/*Campos ocultos*/}
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
                                    id="id_app"
                                    name="id_app"
                                    label="id_app"
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
                        <Grid container item>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    id="int_qtd_combo"
                                    name="int_qtd_combo"
                                    label="int_qtd_combo"
                                    value={formik.values.int_qtd_combo}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.int_qtd_combo && Boolean(formik.errors.int_qtd_combo)}
                                    helperText={formik.touched.int_qtd_combo && formik.errors.int_qtd_combo}
                                    margin="normal"
                                    sx={{ display: 'none' }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container item>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    id="int_qtd_adic"
                                    name="int_qtd_adic"
                                    label="int_qtd_adic"
                                    value={formik.values.int_qtd_adic}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.int_qtd_adic && Boolean(formik.errors.int_qtd_adic)}
                                    helperText={formik.touched.int_qtd_adic && formik.errors.int_qtd_adic}
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


                {/*Tela de produtos adicionais*/}
                <Dialog
                    open={openAddCombo}
                    TransitionComponent={Transition}
                    onClose={(e) => { setOpen(false) }}
                    aria-describedby="alert-dialog-slide-description"
                >
                    {/*Titulo botão fechar*/}
                    <DialogTitle>
                    </DialogTitle>

                    {/*Botão fechar*/}
                    <IconButton
                        aria-label="close"
                        onClick={(e) => { setOpenAddCombo(false) }}
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            color: "light-gray",
                        }}>
                        <CloseIcon />
                    </IconButton>

                    {/*Lista dos produtos adicionais*/}
                    {/*Corpo da tela*/}
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">

                            {produtosAdd.map(row => (
                                <Box
                                    component={Paper}
                                    margin={1}
                                    key={row.id_produto}
                                >
                                    <Card sx={{ display: 'flex', flexDirection: 'row' }} >
                                        <Grid container direction="row">
                                            <Grid item xs={4}  >
                                                <Box display='flex'>
                                                    <CardMedia
                                                        component="img"
                                                        height="170"
                                                        image={row.str_foto}
                                                        alt="Jackson"
                                                    />
                                                </ Box>
                                            </Grid>
                                            <Grid item xs={8}>
                                                <Grid container direction="row" height={40} flex={1}>
                                                    <Grid item xs={12}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                            <CardContent sx={{ flex: '1 0 auto', paddingBottom: '0px !important', paddingTop: '10px !important' }}>
                                                                <Typography
                                                                    gutterBottom
                                                                    component="div"
                                                                    fontFamily='Poppins-SemiBold'
                                                                    fontSize='1rem'
                                                                    margin={0}
                                                                >
                                                                    {row.str_descricao}
                                                                </Typography>
                                                                <Typography gutterBottom component="div" fontFamily='Poppins-Light'
                                                                    margin={0}>
                                                                    {row.str_obs}
                                                                </Typography>
                                                                <Typography gutterBottom component="div" fontSize='1rem' fontFamily='Poppins-Bold'
                                                                    margin={0}>
                                                                    {row.dbl_preco}
                                                                </Typography>
                                                            </CardContent>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} display='flex' alignItems='end'>
                                                        <Grid container direction="row">
                                                            <Grid item xs={5}  >

                                                            </Grid>
                                                            <Grid item xs={2}  >
                                                                <Box width='100%' height='100%'>
                                                                    <Button
                                                                        color='secondary'
                                                                        disableElevation
                                                                        variant={'text'}
                                                                        title=''
                                                                        startIcon={<Icon style={{ fontSize: 30 }}>remove</Icon>}
                                                                        onClick={() => { handleprodMinus(row.id_produto) }}
                                                                    >
                                                                    </Button>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={2} display='flex' alignItems='center' justifyContent='end'  >
                                                                <Typography color='secondary' variant="h6">{row.int_qtd_comp}</Typography>
                                                            </Grid>
                                                            <Grid item xs={2}  >
                                                                <Box width='100%' height='100%'>
                                                                    <Button
                                                                        color='secondary'
                                                                        startIcon={<Icon style={{ fontSize: 30 }}>add</Icon>}
                                                                        onClick={() => { handleprodAdd(row.id_produto) }}
                                                                    >
                                                                    </Button>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Card>
                                </Box>
                            ))
                            }
                            {/*Fim lista de produtos adicionais */}
                        </DialogContentText>
                    </DialogContent>

                    {/*Botões da tela de adcionais*/}
                    <DialogActions>
                        <Grid container direction="row" height={40} >
                            <Grid item xs={12} display='flex' alignItems='center' justifyContent='end' >
                                <Button
                                    color='secondary'
                                    variant='contained'
                                    title='Total'
                                    onClick={handleAdicionaItems}
                                >
                                </Button>
                            </Grid>

                        </Grid>
                    </DialogActions>
                </Dialog>
            </form>
        </LayoutBasePage>
    )
}

