import { Box, Icon, IconButton, Theme, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useDrawerContext } from "../contexts";
import React from "react";

interface ILayoutBasePageProps {
    titulo: string;
    children: React.ReactNode;
    barraFeramentas?: React.ReactNode;
    isNew?:boolean;
}

export const LayoutBasePage: React.FC<ILayoutBasePageProps> = ({ children, titulo, barraFeramentas, isNew=false, }) => {
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const them = useTheme();
    const { toggleDrawerOpen } = useDrawerContext();

    return (
        <Box height="100%" display="flex" flexDirection="column" gap={1}>
            <Box display="flex" alignItems="center"
                padding={1}
                height={them.spacing(smDown ? 6 : mdDown ? 8 : 12)} gap={1}>

                {!isNew &&(
                <IconButton onClick={toggleDrawerOpen} >
                <Icon>menu</Icon>
            </IconButton>
                )}

                <Typography
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    variant={smDown ? 'h5' : mdDown ? 'h4' : 'h3'}
                    component='span'
                >
                    {titulo}
                </Typography>
            </Box>
            {barraFeramentas && (
                <Box>
                    <Typography
                    component='span'>
                        {barraFeramentas}
                    </Typography>
                </Box>)
            }
            <Box flex={1} overflow="auto">
                <Typography
                component='span'>
                    {children}
                </Typography>
            </Box>
        </Box>
    );
};