import { hide } from "./modFunctions.js";

const EditButton = (list) => {
    const editButton = document.createElement('img');
    editButton.classList.add('delEdit');
    editButton.setAttribute('src', 'icons8-editar-120.png');
    editButton.addEventListener('click', (event) => editQuestion(event, list));
    return editButton;
};

function editQuestion(event, list) {
    const details = event.currentTarget.parentElement;
    const id = details.parentElement.dataset.id;
    const saveButton = document.getElementById('save');

    // const htmlPrompt = document.querySelector(`[data-id='${id}'] > p`);
    // const htmlAnswerList = document.querySelector(`[data-id='${id}'] > p + div > ol`);
    // const htmlTheme = document.querySelector(`[data-id='${id}'] > p + div > div + div > p`);
    // const htmlCharacter = document.querySelector(`[data-id='${id}'] > p + div > div + div + div > p`);
    // const htmlDifficulty = document.querySelector(`[data-id='${id}'] > p + div > div + div + div + div`);
    // const oldQuestion = list[id];
    
    const prompt = document.querySelector("[ name='statement' ]");
    const alternatives = document.querySelectorAll("[ name='alternatives' ]");
    const correct = document.querySelector("[ name='correct' ]");
    const themeSelect = document.querySelector("[ name='theme' ]");
    const nameSelect = document.querySelector("[ name='name' ]");
    const images = document.querySelectorAll("[ name='image' ]")
    const difficulty = document.querySelector("#difficultyRange");
    const difficultyOutput = document.querySelector("#difficultyOutput");

    const question = list[id];

    prompt.value = question.prompt;
    for(let i=0; i<question.answers.length; i++) {
        alternatives[i].value = question.answers[i];
    };
    correct.value = question.correct;
    themeSelect.value = question.themeId;
    nameSelect.value = question.characterId.nameId;
    for(const image of images) {
        if(image.value == question.characterId.imageId) {
            image.checked = true;
        };
    };
    difficulty.value = question.difficulty;
    difficultyOutput.value = question.difficulty;

    saveButton.dataset.save = id;

    hide("add");
    hide("save");
    hide("cancel");
};

export { EditButton };