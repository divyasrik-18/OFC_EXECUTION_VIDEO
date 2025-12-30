import { openDB } from 'idb';

const DB_NAME = 'BSNL_GIS_System';
const DB_VERSION = 2;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('surveys')) {
        db.createObjectStore('surveys', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files');
      }
    },
  });
};

export const saveSurveyToDB = async (data) => {
  const db = await initDB();
  return db.put('surveys', data);
};

export const getAllSurveys = async () => {
  const db = await initDB();
  return db.getAll('surveys');
};

export const deleteSurveyFromDB = async (id) => {
  const db = await initDB();
  await db.delete('surveys', id);
};

export const updateSurveyInDB = async (data) => {
  const db = await initDB();
  return db.put('surveys', data);
};

export const saveMediaToDisk = async (fileId, fileBlob) => {
  if (!fileBlob) return;
  const db = await initDB();
  return db.put('files', fileBlob, fileId);
};

export const getMediaFromDisk = async (fileId) => {
  const db = await initDB();
  return db.get('files', fileId);
};

export const deleteMediaFromDisk = async (fileId) => {
  const db = await initDB();
  return db.delete('files', fileId);
};