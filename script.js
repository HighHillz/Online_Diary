// Store all variables here
const time = new Date(); // Get current time
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; // Month list
let month_index = time.getMonth(); // Current month index
let year = time.getFullYear(); // Current year
let selected = ""; // Tracks selected date
let entries = {}; // Stores content
let times = {}; // Stores timestamps
let title = {}; // Stores titles
let jsonid = ""; // ID target
const results = []; // Search results

let settings = { // Settings object
  "hour_24": true, //24 hour format flag
  "mode": "light", // Theme mode
}

let settings_buffer = {} // Store unsaved changes temparorily
for (const key in settings) {
  if (settings.hasOwnProperty(key)) {
    settings_buffer[key] = settings[key]; // Initialize buffer with default settings
  }
}

/* let filters = { // Filters object
  "time_range" : [],
  "case_match" : false,
  "text_match" : false,
}

let filters_buffer = {} //Store unsaved filters temparorily until saved
for (const key in filters) {
  if (filters.hasOwnProperty(key)) {
    filters_buffer[key] = filters[key];
  }
} */

// Utility functions
function getDay(date) {
  return date.getDay(); // Get day number (0 = Sunday, 6 = Saturday)
}

function createRow(date, title, mon, year, day) {
  return `<div class='row' onclick='select(${mon}, ${year}, ${day})'><p><b>${date}</b></p><p>${title}</p></div>`;
}

function generateRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Toggle functions
function switchText(item1, item2, container) { // Toggle between two text items
  container.innerHTML = container.innerHTML === item1 ? item2 : item1;
}

function switchDisplay(item1_id, item2_id) { // Toggle visibility of two items
  if (document.getElementById(item1_id).style.display === "none") {
    document.getElementById(item1_id).style.display = "block";
    document.getElementById(item2_id).style.display = "none";
  } else {
    document.getElementById(item1_id).style.display = "none";
    document.getElementById(item2_id).style.display = "block";
  }
}

function switchTextSlider(item1, item2) { // Toggle between two text items with a slider effect
  if (document.getElementById(item1).classList.contains("off")) {
    document.getElementById(item1).classList.remove("off");
    document.getElementById(item2).classList.add("off");
  } else {
    document.getElementById(item1).classList.add("off");
    document.getElementById(item2).classList.remove("off");
  }
}

// Calendar rendering
function createCalendar(elem, year, month) {
  let d = new Date(year, month - 1); // Date to be added to each cell
  let date_today = new Date(); // Today's date
  let table = '<table><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr><tr>';

  // Add empty cells before the first day of the month
  for (let i = 0; i < getDay(d); i++) {
    table += '<td style="visibility:hidden;"></td>';
  }

  // Add cells for each day of the month
  while (d.getMonth() === month - 1) {
    const isToday = d.getFullYear() === date_today.getFullYear() && d.getMonth() === date_today.getMonth() && d.getDate() === date_today.getDate();
    const cellClass = isToday ? "today" : "";
    const is_typed = entries[`a${d.getDate()}${month}${year}`] ? "entried" : ""; // Highlight dates with content
    table += `<td class="${cellClass} ${is_typed}" onclick="changeID(this)">${d.getDate()}</td>`;

    if (getDay(d) % 7 === 6) table += '</tr><tr>'; // Start a new row after Saturday
    d.setDate(d.getDate() + 1);
  }

  // Add empty cells after the last day of the month
  if (getDay(d) !== 0) {
    for (let i = getDay(d); i < 7; i++) {
      table += '<td style="display:none;"></td>';
    }
  }

  table += '</tr></table>';
  elem.innerHTML = table;
}

// Date selection
function select(m, y, d) {
  document.getElementById("month_year").innerHTML = `${months[m - 1]} ${y}`;
  document.getElementById("results-main").style.display = "none";
  document.getElementById("search").value = "";
  createCalendar(calendar, y, m);

  month_index = m - 1;
  year = y;

  // Highlight selected date and update content
  jsonid = `a${d}${m}${y}`;
  updateCalendarSelection(d);
  updateContent(jsonid);
}

// Month and Year selection
document.getElementById("month_year").onclick = function () {
  const monthYear = prompt("Enter month and year in format 'MM/YYYY' (e.g., '01/2023'):", `${month_index + 1}/${year}`);
  if (monthYear) {
    let [month, year] = monthYear.split("/").map(Number);
    if (month >= 1 && month <= 12 && year > time.getFullYear() - 100 && year <= time.getFullYear()) {
      if (year === time.getFullYear() && month > time.getMonth() + 1) {
        alert("Month cannot be in the future.");
        return;
      }

      month_index = month - 1;
      year = year;
      document.getElementById("month_year").innerHTML = `${months[month_index]} ${year}`;
      createCalendar(calendar, year, month);
      select(month, year, time.getDate());
    } else {
      if (month < 1 || month > 12) {
        alert("Invalid input. Please enter a valid month and year.");
      } else if(year <= time.getFullYear() - 100) {
        alert("Year must be within the last 100 years.");
      } else if(year > time.getFullYear()) {
        alert("Year cannot be in the future.");
      }
    }
  }
}

function updateCalendarSelection(selectedDay) {
  const calendarRows = document.getElementById('calendar').getElementsByTagName('tr');
  for (let i = 0; i < calendarRows.length; i++) {
    const cells = calendarRows[i].getElementsByTagName('td');
    for (let j = 0; j < cells.length; j++) {
      const cell = cells[j];
      cell.classList.remove('selected');
      if (cell.innerHTML == selectedDay) {
        cell.classList.add('selected');
      }
    }
  }
}

function updateContent(id) {
  document.getElementById("content").value = entries[id] || "";
  document.getElementById("time").innerHTML = times[id] ? (settings["hour_24"] ? times[id][0] : times[id][1]) : "";
  document.getElementById("title").value = title[id] || "";

  const isToday = id === `a${time.getDate()}${time.getMonth() + 1}${time.getFullYear()}`;
  document.getElementById("content").disabled = document.getElementById("title").disabled = !isToday;
}

// Save content to local storage upon typing something.
document.getElementById("content").addEventListener("input", saveContent);
document.getElementById("title").addEventListener("input", saveContent);

function saveContent() {
  const content = document.getElementById("content").value.trim();
  const titleContent = document.getElementById("title").value.trim();

  if (content || titleContent) {
    entries[jsonid] = content;
    times[jsonid] = [formatDateTime(new Date()), formatDateTime(new Date(), false)];
    title[jsonid] = titleContent;

    localStorage.setItem("story", JSON.stringify(entries));
    localStorage.setItem("times", JSON.stringify(times));
    localStorage.setItem("titles", JSON.stringify(title));

    document.getElementById("time").innerHTML = times[jsonid][settings["hour_24"] ? 0 : 1];
  } else {
    delete entries[jsonid];
    delete times[jsonid];
    delete title[jsonid];

    localStorage.setItem("story", JSON.stringify(entries));
    localStorage.setItem("times", JSON.stringify(times));
    localStorage.setItem("titles", JSON.stringify(title));

    document.getElementById("time").innerHTML = "";
  }
  
  createCalendar(calendar, year, month_index + 1);
  select(time.getMonth() + 1, time.getFullYear(), time.getDate());
}

// Format date and time utility function
function formatDateTime(date, hour_24 = true) {
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const time_stamp = hour_24 ? date.toLocaleTimeString('en-US', { hour12: false }) : date.toLocaleTimeString('en-US', { hour12: true });
  return `${time_stamp}, ${day} ${month} ${year}`;
}

// Change selected date
function changeID(elem) {
  updateCalendarSelection(elem.innerHTML);
  selected = elem.innerHTML;

  setTimeout(() => {
    jsonid = `a${selected}${month_index + 1}${year}`;
    updateContent(jsonid);
  }, 10);
}

// Navigation buttons
document.getElementById("current").onclick = function () {
  month_index = time.getMonth();
  year = time.getFullYear();
  document.getElementById("month_year").innerHTML = `${months[month_index]} ${year}`;
  createCalendar(calendar, year, month_index + 1);
  select(time.getMonth() + 1, time.getFullYear(), time.getDate());
};

document.getElementById("prev").onclick = function () {
  if (month_index === 0) {
    month_index = 11;
    year -= 1;
  } else {
    month_index -= 1;
  }
  updateCalendar();
};

document.getElementById("next").onclick = function () {
  if (month_index === 11) {
    month_index = 0;
    year += 1;
  } else {
    month_index += 1;
  }
  updateCalendar();
};

function updateCalendar() {
  document.getElementById("current").disabled = month_index === time.getMonth() && year === time.getFullYear();
  document.getElementById("month_year").innerHTML = `${months[month_index]} ${year}`;
  createCalendar(calendar, year, month_index + 1);
}

// Search functionality
document.getElementById("search").onkeyup = function () {
  const query = document.getElementById("search").value.trim();
  if (query) {
    /* $("#filters-btn-cont").show();
    $("#settings-btn-cont").hide(); */
    document.getElementById("results-main").style.display = "block";
    document.getElementById("current").disabled = true;
    searchEntries(query);
  } else {
    /* $("#filters-btn-cont").hide();
    $("#settings-btn-cont").show(); */
    document.getElementById("results-main").style.display = "none";
    document.getElementById("current").disabled = month_index === time.getMonth() && year === time.getFullYear();
  }
};

function searchEntries(query) {
  results.length = 0;
  document.getElementById("results").innerHTML = "";
  document.getElementById("num").innerHTML = `<span style='color:dodgerblue;'>${results.length}</span> result(s) found for <span style='color:dodgerblue;'>${query}</span>`;

  for (let sy = time.getFullYear() - 100; sy <= time.getFullYear(); sy++) {
    for (let sm = 1; sm <= 12; sm++) {
      for (let sd = 1; sd <= 31; sd++) {
        jsonid = `a${sd}${sm}${sy}`;
        if (title[jsonid] && title[jsonid].toUpperCase().includes(query.toUpperCase())) {
          const result = `${sd} ${months[sm - 1]} ${sy}`;
          if (!results.includes(result)) {
            results.push(result);
            document.getElementById("results").innerHTML += createRow(result, title[jsonid], sm, sy, sd);
          }
        }
      }
    }
  }

  document.getElementById("num").innerHTML = `<span style='color:dodgerblue;'>${results.length}</span> result(s) found for <span style='color:dodgerblue;'>${query}</span>`;
}

// Placeholder animation
function typePlaceholder(placeholderText) {
  const placeholder = placeholderText.split("");
  let placeholderIndex = 0;

  // Type a charecter every 100ms
  const interval = setInterval(() => {
    if (placeholderIndex < placeholder.length) {
      document.getElementById("search").placeholder += placeholder[placeholderIndex];
      placeholderIndex++;
    } else {
      clearInterval(interval);
    }
  }, 100);
}

// Functionalities provided in settings
document.getElementById("time_format").onclick = function () {
  settings_buffer["hour_24"] = !settings_buffer["hour_24"];
  switchTextSlider('12h', '24h');
}

document.getElementById("theme").onclick = function () {
  settings_buffer["mode"] === "light" ? $("#mode-indi").text("dark") : $("#mode-indi").text("light");
  settings_buffer["mode"] = settings_buffer["mode"] === "light" ? "dark" : "light";
  switchTextSlider('light', 'dark');
}

function saveSettings() {
  // Modify settings
  for (const key in settings_buffer) {
    if (settings_buffer.hasOwnProperty(key)) {
      settings[key] = settings_buffer[key];
    }
  }

  // Modify time format
  for (var i = 0; i < Object.keys(times).length; i++) {
    updateContent(Object.keys(times)[i]);
  }

  select(time.getMonth() + 1, time.getFullYear(), time.getDate());

  // Save settings to local storage and hide settings popup
  localStorage.setItem("settings", JSON.stringify(settings));
  console.log("Settings saved successfully!");
  $("#settings-popup").hide();
  $("#disable-bg").hide();

}

// Cancel button functionality
document.getElementById("cancel-setting").onclick = function () {
  for (const key in settings) {
    if (settings.hasOwnProperty(key)) {
      settings_buffer[key] = settings[key]; // Reset buffer to default settings
    }
  }

  // Reset time format switch
  if (settings_buffer["hour_24"]) {
    document.getElementById("24h").classList.remove("off");
    document.getElementById("12h").classList.add("off");
  } else {
    document.getElementById("24h").classList.add("off");
    document.getElementById("12h").classList.remove("off");
  }
  
  // Reset mode switch
  if (settings_buffer["mode"] === "dark") {
    document.getElementById("dark").classList.remove("off");
    document.getElementById("light").classList.add("off");
  } else {
    document.getElementById("dark").classList.add("off");
    document.getElementById("light").classList.remove("off");
  }

  $('#settings-popup').toggle();
  $('#disable-bg').toggle();
}

/* document.getElementById("cancel-filter").onclick = function() {
  $("#filters-popup").toggle();
  $("#disable-bg").toggle();
} */

function clearPlaceholder() {
  let placeholderText = document.getElementById("search").placeholder;
  const interval = setInterval(() => {
    if (placeholderText.length > 0) {
      placeholderText = placeholderText.slice(0, -1);
      document.getElementById("search").placeholder = placeholderText;
    } else {
      clearInterval(interval);
    }
  }, 100);
}

// Initialization
window.onload = function () {
  entries = JSON.parse(localStorage.getItem("story")) || {};
  times = JSON.parse(localStorage.getItem("times")) || {};
  title = JSON.parse(localStorage.getItem("titles")) || {};
  settings = JSON.parse(localStorage.getItem("settings")) || settings;
  settings_buffer = { ...settings };
  
  if (settings["hour_24"]) {
    document.getElementById("24h").classList.remove("off");
    document.getElementById("12h").classList.add("off");
  } else {
    document.getElementById("24h").classList.add("off");
    document.getElementById("12h").classList.remove("off");
  }

  if (settings["mode"] === "dark") {
    document.getElementById("dark").classList.remove("off");
    document.getElementById("light").classList.add("off");
  } else {
    document.getElementById("dark").classList.add("off");
    document.getElementById("light").classList.remove("off");
  }

  document.getElementById("month_year").innerHTML = `${months[month_index]} ${year}`;
  createCalendar(calendar, year, month_index + 1);
  select(time.getMonth() + 1, time.getFullYear(), time.getDate());

  let placeholderText = generateRandom(Object.values(title)) || "";

  function cyclePlaceholder() {
    typePlaceholder(placeholderText);
    setTimeout(() => {
      clearPlaceholder();
      setTimeout(() => {
        placeholderText = generateRandom(Object.values(title)) || "";
        cyclePlaceholder();
      }, 100 * placeholderText.length); // Wait before typing the next placeholder
    }, 100 * placeholderText.length + 2000); // Wait for typing and display duration
  }

  cyclePlaceholder();
}
