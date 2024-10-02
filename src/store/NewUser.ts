import {create} from 'zustand'
type NewUserState = {
    newUser:boolean;
    email:string;
    pwd:string;
    updNewUser: (newUser: NewUserState['newUser']) => void;
    updEmail: (email: NewUserState['email']) => void;
    updPwd: (pwd: NewUserState['pwd']) => void;
}

export const useNewUserStore = create<NewUserState>((set)=>({
    newUser:false,
    email:'',    
    pwd:'',
    updNewUser: (PNewUser:boolean) => set(() => ({ newUser: PNewUser })),
    updEmail: (Pemail:string) => set(() => ({ email: Pemail })),
    updPwd: (Ppwd:string) => set(() => ({ pwd: Ppwd })),
}));

