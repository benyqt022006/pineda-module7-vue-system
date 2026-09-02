<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import AppHeader from './components/AppHeader.vue'
import EventForm from './components/EventForm.vue'
import EventList from './components/EventList.vue'
import AppFooter from './components/AppFooter.vue'

/* =========================================
   STATE
========================================= */

const events = ref([])
const searchTerm = ref('')
const statusFilter = ref('All')

const showForm = ref(false)
const editingEvent = ref(null)

const mobileMenuOpen = ref(false)
const notificationOpen = ref(false)
const darkMode = ref(true)

const notifications = ref([])

const STORAGE_KEY = 'pineda-eventora-events'
const THEME_KEY = 'pineda-eventora-theme'

/* =========================================
   INITIALIZE
========================================= */

onMounted(() => {
  const savedEvents =
    localStorage.getItem(STORAGE_KEY)

  const savedTheme =
    localStorage.getItem(THEME_KEY)

  if (savedEvents) {
    try {
      events.value = JSON.parse(savedEvents)
    } catch {
      events.value = []
    }
  }

  if (savedTheme) {
    darkMode.value = savedTheme === 'dark'
  }

  applyTheme()
})

/* =========================================
   LOCAL STORAGE
========================================= */

watch(
  events,
  value => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(value)
    )
  },
  {
    deep: true
  }
)

watch(
  darkMode,
  () => {
    applyTheme()

    localStorage.setItem(
      THEME_KEY,
      darkMode.value
        ? 'dark'
        : 'light'
    )
  }
)

function applyTheme() {
  document.documentElement.classList.toggle(
    'dark-theme',
    darkMode.value
  )
}

/* =========================================
   DASHBOARD STATISTICS
========================================= */

const totalEvents = computed(() => {
  return events.value.length
})

const upcomingEvents = computed(() => {
  return events.value.filter(
    event =>
      event.status === 'Upcoming'
  ).length
})

const completedEvents = computed(() => {
  return events.value.filter(
    event =>
      event.status === 'Completed'
  ).length
})

const cancelledEvents = computed(() => {
  return events.value.filter(
    event =>
      event.status === 'Cancelled'
  ).length
})

/* =========================================
   EVENT STATUS PERCENTAGES
========================================= */

const upcomingPercentage = computed(() => {
  if (!totalEvents.value) return 0

  return Math.round(
    (upcomingEvents.value /
      totalEvents.value) *
      100
  )
})

const completedPercentage = computed(() => {
  if (!totalEvents.value) return 0

  return Math.round(
    (completedEvents.value /
      totalEvents.value) *
      100
  )
})

const cancelledPercentage = computed(() => {
  if (!totalEvents.value) return 0

  return Math.round(
    (cancelledEvents.value /
      totalEvents.value) *
      100
  )
})

/* =========================================
   SEARCH + FILTER
========================================= */

const filteredEvents = computed(() => {
  const keyword =
    searchTerm.value
      .toLowerCase()
      .trim()

  return events.value.filter(event => {
    const matchesSearch =
      !keyword ||
      event.eventName
        ?.toLowerCase()
        .includes(keyword) ||
      event.location
        ?.toLowerCase()
        .includes(keyword) ||
      event.organizer
        ?.toLowerCase()
        .includes(keyword)

    const matchesStatus =
      statusFilter.value === 'All' ||
      event.status ===
        statusFilter.value

    return (
      matchesSearch &&
      matchesStatus
    )
  })
})

/* =========================================
   UPCOMING EVENTS
========================================= */

const upcomingEventList = computed(() => {
  return [...events.value]
    .filter(
      event =>
        event.status === 'Upcoming'
    )
    .sort(
      (a, b) =>
        new Date(a.eventDate) -
        new Date(b.eventDate)
    )
    .slice(0, 4)
})

/* =========================================
   RECENT EVENTS
========================================= */

const recentEventList = computed(() => {
  return [...events.value]
    .sort(
      (a, b) =>
        b.id - a.id
    )
    .slice(0, 5)
})

/* =========================================
   CRUD
========================================= */

function addEvent(eventData) {
  const newEvent = {
    id: Date.now(),
    ...eventData
  }

  events.value.unshift(newEvent)

  addNotification(
    'Event created',
    newEvent.eventName
  )

  showForm.value = false
  editingEvent.value = null
}

function updateEvent(updatedEvent) {
  const index =
    events.value.findIndex(
      event =>
        event.id ===
        updatedEvent.id
    )

  if (index === -1) return

  events.value[index] = {
    ...updatedEvent
  }

  addNotification(
    'Event updated',
    updatedEvent.eventName
  )

  showForm.value = false
  editingEvent.value = null
}

function editEvent(event) {
  editingEvent.value = {
    ...event
  }

  showForm.value = true

  closeMobileMenu()

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function deleteEvent(id) {
  const event =
    events.value.find(
      item => item.id === id
    )

  if (!event) return

  const confirmed =
    window.confirm(
      `Are you sure you want to delete "${event.eventName}"?`
    )

  if (!confirmed) return

  events.value =
    events.value.filter(
      item => item.id !== id
    )

  addNotification(
    'Event deleted',
    event.eventName
  )
}

/* =========================================
   FORM
========================================= */

function openAddForm() {
  editingEvent.value = null
  showForm.value = true

  closeMobileMenu()

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function cancelForm() {
  editingEvent.value = null
  showForm.value = false
}

/* =========================================
   MENU
========================================= */

function toggleMenu() {
  mobileMenuOpen.value =
    !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

/* =========================================
   NAVIGATION
========================================= */

function navigateTo(section) {
  closeMobileMenu()

  if (section === 'dashboard') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (section === 'events') {
    document
      .getElementById('event-records')
      ?.scrollIntoView({
        behavior: 'smooth'
      })
  }

  if (section === 'reports') {
    document
      .getElementById('analytics')
      ?.scrollIntoView({
        behavior: 'smooth'
      })
  }

  if (section === 'about') {
    document
      .getElementById('system-overview')
      ?.scrollIntoView({
        behavior: 'smooth'
      })
  }
}

/* =========================================
   THEME
========================================= */

function toggleTheme() {
  darkMode.value =
    !darkMode.value
}

/* =========================================
   NOTIFICATIONS
========================================= */

function addNotification(
  action,
  eventName
) {
  notifications.value.unshift({
    id: Date.now(),
    action,
    eventName,
    time: new Date()
  })

  if (
    notifications.value.length >
    8
  ) {
    notifications.value.pop()
  }
}

function toggleNotifications() {
  notificationOpen.value =
    !notificationOpen.value
}

function clearNotifications() {
  notifications.value = []
}

/* =========================================
   DATE
========================================= */

const currentDate = computed(() => {
  return new Date().toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }
  )
})

const currentDay = computed(() => {
  return new Date().toLocaleDateString(
    'en-US',
    {
      weekday: 'long'
    }
  )
})

/* =========================================
   FORMAT DATE
========================================= */

function formatDate(date) {
  if (!date) return 'No date'

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric'
    }
  )
}

/* =========================================
   DAY
========================================= */

function getDay(date) {
  if (!date) return '--'

  return new Date(
    `${date}T00:00:00`
  ).getDate()
}

function getMonth(date) {
  if (!date) return ''

  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString(
    'en-US',
    {
      month: 'short'
    }
  )
}

function logout() {
  sessionStorage.removeItem('eventoraAuthenticated')
  sessionStorage.removeItem('eventoraUser')

  window.location.reload()
}
</script>

<template>
  

  <div
    class="eventora-app"
    :class="{
      'light-mode': !darkMode
    }"
  >

    <!-- =====================================
         HEADER
    ====================================== -->

    <AppHeader
      :mobile-menu-open="mobileMenuOpen"
      :notification-open="notificationOpen"
      :notification-count="
        notifications.length
      "
      :dark-mode="darkMode"
      @toggle-menu="toggleMenu"
      @toggle-notifications="
        toggleNotifications
      "
      @toggle-theme="toggleTheme"
      @add-event="openAddForm"
      @logout="logout"
      />

    <!-- =====================================
         MOBILE SIDEBAR
    ====================================== -->

    <transition name="overlay">

      <div
        v-if="mobileMenuOpen"
        class="menu-overlay"
        @click="closeMobileMenu"
      ></div>

    </transition>

    <transition name="sidebar">

      <aside
        v-if="mobileMenuOpen"
        class="side-menu"
      >

        <div class="side-menu-header">

          <div class="side-logo">
            ✦
          </div>

          <div>
            <strong>
              EVENTORA
            </strong>

            <small>
              EVENT MANAGEMENT SYSTEM
            </small>
          </div>

          <button
            class="side-close"
            @click="closeMobileMenu"
          >
            ×
          </button>

        </div>

        <div class="side-divider"></div>

        <nav class="side-navigation">

          <p>
            MAIN MENU
          </p>

          <button
            class="side-nav-item active"
            @click="
              navigateTo('dashboard')
            "
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            class="side-nav-item"
            @click="
              navigateTo('events')
            "
          >
            <span>▣</span>
            Events
          </button>

          <button
            class="side-nav-item"
            @click="openAddForm"
          >
            <span>＋</span>
            Add Event
          </button>

          <button
            class="side-nav-item"
            @click="
              navigateTo('reports')
            "
          >
            <span>▥</span>
            Reports
          </button>

          <button
            class="side-nav-item"
            @click="
              navigateTo('about')
            "
          >
            <span>ⓘ</span>
            About
          </button>

        </nav>

        <div class="side-menu-bottom">

          <button
            class="side-theme"
            @click="toggleTheme"
          >
            <span>
              {{ darkMode ? '☾' : '☀' }}
            </span>

            <div>
              <strong>
                {{
                  darkMode
                    ? 'Night Mode'
                    : 'Light Mode'
                }}
              </strong>

              <small>
                Appearance
              </small>
            </div>

            <span class="theme-switch">
              <span
                :class="{
                  on: darkMode
                }"
              ></span>
            </span>
          </button>

          <div class="admin-profile">

            <div class="admin-avatar">
              A
            </div>

            <div>
              <strong>
                Admin
              </strong>

              <small>
                Administrator
              </small>
            </div>

          </div>

        </div>

      </aside>

    </transition>

    <!-- =====================================
         NOTIFICATION PANEL
    ====================================== -->

    <transition name="notification">

      <div
        v-if="notificationOpen"
        class="notification-panel"
      >

        <div class="notification-panel-header">

          <div>
            <strong>
              Notifications
            </strong>

            <small>
              Recent system activity
            </small>
          </div>

          <button
            @click="clearNotifications"
          >
            Clear
          </button>

        </div>

        <div
          v-if="notifications.length"
          class="notification-items"
        >

          <div
            v-for="item in notifications"
            :key="item.id"
            class="notification-item"
          >

            <div class="notification-icon">
              ✓
            </div>

            <div>
              <strong>
                {{ item.action }}
              </strong>

              <p>
                {{ item.eventName }}
              </p>

              <small>
                Just now
              </small>
            </div>

          </div>

        </div>

        <div
          v-else
          class="notification-empty"
        >
          <div>
            🔔
          </div>

          <strong>
            No new notifications
          </strong>

          <small>
            You're all caught up.
          </small>
        </div>

      </div>

    </transition>

    <!-- =====================================
         MAIN CONTENT
    ====================================== -->

    <main class="dashboard-main">

      <!-- HERO -->

      <section class="dashboard-hero">

        <div class="hero-content">

          <div class="hero-label">
            <span></span>
            EVENT OPERATIONS CENTER
          </div>

          <h1>
            Good afternoon,
            <span>Admin!</span>
            👋
          </h1>

          <p>
            Here's what's happening
            with your events today.
          </p>

          <div class="hero-meta">

            <div>
              <span>●</span>
              System operational
            </div>

            <div>
              Last updated just now
            </div>

          </div>

        </div>

        <div class="hero-date">

          <div class="calendar-icon">
            ▣
          </div>

          <div>
            <strong>
              {{ currentDate }}
            </strong>

            <span>
              {{ currentDay }}
            </span>
          </div>

        </div>

      </section>

      <!-- =====================================
           STAT CARDS
      ====================================== -->

      <section class="stat-grid">

        <!-- TOTAL -->

        <div class="tech-stat-card total-card">

          <div class="stat-top">

            <div class="stat-label">
              TOTAL EVENTS
            </div>

            <div class="stat-icon">
              ▣
            </div>

          </div>

          <div class="stat-number">
            {{ totalEvents }}
          </div>

          <div class="stat-description">
            All registered events
          </div>

          <div class="stat-progress">
            <span
              :style="{
                width:
                  totalEvents
                    ? '75%'
                    : '5%'
              }"
            ></span>
          </div>

          <div class="stat-bottom">
            <span class="positive">
              ↑ Active
            </span>

            <span>
              Event records
            </span>
          </div>

        </div>

        <!-- UPCOMING -->

        <div class="tech-stat-card upcoming-card">

          <div class="stat-top">

            <div class="stat-label">
              UPCOMING EVENTS
            </div>

            <div class="stat-icon">
              ◷
            </div>

          </div>

          <div class="stat-number">
            {{ upcomingEvents }}
          </div>

          <div class="stat-description">
            Scheduled events
          </div>

          <div class="stat-progress gold">
            <span
              :style="{
                width:
                  upcomingPercentage + '%'
              }"
            ></span>
          </div>

          <div class="stat-bottom">
            <span class="positive">
              ↑ {{ upcomingPercentage }}%
            </span>

            <span>
              Of total
            </span>
          </div>

        </div>

        <!-- COMPLETED -->

        <div class="tech-stat-card completed-card">

          <div class="stat-top">

            <div class="stat-label">
              COMPLETED EVENTS
            </div>

            <div class="stat-icon">
              ✓
            </div>

          </div>

          <div class="stat-number">
            {{ completedEvents }}
          </div>

          <div class="stat-description">
            Successfully completed
          </div>

          <div class="stat-progress">
            <span
              :style="{
                width:
                  completedPercentage + '%'
              }"
            ></span>
          </div>

          <div class="stat-bottom">
            <span class="positive">
              ↑ {{ completedPercentage }}%
            </span>

            <span>
              Completion rate
            </span>
          </div>

        </div>

        <!-- CANCELLED -->

        <div class="tech-stat-card cancelled-card">

          <div class="stat-top">

            <div class="stat-label">
              CANCELLED EVENTS
            </div>

            <div class="stat-icon">
              ×
            </div>

          </div>

          <div class="stat-number">
            {{ cancelledEvents }}
          </div>

          <div class="stat-description">
            Cancelled events
          </div>

          <div class="stat-progress red">
            <span
              :style="{
                width:
                  cancelledPercentage + '%'
              }"
            ></span>
          </div>

          <div class="stat-bottom">
            <span class="neutral">
              {{ cancelledPercentage }}%
            </span>

            <span>
              Of total
            </span>
          </div>

        </div>

      </section>

      <!-- =====================================
           ANALYTICS
      ====================================== -->

      <section
        id="analytics"
        class="analytics-grid"
      >

        <!-- EVENT OVERVIEW -->

        <div class="tech-panel overview-panel">

          <div class="panel-header">

            <div>
              <span>
                ANALYTICS
              </span>

              <h2>
                Events Overview
              </h2>
            </div>

            <select>
              <option>
                This Month
              </option>

              <option>
                This Year
              </option>

              <option>
                All Time
              </option>
            </select>

          </div>

          <div class="fake-chart">

            <div class="chart-y">
              <span>10</span>
              <span>8</span>
              <span>6</span>
              <span>4</span>
              <span>2</span>
              <span>0</span>
            </div>

            <div class="chart-area">

              <div class="grid-line line1"></div>
              <div class="grid-line line2"></div>
              <div class="grid-line line3"></div>
              <div class="grid-line line4"></div>
              <div class="grid-line line5"></div>

              <svg
                viewBox="0 0 600 220"
                preserveAspectRatio="none"
              >

                <defs>
                  <linearGradient
                    id="chartFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stop-opacity=".35"
                    />

                    <stop
                      offset="100%"
                      stop-opacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  class="chart-fill"
                  d="M0,170
                     C35,140 45,150 70,125
                     S110,160 135,135
                     S175,145 200,110
                     S240,130 270,90
                     S310,120 340,75
                     S385,105 410,120
                     S450,85 480,105
                     S530,60 600,70
                     L600,220
                     L0,220 Z"
                />

                <path
                  class="chart-line"
                  d="M0,170
                     C35,140 45,150 70,125
                     S110,160 135,135
                     S175,145 200,110
                     S240,130 270,90
                     S310,120 340,75
                     S385,105 410,120
                     S450,85 480,105
                     S530,60 600,70"
                />

              </svg>

              <div class="chart-point p1"></div>
              <div class="chart-point p2"></div>
              <div class="chart-point p3"></div>
              <div class="chart-point p4"></div>
              <div class="chart-point p5"></div>

              <div class="chart-months">
                <span>W1</span>
                <span>W2</span>
                <span>W3</span>
                <span>W4</span>
              </div>

            </div>

          </div>

        </div>

        <!-- EVENT STATUS -->

        <div class="tech-panel status-panel">

          <div class="panel-header">

            <div>
              <span>
                DISTRIBUTION
              </span>

              <h2>
                Event Status
              </h2>
            </div>

          </div>

          <div class="donut-container">

            <div
              class="donut"
              :style="{
                background:
                  `conic-gradient(
                    #27b98a 0 ${upcomingPercentage}%,
                    #f0b83d ${upcomingPercentage}% ${upcomingPercentage + completedPercentage}%,
                    #e64f55 ${upcomingPercentage + completedPercentage}% 100%
                  )`
              }"
            >

              <div class="donut-center">

                <strong>
                  {{ totalEvents }}
                </strong>

                <span>
                  TOTAL
                </span>

              </div>

            </div>

            <div class="status-legend">

              <div>
                <span class="dot green"></span>

                <p>
                  Upcoming
                  <strong>
                    {{ upcomingEvents }}
                  </strong>
                </p>

              </div>

              <div>
                <span class="dot gold"></span>

                <p>
                  Completed
                  <strong>
                    {{ completedEvents }}
                  </strong>
                </p>

              </div>

              <div>
                <span class="dot red"></span>

                <p>
                  Cancelled
                  <strong>
                    {{ cancelledEvents }}
                  </strong>
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      <!-- =====================================
           FORM
      ====================================== -->

      <transition name="form">

        <section
          v-if="showForm"
          class="form-area"
        >

          <EventForm
            :event="editingEvent"
            @add-event="addEvent"
            @update-event="
              updateEvent
            "
            @cancel="cancelForm"
          />

        </section>

      </transition>

      <!-- =====================================
           LOWER DASHBOARD
      ====================================== -->

      <section class="lower-grid">

        <!-- UPCOMING EVENTS -->

        <div class="tech-panel upcoming-panel">

          <div class="panel-header">

            <div>
              <span>
                SCHEDULE
              </span>

              <h2>
                Upcoming Events
              </h2>
            </div>

            <button
              @click="
                navigateTo('events')
              "
            >
              View All →
            </button>

          </div>

          <div
            v-if="
              upcomingEventList.length
            "
            class="upcoming-list"
          >

            <div
              v-for="
                event in upcomingEventList
              "
              :key="event.id"
              class="upcoming-item"
            >

              <div class="event-date-box">

                <strong>
                  {{ getDay(event.eventDate) }}
                </strong>

                <span>
                  {{ getMonth(event.eventDate) }}
                </span>

              </div>

              <div class="upcoming-info">

                <strong>
                  {{ event.eventName }}
                </strong>

                <span>
                  📍 {{ event.location }}
                </span>

                <small>
                  {{ event.organizer }}
                </small>

              </div>

              <span class="upcoming-badge">
                UPCOMING
              </span>

            </div>

          </div>

          <div
            v-else
            class="empty-dashboard"
          >
            <span>📅</span>

            <strong>
              No upcoming events
            </strong>

            <small>
              Add an event to see it here.
            </small>
          </div>

        </div>

        <!-- RECENT ACTIVITY -->

        <div class="tech-panel activity-panel">

          <div class="panel-header">

            <div>
              <span>
                SYSTEM ACTIVITY
              </span>

              <h2>
                Recent Activity
              </h2>
            </div>

            <button
              @click="
                toggleNotifications
              "
            >
              View All →
            </button>

          </div>

          <div
            v-if="recentEventList.length"
            class="activity-list"
          >

            <div
              v-for="
                event in recentEventList
              "
              :key="event.id"
              class="activity-item"
            >

              <div class="activity-icon">
                +
              </div>

              <div>
                <strong>
                  Event created
                </strong>

                <span>
                  {{ event.eventName }}
                </span>
              </div>

              <small>
                Recent
              </small>

            </div>

          </div>

          <div
            v-else
            class="empty-dashboard"
          >
            <span>◌</span>

            <strong>
              No activity yet
            </strong>

            <small>
              Your activity will appear here.
            </small>
          </div>

        </div>

        <!-- SYSTEM OVERVIEW -->

        <div
          id="system-overview"
          class="tech-panel system-panel"
        >

          <div class="panel-header">

            <div>
              <span>
                SYSTEM
              </span>

              <h2>
                System Overview
              </h2>
            </div>

          </div>

          <div class="system-items">

            <div>
              <span>
                System Status
              </span>

              <strong class="online">
                ● Online
              </strong>
            </div>

            <div>
              <span>
                Local Storage
              </span>

              <strong class="online">
                ● Active
              </strong>
            </div>

            <div>
              <span>
                Event Records
              </span>

              <strong>
                {{ totalEvents }}
              </strong>
            </div>

            <div>
              <span>
                Data Status
              </span>

              <strong class="online">
                Saved
              </strong>
            </div>

          </div>

          <div class="system-message">

            <div class="shield">
              ✓
            </div>

            <div>
              <strong>
                All systems operational
              </strong>

              <small>
                Your event management
                system is running smoothly.
              </small>
            </div>

          </div>

        </div>

      </section>

      <!-- =====================================
           EVENT RECORDS
      ====================================== -->

      <section
        id="event-records"
        class="records-section"
      >

        <div class="records-heading">

          <div>

            <span>
              RECORD MANAGEMENT
            </span>

            <h2>
              Event Records
            </h2>

            <p>
              Search, filter, edit and
              manage your events.
            </p>

          </div>

          <button
            class="gold-button"
            @click="openAddForm"
          >
            ＋ New Event
          </button>

        </div>

        <div class="search-container">

          <div class="search-box">

            <span>
              ⌕
            </span>

            <input
              v-model="searchTerm"
              type="search"
              placeholder="Search events, venues, organizers..."
            />

            <button
              v-if="searchTerm"
              @click="
                searchTerm = ''
              "
            >
              ×
            </button>

          </div>

          <div class="filter-buttons">

            <button
              v-for="
                status in [
                  'All',
                  'Upcoming',
                  'Completed',
                  'Cancelled'
                ]
              "
              :key="status"
              :class="{
                active:
                  statusFilter ===
                  status
              }"
              @click="
                statusFilter = status
              "
            >
              {{ status }}
            </button>

          </div>

        </div>

        <EventList
          :events="filteredEvents"
          @edit="editEvent"
          @delete="deleteEvent"
        />

      </section>

    </main>

    <AppFooter />

  </div>
</template>

<style>

.logout-button {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 9999;

  padding: 10px 18px;
  border: 1px solid rgba(239, 96, 96, 0.35);
  border-radius: 10px;

  background: rgba(239, 96, 96, 0.1);
  color: #ff8c8c;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background: rgba(239, 96, 96, 0.2);
  border-color: rgba(239, 96, 96, 0.6);
}

@media (max-width: 600px) {
  .logout-button {
    top: 12px;
    right: 12px;
    padding: 8px 12px;
    font-size: 12px;
  }
}
/* =========================================
   VARIABLES
========================================= */

:root {
  --bg: #06100d;
  --surface: #0b1915;
  --surface-2: #0e211b;
  --surface-3: #112921;

  --text: #edf8f4;
  --text-soft: #88a69b;

  --emerald: #27b98a;
  --emerald-bright: #4de0ad;
  --gold: #f0b83d;
  --red: #e64f55;

  --border:
    rgba(80, 190, 150, 0.16);

  --glow:
    rgba(39, 185, 138, 0.18);

  --shadow:
    rgba(0, 0, 0, 0.35);
}

.light-mode {
  --bg: #edf4f1;
  --surface: #ffffff;
  --surface-2: #f6faf8;
  --surface-3: #eaf3ef;

  --text: #15362c;
  --text-soft: #708a81;

  --border:
    rgba(20, 90, 70, 0.12);

  --glow:
    rgba(39, 185, 138, 0.1);

  --shadow:
    rgba(20, 60, 45, 0.12);
}

/* =========================================
   GLOBAL
========================================= */

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;

  background: var(--bg);

  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.eventora-app {
  min-height: 100vh;

  overflow-x: hidden;

  color: var(--text);

  background:
    radial-gradient(
      circle at 85% 10%,
      rgba(39,185,138,.08),
      transparent 25%
    ),
    radial-gradient(
      circle at 15% 80%,
      rgba(240,184,61,.035),
      transparent 25%
    ),
    var(--bg);

  transition:
    background .4s ease,
    color .4s ease;
}

/* =========================================
   HEADER
========================================= */

.app-header {
  position: sticky;

  top: 0;

  z-index: 80;

  height: 72px;

  border-bottom:
    1px solid
    var(--border);

  background:
    rgba(6,16,13,.88);

  backdrop-filter:
    blur(18px);
}

.light-mode .app-header {
  background:
    rgba(255,255,255,.88);
}

.header-inner {
  height: 100%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 1rem;

  padding:
    0 1.3rem;
}

/* =========================================
   SIDEBAR
========================================= */

.menu-overlay {
  position: fixed;

  inset: 0;

  z-index: 90;

  background:
    rgba(0,0,0,.65);

  backdrop-filter:
    blur(5px);
}

.side-menu {
  position: fixed;

  top: 0;
  left: 0;
  bottom: 0;

  z-index: 100;

  width: min(330px, 88vw);

  display: flex;

  flex-direction: column;

  padding: 1.5rem;

  background:
    linear-gradient(
      180deg,
      #07130f,
      #0a1b16
    );

  border-right:
    1px solid
    rgba(39,185,138,.22);

  box-shadow:
    20px 0 60px
    rgba(0,0,0,.45);
}

.light-mode .side-menu {
  background:
    linear-gradient(
      180deg,
      #ffffff,
      #eef7f3
    );
}

.side-menu-header {
  display: flex;

  align-items: center;

  gap: .8rem;
}

.side-logo {
  width: 3rem;
  height: 3rem;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: .9rem;

  background:
    linear-gradient(
      135deg,
      #f0b83d,
      #d99017
    );

  color: white;

  font-size: 1.3rem;

  box-shadow:
    0 0 25px
    rgba(240,184,61,.2);
}

.side-menu-header strong,
.side-menu-header small {
  display: block;
}

.side-menu-header strong {
  color: var(--gold);

  font-size: 1rem;

  letter-spacing: .08em;
}

.side-menu-header small {
  margin-top: .15rem;

  color: var(--text-soft);

  font-size: .45rem;

  letter-spacing: .1em;
}

.side-close {
  margin-left: auto;

  width: 2rem;
  height: 2rem;

  border: 0;

  background: transparent;

  color: var(--text-soft);

  font-size: 1.5rem;
}

.side-divider {
  height: 1px;

  margin:
    1.4rem 0;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(240,184,61,.4),
      transparent
    );
}

.side-navigation {
  display: flex;

  flex-direction: column;

  gap: .35rem;
}

.side-navigation > p {
  margin:
    0 0 .5rem;

  color: var(--text-soft);

  font-size: .45rem;

  font-weight: 900;

  letter-spacing: .16em;
}

.side-nav-item {
  display: flex;

  align-items: center;

  gap: .8rem;

  border: 1px solid transparent;

  border-radius: .75rem;

  background: transparent;

  color: var(--text-soft);

  padding: .8rem;

  text-align: left;

  font-size: .65rem;

  transition:
    .25s ease;
}

.side-nav-item span {
  width: 1.2rem;

  color: var(--emerald);

  text-align: center;

  font-size: .9rem;
}

.side-nav-item:hover,
.side-nav-item.active {
  border-color:
    rgba(39,185,138,.18);

  background:
    linear-gradient(
      90deg,
      rgba(39,185,138,.16),
      rgba(39,185,138,.03)
    );

  color: var(--text);

  transform:
    translateX(4px);
}

.side-menu-bottom {
  margin-top: auto;
}

.side-theme {
  width: 100%;

  display: flex;

  align-items: center;

  gap: .7rem;

  border:
    1px solid
    var(--border);

  border-radius: .8rem;

  background:
    var(--surface-2);

  color: var(--text);

  padding: .8rem;

  text-align: left;
}

.side-theme > span:first-child {
  color: var(--gold);

  font-size: 1rem;
}

.side-theme strong,
.side-theme small {
  display: block;
}

.side-theme strong {
  font-size: .58rem;
}

.side-theme small {
  margin-top: .1rem;

  color: var(--text-soft);

  font-size: .45rem;
}

.theme-switch {
  width: 2.2rem;
  height: 1.1rem;

  margin-left: auto;

  padding: .15rem;

  border-radius: 999px;

  background:
    rgba(255,255,255,.08);
}

.theme-switch span {
  display: block;

  width: .8rem;
  height: .8rem;

  border-radius: 50%;

  background: var(--text-soft);

  transition: .25s ease;
}

.theme-switch span.on {
  margin-left: 1.1rem;

  background: var(--emerald);
}

.admin-profile {
  display: flex;

  align-items: center;

  gap: .65rem;

  margin-top: 1rem;

  padding-top: 1rem;

  border-top:
    1px solid
    var(--border);
}

.admin-avatar {
  width: 2.3rem;
  height: 2.3rem;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #2c7d65,
      #154a3b
    );

  color: white;

  font-size: .7rem;

  font-weight: 900;
}

.admin-profile strong,
.admin-profile small {
  display: block;
}

.admin-profile strong {
  font-size: .6rem;
}

.admin-profile small {
  margin-top: .15rem;

  color: var(--text-soft);

  font-size: .45rem;
}

/* =========================================
   DASHBOARD
========================================= */

.dashboard-main {
  width: min(1500px, 100%);

  margin: auto;

  padding:
    1.5rem
    clamp(1rem, 3vw, 3rem)
    3rem;
}

/* HERO */

.dashboard-hero {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 1rem;

  margin-bottom: 1.3rem;

  padding:
    1.4rem 1.5rem;

  border:
    1px solid
    var(--border);

  border-radius: 1.2rem;

  background:
    linear-gradient(
      135deg,
      rgba(39,185,138,.08),
      var(--surface)
    );

  box-shadow:
    0 15px 45px
    var(--shadow);

  position: relative;

  overflow: hidden;
}

.dashboard-hero::after {
  content: "";

  position: absolute;

  width: 300px;
  height: 300px;

  right: -120px;
  top: -150px;

  border-radius: 50%;

  border:
    1px solid
    rgba(39,185,138,.12);

  box-shadow:
    0 0 0 40px
    rgba(39,185,138,.025),
    0 0 0 80px
    rgba(39,185,138,.02);
}

.hero-label {
  display: flex;

  align-items: center;

  gap: .4rem;

  color: var(--emerald);

  font-size: .48rem;

  font-weight: 900;

  letter-spacing: .14em;
}

.hero-label span {
  width: .4rem;
  height: .4rem;

  border-radius: 50%;

  background: var(--emerald);

  box-shadow:
    0 0 10px
    var(--emerald);
}

.hero-content h1 {
  margin: .35rem 0 .2rem;

  font-size:
    clamp(1.35rem, 3vw, 2rem);

  letter-spacing: -.04em;
}

.hero-content h1 span {
  color: var(--emerald-bright);
}

.hero-content p {
  margin: 0;

  color: var(--text-soft);

  font-size: .62rem;
}

.hero-meta {
  display: flex;

  gap: 1rem;

  margin-top: .7rem;

  color: var(--text-soft);

  font-size: .45rem;
}

.hero-meta span {
  color: var(--emerald);
}

.hero-date {
  display: flex;

  align-items: center;

  gap: .6rem;

  padding: .75rem 1rem;

  border:
    1px solid
    var(--border);

  border-radius: .8rem;

  background:
    var(--surface-2);

  z-index: 1;
}

.calendar-icon {
  width: 2.2rem;
  height: 2.2rem;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: .6rem;

  background:
    rgba(39,185,138,.12);

  color: var(--emerald);
}

.hero-date strong,
.hero-date span {
  display: block;
}

.hero-date strong {
  font-size: .6rem;
}

.hero-date span {
  margin-top: .15rem;

  color: var(--text-soft);

  font-size: .45rem;
}

/* =========================================
   STAT CARDS
========================================= */

.stat-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: .8rem;

  margin-bottom: 1rem;
}

.tech-stat-card {
  position: relative;

  overflow: hidden;

  min-height: 175px;

  padding: 1rem;

  border:
    1px solid
    var(--border);

  border-radius: 1rem;

  background:
    linear-gradient(
      145deg,
      var(--surface-2),
      var(--surface)
    );

  box-shadow:
    0 10px 35px
    var(--shadow);

  transition:
    transform .3s ease,
    border-color .3s ease,
    box-shadow .3s ease;
}

.tech-stat-card:hover {
  transform:
    translateY(-5px);

  border-color:
    rgba(39,185,138,.35);

  box-shadow:
    0 15px 45px
    rgba(39,185,138,.08);
}

.tech-stat-card::before {
  content: "";

  position: absolute;

  width: 100px;
  height: 100px;

  right: -50px;
  bottom: -50px;

  border-radius: 50%;

  background:
    var(--glow);

  filter:
    blur(5px);
}

.stat-top {
  display: flex;

  align-items: center;

  justify-content: space-between;
}

.stat-label {
  color: var(--text-soft);

  font-size: .45rem;

  font-weight: 900;

  letter-spacing: .1em;
}

.stat-icon {
  width: 2.4rem;
  height: 2.4rem;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: .7rem;

  background:
    rgba(39,185,138,.12);

  color: var(--emerald);

  font-size: .9rem;
}

.upcoming-card .stat-icon {
  background:
    rgba(240,184,61,.12);

  color: var(--gold);
}

.cancelled-card .stat-icon {
  background:
    rgba(230,79,85,.12);

  color: var(--red);
}

.stat-number {
  margin-top: .9rem;

  color: var(--text);

  font-size: 2rem;

  font-weight: 900;

  letter-spacing: -.05em;
}

.stat-description {
  color: var(--text-soft);

  font-size: .5rem;
}

.stat-progress {
  height: 3px;

  margin-top: .8rem;

  overflow: hidden;

  border-radius: 999px;

  background:
    rgba(39,185,138,.1);
}

.stat-progress span {
  display: block;

  height: 100%;

  border-radius: inherit;

  background:
    var(--emerald);

  box-shadow:
    0 0 10px
    rgba(39,185,138,.5);

  transition: width .6s ease;
}

.stat-progress.gold {
  background:
    rgba(240,184,61,.1);
}

.stat-progress.gold span {
  background: var(--gold);
}

.stat-progress.red {
  background:
    rgba(230,79,85,.1);
}

.stat-progress.red span {
  background: var(--red);
}

.stat-bottom {
  display: flex;

  justify-content: space-between;

  margin-top: .55rem;

  color: var(--text-soft);

  font-size: .43rem;
}

.positive {
  color: var(--emerald);
}

.neutral {
  color: var(--gold);
}

/* =========================================
   PANELS
========================================= */

.analytics-grid {
  display: grid;

  grid-template-columns:
    1.6fr 1fr;

  gap: .8rem;

  margin-bottom: .8rem;
}

.tech-panel {
  border:
    1px solid
    var(--border);

  border-radius: 1rem;

  background:
    linear-gradient(
      145deg,
      var(--surface-2),
      var(--surface)
    );

  box-shadow:
    0 10px 35px
    var(--shadow);

  overflow: hidden;
}

.panel-header {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 1rem;

  padding:
    1rem 1rem .5rem;
}

.panel-header > div > span {
  color: var(--emerald);

  font-size: .42rem;

  font-weight: 900;

  letter-spacing: .13em;
}

.panel-header h2 {
  margin: .25rem 0 0;

  color: var(--text);

  font-size: .85rem;

  font-weight: 900;
}

.panel-header select {
  border:
    1px solid
    var(--border);

  border-radius: .55rem;

  outline: none;

  background:
    var(--surface);

  color: var(--text);

  padding: .45rem;

  font-size: .48rem;
}

.panel-header button {
  border: 0;

  background: transparent;

  color: var(--gold);

  font-size: .48rem;

  font-weight: 800;
}

/* =========================================
   CHART
========================================= */

.fake-chart {
  display: flex;

  height: 250px;

  padding:
    1rem 1rem .7rem;
}

.chart-y {
  width: 25px;

  display: flex;

  flex-direction: column;

  justify-content: space-between;

  padding-bottom: 22px;

  color: var(--text-soft);

  font-size: .4rem;
}

.chart-area {
  position: relative;

  flex: 1;

  overflow: hidden;
}

.grid-line {
  position: absolute;

  left: 0;
  right: 0;

  height: 1px;

  background:
    rgba(100,180,155,.07);
}

.line1 {
  top: 0;
}

.line2 {
  top: 20%;
}

.line3 {
  top: 40%;
}

.line4 {
  top: 60%;
}

.line5 {
  top: 80%;
}

.chart-area svg {
  position: absolute;

  inset: 0;

  width: 100%;
  height: 90%;
}

.chart-fill {
  fill:
    url(#chartFill);
}

.chart-line {
  fill: none;

  stroke:
    var(--emerald-bright);

  stroke-width: 3;

  filter:
    drop-shadow(
      0 0 5px
      rgba(77,224,173,.5)
    );
}

.chart-point {
  position: absolute;

  width: 7px;
  height: 7px;

  border-radius: 50%;

  background:
    var(--emerald-bright);

  box-shadow:
    0 0 12px
    var(--emerald);

  animation:
    chartPulse 2s infinite;
}

.p1 {
  left: 13%;
  top: 56%;
}

.p2 {
  left: 32%;
  top: 48%;
}

.p3 {
  left: 55%;
  top: 34%;
}

.p4 {
  left: 73%;
  top: 50%;
}

.p5 {
  right: 4%;
  top: 27%;
}

@keyframes chartPulse {
  0%,
  100% {
    box-shadow:
      0 0 5px
      var(--emerald);
  }

  50% {
    box-shadow:
      0 0 16px
      var(--emerald);
  }
}

.chart-months {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 0;

  display: flex;

  justify-content: space-between;

  color: var(--text-soft);

  font-size: .4rem;
}

/* =========================================
   DONUT
========================================= */

.donut-container {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 2rem;

  min-height: 250px;

  padding: 1rem;
}

.donut {
  width: 150px;
  height: 150px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  transform: rotate(-90deg);

  box-shadow:
    0 0 35px
    rgba(39,185,138,.08);
}

.donut-center {
  width: 105px;
  height: 105px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-direction: column;

  border-radius: 50%;

  background:
    var(--surface);

  transform: rotate(90deg);
}

.donut-center strong {
  font-size: 1.5rem;
}

.donut-center span {
  color: var(--text-soft);

  font-size: .42rem;

  letter-spacing: .1em;
}

.status-legend {
  display: flex;

  flex-direction: column;

  gap: .8rem;
}

.status-legend > div {
  display: flex;

  align-items: center;

  gap: .5rem;
}

.dot {
  width: .55rem;
  height: .55rem;

  border-radius: 50%;
}

.dot.green {
  background: var(--emerald);
}

.dot.gold {
  background: var(--gold);
}

.dot.red {
  background: var(--red);
}

.status-legend p {
  margin: 0;

  color: var(--text-soft);

  font-size: .5rem;
}

.status-legend strong {
  display: block;

  margin-top: .1rem;

  color: var(--text);

  font-size: .6rem;
}

/* =========================================
   LOWER GRID
========================================= */

.lower-grid {
  display: grid;

  grid-template-columns:
    1.3fr 1.1fr 1fr;

  gap: .8rem;

  margin-bottom: 1rem;
}

.upcoming-list,
.activity-list {
  padding: .5rem 1rem 1rem;
}

.upcoming-item {
  display: flex;

  align-items: center;

  gap: .7rem;

  padding: .7rem 0;

  border-bottom:
    1px solid
    var(--border);
}

.upcoming-item:last-child {
  border-bottom: 0;
}

.event-date-box {
  width: 40px;
  height: 45px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-direction: column;

  border-radius: .6rem;

  background:
    rgba(240,184,61,.1);

  border:
    1px solid
    rgba(240,184,61,.12);
}

.event-date-box strong {
  color: var(--gold);

  font-size: .85rem;
}

.event-date-box span {
  color: var(--text-soft);

  font-size: .4rem;

  text-transform: uppercase;
}

.upcoming-info {
  flex: 1;

  min-width: 0;
}

.upcoming-info strong,
.upcoming-info span,
.upcoming-info small {
  display: block;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.upcoming-info strong {
  color: var(--text);

  font-size: .58rem;
}

.upcoming-info span {
  margin-top: .15rem;

  color: var(--text-soft);

  font-size: .45rem;
}

.upcoming-info small {
  margin-top: .1rem;

  color: var(--text-soft);

  font-size: .42rem;
}

.upcoming-badge {
  padding: .3rem .4rem;

  border-radius: 999px;

  background:
    rgba(39,185,138,.08);

  color: var(--emerald);

  font-size: .38rem;

  font-weight: 900;
}

.activity-item {
  display: flex;

  align-items: center;

  gap: .6rem;

  padding: .72rem 0;

  border-bottom:
    1px solid
    var(--border);
}

.activity-item:last-child {
  border-bottom: 0;
}

.activity-icon {
  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  background:
    rgba(39,185,138,.12);

  color: var(--emerald);

  font-weight: 900;
}

.activity-item > div:nth-child(2) {
  flex: 1;

  min-width: 0;
}

.activity-item strong,
.activity-item span {
  display: block;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.activity-item strong {
  color: var(--emerald);

  font-size: .5rem;
}

.activity-item span {
  margin-top: .1rem;

  color: var(--text);

  font-size: .52rem;
}

.activity-item small {
  color: var(--text-soft);

  font-size: .42rem;
}

.system-items {
  padding:
    .4rem 1rem;
}

.system-items > div {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: .6rem 0;

  border-bottom:
    1px solid
    var(--border);
}

.system-items span {
  color: var(--text-soft);

  font-size: .5rem;
}

.system-items strong {
  font-size: .5rem;
}

.online {
  color: var(--emerald);
}

.system-message {
  display: flex;

  gap: .6rem;

  margin: .5rem 1rem 1rem;

  padding: .7rem;

  border:
    1px solid
    rgba(39,185,138,.15);

  border-radius: .7rem;

  background:
    rgba(39,185,138,.06);
}

.shield {
  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    rgba(39,185,138,.12);

  color: var(--emerald);
}

.system-message strong,
.system-message small {
  display: block;
}

.system-message strong {
  color: var(--emerald);

  font-size: .52rem;
}

.system-message small {
  margin-top: .2rem;

  color: var(--text-soft);

  font-size: .42rem;

  line-height: 1.4;
}

.empty-dashboard {
  min-height: 170px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-direction: column;

  gap: .25rem;

  padding: 1rem;

  text-align: center;
}

.empty-dashboard > span {
  font-size: 1.5rem;
}

.empty-dashboard strong {
  font-size: .58rem;
}

.empty-dashboard small {
  color: var(--text-soft);

  font-size: .45rem;
}

/* =========================================
   RECORDS
========================================= */

.records-section {
  margin-top: 1rem;
}

.records-heading {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 1rem;

  margin-bottom: .8rem;
}

.records-heading > div > span {
  color: var(--emerald);

  font-size: .42rem;

  font-weight: 900;

  letter-spacing: .13em;
}

.records-heading h2 {
  margin: .25rem 0;

  font-size: 1rem;
}

.records-heading p {
  margin: 0;

  color: var(--text-soft);

  font-size: .5rem;
}

.gold-button {
  border: 0;

  border-radius: .7rem;

  background:
    linear-gradient(
      135deg,
      #f0b83d,
      #d99519
    );

  color: white;

  padding: .7rem .9rem;

  font-size: .55rem;

  font-weight: 900;

  box-shadow:
    0 7px 20px
    rgba(240,184,61,.15);
}

.search-container {
  display: flex;

  align-items: center;

  gap: .5rem;

  margin-bottom: .7rem;
}

.search-box {
  flex: 1;

  display: flex;

  align-items: center;

  gap: .5rem;

  border:
    1px solid
    var(--border);

  border-radius: .75rem;

  background:
    var(--surface);

  padding:
    .15rem .7rem;
}

.search-box > span {
  color: var(--emerald);

  font-size: 1rem;
}

.search-box input {
  width: 100%;

  border: 0;

  outline: 0;

  background: transparent;

  color: var(--text);

  padding: .6rem 0;

  font-size: .55rem;
}

.search-box input::placeholder {
  color: var(--text-soft);
}

.search-box button {
  border: 0;

  background: transparent;

  color: var(--text-soft);
}

.filter-buttons {
  display: flex;

  gap: .3rem;
}

.filter-buttons button {
  border:
    1px solid
    var(--border);

  border-radius: 999px;

  background:
    var(--surface);

  color: var(--text-soft);

  padding:
    .5rem .65rem;

  font-size: .45rem;

  font-weight: 800;
}

.filter-buttons button.active {
  border-color:
    rgba(39,185,138,.3);

  background:
    rgba(39,185,138,.1);

  color: var(--emerald);
}

/* =========================================
   NOTIFICATIONS
========================================= */

.notification-panel {
  position: fixed;

  top: 82px;
  right: 1rem;

  z-index: 200;

  width: min(360px, calc(100vw - 2rem));

  overflow: hidden;

  border:
    1px solid
    var(--border);

  border-radius: 1rem;

  background:
    var(--surface);

  box-shadow:
    0 25px 70px
    rgba(0,0,0,.4);
}

.notification-panel-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding: .9rem;

  border-bottom:
    1px solid
    var(--border);
}

.notification-panel-header strong,
.notification-panel-header small {
  display: block;
}

.notification-panel-header strong {
  font-size: .65rem;
}

.notification-panel-header small {
  margin-top: .15rem;

  color: var(--text-soft);

  font-size: .43rem;
}

.notification-panel-header button {
  border: 0;

  background: transparent;

  color: var(--gold);

  font-size: .45rem;

  font-weight: 800;
}

.notification-items {
  max-height: 350px;

  overflow-y: auto;
}

.notification-item {
  display: flex;

  gap: .6rem;

  padding: .75rem;

  border-bottom:
    1px solid
    var(--border);
}

.notification-icon {
  width: 28px;
  height: 28px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  background:
    rgba(39,185,138,.1);

  color: var(--emerald);
}

.notification-item strong,
.notification-item p,
.notification-item small {
  display: block;
}

.notification-item strong {
  color: var(--emerald);

  font-size: .5rem;
}

.notification-item p {
  margin: .15rem 0;

  color: var(--text);

  font-size: .52rem;
}

.notification-item small {
  color: var(--text-soft);

  font-size: .4rem;
}

.notification-empty {
  display: flex;

  align-items: center;
  justify-content: center;

  flex-direction: column;

  gap: .25rem;

  padding: 2rem;
}

.notification-empty > div {
  font-size: 1.5rem;
}

.notification-empty strong {
  font-size: .55rem;
}

.notification-empty small {
  color: var(--text-soft);

  font-size: .43rem;
}

/* =========================================
   FOOTER
========================================= */

.app-footer {
  border-top:
    1px solid
    var(--border);
}

/* =========================================
   ANIMATIONS
========================================= */

.sidebar-enter-active,
.sidebar-leave-active {
  transition:
    transform .35s
    cubic-bezier(.4,0,.2,1);
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform:
    translateX(-105%);
}

.overlay-enter-active,
.overlay-leave-active {
  transition:
    opacity .3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.notification-enter-active,
.notification-leave-active {
  transition:
    opacity .25s ease,
    transform .25s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;

  transform:
    translateY(-10px);
}

.form-enter-active,
.form-leave-active {
  transition:
    opacity .3s ease,
    transform .3s ease;
}

.form-enter-from,
.form-leave-to {
  opacity: 0;

  transform:
    translateY(-15px);
}

/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 1100px) {

  .stat-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .lower-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .system-panel {
    grid-column:
      span 2;
  }

}

@media (max-width: 800px) {

  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .lower-grid {
    grid-template-columns: 1fr;
  }

  .system-panel {
    grid-column: auto;
  }

  .dashboard-hero {
    flex-direction: column;
  }

  .hero-date {
    align-self: stretch;
  }

}

@media (max-width: 650px) {

  .dashboard-main {
    padding:
      1rem .7rem 2rem;
  }

  .stat-grid {
    grid-template-columns:
      1fr 1fr;

    gap: .5rem;
  }

  .tech-stat-card {
    min-height: 155px;

    padding: .8rem;
  }

  .stat-number {
    font-size: 1.6rem;
  }

  .stat-icon {
    width: 2rem;
    height: 2rem;
  }

  .donut-container {
    flex-direction: column;

    gap: 1rem;
  }

  .records-heading {
    align-items: flex-start;

    flex-direction: column;
  }

  .gold-button {
    width: 100%;
  }

  .search-container {
    align-items: stretch;

    flex-direction: column;
  }

  .filter-buttons {
    overflow-x: auto;
  }

  .filter-buttons button {
    flex-shrink: 0;
  }

}

@media (max-width: 450px) {

  .stat-grid {
    grid-template-columns: 1fr;
  }

  .hero-meta {
    flex-direction: column;

    gap: .3rem;
  }

  .fake-chart {
    height: 210px;
  }

}

.logout-button {
  border: 1px solid rgba(239, 96, 96, 0.3);
  border-radius: 10px;
  padding: 10px 16px;
  background: rgba(239, 96, 96, 0.08);
  color: #ff8c8c;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background: rgba(239, 96, 96, 0.15);
  border-color: rgba(239, 96, 96, 0.5);
}
</style>