import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import "./css/index.css";
import SignUp from "./components/signUp/SignUp.tsx";
import SignIn from "./components/signIn/SignIn.tsx";
import AppTheme from "./themes/AppTheme.tsx";
import { CssBaseline } from "@mui/material";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "signin",
    element: <SignIn />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppTheme>
      <CssBaseline/>
      <RouterProvider router={router} />
    </AppTheme>
  </StrictMode>
);
