import { Autocomplete, TextField } from "@mui/material"
import { error } from "console";
import React, { useEffect, useMemo, useState } from "react";


interface IDropDown {
    id: number;
    ierror?:boolean;
    ihelperText?:React.ReactNode;
}


export const DropDown: React.FC<IDropDown> = (
    {
        id= 0,
        ierror=false,
        ihelperText=undefined

    }
    ) => {
    const [selID, setSelID] = useState<number | undefined>(undefined);

    useEffect(()=>{
        console.log(id);
        setSelID(id);
    });

    const autoCompleteSelectID = useMemo(()=>{
        if (!selID) {
            id = 0;
            return null;
        }

        const selItem = tipoUser.find(option => option.id === selID);
        if (!selID) {
            id = 0;
            return null;
        }
        id = selID;
        return selItem
    }, [selID]);

return (
    <Autocomplete
        openText="Abrir"
        closeText="Fechar"
        noOptionsText="Sem Opções"
        loadingText="Carregando..."
        clearText="Limpar"        
        disablePortal

        value={autoCompleteSelectID}
        options={tipoUser}
        renderInput={(params) => (
            <TextField
                error={ierror}
                helperText={ihelperText}
                {...params}
                label='Perfil do Usuário'
            />
        )}
        onChange={(_, newValue)=>{setSelID(newValue?.id)}}
    />
);
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