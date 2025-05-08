//Button animations
const settings_btn = document.querySelector('#settings');
const filters_btn = document.querySelector('#filters');

settings_btn.addEventListener('mouseover', () => {
    const settingsLabel = document.querySelector('#settings-label');
    settingsLabel.style.display = 'block';
    const searchElement = document.querySelector('#search');
    searchElement.style.width = 'calc(90% - 60px)';
    searchElement.style.transition = 'width 0.5s ease-in-out';
});

settings_btn.addEventListener('mouseout', () => {
    const settingsLabel = document.querySelector('#settings-label');
    settingsLabel.style.display = 'none';
    $("#search").css("width", "calc(90%)");
});

filters_btn.addEventListener('mouseover', () => {
    const settingsLabel = document.querySelector('#filters-label');
    settingsLabel.style.display = 'block';
    const searchElement = document.querySelector('#search');
    searchElement.style.width = 'calc(90% - 60px)';
    searchElement.style.transition = 'width 0.5s ease-in-out';
});

filters_btn.addEventListener('mouseout', () => {
    const settingsLabel = document.querySelector('#filters-label');
    settingsLabel.style.display = 'none';
    $("#search").css("width", "calc(90%)");
});

// Dark/Light mode
const save_btn = document.querySelector('#save-setting');
let currentMode = JSON.parse(localStorage.getItem('settings'))["mode"] || 'light';

save_btn.addEventListener('click', () => {
    toggleTheme();
});

function toggleTheme() {
    currentMode = JSON.parse(localStorage.getItem('settings'))["mode"] || 'light';
    if (currentMode === 'light') {
        lightTheme();
    } else {
        darkTheme();
    }
};

function lightTheme() {
    bg_color = "rgb(220, 220, 220)";
    text_color = "rgb(10, 10, 10)";

    document.body.classList.add('light-mode');
    document.getElementById("results-main").classList.add('light-mode');

    $(".calendar").css("background-color", "rgb(240, 240, 240)");
    $(".calendar").css("color", text_color);
    $(".arrow").css("border", "solid black");
    $(".arrow").css("border-width", "0 5px 5px 0");

    $("#search, #content, #title").css("background-color", bg_color);
    $("#search, #content, #title, #current").css("color", text_color);
    $("#title").css("border-bottom", "solid 1px black");
    $(".tools").css("border-bottom", "solid 1px rgb(190, 190, 190)");
    $(".calendar, textarea, #title").css("border", "solid 1px rgb(190, 190, 190)");
    $(".button-container").css("background-color","rgba(220, 220, 220, 0.8)");
    $(".button-container button").css("color",text_color);

    $("#month_year").addClass('hover-light');
    document.querySelectorAll('td').forEach(cell => cell.classList.add('hover-light'));

    $(".popup").css("background-color", bg_color);
    $(".popup-content, .textSlider").css("color", text_color);
    $(".popup").css("border", "solid 1px rgb(190, 190, 190)");
}

function darkTheme() {
    bg_color = "rgb(20, 20, 20)";
    text_color = "rgb(230, 230, 230)";

    document.body.classList.remove('light-mode');
    document.getElementById("results-main").classList.remove('light-mode');

    $(".calendar").css("background-color", "black");
    $(".calendar").css("color", text_color);
    $(".arrow").css("border", "solid white");
    $(".arrow").css("border-width", "0 5px 5px 0");

    $("#search, #content, #title").css("background-color", bg_color);
    $("#search, #content, #title, #current").css("color", text_color);
    $("#title").css("border-bottom", "solid 1px white");
    $(".tools").css("border-bottom", "solid 1px rgb(50, 50, 50)");
    $(".calendar, textarea, #title").css("border", "solid 1px rgb(50, 50, 50)");
    $(".button-container").css("background-color","rgba(20, 20, 20, 0.8)");
    $(".button-container button").css("color", text_color);

    $("#month_year").removeClass('hover-light');
    document.querySelectorAll('td').forEach(cell => cell.classList.remove('hover-light'));

    $(".popup").css("background-color", bg_color);
    $(".popup").css("border", "solid 1px rgb(50, 50, 50)");
    $(".popup-content, .textSlider").css("color", text_color)
}

window.addEventListener('load', () => {
    setTimeout(toggleTheme, 10);
});