import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";

import AuthenticatedAPI from "./components/AuthenticatedAPI";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "https://aegisagent-api",
          scope: "openid profile email agent:read agent:execute agent:manage"
        }}
      >

        <AuthenticatedAPI>
          <App />
        </AuthenticatedAPI>

      </Auth0Provider>

  </React.StrictMode>

);