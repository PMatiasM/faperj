const Menu = (list) => {
    const menu = document.createElement('div');
    menu.classList.add('container');
    menu.dataset.menu = list.length - 1;
    menu.innerHTML = `
                        <div class="bar1"></div>
                        <div class="bar2"></div>
                        <div class="bar3"></div>`;
    return menu;
};

export { Menu };