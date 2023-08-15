import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

  
export const putDb = async (content) => console.error('putDb not implemented');

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log('GET from the database');

// Create connection to database 'jate' and version '1'
  const jateDB = await openDB('jate', 1);

// Create a new transaction and specify db name and data privileges
  const tx = jateDB.transaction('jate', 'readonly');

// Open up the desired object store.
  const store = tx.objectStore('jate');

// Use getAll method to get all data in the database
  const request = store.getAll();

// Get confirmation of the request
  const result = await request
  console.log('result.value', result);
  return result;
};

initdb();
