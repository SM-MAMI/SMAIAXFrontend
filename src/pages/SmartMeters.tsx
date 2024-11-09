import {
  Box,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { CardContainer } from "../components/auth/CardContainer";
import { useEffect, useState } from "react";
import { useSnackbar } from "../hooks/useSnackbar";
import { useSmartMeterService } from "../hooks/services/useSmartMeterService";
import { SmartMeterCreateDto, SmartMeterOverviewDto } from "../api/openAPI";
import { isNullOrEmptyOrWhiteSpaces } from "../hooks/useValidation";

const SmartMeters = () => {
  const [addFormVisible, setAddFormVisible] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [smartMeters, setSmartMeters] = useState<
    SmartMeterOverviewDto[] | undefined
  >(undefined);
  const [smartMeterNameError, setSmartMeterNameError] = useState(false);
  const [smartMeterNameErrorMessage, setSmartMeterNameErrorMessage] =
    useState("");

  const { getSmartMeters, addSmartMeter } = useSmartMeterService();

  useEffect(() => {
    const loadSmartMeters = async () => {
      try {
        const sms = await getSmartMeters();
        setSmartMeters(sms);
      } catch (error) {
        console.log(error);
        showSnackbar("error", `Failed to load smart meters!`);
      }
    };
    void loadSmartMeters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSmartMeters]);

  const openAddForm = () => {
    setAddFormVisible(true);
  };

  const validateSmartMeterName = (smName: string): boolean => {
    if (isNullOrEmptyOrWhiteSpaces(smName)) {
      setSmartMeterNameError(true);
      setSmartMeterNameErrorMessage("Smart meter name is requiered.");
      return false;
    }

    if (smartMeters?.map((sm) => sm.name).includes(smName)) {
      setSmartMeterNameError(true);
      setSmartMeterNameErrorMessage("Smart meter name must be unique.");
      return false;
    }

    setSmartMeterNameError(false);
    setSmartMeterNameErrorMessage("");
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const smartMeterName = data.get("smartMeterName") as string;

    validateSmartMeterName(smartMeterName);
    const smartMeterDto: SmartMeterCreateDto = {
      name: smartMeterName,
    };

    try {
      await addSmartMeter(smartMeterDto);
      setAddFormVisible(false);
      showSnackbar("success", "Successfully added smart meter!");
    } catch (error) {
      console.log(error);
      showSnackbar("error", `Smart meter could not be added!`);
    }
  };

  return (
    <CardContainer sx={{ gap: "10px", alignItems: "center" }}>
      <Typography
        component="h1"
        variant="h4"
        sx={{
          width: "100%",
          fontSize: "clamp(2rem, 10vw, 2.15rem)",
          textAlign: "center",
        }}
      >
        Smart Meters
      </Typography>
      <div>
        <Button variant="contained" size="large" onClick={openAddForm}>
          +
        </Button>
      </div>
      <Box
        component="form"
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        className="responsive-box"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          visibility: addFormVisible ? "visible" : "hidden",
        }}
      >
        <FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormLabel htmlFor="smartMeterName">Smart Meter Name</FormLabel>
          </Box>
          <TextField
            fullWidth
            id="smartMeterName"
            placeholder="SM1"
            name="smartMeterName"
            autoComplete="smartMeterName"
            color={smartMeterNameError ? "error" : "primary"}
            error={smartMeterNameError}
            helperText={smartMeterNameErrorMessage}
          />
        </FormControl>
        <div style={{ textAlign: "right" }}>
          <Button type="submit" variant="outlined">
            Ok
          </Button>
        </div>
      </Box>
      <div>{smartMeters && smartMeters.map((sm) => sm.name)}</div>
    </CardContainer>
  );
};

export default SmartMeters;
