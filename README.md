# EVENTORA — Event Management System

A responsive and modern **Event Management System** built using **Vue.js and Vite**. The system allows users to create, view, update, delete, search, and filter event records through an interactive dashboard.

---

## 📌 Project Information

**Project:** Event Management System  
**System Name:** EVENTORA  
**Framework:** Vue.js  
**Build Tool:** Vite  
**Language:** JavaScript  
**Name:** Justin D. Pineda
**Course:** BSCS  
**Module:** Module 7  
**Year & Section:** BSCS 3A

---

## 🎯 Project Overview

EVENTORA is a web-based Event Management System designed to organize and manage event records efficiently.

The system provides a centralized dashboard where users can monitor event statistics, view upcoming events, manage event records, and analyze event statuses.

The interface was designed to be clean, modern, responsive, and easy to use on both desktop and mobile devices.

---

## ✨ Features

### 📊 Dashboard

- Total Events
- Upcoming Events
- Completed Events
- Cancelled Events
- Event Overview Analytics
- Event Status Distribution
- Upcoming Events Section

### 📝 Event Management

- Create new events
- View event records
- Edit existing events
- Delete events
- Event confirmation before deletion
- Event status management

### 🔎 Search & Filter

- Search events by:
  - Event name
  - Location
  - Organizer
- Filter events by status:
  - All
  - Upcoming
  - Completed
  - Cancelled

### 🔔 Notification System

- Event creation notifications
- Event update notifications
- Event deletion notifications
- Unread notification counter
- Mark notifications as read
- Mark all notifications as read

### 🌙 Appearance

- Light Mode
- Night Mode
- Smooth transitions
- Responsive layout
- Mobile-friendly interface
- Hamburger side menu

### 💾 Data Persistence

Event records are saved using **Local Storage**, allowing the data to remain available even after refreshing the browser.

---

## 🛠️ Technologies Used

- Vue.js
- Vite
- JavaScript
- HTML5
- CSS3
- Local Storage
- Responsive Web Design

---

## 📁 Project Structure

```text
pineda-module7-event-system/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── AppFooter.vue
│   │   ├── AppHeader.vue
│   │   ├── EventForm.vue
│   │   └── EventList.vue
│   │
│   ├── App.vue
│   ├── main.js
│   └── style.css
│
├── index.html
├── package.json
├── package-lock.json
└── README.md