import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const find = async (path: string, ...pathSegments: string[]) => {
  return await getDoc(doc(db, path, ...pathSegments));
};

const all = async (path: string, ...pathSegments: string[]) => {
  return await getDocs(collection(db, path, ...pathSegments));
};

const get1 = async (
  path: string,
  pathSegments: string[],
  ...whereCond: QueryConstraint[]
) => {
  return await getDocs(
    query(collection(db, path, ...pathSegments), ...whereCond),
  );
};

const get = (path: string, ...pathSegments: string[]) => {
  return {
    where: async (...whereCond: QueryConstraint[]) =>
      await getDocs(query(collection(db, path, ...pathSegments), ...whereCond)),
  };
};

const set1 = async (data: any, path: string, ...pathSegments: string[]) => {
  return await setDoc(doc(db, path, ...pathSegments), data, { merge: true });
};

const set = (path: string, ...pathSegments: string[]) => {
  return {
    value: async (data: any) =>
      await setDoc(doc(db, path, ...pathSegments), data, { merge: true }),
  };
};

const setUnMerged = (path: string, ...pathSegments: string[]) => {
  return {
    value: async (data: any) =>
      await setDoc(doc(db, path, ...pathSegments), data),
  };
};

const add1 = async (data: any, path: string) => {
  return await addDoc(collection(db, path), data);
};

const add = (path: string, ...pathSegments: string[]) => {
  return {
    value: async (data: any) =>
      await addDoc(collection(db, path, ...pathSegments), data),
  };
};

const update1 = async (data: any, path: string, ...pathSegments: string[]) => {
  await updateDoc(doc(db, path, ...pathSegments), data);
};

const update = (path: string, ...pathSegments: string[]) => {
  return {
    value: async (data: any) => {
      await updateDoc(doc(db, path, ...pathSegments), data);
    },
  };
};

// const remove = async (path: string, ...pathSegments: string[]) => {
//   await deleteDoc(doc(db, path, ...pathSegments));
// };

const remove = async (path: string, ...pathSegments: string[]) => {
  await deleteDoc(doc(db, path, ...pathSegments));
};

const count = (path: string, ...pathSegments: string[]) => {
  return {
    where: async (...whereCond: QueryConstraint[]) => {
      const snap = await getCountFromServer(
        query(collection(db, path), ...whereCond),
      );

      return snap.data().count;
    },
  };
};

// const count = async (path: string, ...whereCond: QueryConstraint[]) => {
//   const snap = await getCountFromServer(
//     query(collection(db, path), ...whereCond)
//   );

//   return snap.data().count;
// };
const getUserSavedItems = (userId: string) => {
  if (!userId) throw new Error("User ID is required");

  return {
    where: async (...whereCond: QueryConstraint[]) =>
      await get("users", userId, "savedItems").where(...whereCond),
  };
};

export {
  add,
  all,
  count,
  find,
  get, getUserSavedItems, orderBy,
  remove,
  serverTimestamp,
  set,
  setUnMerged,
  update,
  where
};

