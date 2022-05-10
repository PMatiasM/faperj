const DeleteButton = (list) => {
    const deleteButton = document.createElement('img');
    deleteButton.classList.add('delEdit');
    deleteButton.setAttribute('src', 'icons8-lixo-192.png');
    deleteButton.addEventListener('click', (event) => deleteQuestion(event, list));
    return deleteButton;
};

function deleteQuestion(event, list) {
    const details = event.currentTarget.parentElement;
    const questionListId = details.dataset.question;
    list[questionListId] = null;
    const question = details.parentElement;
    question.remove();
};

export { DeleteButton };