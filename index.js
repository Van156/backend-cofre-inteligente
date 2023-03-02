// hacer el import de express tradicional
// const express = require('express');

// hacer el nuevo import

import Express from "express";
import Cors from "cors";
import dotenv from "dotenv";
import { conectarBD } from "./db/db.js";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

import rutasUsuario from "./views/usuarios/rutas.js";
import rutasHistorico from "./views/historicos/rutas.js";
import rutasSolicitud from "./views/solicitudes/rutas.js";

import autorizacionEstadoUsuario from "./middleware/autorizacionEstadoUsuario.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT || 5000;

const app = Express();

app.use(Express.json());
app.use(Cors());

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri:
      "https://proyecto-final-electronica.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "api-cofre-inteligente-administracion-llaves",
  issuer: "https://proyecto-final-electronica.us.auth0.com/",
  algorithms: ["RS256"],
});

// 4 y 5: enviarle el token a auth0 para que devuelva si es valido o no
app.use(jwtCheck);

app.use(autorizacionEstadoUsuario);

app.use(rutasUsuario);

app.use(rutasHistorico);
app.use(rutasSolicitud);

const main = () => {
  return app.listen(port, () => {
    console.log(`escuchando puerto ${port}`);
  });
};

const index = {
  handler: conectarBD(main),
};

export default index;
