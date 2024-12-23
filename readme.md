# Setup for Keycloak

1. go to parent dir and `docker-compose up` - start keycloak

    - username: `admin`

    - password: `admin`

2. go to `http://localhost:7080` - access Keycloak

3. create Realm called `kong-frontend`

4. create Client called `kong-frontend`

5. configure following access settings:

    ![](./img/settings_access.png)

    - ensure that `Valid redirect URIs` have a trailing `/`

6. create user and specify any username and save

7. go to `credentials` in the user page and set a password

# Setup for Frontend

1. `npm install keycloak-js @react-keycloak/web` - install keycloak js adapter

2. `npm run dev` - start web app

# Setup for Kong

1. create an openid connect plugin on a Kong service and route

    - Note: we change introspection and JWKS endpoint since it is running on localhost, and discovery endpoints return localhost hostnames. If keycloak is mapped to a proper DNS record, can avoid those 2 steps.
    - Add the issuer to keycloak discovery endpoint like so: `http://keycloak:7080/realms/<realm-name>`
    - Auth methods: `Introspection`, `Bearer Acces Token`
    - Introspection endpoint: `http://keycloak:7080/realms/<realm-name>/protocol/openid-connect/token/introspect`
    - JWKS Endpoint: `http://keycloak:7080/realms/kong-frontend/protocol/openid-connect/certs`

# Execution for Authentication

1. navigate to `http://localhost:3001` to login

    - username and password same as in __Setup for Keycloak__ step 6 and 7

2. Retrieve access token from UI

3. Import the curl to Insomnia or any tool from `config/curl-request/curl.md`

4. Test the API by calling the cURL with access token from the keycloak UI in step 2

# Setup for Authorisation

1. go to Groups in your realm

    - create a group called `developers`, give it a name and click save

2. add member to created group in step 1 and add user to created group in step #1

3. go to your realm -> `client scopes` -> click `profile`

    - click `mapper` and click `By configuration`
    - click `group membership`
    - Fill in below values:
        - `Name`: `groups`
        - `Token claim name`: `groups`
    - _Note: This ensures that groups claim will be added to JWT token generation_

4. go to konnect and edit the OpenID Connect plugin

    - Under Authorization:
        - delete value from `groups claim` field
        - add `groups` to the `Authenticated Groups Claim` field

5. create ACL plugin on route level with following settings:

    - `config.deny`: `developers`
    - check `Always Use Authenticated Groups`
    - click save

# Execution for Authorisation

1. go back to browser -> `http://localhost:3001` and refresh to generate a new access token

2. inspect the token on `jwt.io` to verify groups claim was added to access token -> copy the JWT token

3. test the API by calling the cURL with access token from the keycloak UI in step 2

4. see 200 OK accessing the API

5. Change the ACL plugin to move `developers` to `config.allow` instead

6. See a `403 - unauthorized` instead

# References

1. [Link](https://www.geeksforgeeks.org/how-to-implement-keycloak-authentication-in-react/) - Keycloak js adapter guide for react

2. [Link](https://www.keycloak.org/securing-apps/javascript-adapter) - official docs getting started keycloak js adapter

3. [Link](https://stackoverflow.com/questions/76919561/group-is-not-coming-in-jwt-token-in-keycloak-23-0-0) for keycloak setup for groups claim
