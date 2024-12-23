import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:7080",
  realm: "kong-frontend", // to change
  clientId: "kong-frontend", // to change
});

export default keycloak;
