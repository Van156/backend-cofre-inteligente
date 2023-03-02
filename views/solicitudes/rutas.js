import Express from "express";
import {
  queryAllSolictuds,
  crearSolicitud,
  editarSolicitud,
  eliminarUsuario,
  consultarSolicitudesUsuario,
  consultarOCrearUsuario,
} from "../../controllers/solicitudes/controller.js";

const rutasSolicitudes = Express.Router();

const genercCallback = (res) => (err, result) => {
  if (err) {
    res.status(500).send("Error consultando los solicitudes");
  } else {
    res.json(result);
  }
};

rutasSolicitudes.route("/solicitudes").get((req, res) => {
  console.log("alguien hizo get en la ruta /solicitudes");
  queryAllSolictuds(genercCallback(res));
});

rutasSolicitudes.route("/solicitudes").post((req, res) => {
  crearSolicitud(req.body, genercCallback(res));
});

rutasSolicitudes.route("/solicitudes/self").get((req, res) => {
  console.log("alguien hizo get en la ruta /self");
  consultarOCrearUsuario(req, genercCallback(res));
  // consultarUsuario(, genercCallback(res));
});

rutasSolicitudes.route("/solicitudes/:id").get((req, res) => {
  console.log("alguien hizo get en la ruta /solicitudes con id ");
  consultarSolicitudesUsuario(req.params.id, genercCallback(res));
});

rutasSolicitudes.route("/solicitudes/:id").patch((req, res) => {
  console.log("alguien hizo patch en la ruta /solicitudes con id ");
  editarSolicitud(req.params.id, req.body, genercCallback(res));
});

rutasSolicitudes.route("/solicitudes/:id").delete((req, res) => {
  eliminarUsuario(req.params.id, genercCallback(res));
});

export default rutasSolicitudes;
