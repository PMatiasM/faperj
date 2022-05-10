import { loadThemes, loadNames, loadImages } from "./components/loadFunctions.js";
import { saveQuestion, saveEdit } from "./components/saveFunctions.js";
import { sendTheme, sendList } from "./components/sendFunctions.js";
import { hide, cancelEdit } from "./components/modFunctions.js";

(() => {
    
    loadThemes();
    loadNames();
    loadImages();

    const list = [];

    const send = document.getElementById('send');
    send.addEventListener('click', () => sendList(list));
    
    const add = document.getElementById('add');
    add.addEventListener('click', () => saveQuestion(list));

    const save = document.getElementById('save');
    save.addEventListener('click', (event) => saveEdit(event, list));

    const cancel = document.getElementById('cancel');
    cancel.addEventListener('click', cancelEdit);

    const addTheme = document.getElementById('addTheme');
    addTheme.addEventListener('click', () => hide("addThemeDiv"));
    
    const saveTheme = document.getElementById('addNewTheme');
    saveTheme.addEventListener('click', sendTheme);

})()