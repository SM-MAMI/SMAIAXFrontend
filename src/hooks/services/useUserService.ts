import { useCallback, useContext } from 'react';
import { ApiContext } from '../../components/context/ApiContext.tsx';
import { ProblemDetails, UserDto } from '../../api/openAPI';
import { AxiosError } from 'axios';

export const useUserService = () => {
    const context = useContext(ApiContext);

    if (!context) {
        throw new Error('useAuthenticationService must be used within an ApiContextProvider');
    }

    const { userApi } = context;

    const getUser = useCallback(async (): Promise<UserDto> => {
        try {
            const response = await userApi.getUser();
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ProblemDetails>;
            const errorMessage = axiosError.response?.data.title || axiosError.message;
            throw new Error(errorMessage);
        }
    }, [userApi]);

    return { getUser };
};
