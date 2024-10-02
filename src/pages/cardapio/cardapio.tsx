import React, { useState } from "react";
import { CarouselPromo } from "../../shared/components/carousel/CarouselPromo";
import { CarouselDestaque } from "../../shared/components/carousel/CarouselDestaque";
import {
    Badge,
    BottomNavigation,
    BottomNavigationAction,
    Box,
    Button,
    Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Divider,
    Grid, Icon, IconButton, ImageList, ImageListItem, Paper, Slide, TextField, Theme, Typography,
    useMediaQuery
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from '@mui/icons-material/Close';
import { LayoutBasePage } from "../../shared/layouts";
import { useNavigate } from "react-router";
import { number } from "yup";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IProduto {
    name: string;
    description: string;
    preco: string;
    image: string;
}

interface IProdutoAdd {
    id: number;
    name: string;
    description: string;
    preco: string;
    image: string;
    quantidade: number;
}

interface IPedidoItem {
    id: number;
    id_empresa: number;
    id_pedido: number;
    id_produto: number;
    dbl_precounit: number;
    int_qtd_comp: number;
    dbl_tot_item: number;
    dbl_desconto: number;
    dbl_tot_liq: number;
    int_situacao: number;
    str_combo: string;
    str_obs: string;
    id_usuario: number;
    id_app: number;
    id_user_man: number;
    str_nome: string;
    str_image: string;
    str_descricao: string;
    str_preco: string;
}

const real = new Intl.NumberFormat('pr-BR', {
    style: 'currency',
    currency: 'BRL',
});

export const Cardapio: React.FC = () => {
    const xsDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const lgDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
    const xlDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('xl'));

    const [idItemSacola, setIdItemSacola] = useState<number>(0);
    const [totValItem, setTotValItem] = useState<String>('Adicionar R$ 0.00');
    const [totPedido, setTotPedido] = useState<String>('R$ 0.00');
    const [ValItem, setValItem] = useState<number>(0);
    const [totQtdItem, setTotQtdItem] = useState<number>(1);
    const [totQtdItemSac, setTotQtdItemSac] = useState<number>(0);
    const [totValItemAdd, setTotValItemAdd] = useState<String>('Adicionar R$ 0.00');
    const [bottomNav, setBottomNav] = useState<number>(1);

    const [open, setOpen] = useState<boolean>(false);
    const [openConf, setOpenConf] = useState<boolean>(false);
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openSacDet, setOpenSacDet] = useState<boolean>(false);
    const [sacola, setSacola] = useState<boolean>(false);
    const [obs, setObs] = useState<string>('');
    const [classAnim, setclassAnim] = useState<string>('bounce-in-top');

    const [prod, setProd] = useState<IProduto>
        ({
            name: "",
            description: "",
            preco: "",
            image: "",
        }
        );

    const [prodAdd, setProdAdd] = React.useState<IProdutoAdd[]>
        ([{
            id: 0,
            name: "",
            description: "",
            preco: "",
            image: "",
            quantidade: 0,
        },]
        );

    const [pedItem, setPedItem] = useState<IPedidoItem[]>([]);

    const navigate = useNavigate();

    /*Adicona item ao pedido (sacola) */
    const handleAddPedItem = (produto: IProduto) => {
        setPedItem([
            ...pedItem,
            {
                id: 0,
                id_empresa: 0,
                id_pedido: 0,
                id_produto: 0,
                dbl_precounit: 0,
                int_qtd_comp: 0,
                dbl_tot_item: 0,
                dbl_desconto: 0,
                dbl_tot_liq: 0,
                int_situacao: 0,
                str_combo: "",
                str_obs: obs,
                id_usuario: 0,
                id_app: 0,
                id_user_man: 0,
                str_nome: "",
                str_image: "",
                str_descricao: "",
                str_preco: "",
            },
        ]);
    }

    /*Botão que mostra o detalhe dos produtos */
    const handleDetail = (prod: IProduto) => {
        setProd(prod);
        setTotValItem("Adicionar " + prod.preco);
        setTotQtdItem(1);
        setValItem(parseFloat(prod.preco.replace('R$ ', '')));
        setOpen(true);
    }

    /*Botão de adição de quantidade dos itens */
    const handleAdd = () => {
        let qtde = (totQtdItem + 1);
        let preco = ValItem;
        setTotQtdItem(qtde)
        setTotValItem("Adicionar " + real.format(preco * qtde));
    }

    /*Botão de menos de quantidade dos itens */
    const handleMinus = () => {
        if (totQtdItem > 1) {
            let qtde = (totQtdItem - 1);
            let preco = ValItem;
            setTotQtdItem(qtde)
            setTotValItem("Adicionar " + real.format(preco * qtde));
        }
    }

    /*Botão de adição do item na sacola */
    const handleAdicionaItem = () => {
        setOpen(false);
        setclassAnim('bounce-in-top');
        setSacola(true);
        setTotQtdItemSac(totQtdItemSac + totQtdItem);
        setPedItem(
            [
                ...pedItem,
                {
                    id: pedItem.length + 1,
                    id_empresa: 1,
                    id_pedido: 1,
                    id_produto: 1,
                    dbl_precounit: parseFloat(prod.preco.replace('R$ ', '')),
                    int_qtd_comp: totQtdItem,
                    dbl_tot_item: ValItem * totQtdItem,
                    dbl_desconto: 0,
                    dbl_tot_liq: parseFloat(prod.preco.replace('R$ ', '')) * totQtdItem,
                    int_situacao: 0,
                    str_combo: "",
                    str_obs: obs,
                    id_usuario: 1,
                    id_app: 0,
                    id_user_man: 1,
                    str_nome: prod.name,
                    str_image: prod.image,
                    str_descricao: prod.description,
                    str_preco: prod.preco,
                },
            ]
        );
        let totalPed = parseFloat(totPedido.replace(/([^0-9,])/g, ''));
        setTotPedido(real.format(totalPed + (ValItem * totQtdItem)))
    }

    /*Botão de adição de quantidade dos itens adicionais */
    const handleprodAdd = (id: number) => {
        let preco = 0;
        let total = 0;

        const nextprodAdd = produtosAdd.map((c, i) => {
            if (id === c.id) {
                c.quantidade++;
                preco = parseFloat(c.preco.replace(/([^0-9,])/g, ''));
                total = total + (preco * c.quantidade);
                return c;
            } else {
                preco = parseFloat(c.preco.replace(/([^0-9,])/g, ''));
                total = total + (preco * c.quantidade);
                return c;
            }
        });

        setTotValItemAdd("Adicionar " + real.format(total));
        setProdAdd(nextprodAdd);
    }

    /*Botão de menos de quantidade dos itens adicionais */
    const handleprodMinus = (id: number) => {
        let preco = 0;
        let total = 0;

        const nextprodAdd = produtosAdd.map((c, i) => {
            if (id === c.id) {
                if (c.quantidade > 0) {
                    c.quantidade--;
                    preco = parseFloat(c.preco.replace('R$ ', '').replace('.', '').replace(',', '.'));
                    total = total + (preco * c.quantidade);
                }
                return c;
            } else {
                preco = parseFloat(c.preco.replace('R$ ', '').replace('.', '').replace(',', '.'));
                total = total + (preco * c.quantidade);
                return c;
            }
        });
        //setTotValItemAdd("Adicionar " + real.format(total));
        setProdAdd(nextprodAdd);
    }

    /*Botão de adcionar os items adicionais */
    const handleAdicionaItemAdd = () => {
        let tot_addItem = ValItem + parseFloat(totValItemAdd.replace(/([^0-9,])/g, ''));
        setOpenAdd(false);
        const itemsAdd = produtosAdd.map((c, i) => {
            if (c.quantidade > 0) {
                return c.quantidade.toString() + ' ' + c.name + '\n'
            }
        });
        setValItem(tot_addItem)
        setTotValItem("Adicionar " + real.format(tot_addItem));
        setObs('Acrescentar :\n' + itemsAdd.toString().replaceAll(',', ''));
    }

    /*Fuções tela Sacola */
    /*Botão de adição de quantidade dos itens */
    const handleAddSac = (id: number) => {
        let preco = 0;
        let total = 0;
        let totalPedido = 0;
        setIdItemSacola(id);

        const nextpedItem = pedItem.map((c, i) => {
            if (id === c.id) {
                c.int_qtd_comp++;
                preco = c.dbl_precounit;
                total += (preco * c.int_qtd_comp);
                c.dbl_tot_item = (preco * c.int_qtd_comp);
                totalPedido += c.dbl_tot_item;
                return c;
            } else {
                preco = c.dbl_precounit;
                total += (preco * c.int_qtd_comp);
                c.dbl_tot_item = (preco * c.int_qtd_comp);
                totalPedido += c.dbl_tot_item;
                return c;
            }
        });
        setTotQtdItemSac(totQtdItemSac + 1);
        //setTotValItemAdd("Adicionar " + real.format(total));
        setPedItem(nextpedItem);
        setTotPedido(real.format(totalPedido));

    }

    /*Botão de menos de quantidade dos itens */
    const handleMinusSac = (id: number) => {
        let preco = 0;
        let total = 0;
        let totalPedido = 0;
        setIdItemSacola(id);

        const nextpedItem = pedItem.map((c, i) => {
            if (id === c.id) {
                if ((c.int_qtd_comp - 1) === 0) {
                    setOpenConf(true);
                }
                else {
                    c.int_qtd_comp--;
                    preco = c.dbl_precounit;
                    total += (preco * c.int_qtd_comp);
                    c.dbl_tot_item = (preco * c.int_qtd_comp);
                    totalPedido += c.dbl_tot_item;
                }
                return c;
            } else {
                preco = c.dbl_precounit;
                total += (preco * c.int_qtd_comp);
                c.dbl_tot_item = (preco * c.int_qtd_comp);
                totalPedido += c.dbl_tot_item;
                return c;
            }
        });
        setTotQtdItemSac(totQtdItemSac - 1);
        //setTotValItemAdd("Adicionar " + real.format(total));
        setPedItem(nextpedItem);
        setTotPedido(real.format(totalPedido));
    }

    /*Exclui item da sacola */
    const handleDelete = (id: number) => {        
        setOpenConf(true);
    }

    /*Funções de confirmação de exclusão*/
    const handleCloseConf = () => {
        setOpenConf(false);
    }
    const handleSaveConf = () => {
        setPedItem(oldRows => [
            ...oldRows.filter(oldRow => oldRow.id !== idItemSacola),
        ]
        );
        setOpenConf(false);
    }

    return (
        <LayoutBasePage
            titulo="Cardapio"
        >
            {/*Carrossel de promoções*/}
            <CarouselDestaque />

            {/*Lista de produtos*/}
            {produtos.map(row => (
                <Box
                    component={Paper}
                    margin={1}
                >
                    <Card sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Grid container direction="row">
                            <Grid item xs={8}  >
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flex: '1 0 auto' }}>
                                        <Typography
                                            gutterBottom
                                            component="div"
                                            fontFamily='Poppins-SemiBold'
                                            fontSize={(xsDown ? '1.5rem' : mdDown ? '1.3rem' : '2rem')}
                                        >
                                            {row.name}
                                        </Typography>
                                        <Typography gutterBottom component="div" fontFamily='Poppins-Regular' >
                                            {row.description}
                                        </Typography>
                                        <Typography gutterBottom component="div" fontSize='2vm' fontFamily='Poppins-Bold'>
                                            {row.preco}
                                        </Typography>
                                    </CardContent>
                                </Box>
                            </Grid>
                            <Grid item xs={4}  >
                                <Box display='flex'>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={row.image}
                                        alt="Jackson"
                                    />
                                </ Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box flex={1} width='100%' height='100%' display='flex' alignItems='center' justifyContent='end'>
                                    <Button
                                        disableElevation
                                        variant={'text'}
                                        title=''
                                        endIcon={<Icon style={{ fontSize: 40 }}>add</Icon>}
                                        onClick={(e) => { handleDetail(row) }}
                                    >
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Card>
                </Box>
            ))
            }

            {/*Faixa da Sacola*/}
            {smDown && (
                <>
                    <Box height={120}></Box>

                    <Slide direction="down" in={sacola}
                        mountOnEnter
                        unmountOnExit
                        className={classAnim}
                    >
                        <Paper
                            style={{ position: 'fixed', bottom: 50, left: 0, right: 0, border: 'none' }}
                            component='button'
                            onClick={() => { setclassAnim('bounce-out-top'); setOpenSacDet(true) }}
                        >
                            <Grid container direction="row" height={60}>
                                <Grid item xs={3}  >
                                    <Box width='100%' height='100%'>
                                        <Badge
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            style={{ right: 0, top: 0 }}
                                            badgeContent={totQtdItemSac} color="secondary"
                                        >
                                            <Icon style={{ fontSize: 40 }}>shopping_bag</Icon>
                                        </Badge>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} display='flex' alignItems='center' justifyContent='center'  >
                                    <Typography
                                        fontFamily='Poppins-semibold'
                                        fontSize={(xsDown ? '1rem' : mdDown ? '1rem' : '1rem')}

                                    >
                                        Ver Sacola
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} display='flex' alignItems='center' justifyContent='end'  >
                                    <Typography
                                        fontFamily='Poppins-Bold'
                                        fontSize={(xsDown ? '1rem' : mdDown ? '1rem' : '1rem')}
                                    >
                                        {totPedido}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Slide>
                    <Paper sx={{ position: 'fixed', bottom: -1, left: 0, right: 0 }}>
                        <BottomNavigation
                            showLabels
                            value={bottomNav}
                            onChange={(event, newValue) => {
                                setBottomNav(newValue);
                            }}
                        >
                            <BottomNavigationAction
                                label="Início"
                                icon={<Icon>home</Icon>}
                            />
                            <BottomNavigationAction label="Promoções" icon={<Icon>percent</Icon>} />
                            <BottomNavigationAction label="Pedidos" icon={<Icon>shopping_bag</Icon>} />
                            <BottomNavigationAction label="Perfil" icon={<Icon>person</Icon>} />
                        </BottomNavigation>
                    </Paper>
                </>
            )}

            {/*Tela de Detalhes*/}
            <Dialog
                fullScreen
                open={open}
                TransitionComponent={Transition}
                onClose={(e) => { setOpen(false) }}
            >
                {/*Titulo botão fechar*/}
                <DialogTitle>
                </DialogTitle>

                {/*Botão fechar*/}
                <IconButton
                    aria-label="close"
                    onClick={(e) => { setOpen(false) }}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        color: "light-gray",
                    }}>
                    <CloseIcon />
                </IconButton>

                {/*Fotos do produto*/}
                <ImageList
                    sx={{ width: '100%', height: 350 }}
                    variant="quilted"
                    cols={4}
                    rowHeight={90}
                >
                    {itemImg.map((item) => (
                        <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
                            <img
                                {...srcset(item.img, 121, item.rows, item.cols)}
                                alt={item.title}
                                loading="lazy"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>

                {/*Corpo da tela*/}
                <DialogContent
                sx={{paddingBottom:'0px !important', paddingTop:'0px !important'}}
                >
                    <DialogContentText id="alert-dialog-slide-description"
                    
                    >

                        {/*Nome do produto*/}
                        <Typography
                            gutterBottom
                            component="div"
                            fontFamily='Poppins-SemiBold'
                            fontSize={(xsDown ? '1.5rem' : mdDown ? '1.3rem' : '2rem')}
                        >
                            {prod.name}
                        </Typography>

                        {/*Descrição do produto*/}
                        <Typography gutterBottom component="div" fontFamily='Poppins-Regular' >
                            {prod.description}
                        </Typography>

                        {/*Preço do produto*/}
                        <Box display='flex' alignItems='end' justifyContent='end'>
                            <Typography gutterBottom component="div" fontSize='2vm' fontFamily='Poppins-Bold'>
                                {prod.preco}
                            </Typography>
                        </Box>

                        {/*Botão para acrescentar mais sabor (igredientes)*/}
                        <Box width='100%' display='flex' alignItems='center' justifyContent='end' marginBottom={2}>
                            <Button
                                color="secondary"
                                variant='contained'
                                onClick={() => { setOpenAdd(true); }}
                            >
                                <Typography gutterBottom component="div" fontSize='2vm' fontFamily='Poppins-Bold' justifyContent='center'>
                                    Acrescentar mais sabor
                                </Typography>
                            </Button>
                        </Box>

                        {/*Observação do produto e os adicionais*/}
                        <TextField
                            fullWidth
                            id="str_obs"
                            name="str_obs"
                            placeholder="Observação"
                            label="Alguma observação ?"
                            value={obs}
                            onChange={(e) => { setObs(e.target.value); }}
                            margin="normal"
                            multiline
                            rows={3}
                            maxRows={10}
                        />
                        {/*Total dos adicionais*/}
                        {totValItemAdd.indexOf('R$ 0.00') === -1 &&
                            (<Typography
                                gutterBottom
                                component="div"
                                fontFamily='Poppins-SemiBold'
                                fontSize={(xsDown ? '1.3rem' : '1.1rem')}
                            >
                                {totValItemAdd.replace('Adicionar', 'Total de adicionais : ')}
                            </Typography>)
                        }

                    </DialogContentText>
                </DialogContent>

                {/*Botões da tela de detalhe*/}
                <DialogActions>
                    <Grid container direction="row">
                        <Grid item xs={2}  >
                            <Box width='100%' height='100%'>
                                <Button
                                    color='secondary'
                                    disableElevation
                                    variant={'text'}
                                    title=''
                                    startIcon={<Icon style={{ fontSize: 30 }}>remove</Icon>}
                                    onClick={handleMinus}
                                >
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={1} display='flex' alignItems='center'  >
                            <Typography color='secondary' variant="h6">{totQtdItem}</Typography>
                        </Grid>
                        <Grid item xs={2}  >
                            <Box width='100%' height='100%'>
                                <Button
                                    color='secondary'
                                    startIcon={<Icon style={{ fontSize: 30 }}>add</Icon>}
                                    onClick={handleAdd}
                                >
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={7} display='flex' alignItems='center' justifyContent='end'>
                            <Button
                                color='secondary'
                                variant='contained'
                                title='Total'
                                onClick={handleAdicionaItem}
                                sx={{ marginRight: 2 }}
                            >
                                <Typography>
                                    {totValItem}
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/*Tela de produtos adicionais*/}
            <Dialog
                open={openAdd}
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
                    onClick={(e) => { setOpenAdd(false) }}
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
                                key={row.id}
                            >
                                <Card sx={{ display: 'flex', flexDirection: 'row' }} >
                                    <Grid container direction="row">
                                        <Grid item xs={4}  >
                                            <Box display='flex'>
                                                <CardMedia
                                                    component="img"
                                                    height="170"
                                                    image={row.image}
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
                                                                {row.name}
                                                            </Typography>
                                                            <Typography gutterBottom component="div" fontFamily='Poppins-Light'
                                                                margin={0}>
                                                                {row.description}
                                                            </Typography>
                                                            <Typography gutterBottom component="div" fontSize='1rem' fontFamily='Poppins-Bold'
                                                                margin={0}>
                                                                {row.preco}
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
                                                                    onClick={() => { handleprodMinus(row.id) }}
                                                                >
                                                                </Button>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={2} display='flex' alignItems='center' justifyContent='end'  >
                                                            <Typography color='secondary' variant="h6">{row.quantidade}</Typography>
                                                        </Grid>
                                                        <Grid item xs={2}  >
                                                            <Box width='100%' height='100%'>
                                                                <Button
                                                                    color='secondary'
                                                                    startIcon={<Icon style={{ fontSize: 30 }}>add</Icon>}
                                                                    onClick={() => { handleprodAdd(row.id) }}
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
                                onClick={handleAdicionaItemAdd}
                            >
                                <Typography>
                                    {totValItemAdd}
                                </Typography>
                            </Button>
                        </Grid>

                    </Grid>
                </DialogActions>
            </Dialog>

            {/*Tela da sacola*/}
            <Dialog
                fullScreen
                open={openSacDet}
                TransitionComponent={Transition}
                onClose={(e) => { setOpenSacDet(false) }}
            >
                {/*Titulo botão fechar*/}
                <DialogTitle>
                </DialogTitle>

                {/*Botão fechar*/}
                <IconButton
                    aria-label="close"
                    onClick={(e) => { setclassAnim('bounce-in-top'); setOpenSacDet(false) }}
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        color: "light-gray",
                    }}>
                    <CloseIcon />
                </IconButton>

                {/*Corpo da tela sacola*/}
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">

                        {/*Lista de produtos da sacola*/}
                        {pedItem.map(row => (
                            <Box
                                component={Paper}
                                margin={1}
                            >
                                <Card sx={{ display: 'flex', flexDirection: 'row' }}>
                                    <Grid container direction="row">
                                        {/*Linha da descrição e imagem */}
                                        <Grid item xs={12}>
                                            <Grid container direction="row">
                                                <Grid item xs={8}  >
                                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                        <CardContent sx={{ flex: '1 0 auto', paddingBottom: '0px !important' }}>
                                                            <Typography
                                                                gutterBottom
                                                                component="div"
                                                                fontFamily='Poppins-SemiBold'
                                                                fontSize={(xsDown ? '1.5rem' : mdDown ? '1.3rem' : '2rem')}
                                                            >
                                                                {row.str_nome}
                                                            </Typography>
                                                            <Typography gutterBottom component="div" fontFamily='Poppins-Regular' >
                                                                {row.str_descricao}
                                                            </Typography>
                                                        </CardContent>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={4}  >
                                                    <Box display='flex'>
                                                        <CardMedia
                                                            component="img"
                                                            height="200"
                                                            image={row.str_image}
                                                            alt="Jackson"
                                                        />
                                                    </ Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        {/* linha da observação/valor  */}
                                        <Grid item xs={12}>
                                            <Grid container direction="row">
                                                <Grid item xs={8} marginLeft={2}  >
                                                    <Typography gutterBottom component="div" fontFamily='Poppins-bold' color='primary'
                                                        fontSize='0.8rem'
                                                    >
                                                        {row.str_obs}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={3}  >
                                                    <Typography gutterBottom component="div" fontSize='2vm' fontFamily='Poppins-Bold'
                                                        display='flex' justifyContent='end'>
                                                        {real.format(row.dbl_tot_item)}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* linha dos botões  */}
                                        <Grid item xs={12}>
                                            <Grid container direction="row">
                                                <Grid item xs={2}  >
                                                    <Box width='100%' height='100%'>
                                                        <Button
                                                            color='secondary'
                                                            disableElevation
                                                            variant={'text'}
                                                            title=''
                                                            startIcon={<Icon style={{ fontSize: 30 }}>remove</Icon>}
                                                            onClick={() => handleMinusSac(row.id)}
                                                        >
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={1} display='flex' alignItems='center'  >
                                                    <Typography color='secondary' variant="h6">{row.int_qtd_comp}</Typography>
                                                </Grid>
                                                <Grid item xs={2}  >
                                                    <Box width='100%' height='100%'>
                                                        <Button
                                                            color='secondary'
                                                            startIcon={<Icon style={{ fontSize: 30 }}>add</Icon>}
                                                            onClick={() => handleAddSac(row.id)}
                                                        >
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={7} display='flex' alignItems='center' justifyContent='end' >
                                                    <Button
                                                        color='secondary'
                                                        startIcon={<Icon style={{ fontSize: 30 }}>delete</Icon>}
                                                        sx={{ padding: 0, justifyContent: 'end' }}
                                                        onClick={() => handleDelete(row.id)}
                                                    >
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Box>
                        ))
                        }
                    </DialogContentText>
                </DialogContent>

                {/*Botões da tela de sacola*/}
                <DialogActions>
                    <Grid container direction="row">
                        <Grid item xs={12} display='flex' alignItems='center' justifyContent='start' margin={2}>
                            <Typography
                                fontFamily='Poppins-SemiBold'
                                fontSize={(xsDown ? '1.5rem' : mdDown ? '1rem' : '1.3rem')}
                            >
                                Total do Pedido {totPedido}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} display='flex' alignItems='center' justifyContent='start' >
                            <Button
                                color='secondary'
                                variant='contained'
                                title='Total'
                                onClick={() => {setclassAnim('bounce-in-top'); setOpenSacDet(false);}}
                            >
                                <Typography
                                    fontFamily='Poppins-SemiBold'
                                    fontSize={(xsDown ? '1.5rem' : mdDown ? '0.80rem' : '1rem')}
                                >
                                    Continuar Comprando
                                </Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={5} display='flex' alignItems='center' justifyContent='end' >
                            <Button
                                color='secondary'
                                variant='contained'
                                title='Total'
                                onClick={()=>{}}
                            >
                                <Typography
                                    fontFamily='Poppins-SemiBold'
                                    fontSize={(xsDown ? '1.5rem' : mdDown ? '0.8rem' : '1rem')}
                                >
                                    Finalizar Pedido
                                </Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>

            {/*tela de confirmações */}
            <Dialog
                open={openConf}
                TransitionComponent={Transition}
                onClose={handleCloseConf}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle display='flex' alignItems='center'>
                    <Grid container>
                        <Grid container item direction='row' columnSpacing={5}>
                            <Grid item xs={12}>
                                <Typography variant="h6">
                                    Exclusão de itens
                                </Typography>

                            </Grid>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Confirma a exclusão desse item do pedido ?
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseConf}>Não</Button>
                    <Button onClick={handleSaveConf}>Sim</Button>
                </DialogActions>
            </Dialog>
        </LayoutBasePage>
    )
}

function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${size * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

var produtos = [
    {
        name: "X Salada",
        description: "Pão de hamburguer artesanal, 140g carne bovina (blend patinho/acem), queijo muzzarela, alface, tomate, cebola e maionese verde.",
        preco: "R$ 38,00",
        image: "./xsalada.jpg",
    },
    {
        name: "Ultimate Bacon",
        description: "Pão de hamburguer artesanal, 200g carne bovina (blend patinho/acem), queijo muzzarela, cebola caramelizada, bastante bacon e maionese picante.",
        preco: "R$ 42,00",
        image: "./ultimate_bacon.jpg",
    },
    {
        name: "Hot-Dog",
        description: "Salsicha especial grelhada com queijo cheddar e molho chili (mexicano), acompanha fritas.",
        preco: "R$ 38,00",
        image: "./hotdog_fritas.jpg",
    },
    {
        name: "Chicken Salad",
        description: "Pão artesanal, 150g  de filé de frago crysp,  alface, tomate, cebola.",
        preco: "R$ 38,00",
        image: "./chicken.jpg",
    },
    {
        name: "X Salada - veggie",
        description: "Pão artesanal, 140g de hambuguer (grãos, feijão-preto), alface, tomate, cebola rôxa e maionese da casa.",
        preco: "R$ 40,00",
        image: "./veggie.jpg",
    },
    {
        name: "Coppa sanduiche",
        description: "Pão baguette, 200g de presunto coppa italiano, rúcula e queijo gongonzola regado com azeite de oliva virgem.",
        preco: "R$ 40,00",
        image: "./coppa.jpg",
    },
    {
        name: "Pernil",
        description: "Pão baguette, 200g de pernil assado com especiárias, com queijo suiço e pickles.",
        preco: "R$ 42,00",
        image: "./pernil.jpg",
    },
    {
        name: "X Cheddar",
        description: "Pão de hamburguer artesanal, 140g carne bovina (blend patinho/acem), queijo cheddar, cebola crysp, bacon e maionese verde.",
        preco: "R$ 40,00",
        image: "./cheddar.png",
    }
]

var produtosAdd = [
    {
        id: 1,
        name: "Cheddar",
        description: "2 fatias de queijo tipo cheddar.",
        preco: "R$ 4,00",
        image: "./images/add_cheddar.jpg",
        quantidade: 0,
    },
    {
        id: 2,
        name: "Queijo Suiço",
        description: "2 fatias de queijo suiço.",
        preco: "R$ 4,00",
        image: "./images/add_swiss_cheese.jpg",
        quantidade: 0,
    },
    {
        id: 3,
        name: "Queijo muzzarela",
        description: "2 fatias de queijo tipo muzzarella.",
        preco: "R$ 4,00",
        image: "./images/add_muzzarela.jpg",
        quantidade: 0,
    },
    {
        id: 4,
        name: "Maionese",
        description: "1 pote com maionese da casa.",
        preco: "R$ 3,00",
        image: "./images/add_mayonnaise.png",
        quantidade: 0,
    },
    {
        id: 5,
        name: "Bacon",
        description: "5 fatias de bacon frito.",
        preco: "R$ 4,00",
        image: "./images/add_bacon.jpg",
        quantidade: 0,
    },
    {
        id: 6,
        name: "Salada",
        description: "Alface e tomate.",
        preco: "R$ 2,00",
        image: "./images/add_salad.jpg",
        quantidade: 0,
    },
]

const itemImg = [
    {
        img: './cheddar.png',
        title: 'X Cheddar',
        rows: 2,
        cols: 2,
    },
    {
        img: './pernil.jpg',
        title: 'Pernil',
    },
    {
        img: './coppa.jpg',
        title: 'Coppa',
    },
    {
        img: './veggie.jpg',
        title: 'X Salada - veggie',
        cols: 2,
    },
    {
        img: './chicken.jpg',
        title: 'X Chicken',
        cols: 2,
    },
    {
        img: './hotdog_fritas.jpg',
        title: 'Hot-Dog',
        author: '@Jackson',
        rows: 2,
        cols: 2,
    },
    {
        img: './ultimate_bacon.jpg',
        title: 'Ultimate Bacon',
    },
    {
        img: './xsalada.jpg',
        title: 'X Salad',
    },
    {
        img: './pernil.jpg',
        title: 'Pernil',
        rows: 2,
        cols: 2,
    },
    {
        img: './pernil.jpg',
        title: 'Pernil 2',
    },
    {
        img: './pernil.jpg',
        title: 'Pernil 3',
    },
    {
        img: './pernil.jpg',
        title: 'Pernil 4',
        cols: 2,
    },
];

/*
function ReactSpringTransition({ children }: React.PropsWithChildren<{}>) {
    const { requestedEnter, onExited } = useTransitionStateManager();
  
    const api = useSpringRef();
    const springs = useSpring({
      ref: api,
      from: { opacity: 0, transform: 'translateY(-8px) scale(0.95)' },
    });
  
    React.useEffect(() => {
      if (requestedEnter) {
        api.start({
          opacity: 1,
          transform: 'translateY(0) scale(1)',
          config: { tension: 250, friction: 10 },
        });
      } else {
        api.start({
          opacity: 0,
          transform: 'translateY(-8px) scale(0.95)',
          config: { tension: 170, friction: 26 },
          onRest: onExited,
        });
      }
    }, [requestedEnter, api, onExited]);
  
    return <animated.div style={springs}>{children}</animated.div>;
  }
  
  .whatever {
  animation-timing-function:linear(0, 0.2, 0.5, 0.8, 1.1, 1.3, 1.36, 1.367, 1.31, 1.21, 1.1, 1, 0.93, 0.88, 0.87, 0.88, 0.91, 0.95, 0.99, 1.02, 1.04, 1.046, 1.044, 1.035, 1.02, 1.01, 1, 0.989, 0.984, 0.9837, 0.986, 0.99, 0.995, 1, 1.003, 1.005, 1.0058, 1.0053, 1.004, 1.002, 1.001, 0.999, 0.9984, 0.998, 0.998, 0.9984, 0.999, 0.9996, 1.0001, 1 100% 100%);
}
  
  */