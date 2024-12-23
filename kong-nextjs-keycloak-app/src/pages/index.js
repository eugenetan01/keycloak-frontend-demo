import React, { useState, useEffect } from "react";
import keycloak from "../utils/keycloak";

export default function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (keycloak.authenticated) {
      // Load user info
      keycloak.loadUserInfo().then((info) => {
        setUserInfo(info);
      });
      // Get and set the access token
      setAccessToken(keycloak.token);
    }
  }, []);

  const logout = () => {
    keycloak.logout();
  };

  return (
    <div>
      <h1>Welcome to the Next.js App with Keycloak</h1>
      {userInfo ? (
        <>
          <p>Logged in as: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
          <p>
            Access Token: <code>{accessToken}</code>
          </p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}
