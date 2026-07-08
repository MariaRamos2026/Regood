import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../config/firebaseConfig";

// registro
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

// inicio sesión
export const iniciarSesion = async (correo, password) => {
  const credenciales = await signInWithEmailAndPassword(auth, correo, password);
  return credenciales.user.uid;
};

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);
  return { user };
}