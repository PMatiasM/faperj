(() => {
    function loadThemes() {
        const themes = document.querySelector('[ name=theme ]');
        fetch('http://faperj.ddns.net:31415/themes',{ method:"get" })
        .then(function(response) {
            response.json().then(function(data) {
                for(const theme of data) {
                    themes.innerHTML += `<option value="${theme.id}">${theme.theme}</option>`;
                }
            })
        })
    }

    function loadCharacters() {
        const characters = document.querySelector('[ name=character ]');
        fetch('http://faperj.ddns.net:31415/characters',{ method:"get" })
        .then(function(response) {
            response.json().then(function(data) {
                for(const character of data) {
                    characters.innerHTML += `<option value="${character.id}">${character.charName}</option>`;
                }
            })
        })
    }

    if(document.getElementById("theme")) loadThemes();
    if(document.getElementById("character")) loadCharacters();

    function saveQuestion() {
        const registersDiv = document.getElementById("questionsDiv");
        let prompt = document.querySelector("[name='statement']").value;
        if(prompt === '') {
            prompt = null;
        }
        const alternatives = document.querySelectorAll("[name='alternatives']")
        const answers = []
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
            window.alert("The correct answer cannot be null")
            return;
        }
        
        const themeSelect = document.querySelector('[ name=theme ]');
        const theme = themeSelect.options[themeSelect.selectedIndex].text;
        const themeId = themeSelect.value;

        if(!themeId) {
            window.alert("The theme cannot be null")
            return;
        }

        const characterSelect = document.querySelector('[ name=character ]');
        const character = characterSelect.options[characterSelect.selectedIndex].text;
        const characterId = characterSelect.value;

        if(!characterId) {
            window.alert("The character cannot be null")
            return;
        }

        const difficulty = document.querySelector("#difficultyRange").value;

        const question = {
            prompt,
            answers,
            correct,
            themeId,
            characterId,
            difficulty
        };
        
        if(list.length == 0) {
            save.classList.toggle('hide');
        }

        list.push(question);

        const answersList = document.createElement('ol');
        index = 0;
        for(const answer of question.answers) {
            if(index == question.correct) {
                answersList.innerHTML += `<li class="rightAnswer"><p>${answer}</p></li>`;
            } else {
                answersList.innerHTML += `<li><p>${answer}</p></li>`;
            }
            index++;
        }

        const deleteButton = document.createElement('img');
        deleteButton.classList.add('delEdit')
        deleteButton.setAttribute('src', 'icons8-lixo-192.png')
        deleteButton.addEventListener('click', deleteQuestion)

        const editButton = document.createElement('img');
        editButton.classList.add('delEdit')
        editButton.setAttribute('src', 'icons8-editar-120.png')
        editButton.addEventListener('click', editQuestion)

        const details = document.createElement('div');
        details.classList.add('details');
        details.classList.add('hide');
        details.dataset.question = list.length - 1;
        details.appendChild(answersList);
        details.innerHTML += `
                                <div class="horizontalDivisor"></div>
                                <div class="detailsTCD">
                                    <h2>Tema:</h2>
                                    <p>${theme}</p>
                                </div>
                                <div class="detailsTCD">
                                    <h2>Personagem:</h2>
                                    <p>${character}</p>
                                </div>
                                <div class="detailsTCD">
                                    <h2>Dificuldade:</h2>
                                    <input id="difficultyRange" type="range" value="${question.difficulty}" min="1" max="5" oninput="this.nextElementSibling.value = this.value" disabled>
                                    <output id="difficultyOutput">${question.difficulty}</output>
                                </div>`;
        details.appendChild(deleteButton);
        details.appendChild(editButton);

        const menu = document.createElement('div');
        menu.classList.add('container');
        menu.dataset.menu = list.length - 1;
        menu.innerHTML = `
                            <div class="bar1"></div>
                            <div class="bar2"></div>
                            <div class="bar3"></div>`;

        const register = document.createElement('div');
        register.classList.add('registros');
        register.appendChild(menu)
        register.innerHTML += `<p>${question.prompt}</p>`;
        register.appendChild(details);

        registersDiv.insertBefore(register, registersDiv.firstChild);

        register.firstChild.addEventListener('click', hideDetails);

        clean();
    }

    function editQuestion(event) {
        return;
    }

    function deleteQuestion(event) {
        const details = event.currentTarget.parentElement;
        const questionListId = details.dataset.question;
        list[questionListId] = null;
        const question = details.parentElement;
        question.remove();
    }

    function sendTheme() {
        const themes = document.querySelector('[ name=theme ]');
        const theme = document.getElementById('newTheme');
        if(!theme.value) {
            window.alert("The theme cannot be null")
            return;
        }
        const url = 'http://faperj.ddns.net:31415/themes';
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
    }

    function sendCharacter() {
        const characters = document.querySelector('[ name=character ]');
        const character = document.getElementById('newCharacter');
        const portraitURL = document.getElementById('newportraitURL');

        if(!character.value) {
            window.alert("The character cannot be null")
            return;
        }

        const url = 'http://faperj.ddns.net:31415/characters';
        const opcoes = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                charName: character.value,
                portraitURL: portraitURL.value
            })
        };
        fetch(url, opcoes)
            .then(async response => {
                const message = await response.json();
                if (!response.ok) {
                    window.alert("HTTP status " + response.status + "\n\n" + message["Error message"]);
                } else {
                    window.alert("HTTP status " + response.status + "\n\n" + message.Status);
                    character.value = '';
                    portraitURL.value = '';
                    hide("addCharacterDiv");
                    characters.innerHTML = '';
                    loadCharacters();
                }
            })
    }

    function sendList() {
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

        const url = 'http://faperj.ddns.net:31415/lists';
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
                    save.classList.toggle('hide');
                    list = [];
                }
            })
    }

    function clean() {
        document.querySelector("[name='statement']").value = "";
        for(const alternative of document.querySelectorAll("[name='alternatives']")) {
            if(alternative) {
                alternative.value = "";
            }
        }
        document.querySelector("[name='correct']").value = "";
        document.querySelector("[name='theme']").value = "";
        document.querySelector("[name='character']").value = "";

        document.querySelector("#difficultyRange").value = 3;
        document.getElementById("difficultyOutput").innerText = 3;
    }

    function hide(divId) {
        const div = document.getElementById(divId);
        div.classList.toggle('hide');
    }

    function hideDetails(event) {
        const menu = event.currentTarget;
        menu.classList.toggle('change');

        const detailsId = menu.dataset.menu
        const details = document.querySelector(`[data-question='${detailsId}']`);
        details.classList.toggle('hide')
    }

    let list = [];
    const add = document.getElementById('add');
    add.addEventListener('click', saveQuestion);

    const save = document.getElementById('save');
    save.addEventListener('click', sendList);

    const addTheme = document.getElementById('addTheme');
    addTheme.addEventListener('click', () => hide("addThemeDiv"));
    
    const saveTheme = document.getElementById('addNewTheme');
    saveTheme.addEventListener('click', sendTheme);

    const addCharacter = document.getElementById('addCharacter');
    addCharacter.addEventListener('click', () => hide("addCharacterDiv"));
    
    const saveCharacter = document.getElementById('addNewCharacter');
    saveCharacter.addEventListener('click', sendCharacter);
})()