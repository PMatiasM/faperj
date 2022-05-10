import { DeleteButton } from "./deleteButton.js";
import { EditButton } from "./editButton.js";
import { AnswersList } from "./answerList.js";

const Details = (list, theme, name, path, question) => {
    const details = document.createElement('div');
    details.classList.add('details');
    details.classList.add('hide');
    details.dataset.question = list.length - 1;
    details.appendChild(AnswersList(question));
    details.innerHTML += `
                            <div class="horizontalDivisor"></div>
                            <div class="detailsTCD">
                                <h2>Tema:</h2>
                                <p>${theme}</p>
                            </div>
                            <div class="detailsTCD">
                                <h2>Personagem:</h2>
                                <div>
                                    <img src="${path}" alt="">
                                    <p>${name}</p>
                                </div>
                            </div>
                            <div class="detailsTCD">
                                <h2>Dificuldade:</h2>
                                <input id="difficultyRange" type="range" value="${question.difficulty}" min="1" max="3" oninput="this.nextElementSibling.value = this.value" disabled>
                                <output id="difficultyOutput">${question.difficulty}</output>
                            </div>`;
    details.appendChild(DeleteButton(list));
    details.appendChild(EditButton(list));
    return details;
};

export { Details };