class Calendar {
  constructor(elem, months) {
    this.elem = elem;
    this.months = months;
  }

  static getDay(date) {
    return date.getDay();
  }

  render(year, month, entries) {
    let d = new Date(year, month - 1);
    let today = new Date();
    let table = '<table><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr><tr>';

    for (let i = 0; i < Calendar.getDay(d); i++) table += '<td style="visibility:hidden;"></td>';

    while (d.getMonth() === month - 1) {
      const isToday = d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
      const cellClass = isToday ? "today" : "";
      const isTyped = entries[`a${d.getDate()}${month}${year}`] ? "entried" : "";
      table += `<td class="${cellClass} ${isTyped}" onclick="diary.changeID(this)">${d.getDate()}</td>`;
      if (Calendar.getDay(d) % 7 === 6) table += '</tr><tr>';
      d.setDate(d.getDate() + 1);
    }

    if (Calendar.getDay(d) !== 0) {
      for (let i = Calendar.getDay(d); i < 7; i++) table += '<td style="display:none;"></td>';
    }
    table += '</tr></table>';
    this.elem.innerHTML = table;
  }

  static updateSelection(selectedDay) {
    const rows = document.getElementById('calendar').getElementsByTagName('tr');
    for (let row of rows) {
      for (let cell of row.getElementsByTagName('td')) {
        cell.classList.remove('selected');
        if (cell.innerHTML == selectedDay) cell.classList.add('selected');
      }
    }
  }
}

class Settings {
  constructor() {
    this.defaults = { hour_24: true, mode: "light" };
    this.data = JSON.parse(localStorage.getItem("settings")) || { ...this.defaults };
    this.buffer = { ...this.data };

    document.getElementById("time_format").onclick = () => this.toggleTimeFormat();
    document.getElementById("theme").onclick = () => this.toggleTheme();
    document.getElementById("save-setting").onclick = () => this.saveSettings();
    document.getElementById("cancel-setting").onclick = () => this.cancelSettings();
  }
  
  toggleTimeFormat() {
    this.buffer.hour_24 = !this.buffer.hour_24;
    this.updateSettingsUI();
  }

  toggleTheme() {
    this.buffer.mode = this.buffer.mode === "light" ? "dark" : "light";
    this.updateSettingsUI();
  }

  saveSettings() {
    console.log(this.buffer);
    this.save();
    this.updateSettingsUI();
    $("#settings-popup").hide();
    $("#disable-bg").hide();
  }

  cancelSettings() {
    this.reset();
    this.updateSettingsUI();
    $('#settings-popup').toggle();
    $('#disable-bg').toggle();
  }

  updateSettingsUI() {
    if (this.buffer.hour_24) {
      document.getElementById("24h").classList.remove("off");
      document.getElementById("12h").classList.add("off");
    } else {
      document.getElementById("24h").classList.add("off");
      document.getElementById("12h").classList.remove("off");
    }
    if (this.buffer.mode === "dark") {
      document.getElementById("dark").classList.remove("off");
      document.getElementById("light").classList.add("off");
    } else {
      document.getElementById("dark").classList.add("off");
      document.getElementById("light").classList.remove("off");
    }
  }

  save() {
    this.data = { ...this.buffer };
    localStorage.setItem("settings", JSON.stringify(this.data));
  }

  reset() {
    this.buffer = { ...this.data };
  }
}

class Diary {
  constructor() {
    this.time = new Date();
    this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.monthIndex = this.time.getMonth();
    this.year = this.time.getFullYear();
    this.selected = "";
    this.entries = JSON.parse(localStorage.getItem("story")) || {};
    this.times = JSON.parse(localStorage.getItem("times")) || {};
    this.titles = JSON.parse(localStorage.getItem("titles")) || {};
    this.jsonid = "";
    this.results = [];
    this.settings = new Settings();
    this.calendar = new Calendar(document.getElementById("calendar"), this.months);

    this.init();
  }

  init() {
    document.getElementById("month_year").innerHTML = `${this.months[this.monthIndex]} ${this.year}`;
    this.calendar.render(this.year, this.monthIndex + 1, this.entries);
    this.select(this.monthIndex + 1, this.year, this.time.getDate());

    document.getElementById("content").addEventListener("input", () => this.saveContent());
    document.getElementById("title").addEventListener("input", () => this.saveContent());

    document.getElementById("month_year").onclick = () => this.promptMonthYear();
    document.getElementById("current").onclick = () => this.gotoCurrent();
    document.getElementById("prev").onclick = () => this.gotoPrev();
    document.getElementById("next").onclick = () => this.gotoNext();
    document.getElementById("search").onkeyup = () => this.searchEntries();

    this.settings.updateSettingsUI();
    this.cyclePlaceholder();
  }

  select(m, y, d) {
    document.getElementById("month_year").innerHTML = `${this.months[m - 1]} ${y}`;
    document.getElementById("results-main").style.display = "none";
    document.getElementById("search").value = "";
    this.calendar.render(y, m, this.entries);

    this.monthIndex = m - 1;
    this.year = y;
    this.jsonid = `a${d}${m}${y}`;
    Calendar.updateSelection(d);
    this.updateContent(this.jsonid);
  }

  promptMonthYear() {
    const input = prompt("Enter month and year in format 'MM/YYYY' (e.g., '01/2023'):", `${this.monthIndex + 1}/${this.year}`);
    if (input) {
      let [month, year] = input.split("/").map(Number);
      if (month >= 1 && month <= 12 && year) {
        if ((year === this.time.getFullYear() && month > this.time.getMonth() + 1) || year > this.time.getFullYear()) {
          alert("ERROR: Attempt to travel to the future"); return;
        } else if (year < this.time.getFullYear() - 100 || (year === this.time.getFullYear() - 100 && month < this.time.getMonth() + 1)) {
          alert("ERROR: Attempt to travel more than 100 years in the past."); return;

        }
        this.monthIndex = month - 1;
        this.year = year;
        document.getElementById("month_year").innerHTML = `${this.months[this.monthIndex]} ${year}`;
        this.calendar.render(year, month, this.entries);
        this.select(month, year, this.time.getDate());
      } else {
        alert(`ERROR: Invalid Input. Please enter a valid month (1-12) and year.`); return;
      }
    }
  }

  updateContent(id) {
    document.getElementById("content").value = this.entries[id] || "";
    document.getElementById("time").innerHTML = this.times[id] ? (this.settings.data.hour_24 ? this.times[id][0] : this.times[id][1]) : "";
    document.getElementById("title").value = this.titles[id] || "";
    const isToday = id === `a${this.time.getDate()}${this.time.getMonth() + 1}${this.time.getFullYear()}`;
    document.getElementById("content").disabled = document.getElementById("title").disabled = !isToday;
  }

  saveContent() {
    const content = document.getElementById("content").value;
    const titleContent = document.getElementById("title").value;
    if (content || titleContent) {
      this.entries[this.jsonid] = content;
      this.times[this.jsonid] = [this.formatDateTime(new Date(), true), this.formatDateTime(new Date(), false)];
      this.titles[this.jsonid] = titleContent;
      localStorage.setItem("story", JSON.stringify(this.entries));
      localStorage.setItem("times", JSON.stringify(this.times));
      localStorage.setItem("titles", JSON.stringify(this.titles));
      document.getElementById("time").innerHTML = this.times[this.jsonid][this.settings.data.hour_24 ? 0 : 1];
    } else {
      delete this.entries[this.jsonid];
      delete this.times[this.jsonid];
      delete this.titles[this.jsonid];
      localStorage.setItem("story", JSON.stringify(this.entries));
      localStorage.setItem("times", JSON.stringify(this.times));
      localStorage.setItem("titles", JSON.stringify(this.titles));
      document.getElementById("time").innerHTML = "";
    }
    this.calendar.render(this.year, this.monthIndex + 1, this.entries);
    this.select(this.time.getMonth() + 1, this.time.getFullYear(), this.time.getDate());
  }

  formatDateTime(date, hour_24 = true) {
    const day = date.getDate();
    const month = this.months[date.getMonth()];
    const year = date.getFullYear();
    const time_stamp = hour_24 ? date.toLocaleTimeString('en-US', { hour12: false }) : date.toLocaleTimeString('en-US', { hour12: true });
    return `${time_stamp}, ${day} ${month} ${year}`;
  }

  changeID(elem) {
    Calendar.updateSelection(elem.innerHTML);
    this.selected = elem.innerHTML;
    setTimeout(() => {
      this.jsonid = `a${this.selected}${this.monthIndex + 1}${this.year}`;
      this.updateContent(this.jsonid);
    }, 10);
  }

  gotoCurrent() {
    this.monthIndex = this.time.getMonth();
    this.year = this.time.getFullYear();
    document.getElementById("month_year").innerHTML = `${this.months[this.monthIndex]} ${this.year}`;
    this.calendar.render(this.year, this.monthIndex + 1, this.entries);
    this.select(this.time.getMonth() + 1, this.time.getFullYear(), this.time.getDate());
  }

  gotoPrev() {
    if (this.monthIndex === 0) {
      this.monthIndex = 11;
      this.year -= 1;
    } else {
      this.monthIndex -= 1;
    }
    this.updateCalendar();
  }

  gotoNext() {
    if (this.monthIndex === 11) {
      this.monthIndex = 0;
      this.year += 1;
    } else {
      this.monthIndex += 1;
    }
    this.updateCalendar();
  }

  updateCalendar() {
    document.getElementById("current").disabled = this.monthIndex === this.time.getMonth() && this.year === this.time.getFullYear();
    document.getElementById("month_year").innerHTML = `${this.months[this.monthIndex]} ${this.year}`;
    this.calendar.render(this.year, this.monthIndex + 1, this.entries);
  }

  searchEntries() {
    const query = document.getElementById("search").value.trim();
    if (query) {
      document.getElementById("results-main").style.display = "block";
      this.results.length = 0;
      document.getElementById("results").innerHTML = "";
      for (let sy = this.time.getFullYear() - 100; sy <= this.time.getFullYear(); sy++) {
        for (let sm = 1; sm <= 12; sm++) {
          for (let sd = 1; sd <= 31; sd++) {
            let id = `a${sd}${sm}${sy}`;
            if (this.titles[id] && this.titles[id].toUpperCase().includes(query.toUpperCase())) {
              const result = `${sd} ${this.months[sm - 1]} ${sy}`;
              if (!this.results.includes(result)) {
                this.results.push(result);
                document.getElementById("results").innerHTML += `<div class='row' onclick='diary.select(${sm}, ${sy}, ${sd})'><p><b>${result}</b></p><p>${this.titles[id]}</p></div>`;
              }
            }
          }
        }
      }
      document.getElementById("num").innerHTML = `<span style='color:dodgerblue;'>${this.results.length}</span> result(s) found for <span style='color:dodgerblue;'>${query}</span>`;
    } else {
      document.getElementById("results-main").style.display = "none";
    }
  }

  // Placeholder animation
  cyclePlaceholder() {
    let placeholderText = this.generateRandom(Object.values(this.titles)) || "";
    const typePlaceholder = (text) => {
      let idx = 0;
      document.getElementById("search").placeholder = "";
      const interval = setInterval(() => {
        if (idx < text.length) {
          document.getElementById("search").placeholder += text[idx++];
        } else {
          clearInterval(interval);
          setTimeout(() => clearPlaceholder(text), 2000);
        }
      }, 100);
    };
    const clearPlaceholder = (text) => {
      let idx = text.length;
      const interval = setInterval(() => {
        if (idx > 0) {
          document.getElementById("search").placeholder = text.slice(0, --idx);
        } else {
          clearInterval(interval);
          placeholderText = this.generateRandom(Object.values(this.titles)) || "";
          setTimeout(() => typePlaceholder(placeholderText), 500);
        }
      }, 100);
    };
    typePlaceholder(placeholderText);
  }

  generateRandom(array) {
    if (!array.length) return "";
    return array[Math.floor(Math.random() * array.length)];
  }
}

// Global instance for event handlers
window.diary = new Diary();
