import Express from "express";
import {
  queryAllUsers,
  queryAllHistoric,
  crearUsuario,
  editarHistorico,
  eliminarUsuario,
  consultarUsuario,
  consultarOCrearUsuario,
} from "../../controllers/Historico/controller.js";

const rutasHistorico = Express.Router();

const genercCallback = (res) => (err, result) => {
  if (err) {
    res.status(500).send("Error consultando los historicos");
  } else {
    res.json(result);
  }
};

rutasHistorico.route("/historicos").get((req, res) => {
  console.log("alguien hizo get en la ruta /historicos");
  queryAllHistoric(genercCallback(res));
});

rutasHistorico.route("/historicos").post((req, res) => {
  crearUsuario(req.body, genercCallback(res));
});

rutasHistorico.route("/historicos/self").get((req, res) => {
  console.log("alguien hizo get en la ruta /self");
  consultarOCrearUsuario(req, genercCallback(res));
  // consultarUsuario(, genercCallback(res));
});

rutasHistorico.route("/historicos/:id").get((req, res) => {
  console.log("alguien hizo get en la ruta /historicos");
  consultarUsuario(req.params.id, genercCallback(res));
});

rutasHistorico.route("/historicos/:id").patch((req, res) => {
  editarHistorico(req.params.id, req.body, genercCallback(res));
});

rutasHistorico.route("/historicos/:id").delete((req, res) => {
  eliminarUsuario(req.params.id, genercCallback(res));
});

export default rutasHistorico;
