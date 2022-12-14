import { createContext, useEffect, useState } from "react";

import {getAuthTokenStorage, saveAuthTokenStorage, removeAuthTokenStorage} from '../storage/storageAuthToken';
import { getUserStorage, removeUserStorage, saveUserStorage } from "../storage/storageUser";

import { UserDTO } from "../dtos/UserDTO";
import { api } from "../services/api";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUserProfile: (updatedUser: UserDTO) => Promise<void>;
    isLoadingUserStorageData: boolean;
    refreshedToken: string;
}

type AuthContextProviderProps = {
    children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({children}: AuthContextProviderProps){
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [refreshedToken, setRefreshedToken] = useState('');
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

    function updateUserStateAndAPITokenHeaders(userData: UserDTO, token: string){
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(userData);
    }

    async function saveUserAndTokenStorage(userData: UserDTO, token: string){
        await saveUserStorage(userData);
        await saveAuthTokenStorage(token);
    }

    async function signIn(email: string, password: string){
        try {
            const {data} = await api.post('/sessions', {email, password})

            if(data.user && data.token){
                setIsLoadingUserStorageData(true);

                await saveUserAndTokenStorage(data.user, data.token);

                updateUserStateAndAPITokenHeaders(data.user, data.token);
            }
        } catch (error) {
            throw error;
        }  finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function signOut(){
        try {
            setIsLoadingUserStorageData(true);

            setUser({} as UserDTO);
            await removeUserStorage();
            await removeAuthTokenStorage();
            
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function updateUserProfile(updatedUser: UserDTO){
        try {
            setUser(updatedUser);
            await saveUserStorage(updatedUser)
            

        } catch (error) {
            throw error;
        }
    }

    async function loadUserData(){
        try {
            setIsLoadingUserStorageData(true);

            const loggedUser = await getUserStorage();
            const token = await getAuthTokenStorage();

            if(token && loggedUser){
                updateUserStateAndAPITokenHeaders(loggedUser, token);
            }
        } catch (error) {
            throw error;

        } finally{
            setIsLoadingUserStorageData(false);
        }
    }

    function refreshUpdatedToken(newToken: string){
        setRefreshedToken(newToken)
    }

    useEffect(() =>{
        loadUserData();
    }, [])

    useEffect(() =>{
        const subscribe = api.registerInterceptTokenManager({ signOut, refreshUpdatedToken })

        return () => subscribe();
    },[signOut])

    return(
        <AuthContext.Provider value={{
            user, 
            signIn,
            isLoadingUserStorageData,
            signOut,
            updateUserProfile,
            refreshedToken
            }}>
            {children}
        </AuthContext.Provider>
    )
}