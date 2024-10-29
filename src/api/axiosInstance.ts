import axios, { AxiosInstance, AxiosError } from 'axios';
import { ProblemDetails, TokenDto } from './openAPI';
import { BASE_PATH } from './openAPI/base.ts';

type RefreshTokenFunction = (tokenDto: TokenDto) => Promise<TokenDto>;

export const createAxiosInstance = (refresh: RefreshTokenFunction): AxiosInstance => {
    const axiosInstance = axios.create({
        baseURL: BASE_PATH,
    });

    axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    });

    axiosInstance.interceptors.response.use((response) => response,
        async (error: AxiosError) => {
            if (error.config == null || error.response?.status !== 401) {
                return Promise.reject(error);
            }

            const refreshToken = localStorage.getItem('refresh_token');
            const accessToken = localStorage.getItem('access_token');
            if (!refreshToken || !accessToken) {
                window.location.href = '/signin';
                return Promise.reject(new Error('No token available'));
            }

            try {
                const tokenDto: TokenDto = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };

                const newTokenDto = await refresh(tokenDto);

                localStorage.setItem('access_token', newTokenDto.accessToken);
                localStorage.setItem('refresh_token', newTokenDto.refreshToken);

                error.config.headers['Authorization'] = `Bearer ${newTokenDto.accessToken}`;
                return await axiosInstance.request(error.config);
            } catch (error) {
                const axiosError = error as AxiosError<ProblemDetails>;
                const errorMessage = axiosError.response?.data.title || axiosError.message;

                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                window.location.href = '/signin';
                return Promise.reject(new Error(errorMessage));
            }
        },
    );

    return axiosInstance;
};
