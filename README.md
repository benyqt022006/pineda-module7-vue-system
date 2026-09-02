# EVENTORA — Event Management System

A modern and responsive Event Management System built using **Vue.js** and **Vite**. EVENTORA allows users to create, view, search, edit, and delete event records through a simple and organized interface.

---

## Project Information

**Student:** Justin D. Pineda
**Course:** BSCS
**Section:** BSCS 3A
**Module:** Module 7 — Vue.js
**Project:** Event Management System
**System Name:** EVENTORA

---

## System Description

EVENTORA is a web-based Event Management System designed to help users organize and manage event information efficiently.

The system provides a centralized dashboard where users can monitor event records and perform common event management operations. It supports adding new events, viewing existing events, editing event details, deleting events, and searching through event records.

The application is built using Vue.js and follows a component-based structure to make the system easier to maintain and update. Event records are stored using browser **localStorage**, allowing the data to remain available even after refreshing or reopening the application in the same browser.

---

## Selected Entity

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

## Features

### Dashboard

* Displays the total number of events
* Shows upcoming events
* Shows completed events
* Shows cancelled events
* Provides an overview of event records
* Displays event statistics and status distribution

### Add Event

Users can create a new event by entering the required event information through the event form.

### View Event Records

Users can view multiple event records in an organized list or table.

### Edit Event

Existing event records can be selected and updated when event information changes.

### Delete Event

Users can remove an event record through a confirmation process to help prevent accidental deletion.

### Search and Filter

Users can search and filter event records to quickly find specific events.

### Local Storage

Event data is stored using browser localStorage. This allows event records to remain available after refreshing the page without requiring a separate database.

### Notifications

The system provides notifications to inform users about important actions, such as successfully adding, updating, or deleting an event.

### Light and Night Mode

Users can switch between light mode and night mode for a more comfortable viewing experience.

### Responsive Design

The interface is responsive and adapts to different screen sizes, including:

* Desktop
* Laptop
* Tablet
* Mobile devices

### Responsive Navigation

The system includes a responsive navigation menu with a hamburger menu for smaller screen sizes.

---

## System Architecture

EVENTORA uses a **component-based Vue.js architecture**. The application is divided into reusable Vue components and composables that handle different responsibilities.

The main parts of the system include:

* **Presentation Layer** — Vue components responsible for displaying the interface and receiving user input.
* **Application Logic** — Vue composables and JavaScript functions responsible for event management, searching, filtering, notifications, and state management.
* **Data Storage** — Browser localStorage used to save and retrieve event records.

This structure separates the user interface from application logic and data storage, making the system easier to maintain and extend.

---

## Technologies Used

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

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/benyqt022006/pineda-module7-vue-system.git


# Eventora Event Management System

## Module 9 – Software Evolution

Eventora is a Vue.js-based Event Management System developed and continuously improved from Module 7 through Module 9.

The system provides event management functions including creating, displaying, editing, deleting, searching, validating, and storing event records.

---

## Technology Stack

- Vue.js
- Vite
- JavaScript
- CSS
- localStorage
- Vue Router
- Vitest
- Vue Test Utils
- jsdom
- Git and GitHub
- GitHub Actions

---

## Module 9 Change Request

### CR-M9-01 – User Authentication and Account Management

**Maintenance Type:** Perfective Maintenance

The Module 9 evolution adds user registration, login, and logout functionality to the existing Eventora system.

### Objectives

- Allow users to create an Eventora account.
- Validate registration information.
- Allow registered users to log in.
- Protect access to the main Eventora system through authentication.
- Provide a logout function.
- Preserve existing event management functionality.

---

## Authentication Features

### Registration

Users can create an account by providing:

- Full Name
- Email Address
- Password
- Confirm Password

The registration process validates required information, email format, password length, and password confirmation.

### Login

Registered users can log in using their email address and password.

### Logout

Authenticated users can log out from the Eventora system using the Logout button in the application header.

---

## Existing Event Management Features

The following existing functions remain available:

- Add Event
- Display Event Records
- Edit Event
- Delete Event
- Search Event
- Event Validation
- Event Persistence
- Event Status Management

---

## Testing

Vitest is used for automated testing.

The baseline system contained:

- 11 automated tests
- 11 passed
- 0 failed

Module 9 testing adds verification for the new authentication functionality while preserving the existing event management tests.

## Updated Manual Test Cases – Module 9

| Test Case ID | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC-M9-01 | Register with valid name, email, and matching password | Account is created successfully | Account created successfully | PASS |
| TC-M9-02 | Register with an email that already exists | System displays an existing-account error | Existing-account error displayed | PASS |
| TC-M9-03 | Login using valid registered credentials | User is redirected to the Eventora dashboard | Eventora dashboard displayed | PASS |
| TC-M9-04 | Login using incorrect password | System rejects the login attempt | Login attempt rejected | PASS |
| TC-M9-05 | Click Logout while authenticated | User is logged out and returned to the authentication screen | User returned to authentication screen | PASS |

### Verification Commands

```bash
npm run test:run


add:

```md
### Production Build

```bash
npm run build
