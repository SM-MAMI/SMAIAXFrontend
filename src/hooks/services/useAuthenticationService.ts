import { useCallback, useContext } from 'react';
import { ApiContext } from '../../components/context/ApiContext.tsx';
import {
    LoginDto,
    ProblemDetails,
    RegisterDto, TokenDto,
} from '../../api/openAPI';
import { AxiosError } from 'axios';

export const useAuthenticationService = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useAuthenticationService must be used within an ApiContextProvider');
    }

    const { authenticationApi } = context;

    const register = useCallback(
        async (registerDto: RegisterDto): Promise<string> => {
            try {
                const response = await authenticationApi.apiAuthenticationRegisterPost(registerDto);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title || axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [authenticationApi],
    );

    const login = useCallback(
        async (loginDto: LoginDto): Promise<TokenDto> => {
            try {
                const response = await authenticationApi.apiAuthenticationLoginPost(loginDto);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title || axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [authenticationApi],
    );

    const logout = useCallback(
        async (tokenDto: TokenDto): Promise<void> => {
            try {
                await authenticationApi.apiAuthenticationLogoutPost(tokenDto);
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title || axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [authenticationApi],
    );

    const refresh = useCallback(
        async (tokenDto: TokenDto): Promise<TokenDto> => {
            try {
                const response = await authenticationApi.apiAuthenticationRefreshPost(tokenDto);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title || axiosError.message;
                throw new Error(errorMessage);
            }
        },
        [authenticationApi],
    );

    return {
        register,
        login,
        logout,
        refresh,
    };
};
