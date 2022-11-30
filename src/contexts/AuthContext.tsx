import { createContext, useEffect, useState } from "react";
import { getUserStorage, removeUserStorage, saveUserStorage } from "../storage/storageUser";

import { UserDTO } from "../dtos/UserDTO";
import { api } from "../services/api";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    loadingUserStorageData: boolean;
}

type AuthContextProviderProps = {
    children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthContextProviderProps){
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [loadingUserStorageData, setLoadingUserStorageData] = useState(true);

    async function signIn(email: string, password: string){
        try {
            const {data} = await api.post('/sessions', {email, password})

            if(data.user){
                setUser(data.user);
                saveUserStorage(data.user);
            }
        } catch (error) {
            throw error;
        }
    }

    async function signOut(){
        try {
            setLoadingUserStorageData(true);

            setUser({} as UserDTO);
            await removeUserStorage();
        } catch (error) {
            throw error;
        } finally {
            setLoadingUserStorageData(false);
        }
    }

    async function loadUserData(){
        try {
            const loggedUser = await getUserStorage();
            if(loggedUser){
                setUser(loggedUser);
            }
        } catch (error) {
            throw error;

        } finally{
            setLoadingUserStorageData(false);
        }
    }

    useEffect(() =>{
        loadUserData();
    }, [])

    return(
        <AuthContext.Provider value={{
            user, 
            signIn,
            loadingUserStorageData,
            signOut
            }}>
            {children}
        </AuthContext.Provider>
    )
}