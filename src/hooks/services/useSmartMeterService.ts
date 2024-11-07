import { useCallback, useContext } from "react";
import { ApiContext } from "../../components/context/ApiContext.tsx";
import { ProblemDetails, SmartMeterOverviewDto } from "../../api/openAPI";
import { AxiosError } from "axios";

export const useSmartMeterService = () => {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error(
      "useSmartMeterService must be used within an ApiContextProvider"
    );
  }

  const { smartMeterApi } = context;

  const getSmartMeters = useCallback(async (): Promise<
    SmartMeterOverviewDto[]
  > => {
    try {
      const response = await smartMeterApi.getSmartMeters();

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ProblemDetails>;
      const errorMessage =
        axiosError.response?.data.title || axiosError.message;
      throw new Error(errorMessage);
    }
  }, [smartMeterApi]);

  return {
    getSmartMeters,
  };
};
