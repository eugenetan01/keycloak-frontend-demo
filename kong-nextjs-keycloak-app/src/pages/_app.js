import "@/styles/globals.css";

import React, { useEffect, useState } from "react";
import keycloak from "../utils/keycloak";

export default function MyApp({ Component, pageProps }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .then((auth) => {
        setAuthenticated(auth);
        if (auth) {
          console.log("Authenticated");
        } else {
          console.log("Not authenticated");
        }
      })
      .catch((err) => {
        console.error("Failed to initialize Keycloak", err);
      });
  }, []);

  if (!authenticated) {
    return <div>Loading...</div>; // Optional loading screen
  }

  return <Component {...pageProps} />;
}
