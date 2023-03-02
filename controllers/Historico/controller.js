import { ObjectId } from "mongodb";
import { getDB } from "../../db/db.js";
import jwt_decode from "jwt-decode";

const queryAllUsers = async (callback) => {
  const baseDeDatos = getDB();
  console.log("query");
  await baseDeDatos.collection("usuarios").find({}).limit(50).toArray(callback);
};

const queryAllHistoric = async (callback) => {
  const baseDeDatos = getDB();
  console.log("query");
  await baseDeDatos
    .collection("historial")
    .find({})
    .sort("fecha", -1)
    .toArray(callback);
};

const crearUsuario = async (datosUsuario, callback) => {
  const baseDeDatos = getDB();
  await baseDeDatos.collection("usuarios").insertOne(datosUsuario, callback);
};

const consultarUsuario = async (id, callback) => {
  const baseDeDatos = getDB();
  await baseDeDatos
    .collection("usuarios")
    .findOne({ _id: new ObjectId(id) }, callback);
};

const consultarOCrearUsuario = async (req, callback) => {
  console.log("Estoy llegando a crear usuarios");
  // 6.1. obtener los datos del usuario desde el token
  const token = req.headers.authorization.split("Bearer ")[1];
  console.log("toke decodificado", jwt_decode(token));
  const user = jwt_decode(token)["http://localhost/userData"];
  console.log(user);

  // 6.2. con el correo del usuario o con el id de auth0, verificar si el usuario ya esta en la bd o no
  const baseDeDatos = getDB();
  await baseDeDatos
    .collection("usuarios")
    .findOne({ email: user.email }, async (err, response) => {
      console.log("response consulta bd", response);
      if (response) {
        // 7.1. si el usuario ya esta en la BD, devuelve la info del usuario
        callback(err, response);
      } else {
        // 7.2. si el usuario no esta en la bd, lo crea y devuelve la info
        user.auth0ID = user._id;
        delete user._id;
        user.rol = "sin rol";
        user.estado = "pendiente";
        await crearUsuario(user, (err, respuesta) => callback(err, user));
      }
    });
};

const editarHistorico = async (id, edicion, callback) => {
  const filtroUsuario = { _id: new ObjectId(id) };
  const operacion = {
    $set: edicion,
  };
  const baseDeDatos = getDB();
  await baseDeDatos
    .collection("historial")
    .findOneAndUpdate(
      filtroUsuario,
      operacion,
      { upsert: true, returnOriginal: true },
      callback
    );
};

const eliminarUsuario = async (id, callback) => {
  const filtroUsuario = { _id: new ObjectId(id) };
  const baseDeDatos = getDB();
  await baseDeDatos.collection("usuarios").deleteOne(filtroUsuario, callback);
};

export {
  queryAllUsers,
  queryAllHistoric,
  crearUsuario,
  consultarUsuario,
  editarHistorico,
  eliminarUsuario,
  consultarOCrearUsuario,
};
