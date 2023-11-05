/* eslint-disable no-undef */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDocs,
  collection,
  where,
  query,
  addDoc,
  setDoc,
  deleteDoc,
  getDoc

} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();

export async function userExists(correo, pwd) {
    let user = null;
    try {
        const q = query(collection(db, "Usuarios"), where("Correo", "==", correo), where("Password", "==", pwd));
        const querySnapshot = await getDocs(q);
  
        querySnapshot.forEach((doc) => { 
            if (doc.data() != null) {
                user = doc.data()
              }
        })
        return user;
    } catch (error) {
        console.log(error)
        return user = null;
    }
    
}

export async function ObtenerDataDB(refTable) {
  const users = [];
  const q = query(collection(db, refTable));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const user = { ...doc.data() };
    user.docId = doc.id;
    users.push(user);
  });

  return users;
}

export async function CreateNewElement(refTable, element) {
  try {
    const linksRef = collection(db, refTable);
    const res = await addDoc(linksRef, element);
    return res;
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function DeleteElement(refTable, docId) {
  try {
    await deleteDoc(doc(db, refTable, docId));
    return docId;
  } catch (error) {
    console.log(error);
  }
}

export async function UpdateElement(refTable, docId, element) {
  try {
    const res = await setDoc(doc(db, refTable, docId), element);
    console.log("elemento actualizado", docId, element, res);
  } catch (error) {
    console.log(error);
  }
}

export async function RecordCount(refTable) {
  try {
    const querySnapshot = await getDocs(collection(db, refTable));
    const count = querySnapshot.size;
    return count;
  } catch (error) {
    console.error(error);
    throw error; 
  }
}


export async function getRegisterInfo(Folio) {
  //const docRef = doc(db, "Registros", Folio);
  //const docSnap = await getDoc(docRef);
  //return docSnap.data();
  let Registro = null;
    try {
        const q = query(collection(db, "Registros"), where("Folio", "==", Folio));
        const querySnapshot = await getDocs(q);
  
        querySnapshot.forEach((doc) => { 
            if (doc.data() != null) {
               Registro = doc.data()
              }
        })
        return Registro;
    } catch (error) {
        console.log(error)
        return Registro = null;
    }
}