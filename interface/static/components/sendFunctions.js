import { loadThemes } from "./loadFunctions.js"
import { clean, hide, cleanList } from "./modFunctions.js"

function sendTheme() {
    const themes = document.querySelector('[ name=theme ]');
    const theme = document.getElementById('newTheme');
    if(!theme.value) {
        window.alert("The theme cannot be null")
        return;
    }
    const url = 'http://localhost:31415/themes';
    const opcoes = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            theme: theme.value
        })
    };
    fetch(url, opcoes)
        .then(async response => {
            const message = await response.json();
            if (!response.ok) {
                window.alert("HTTP status " + response.status + "\n\n" + message["Error message"]);
            } else {
                window.alert("HTTP status " + response.status + "\n\n" + message.Status);
                theme.value = '';
                hide("addThemeDiv");
                themes.innerHTML = '';
                loadThemes();
            }
        })
};

async function sendCharacter(nameId, imageId) {
    
    let characterId = null;
    const url = 'http://localhost:31415/characters';
    const opcoes = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            charName: nameId,
            portraitURL: imageId
        })
    };

    await fetch(url, opcoes)
        .then(async response => {
            const message = await response.json();
            if (!response.ok) {
                window.alert("HTTP status " + response.status + "\n\n" + message["Error message"]);
            } else {
                characterId = message.id;
            }
        })
    
    return characterId;
}

async function sendList(list) {
    const validList = [];
    const title = document.getElementById('titleInput').value;
    const registersDiv = document.getElementById("questionsDiv");

    if(!title) {
        window.alert("The title cannot be null")
        return;
    }
    
    for(const item of list) {
        if(item) {
            validList.push(item)
        }
    }

    if(validList.length == 0) {
        window.alert("The list cannot be empty")
        return;
    }

    for(const question of validList) {
        const characterId = await sendCharacter(question.characterId.nameId, question.characterId.imageId);
        question.characterId = characterId;
    }

    const url = 'http://localhost:31415/lists';
    const opcoes = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title : title,
            questions : validList,
            description : ''
        })
    };
    fetch(url, opcoes)
        .then(async response => {
            const message = await response.json();
            if (!response.ok) {
                window.alert("HTTP status " + response.status + "\n\n" + message["Error message"]);
            } else {
                window.alert("HTTP status " + response.status + "\n\n" + message.Status);
                clean();
                registersDiv.innerHTML = '';
                document.getElementById('titleInput').value = '';
                hide('send');
                cleanList(list)
            }
        })
};

export { sendTheme, sendList, sendCharacter };