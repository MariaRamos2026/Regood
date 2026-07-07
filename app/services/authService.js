import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";


export const registrarUsuario = async (nombre, correo, password) => {
  const credenciales = await createUserWithEmailAndPassword(auth, correo, password);
  const uid = credenciales.user.uid;

  await setDoc(doc(db, "usuarios", uid), {
    nombre,
    correo,
    fecha_registro: new Date(),
    reputacion: 5.0
  });
  return uid;
};


export const iniciarSesion = async (correo, password) => {
  const credenciales = await signInWithEmailAndPassword(auth, correo, password);
  return credenciales.user.uid;
};