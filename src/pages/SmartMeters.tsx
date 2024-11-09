import {
  Box,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Button,
  useMediaQuery,
} from "@mui/material";
import { CardContainer } from "../components/auth/CardContainer";
import { useEffect, useState } from "react";
import { useSnackbar } from "../hooks/useSnackbar";
import { useSmartMeterService } from "../hooks/services/useSmartMeterService";
import { SmartMeterCreateDto, SmartMeterOverviewDto } from "../api/openAPI";
import { isNullOrEmptyOrWhiteSpaces } from "../hooks/useValidation";
import SmartMeterIcon from "../assets/SmartMeterIcon";

const SmartMeters = () => {
  const [addFormVisible, setAddFormVisible] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [smartMeters, setSmartMeters] = useState<
    SmartMeterOverviewDto[] | undefined
  >([
    { name: "1" },
    { name: "sllsf" },
    { name: "sllssdff" },
    { name: "sllsf" },
    { name: "sllsf" },
    { name: "sllssdff" },
    { name: "sllsf" },
    { name: "sllsf" },
    { name: "sllssdff" },
    { name: "sllsf" },
    { name: "sllssdff" },
    { name: "sllsf" },
    { name: "sllsf" },
    { name: "sllssdff" },
    { name: "sllsf" },
    { name: "sllssdff" },
    { name: "sllsf" },
    { name: "sllsf" },
    { name: "sllssdff" },
  ]);
  const [smartMeterNameError, setSmartMeterNameError] = useState(false);
  const [smartMeterNameErrorMessage, setSmartMeterNameErrorMessage] =
    useState("");

  const { getSmartMeters, addSmartMeter } = useSmartMeterService();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

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
      setSmartMeterNameErrorMessage("Smart Meter Name must be unique.");
      return false;
    }

    setSmartMeterNameError(false);
    setSmartMeterNameErrorMessage("");
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          visibility: addFormVisible ? "visible" : "hidden",
          width: {
            xs: "90%", // Applies when screen width is below 600px
            sm: "65%", // Applies when screen width is 600px or above
          },
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
      <div
        style={{
          position: "relative",
          height: "100vh",
          width: "100vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row", // Column layout for small screens
            flexWrap: isSmallScreen ? "nowrap" : "wrap", // Wrap only on larger screens
            justifyContent: isSmallScreen ? "center" : "space-between",
            overflowY: "auto",
          }}
        >
          {smartMeters &&
            smartMeters.map((sm) => (
              <Button
                key={sm.name}
                variant="text"
                sx={{
                  flexDirection: "column",
                  color: "white",
                  flex: isSmallScreen ? "1 1 100%" : "1 1 30%", // Full width on small screens
                  boxSizing: "content-box",
                }}
              >
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {sm.name}
                </Typography>
                <SmartMeterIcon />
              </Button>
            ))}
        </div>
      </div>
    </CardContainer>
  );
};

export default SmartMeters;
