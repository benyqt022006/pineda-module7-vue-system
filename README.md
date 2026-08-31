# 📅 EVENTORA — Event Management System

A modern and responsive Event Management System built using **Vue.js** and **Vite**. EVENTORA allows users to create, view, search, edit, and delete event records through a simple and organized interface.

---

## 📌 Project Information

**Student:** Justin D. Pineda
**Course:** BSCS
**Section:** BSCS 3A
**Module:** Module 7 — Vue.js
**Project:** Event Management System
**System Name:** EVENTORA

---

## 📖 System Description

EVENTORA is a web-based Event Management System designed to help users organize and manage event information efficiently.

The system provides a centralized dashboard where users can monitor event records and perform common event management operations. It supports adding new events, viewing existing events, editing event details, deleting events, and searching through event records.

The application is built using Vue.js and follows a component-based structure to make the system easier to maintain and update. Event records are stored using browser **localStorage**, allowing the data to remain available even after refreshing or reopening the application in the same browser.

---

## 🎯 Selected Entity

The selected entity for this system is:

**Event**

Each event record contains important information such as:

* Event title
* Event date
* Event time
* Event location
* Event category
* Event description
* Event status

---

## ✨ Features

### 📊 Dashboard

* Displays the total number of events
* Shows upcoming events
* Shows completed events
* Shows cancelled events
* Provides an overview of event records
* Displays event statistics and status distribution

### ➕ Add Event

Users can create a new event by entering the required event information through the event form.

### 📋 View Event Records

Users can view multiple event records in an organized list or table.

### ✏️ Edit Event

Existing event records can be selected and updated when event information changes.

### 🗑️ Delete Event

Users can remove an event record through a confirmation process to help prevent accidental deletion.

### 🔎 Search and Filter

Users can search and filter event records to quickly find specific events.

### 💾 Local Storage

Event data is stored using browser localStorage. This allows event records to remain available after refreshing the page without requiring a separate database.

### 🔔 Notifications

The system provides notifications to inform users about important actions, such as successfully adding, updating, or deleting an event.

### 🌙 Light and Night Mode

Users can switch between light mode and night mode for a more comfortable viewing experience.

### 📱 Responsive Design

The interface is responsive and adapts to different screen sizes, including:

* Desktop
* Laptop
* Tablet
* Mobile devices

### ☰ Responsive Navigation

The system includes a responsive navigation menu with a hamburger menu for smaller screen sizes.

---

## 🏗️ System Architecture

EVENTORA uses a **component-based Vue.js architecture**. The application is divided into reusable Vue components and composables that handle different responsibilities.

The main parts of the system include:

* **Presentation Layer** — Vue components responsible for displaying the interface and receiving user input.
* **Application Logic** — Vue composables and JavaScript functions responsible for event management, searching, filtering, notifications, and state management.
* **Data Storage** — Browser localStorage used to save and retrieve event records.

This structure separates the user interface from application logic and data storage, making the system easier to maintain and extend.

---

## 🛠️ Technologies Used

* **Vue.js** — Frontend framework
* **Vite** — Development and build tool
* **JavaScript** — Application logic
* **HTML5** — Page structure
* **CSS3** — Styling
* **Tailwind CSS** — Utility-based styling
* **Browser localStorage** — Client-side data storage
* **Git** — Version control
* **GitHub** — Source code repository
* **GitHub Actions** — Continuous integration
* **GitHub Pages** — Application deployment

---

## 💻 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/benyqt022006/pineda-module7-vue-system.git
```

### 2. Open the Project Folder

```bash
cd pineda-module7-vue-system
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

After running the command, open the local development URL provided by Vite in your browser.

### 5. Build the Application

To create a production build, run:

```bash
npm run build
```

The generated production files will be placed in the `dist` directory.

---

## 💾 Data Storage — localStorage

EVENTORA uses the browser's **localStorage** to store event records.

Instead of using a traditional database, the application saves event information directly in the user's browser. When the application starts, it retrieves the saved records from localStorage and loads them into the Vue application.

This allows users to:

* Keep event records after refreshing the page
* Store data without a backend database
* Create, update, and delete records locally
* Continue using the system without an internet connection after the application has been loaded

However, localStorage is browser-specific, meaning the stored records are not automatically shared between different browsers or devices.

---

## 🔗 Connection Between Module 6 and Module 7

The **Module 7 Vue.js project** builds upon the system and entity concepts established in **Module 6**.

The selected **Event** entity from the previous module is carried into the Vue.js implementation. The event information defined in the earlier system design is represented as event records in EVENTORA.

Module 7 focuses on implementing the system using Vue.js, reusable components, reactive data, client-side state management, localStorage, responsive design, and modern frontend development practices.

---


## ⚙️ Continuous Integration

EVENTORA uses **GitHub Actions** to automatically check the application whenever changes are pushed to the repository or a pull request is created for the main branch.

The workflow installs the project dependencies and runs the Vue production build:

```bash
npm ci
npm run build
```

This helps verify that the application can be successfully built after code changes.

---

## 🚀 Deployment

The application can be deployed using **GitHub Pages**. The production version is generated through the Vite build process and can be hosted as a static web application.

The GitHub repository also contains the project's source code, documentation, screenshots, and workflow configuration.

---

## ⚠️ Known Limitations

* Event records are stored only in the browser's localStorage.
* Data is not synchronized between different devices or browsers.
* There is currently no user authentication or account system.
* There is no server-side database.
* Event records are managed locally by the user.
* Clearing browser storage will remove the locally stored event records.
* The system does not currently provide real-time synchronization between users.

---

## 🔮 Future Improvements

Future versions of EVENTORA may include:

* Backend API integration
* MySQL or other database integration
* User authentication and authorization
* Cloud-based event storage
* Event calendar integration
* Email or reminder notifications
* Multiple-user support
* Advanced event filtering and sorting
* Event export and reporting
* Improved accessibility
* More advanced dashboard analytics

---

## 📂 Project Structure

A simplified structure of the project is:

```text
pineda-module7-vue-system/
├── .github/
│   └── workflows/
│       └── build.yml
├── public/
├── src/
│   ├── components/
│   ├── composables/
│   ├── App.vue
│   └── main.js
├── screenshots/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 👨‍💻 Author

**Justin D. Pineda**
BSCS 3A
Module 7 — Vue.js

---
