function clean() {
    document.querySelector("[name='statement']").value = "";
    for(const alternative of document.querySelectorAll("[name='alternatives']")) {
        if(alternative) {
            alternative.value = "";
        }
    }
    document.querySelector("[name='correct']").value = "";
    document.querySelector("[name='theme']").value = "";
    document.querySelector("[name='name']").value = "";
    for(const image of document.querySelectorAll('[ name=image ]')) {
        image.checked = false;
    };

    document.querySelector("#difficultyRange").value = 2;
    document.getElementById("difficultyOutput").innerText = 2;
};

function cleanList(list) {
    while(list.length) {
        list.pop();
    }
}

function hide(elementId) {
    const element = document.getElementById(elementId);
    element.classList.toggle('hide');
};

function cancelEdit() {
    clean();
    document.getElementById('save').removeAttribute('data-save');
    hide("add");
    hide("save");
    hide("cancel");
}

export { clean, hide, cleanList, cancelEdit };