// Utility functions
function showLabel(labelId) {
    document.querySelector(labelId).style.display = 'block';
}

function hideLabel(labelId) {
    document.querySelector(labelId).style.display = 'none';
}

function setSearchWidth(width) {
    const searchElement = document.querySelector('#search');
    searchElement.style.width = width;
    searchElement.style.transition = 'width 0.5s ease-in-out';
}

// Button animations
const settingsBtn = document.querySelector('#settings');
const filtersBtn = document.querySelector('#filters');

settingsBtn.addEventListener('mouseover', () => {
    showLabel('#settings-label');
    setSearchWidth('calc(90% - 60px)');
});

settingsBtn.addEventListener('mouseout', () => {
    hideLabel('#settings-label');
    setSearchWidth('calc(90%)');
});

filtersBtn.addEventListener('mouseover', () => {
    showLabel('#filters-label');
    setSearchWidth('calc(90% - 60px)');
});

filtersBtn.addEventListener('mouseout', () => {
    hideLabel('#filters-label');
    setSearchWidth('calc(90%)');
});

// Theme toggling
const saveBtn = document.querySelector('#save-setting');

function getCurrentMode() {
    const settings = JSON.parse(localStorage.getItem('settings')) || {};
    return settings.mode || 'light';
}

function toggleTheme() {
    if (getCurrentMode() === 'light') {
        applyLightTheme();
    } else {
        applyDarkTheme();
    }
}

saveBtn.addEventListener('click', toggleTheme);

function applyLightTheme() {
    const bgColor = "rgb(220, 220, 220)";
    const textColor = "rgb(10, 10, 10)";

    document.body.classList.add('light-mode');
    document.getElementById("results-main").classList.add('light-mode');

    $(".calendar").css({
        "background-color": "rgb(240, 240, 240)",
        "color": textColor,
        "border": "solid 1px rgb(190, 190, 190)"
    });
    $(".arrow").css({
        "border": "solid black",
        "border-width": "0 5px 5px 0"
    });

    $("#search, #content, #title").css("background-color", bgColor);
    $("#search, #content, #title, #current").css("color", textColor);
    $("#title").css("border-bottom", "solid 1px black");
    $(".tools").css("border-bottom", "solid 1px rgb(190, 190, 190)");
    $(".calendar, textarea, #title").css("border", "solid 1px rgb(190, 190, 190)");
    $(".button-container").css("background-color", "rgba(220, 220, 220, 0.8)");
    $(".button-container button").css("color", textColor);

    $("#month_year").addClass('hover-light');
    document.querySelectorAll('td').forEach(cell => cell.classList.add('hover-light'));

    $(".popup").css({
        "background-color": bgColor,
        "border": "solid 1px rgb(190, 190, 190)"
    });
    $(".popup-content, .textSlider").css("color", textColor);
}

function applyDarkTheme() {
    const bgColor = "rgb(20, 20, 20)";
    const textColor = "rgb(230, 230, 230)";

    document.body.classList.remove('light-mode');
    document.getElementById("results-main").classList.remove('light-mode');

    $(".calendar").css({
        "background-color": "black",
        "color": textColor,
        "border": "solid 1px rgb(50, 50, 50)"
    });
    $(".arrow").css({
        "border": "solid white",
        "border-width": "0 5px 5px 0"
    });

    $("#search, #content, #title").css("background-color", bgColor);
    $("#search, #content, #title, #current").css("color", textColor);
    $("#title").css("border-bottom", "solid 1px white");
    $(".tools").css("border-bottom", "solid 1px rgb(50, 50, 50)");
    $(".calendar, textarea, #title").css("border", "solid 1px rgb(50, 50, 50)");
    $(".button-container").css("background-color", "rgba(20, 20, 20, 0.8)");
    $(".button-container button").css("color", textColor);

    $("#month_year").removeClass('hover-light');
    document.querySelectorAll('td').forEach(cell => cell.classList.remove('hover-light'));

    $(".popup").css({
        "background-color": bgColor,
        "border": "solid 1px rgb(50, 50, 50)"
    });
    $(".popup-content, .textSlider").css("color", textColor);
}

// Apply theme on load
window.addEventListener('load', () => {
    setTimeout(toggleTheme, 10);
});