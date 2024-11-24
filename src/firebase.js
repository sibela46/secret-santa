const firebaseConfig = {
    apiKey: "AIzaSyA5CVEpFnlsxXJ6ehtAr8JjwWVfvL8cCmw",
    authDomain: "secret-santa-add50",
    databaseURL: "https://secret-santa-add50.firebaseio.com/",
    projectId: "secret-santa-add50"
};

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import { getFirestore, collection, setDoc, getDocs, doc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setNames(names) {
    const namesCollection = collection(db, "names");

    const toAdd = {
        names: names
    }
    // Define the document reference
    const docRef = doc(namesCollection, 'left-names-doc');
    
    // Add or update the document
    await setDoc(docRef, toAdd);
}

async function setDrawn(names) {
    const namesCollection = collection(db, "haveDrawn");
    
    const toAdd = {
        names: names
    }
    // Define the document reference
    const docRef = doc(namesCollection, 'have-drawn-doc');
    
    // Add or update the document
    await setDoc(docRef, toAdd);
}

async function getNames() {
    try {
        const querySnapshot = await getDocs(collection(db, "names"));
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error fetching names:", error);
        throw new Error("Could not fetch names"); 
    }
}

async function getDrawn() {
    try {
        const querySnapshot = await getDocs(collection(db, "haveDrawn"));
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error fetching names:", error);
        throw new Error("Could not fetch names"); 
    }
}

function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    console.log(true);
    return true;
}

export { getNames, getDrawn, setNames, setDrawn };