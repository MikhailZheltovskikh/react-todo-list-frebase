import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyDQ85F0qeWxFJ_d5x752JkCcl_0p2M6Smw',
	authDomain: 'todo-b8af6.firebaseapp.com',
	projectId: 'todo-b8af6',
	storageBucket: 'todo-b8af6.appspot.com',
	messagingSenderId: '451328662463',
	appId: '1:451328662463:web:18e6f0961276fb1f501f0a',
	databaseURL: "https://todo-b8af6-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app)
