import { initializeApp } from '@firebase/app';
import config from '../config/config.js';
import { getStorage } from '@firebase/storage';
const db = initializeApp(config.firebaseConfig);
const storage = getStorage(db)
export default storage 