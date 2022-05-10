function loadThemes() {
    const themes = document.querySelector('[ name=theme ]');
    fetch('http://localhost:31415/themes',{ method:"get" })
    .then(function(response) {
        response.json().then(function(data) {
            for(const theme of data.list) {
                themes.innerHTML += `<option value="${theme.id}">${theme.theme}</option>`;
            }
        })
    })
};

function loadNames() {
    const names = document.querySelector('[ name=name ]');
    fetch('http://localhost:31415/names',{ method:"get" })
    .then(function(response) {
        response.json().then(function(data) {
            for(const name of data) {
                names.innerHTML += `<option value="${name.id}">${name.name}</option>`;
            }
        })
    })
};

function loadImages() {
    const images = document.querySelector('.charactersImagesDiv > ul');
    fetch('http://localhost:31415/paths',{ method:"get" })
    .then(function(response) {
        response.json().then(function(data) {
            for(const path of data) {
                images.innerHTML += `<li class="imageList"><label><input type="radio" name="image" value="${path.id}"><img src="${path.path}"/></label></li>`;
            }
        })
    })
};

export { loadThemes, loadNames, loadImages };