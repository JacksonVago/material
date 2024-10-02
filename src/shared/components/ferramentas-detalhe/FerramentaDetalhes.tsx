import { Box, Button, Divider, Icon, Paper, Skeleton, Theme, Typography, useMediaQuery, useTheme } from "@mui/material"
import React from "react"

interface IFerramentaDetalhes {
    textoBtnSave?: string;
    showBtnSave?: boolean;
    showBtnSaveSkl?: boolean;
    OnClickBtnSave?: () => void;

    textoBtnSaveBack?: string;
    showBtnSaveBack?: boolean;
    showBtnSaveBackSkl?: boolean;
    OnClickBtnSaveBack?: () => void;

    textoBtnDel?: string;
    showBtnDel?: boolean;
    showBtnDelSkl?: boolean;
    OnClickBtnDel?: () => void;

    textoBtnAdd?: string;
    showBtnAdd?: boolean;
    showBtnAddSkl?: boolean;
    OnClickBtnAdd?: () => void;

    textoBtnBack?: string;
    showBtnBack?: boolean;
    showBtnBackSkl?: boolean;
    OnClickBtnBack?: () => void;

}
export const FerramentaDetalhes: React.FC<IFerramentaDetalhes> = (
    {
        textoBtnSave = 'Salvar',
        showBtnSave = true,
        showBtnSaveSkl = false,
        OnClickBtnSave,

        textoBtnSaveBack = 'Salvar e Voltar',
        showBtnSaveBack = true,
        showBtnSaveBackSkl = false,
        OnClickBtnSaveBack,

        textoBtnDel = 'Deletar',
        showBtnDel = true,
        showBtnDelSkl = false,
        OnClickBtnDel,

        textoBtnAdd = 'Novo',
        showBtnAdd = true,
        showBtnAddSkl = false,
        OnClickBtnAdd,

        textoBtnBack = 'Voltar',
        showBtnBack = true,
        showBtnBackSkl = false,
        OnClickBtnBack
    }

) => {
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const theme = useTheme();

    return (
        <Box
            gap={1}
            marginX={1}
            padding={1}
            paddingX={2}
            display="flex"
            alignItems="center"
            height={theme.spacing(5)}
            component={Paper}>

            {showBtnBack && (
                <Button
                    color='primary'
                    disableElevation
                    variant={smDown ? 'text' : 'outlined'}
                    startIcon={<Icon>arrow_back</Icon>}
                    onClick={OnClickBtnBack}
                >
                    <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden' component={'span'}>

                        {smDown ? '' : textoBtnBack}
                    </Typography>
                </Button>
            )}

            {showBtnBack &&
            (showBtnAdd || showBtnDel || showBtnSave || showBtnSaveBack) &&
            (
 
                <Divider
                variant='middle' orientation='vertical'
                />
            )}

            {(showBtnSave && !showBtnSaveSkl) && (
                <Button
                    color='primary'
                    disableElevation
                    variant={smDown ? 'text' : 'contained'}
                    startIcon={<Icon>save</Icon>}
                    onClick={OnClickBtnSave}
                >
                    <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden' component={'span'}>
                        {smDown ? '' : textoBtnSave}
                    </Typography>
                </Button>
            )}

            {showBtnSaveSkl && (
                <Skeleton width={110} height={65} />
            )}

            {(showBtnSaveBack && !showBtnSaveBackSkl && !mdDown) && (

                <Button
                    color='primary'
                    disableElevation
                    variant='outlined'
                    startIcon={<Icon>save</Icon>}
                    onClick={OnClickBtnSaveBack}
                >
                    <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden' component={'span'}>
                        {textoBtnSaveBack}
                    </Typography>
                </Button>
            )}
            {(showBtnSaveBackSkl && !mdDown) && (

                <Skeleton width={180} height={65} />
            )}

            {(showBtnDel && !showBtnDelSkl) && (

                <Button
                    color='primary'
                    disableElevation
                    variant={smDown ? 'text' : 'outlined'}
                    endIcon={<Icon>delete</Icon>}
                    onClick={OnClickBtnDel}
                >
                    <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden' component={'span'}>

                        {smDown ? '' : textoBtnDel}
                    </Typography>
                </Button>
            )}
            {showBtnDelSkl && (

                <Skeleton width={110} height={65} />
            )}

            {(showBtnAdd && !showBtnAddSkl) && (

                <Button
                    color='primary'
                    disableElevation
                    variant={smDown ? 'text' : 'outlined'}
                    endIcon={<Icon>add_box</Icon>}
                    onClick={OnClickBtnAdd}
                >
                    <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden' component={'span'}>

                        {smDown ? '' : textoBtnAdd}
                    </Typography>
                </Button>
            )}
            {(showBtnAddSkl  && !mdDown) && (

                <Skeleton width={110} height={65} />
            )}
        </Box>
    )
}