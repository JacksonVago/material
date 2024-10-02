import { Box, Button, Icon, InputAdornment, Paper, TextField, Theme, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Environment } from "../../environment";
import { useState } from "react";

interface IFerramentasListagemProps {
    textoBusca?: string;
    mostraInputBusca?: boolean;
    changeTextBusca?: (novoTexto: string) => void;
    textoBtAdd?: string;
    mostraBtAdd?: boolean;
    onClickBtAdd?: () => void;
}
export const FerramentasListagem: React.FC<IFerramentasListagemProps> = (
    {
        textoBusca = '',
        mostraInputBusca = false,
        changeTextBusca,
        textoBtAdd = 'NOVO',
        mostraBtAdd = false,
        onClickBtAdd,
    }
) => {

    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
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

            {mostraInputBusca && (
                <TextField
                    value={textoBusca}
                    size="small"
                    placeholder={Environment.INPUT_DE_BUSCA}
                    onChange={(e) => changeTextBusca?.(e.target.value)}
                    id="input-with-icon-textfield"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Icon>
                                    search
                                </Icon>
                            </InputAdornment>
                        ),
                    }}
                >
                </TextField>
            )}

            {mostraBtAdd && (
                <Box flex={1} display="flex" justifyContent="end">
                    <Box>
                        <Button
                            color='primary'
                            disableElevation
                            variant={'text'}
                            title={textoBtAdd}
                            endIcon={<Icon>add_box</Icon>}
                            onClick={onClickBtAdd}
                        >
                            <Typography variant='button' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden' component={'span'}>

                                {smDown ? '' : textoBtAdd}
                            </Typography>

                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    )
}