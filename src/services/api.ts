import axios, { AxiosInstance } from 'axios';
import { AppError } from '../utils/AppError';
import { useAuth } from '../hooks/useAuth';

type SignOut = () => void;

type APIInstanceProps = AxiosInstance & {
    registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

const api = axios.create({
    baseURL: 'http://192.168.15.200:3333',
}) as APIInstanceProps;

api.registerInterceptTokenManager = (signOut) => {
    const InterceptTokenManager = api.interceptors.response.use((response) => response, (requestError) => {

        if (requestError?.response?.status === 401) {
            if(requestError.response.data?.message === 'token.expired'  ||requestError.response.data?.message === 'token.invalid') {

            }
            signOut();
        }



        if(requestError.response && requestError.response.data){
            return Promise.reject(new AppError(requestError.response.data.message));
        }else{
            return Promise.reject(requestError);
        }
    });


    return () =>{
        api.interceptors.response.eject(InterceptTokenManager);
    }
}









export { api };