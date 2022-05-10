const AnswersList = (question) => {
    const answersList = document.createElement('ol');
    let index = 0;
    for(const answer of question.answers) {
        if(index == question.correct) {
            answersList.innerHTML += `<li class="rightAnswer"><p>${answer}</p></li>`;
        } else {
            answersList.innerHTML += `<li><p>${answer}</p></li>`;
        }
        index++;
    }
    return answersList;
};

export { AnswersList };