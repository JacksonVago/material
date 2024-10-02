import { bool } from 'yup';
import {create} from 'zustand'

/*Global use para parametros globais  */
type globalParams = {
    login:string;
    pwd:string;
    token:string;
    id_empresa:string;
    superUser:boolean;
    updLogin: (login: globalParams['login']) => void;
    updPwd: (pwd: globalParams['pwd']) => void;
    updId_empresa: (id_empresa: globalParams['id_empresa']) => void;
    updToken: (token: globalParams['token']) => void;
    updsuperUser: (superUser: globalParams['superUser']) => void;
}

export const useGlobalParams = create<globalParams>((set)=>({
    login:'',
    pwd:'',
    token:'',
    id_empresa:'',
    superUser:false,
    updLogin: (Plogin:string) => set(() => ({ login: Plogin })),
    updPwd: (Ppwd:string) => set(() => ({ pwd: Ppwd })),
    updId_empresa: (Pid_empresa:string) => set(() => ({ id_empresa: Pid_empresa })),
    updToken: (Ptoken:string) => set(() => ({ token: Ptoken })),
    updsuperUser: (PsuperUser:boolean) => set(() => ({ superUser: PsuperUser })),

}));