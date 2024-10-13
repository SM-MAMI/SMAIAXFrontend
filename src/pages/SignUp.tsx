import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SitemarkIcon } from "../assets/CustomIcons.tsx";
import { Link as RouterLink } from "react-router-dom";
import { CardContainer, Card } from "../components/CardContainer.tsx";
import { EmailRegex } from "../constants/constants.ts";

export default function SignUp() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [firstnameError, setFirstnameError] = React.useState(false);
  const [firstnameErrorMessage, setFirstnameErrorMessage] = React.useState("");
  const [lastnameError, setLastnameError] = React.useState(false);
  const [lastnameErrorMessage, setLastnameErrorMessage] = React.useState("");

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const firstname = document.getElementById("firstname") as HTMLInputElement;
    const lastname = document.getElementById("lastname") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !EmailRegex.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!firstname.value || firstname.value.length < 1) {
      setFirstnameError(true);
      setFirstnameErrorMessage("First name is required.");
      isValid = false;
    } else {
      setFirstnameError(false);
      setFirstnameErrorMessage("");
    }

    if (!lastname.value || lastname.value.length < 1) {
      setLastnameError(true);
      setLastnameErrorMessage("Last name is required.");
      isValid = false;
    } else {
      setLastnameError(false);
      setLastnameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      name: data.get("name"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <CardContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <SitemarkIcon />
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel htmlFor="firstname">First name</FormLabel>
            </Box>
            <TextField
              autoComplete="firstname"
              name="firstname"
              required
              fullWidth
              id="firstname"
              placeholder="Jon"
              error={firstnameError}
              helperText={firstnameErrorMessage}
              color={firstnameError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel htmlFor="lastname">Last name</FormLabel>
            </Box>
            <TextField
              autoComplete="lastname"
              name="lastname"
              required
              fullWidth
              id="lastname"
              placeholder="Snow"
              error={lastnameError}
              helperText={lastnameErrorMessage}
              color={lastnameError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel htmlFor="email">Email</FormLabel>
            </Box>
            <TextField
              required
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              error={emailError}
              helperText={emailErrorMessage}
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          <FormControl>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <FormLabel htmlFor="password">Password</FormLabel>
            </Box>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          <Divider />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            Sign up
          </Button>
          <Typography sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <span>
              <Link
                component={RouterLink}
                to="/signin"
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                Sign in
              </Link>
            </span>
          </Typography>
        </Box>
      </Card>
    </CardContainer>
  );
}
