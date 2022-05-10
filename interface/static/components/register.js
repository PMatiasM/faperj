import { Menu } from "./menu.js";
import { Details } from "./details.js";

const Register = (list, theme, name, path, question) => {
    const register = document.createElement('div');
    register.classList.add('registros');
    register.dataset.id = list.length - 1;
    register.appendChild(Menu(list))
    register.innerHTML += `<p>${question.prompt}</p>`;
    register.appendChild(Details(list, theme, name, path, question));
    register.firstChild.addEventListener('click', hideDetails);
    return register;
};

function hideDetails(event) {
    const menu = event.currentTarget;
    menu.classList.toggle('change');

    const detailsId = menu.dataset.menu
    const details = document.querySelector(`[data-question='${detailsId}']`);
    details.classList.toggle('hide')
};

export { Register };