import { clean, hide } from "./modFunctions.js";
import { Register } from "./register.js";

function saveQuestion(list) {
    const registersDiv = document.getElementById("questionsDiv");
    
    const infos = verifyQuestion();

    if(!infos) {
        return;
    };

    const question = infos.question;
    const name = infos.name;
    const theme = infos.theme;
    const path = infos.path;

    if(list.length == 0) {
        hide('send');
    };

    list.push(question);

    registersDiv.insertBefore(Register(list, theme, name, path, question), registersDiv.firstChild);
    
    clean();
};

function saveEdit(event, list) {
    const saveButton = event.currentTarget;
    const id = saveButton.dataset.save;
    const oldRegister = document.querySelector(`[data-id="${id}"]`)

    const infos = verifyQuestion();
    if(!infos) {
        return;
    };

    const question = infos.question;
    const name = infos.name;
    const theme = infos.theme;
    const path = infos.path;

    list[id] = question;

    const register = Register(list, theme, name, path, question);
    register.dataset.id = id;
    register.firstChild.dataset.menu = id;
    register.lastChild.dataset.question = id;

    oldRegister.replaceWith(register);

    saveButton.removeAttribute('data-save');

    clean();
    hide("add");
    hide("save");
    hide("cancel");
};

function verifyQuestion() {
    let prompt = document.querySelector("[name='statement']").value;
    if(prompt === '') {
        window.alert("The prompt cannot be null");
        return;
    }

    const alternatives = document.querySelectorAll("[name='alternatives']");
    const answers = [];
    let index = 0;

    for(const alternative of alternatives) {
        if(alternative.value) {
            answers.push(alternative.value)
        } else if(alternatives[index+1] !== undefined) {
            if(alternatives[index+1].value != '') {
                window.alert("Do not leave a blank field between the answers");
                return;
            }
        }
        index++;
    }

    const correct = document.querySelector("[ name='correct' ]").value;
    if(!correct || !alternatives[correct].value) {
        window.alert("The correct answer cannot be null");
        return;
    }
    
    const themeSelect = document.querySelector('[ name=theme ]');
    const theme = themeSelect.options[themeSelect.selectedIndex].text;
    const themeId = themeSelect.value;
    if(!themeId) {
        window.alert("The theme cannot be null")
        return;
    }

    const nameSelect = document.querySelector('[ name=name ]');
    const name = nameSelect.options[nameSelect.selectedIndex].text;
    const nameId = nameSelect.value;
    if(!nameId) {
        window.alert("The name cannot be null")
        return;
    }

    const images = document.querySelectorAll('[ name=image ]');
    let path = null;
    let imageId = null;
    for(const image of images) {
        if(image.checked) {
            path = image.nextSibling.getAttribute('src');
            imageId = image.value;
        }
    }
    if(!imageId) {
        window.alert("The image cannot be null")
        return;
    }

    const characterId = {
        nameId,
        imageId
    };

    const difficulty = document.querySelector("#difficultyRange").value;

    const question = {
        prompt,
        answers,
        correct,
        themeId,
        characterId,
        difficulty
    };

    const infos = {
        question,
        theme,
        name,
        path
    };

    return infos;
};

export { saveQuestion, saveEdit };