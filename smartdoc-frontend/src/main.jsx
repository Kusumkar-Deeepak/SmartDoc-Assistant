import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="VITE_AUTH0_DOMAIN"
      clientId="VITE_AUTH0_CLIENT_ID"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage" // to persist login for returning users
      useRefreshTokens={true}
    >
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Auth0Provider>
  </StrictMode>
);
