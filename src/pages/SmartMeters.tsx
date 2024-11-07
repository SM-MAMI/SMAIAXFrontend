import {
  Box,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { CardContainer } from "../components/auth/CardContainer";
import { useState } from "react";
import { useSnackbar } from "../hooks/useSnackbar";

const SmartMeters = () => {
  const [addFormVisible, setAddFormVisible] = useState(false);
  const { showSnackbar } = useSnackbar();

  const addSmartMeter = () => {
    setAddFormVisible(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const smartMeterName = data.get("smartMeterName");

    //todo: check if smart meter name is unique.

    try {
      // todo add smart meter

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
        <Button variant="contained" size="large" onClick={addSmartMeter}>
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
            color="primary"
          />
        </FormControl>
        <div style={{ textAlign: "right" }}>
          <Button type="submit" variant="outlined">
            Ok
          </Button>
        </div>
      </Box>
    </CardContainer>
  );
};

export default SmartMeters;
