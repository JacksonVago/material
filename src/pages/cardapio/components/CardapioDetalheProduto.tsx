import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Icon, IconButton, ImageList, ImageListItem, Slide, TextField, Theme, Typography, useMediaQuery } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from "react";

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
    isopen:boolean;
}

const real = new Intl.NumberFormat('pr-BR', {
    style: 'currency',
    currency: 'BRL',
});

export const CardapioDetalheProduto: React.FC<IProduto> = (
    {    
        name='',
        description='',
        preco='',
        image='',
        isopen=false,
    }
) => {
    const xsDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('xs'));
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const [open, setOpen] = useState<boolean>(isopen);
    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [obs, setObs] = useState<string>('');

    const [totValItem, setTotValItem] = useState<String>('Adicionar R$ 0.00');
    const [ValItem, setValItem] = useState<number>(0);
    const [totValItemAdd, setTotValItemAdd] = useState<String>('Adicionar R$ 0.00');
    const [totQtdItemSac, setTotQtdItemSac] = useState<number>(0);
    const [totQtdItem, setTotQtdItem] = useState<number>(1);
    const [sacola, setSacola] = useState<boolean>(false);
    
    const OpenDetail = (IsOpen:boolean) =>{
        console.log('passou aqui');
        setOpen(IsOpen);
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
        setSacola(true);
        setTotQtdItemSac(totQtdItemSac + totQtdItem);
    }

    /*eventos da confirmação da exclusão */
    const handleCloseConf = () =>{

    }

    const handleSaveConf = () =>{

    }

    return (
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
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">

                    {/*Nome do produto*/}
                    <Typography
                        gutterBottom
                        component="div"
                        fontFamily='Poppins-SemiBold'
                        fontSize={(xsDown ? '1.5rem' : mdDown ? '1.3rem' : '2rem')}
                    >
                        {name}
                    </Typography>

                    {/*Descrição do produto*/}
                    <Typography gutterBottom component="div" fontFamily='Poppins-Regular' >
                        {description}
                    </Typography>

                    {/*Preço do produto*/}
                    <Box display='flex' alignItems='end' justifyContent='end'>
                        <Typography gutterBottom component="div" fontSize='2vm' fontFamily='Poppins-Bold'>
                            {preco}
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
                            fontSize={(xsDown ? '1.3rem' : mdDown ? '1.0rem' : '2rem')}
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
                    <Grid item xs={7} display='flex' alignItems='center' justifyContent='end' >
                        <Button
                            color='secondary'
                            variant='contained'
                            title='Total'
                            onClick={handleAdicionaItem}
                        >
                            <Typography>
                                {totValItem}
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}

function srcset(image: string, size: number, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${size * rows
            }&fit=crop&auto=format&dpr=2 2x`,
    };
}

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