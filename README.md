# Online Diary

Online Diary is a client-side web application designed to recreate the intimate feel and functionality of a physical, personal journal in a digital environment. Much like a traditional paper diary, it provides a versatile, private space where you can capture daily thoughts, write reflective journals, take quick notes, log schedules, and record important tasks — all seamlessly organized through an interactive, calendar-based timeline.

![Latest Version](https://img.shields.io/badge/Latest%20Version-1.0.2-blue.svg)
![Status](https://img.shields.io/badge/Status-Active-green.svg)


## 🌟 Features

### 1. Interactive Calendar Navigation
* **Dynamic Rendering**: Generates a responsive grid calendar for any selected month and year, complete with visual indicators for today's date and days with existing entries.
* **Month & Year Quick Travel**: Click the header to jump to any month/year combination. Features validation logic to prevent "future time travel" or traveling more than 100 years into the past.
* **Smart Navigation**: Easily transition between months with the previous and next arrow buttons or return to the current date with the dedicated "Today" button.

### 2. Secure Local Persistence
* **Instant Save**: Automatically saves diary titles, content, and precise timestamps to the browser's `localStorage` as you type, ensuring zero data loss.
* **Structured Data**: Separately indexes entries, creation timestamps, and titles, dynamically linking them to their corresponding calendar dates.

### 3. Sleek Settings & Themes
* **Theme Selector**: Toggle between light mode (soft light grey palette with clean borders) and dark mode (sleek midnight-dark aesthetic).
* **Time Format Slider**: Switch display formats between 12-hour (AM/PM) and 24-hour clocks, instantly updating the timestamps shown on your entries.
* **Responsive Layout**: Designed with a persistent tools panel, expandable settings overlay, and fluid layout adapting to varying viewport widths.

### 4. Smart Writing Lock
* **Historical Lock**: Prevents modifying history by automatically disabling input fields (Title & Content) for any day other than the current day.
* **View Mode**: Past entries remain readable and easily navigable while maintaining integrity against accidental edits.

### 5. Title-Based Search Engine
* **Instant Search Results**: Features a search bar to instantly query entry titles across all 100 years of history, displaying search results in real-time.
* **Interactive Results**: Click on any search result to automatically load that date and view the corresponding diary entry.
* **Dynamic Placeholder**: Animates a typewriter-effect placeholder text in the search bar, cycling through random historical entry titles to prompt discovery.


## 🚀 How to Run

### Method 1: Local HTTP Server (Recommended)
To run the project locally and avoid potential local file system origin restrictions in some browsers:

1. **Start Python HTTP Server**:
   Open a terminal in the project directory and run:
   ```bash
   python3 -m http.server 8000
   ```
2. **Access the App**:
   Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Method 2: Live Server (Development Mode)
If you are developing locally inside an editor:

1. **VS Code Live Server**:
   If using Visual Studio Code, right-click `index.html` and click **"Open with Live Server"**.
2. **Direct Browser Execution**:
   Alternatively, since the application relies only on client-side technologies, you can open `index.html` directly in your browser.
