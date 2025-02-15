import { useCallback, useContext } from 'react';
import { ApiContext } from '../../provider/context/ApiContext.tsx';
import { LoginDto, ProblemDetails, RegisterDto, TokenDto } from '../../api/openAPI';
import { AxiosError } from 'axios';
import { getErrorDetails } from '../../utils/helper.ts';

export const useAuthenticationService = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useAuthenticationService must be used within an ApiContextProvider');
    }

    const { authenticationApi } = context;

    const register = useCallback(
        async (registerDto: RegisterDto): Promise<string> => {
            try {
                const response = await authenticationApi.register(registerDto);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                throw new Error(getErrorDetails(axiosError));
            }
        },
        [authenticationApi]
    );

    const login = useCallback(
        async (loginDto: LoginDto): Promise<TokenDto> => {
            try {
                const response = await authenticationApi.login(loginDto);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                throw new Error(getErrorDetails(axiosError));
            }
        },
        [authenticationApi]
    );

    const logout = useCallback(
        async (tokenDto: TokenDto): Promise<void> => {
            try {
                await authenticationApi.logout(tokenDto);
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                throw new Error(getErrorDetails(axiosError));
            }
        },
        [authenticationApi]
    );

    const refresh = useCallback(
        async (tokenDto: TokenDto): Promise<TokenDto> => {
            try {
                const response = await authenticationApi.refresh(tokenDto);
                return response.data;
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                throw new Error(getErrorDetails(axiosError));
            }
        },
        [authenticationApi]
    );

    return {
        register,
        login,
        logout,
        refresh,
    };
};
