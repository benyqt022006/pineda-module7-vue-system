<script setup>
import { computed } from 'vue'

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'edit',
  'delete'
])

/* =========================================
   HELPERS
========================================= */

function formatDate(date) {
  if (!date) return 'No date'

  const parsed = new Date(`${date}T00:00:00`)

  if (Number.isNaN(parsed.getTime())) {
    return date
  }

  return parsed.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
  )
}

function formatTime(time) {
  if (!time) return ''

  const [hours, minutes] =
    time.split(':')

  let hour = Number(hours)

  const suffix =
    hour >= 12 ? 'PM' : 'AM'

  hour =
    hour % 12 || 12

  return `${hour}:${minutes} ${suffix}`
}

function statusClass(status) {
  return String(status || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
}

function getInitials(name) {
  if (!name) return 'EV'

  const words =
    name.trim().split(/\s+/)

  if (words.length === 1) {
    return words[0]
      .substring(0, 2)
      .toUpperCase()
  }

  return (
    words[0][0] +
    words[1][0]
  ).toUpperCase()
}

function getEventNumber(index) {
  return String(index + 1)
    .padStart(2, '0')
}

/* =========================================
   EVENT SUMMARY
========================================= */

const visibleCount = computed(() => {
  return props.events.length
})

const hasEvents = computed(() => {
  return props.events.length > 0
})
</script>


<template>

  <section class="event-records-panel">

    <!-- =====================================
         RECORD HEADER
    ====================================== -->

    <div class="records-topbar">

      <div class="records-count">

        <div class="records-count-icon">
          ▣
        </div>

        <div>

          <strong>
            {{ visibleCount }}
          </strong>

          <span>
            {{
              visibleCount === 1
                ? 'event found'
                : 'events found'
            }}
          </span>

        </div>

      </div>


      <div class="records-system-status">

        <span class="live-dot"></span>

        <span>
          LIVE RECORDS
        </span>

      </div>

    </div>


    <!-- =====================================
         EMPTY STATE
    ====================================== -->

    <div
      v-if="!hasEvents"
      class="empty-records"
    >

      <div class="empty-orbit">

        <div class="empty-icon">
          ▣
        </div>

      </div>

      <h3>
        No Events Found
      </h3>

      <p>
        There are currently no event records
        matching your search or filter.
      </p>

      <small>
        Create a new event to get started.
      </small>

    </div>


    <!-- =====================================
         DESKTOP TABLE
    ====================================== -->

    <div
      v-else
      class="desktop-records"
    >

      <div class="table-header">

        <span class="number-column">
          #
        </span>

        <span class="event-column">
          EVENT
        </span>

        <span>
          DATE & TIME
        </span>

        <span>
          LOCATION
        </span>

        <span>
          ORGANIZER
        </span>

        <span>
          STATUS
        </span>

        <span class="action-column">
          ACTIONS
        </span>

      </div>


      <div
        v-for="(event, index) in events"
        :key="event.id"
        class="event-row"
      >

        <!-- NUMBER -->

        <div class="number-cell">

          <span>
            {{ getEventNumber(index) }}
          </span>

        </div>


        <!-- EVENT -->

        <div class="event-cell">

          <div class="event-avatar">
            {{ getInitials(event.eventName) }}
          </div>

          <div class="event-main-info">

            <strong
              :title="event.eventName"
            >
              {{ event.eventName }}
            </strong>

            <small>
              EVENT ID:
              {{ event.id }}
            </small>

          </div>

        </div>


        <!-- DATE -->

        <div class="date-cell">

          <strong>
            {{ formatDate(event.eventDate) }}
          </strong>

          <small
            v-if="event.eventTime"
          >
            ◷
            {{ formatTime(event.eventTime) }}
          </small>

          <small v-else>
            Time not set
          </small>

        </div>


        <!-- LOCATION -->

        <div class="location-cell">

          <span class="location-icon">
            ⌖
          </span>

          <span
            :title="event.location"
          >
            {{ event.location || 'Not specified' }}
          </span>

        </div>


        <!-- ORGANIZER -->

        <div class="organizer-cell">

          <div class="organizer-avatar">
            {{
              getInitials(
                event.organizer
              )
            }}
          </div>

          <span
            :title="event.organizer"
          >
            {{
              event.organizer ||
              'Not specified'
            }}
          </span>

        </div>


        <!-- STATUS -->

        <div class="status-cell">

          <span
            class="status-badge"
            :class="
              statusClass(
                event.status
              )
            "
          >

            <span class="status-dot"></span>

            {{
              event.status ||
              'Unknown'
            }}

          </span>

        </div>


        <!-- ACTIONS -->

        <div class="action-cell">

          <button
            class="row-action edit-action"
            title="Edit event"
            @click="
              emit('edit', event)
            "
          >
            <span>✎</span>
          </button>

          <button
            class="row-action delete-action"
            title="Delete event"
            @click="
              emit('delete', event.id)
            "
          >
            <span>×</span>
          </button>

        </div>

      </div>

    </div>


    <!-- =====================================
         MOBILE CARDS
    ====================================== -->

    <div
      v-if="hasEvents"
      class="mobile-records"
    >

      <article
        v-for="(event, index) in events"
        :key="event.id"
        class="event-mobile-card"
      >

        <!-- CARD TOP -->

        <div class="mobile-card-top">

          <div class="mobile-event-identity">

            <div class="event-avatar large">
              {{ getInitials(event.eventName) }}
            </div>

            <div>

              <span class="mobile-number">
                EVENT {{ getEventNumber(index) }}
              </span>

              <h3>
                {{ event.eventName }}
              </h3>

            </div>

          </div>


          <span
            class="status-badge"
            :class="
              statusClass(
                event.status
              )
            "
          >
            <span class="status-dot"></span>

            {{ event.status }}

          </span>

        </div>


        <!-- CARD DETAILS -->

        <div class="mobile-details">

          <div class="mobile-detail">

            <span class="detail-icon">
              ◷
            </span>

            <div>

              <small>
                DATE & TIME
              </small>

              <strong>
                {{ formatDate(event.eventDate) }}

                <template
                  v-if="event.eventTime"
                >
                  ·
                  {{ formatTime(event.eventTime) }}
                </template>

              </strong>

            </div>

          </div>


          <div class="mobile-detail">

            <span class="detail-icon">
              ⌖
            </span>

            <div>

              <small>
                LOCATION
              </small>

              <strong>
                {{
                  event.location ||
                  'Not specified'
                }}
              </strong>

            </div>

          </div>


          <div class="mobile-detail">

            <span class="detail-icon">
              ◉
            </span>

            <div>

              <small>
                ORGANIZER
              </small>

              <strong>
                {{
                  event.organizer ||
                  'Not specified'
                }}
              </strong>

            </div>

          </div>


          <div
            v-if="event.description"
            class="mobile-description"
          >

            <small>
              DESCRIPTION
            </small>

            <p>
              {{ event.description }}
            </p>

          </div>

        </div>


        <!-- CARD ACTIONS -->

        <div class="mobile-card-actions">

          <button
            class="mobile-edit-button"
            @click="
              emit('edit', event)
            "
          >
            <span>✎</span>
            Edit Event
          </button>

          <button
            class="mobile-delete-button"
            @click="
              emit('delete', event.id)
            "
          >
            <span>×</span>
            Delete
          </button>

        </div>

      </article>

    </div>


    <!-- =====================================
         FOOTER
    ====================================== -->

    <div
      v-if="hasEvents"
      class="records-footer"
    >

      <div>

        <span class="footer-indicator"></span>

        <span>
          Showing
          <strong>
            {{ visibleCount }}
          </strong>
          {{
            visibleCount === 1
              ? 'record'
              : 'records'
          }}
        </span>

      </div>

      <span>
        Eventora Data Management
      </span>

    </div>

  </section>

</template>


<style scoped>

/* =========================================
   MAIN PANEL
========================================= */

.event-records-panel {
  overflow: hidden;

  border:
    1px solid
    var(--border);

  border-radius:
    1rem;

  background:
    linear-gradient(
      145deg,
      var(--surface-2),
      var(--surface)
    );

  box-shadow:
    0 12px 40px
    var(--shadow);
}


/* =========================================
   TOP BAR
========================================= */

.records-topbar {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 1rem;

  padding:
    .8rem 1rem;

  border-bottom:
    1px solid
    var(--border);

  background:
    rgba(39,185,138,.025);
}

.records-count {
  display: flex;

  align-items: center;

  gap: .55rem;
}

.records-count-icon {
  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius:
    8px;

  background:
    rgba(39,185,138,.09);

  color:
    var(--emerald);

  font-size:
    .7rem;
}

.records-count strong,
.records-count span {
  display: block;
}

.records-count strong {
  color:
    var(--text);

  font-size:
    .65rem;
}

.records-count span {
  margin-top:
    .1rem;

  color:
    var(--text-soft);

  font-size:
    .4rem;
}

.records-system-status {
  display: flex;

  align-items: center;

  gap: .35rem;

  color:
    var(--emerald);

  font-size:
    .38rem;

  font-weight:
    900;

  letter-spacing:
    .08em;
}

.live-dot {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background:
    var(--emerald);

  box-shadow:
    0 0 8px
    var(--emerald);

  animation:
    livePulse 2s infinite;
}

@keyframes livePulse {

  0%,
  100% {
    opacity: .45;
  }

  50% {
    opacity: 1;
  }

}


/* =========================================
   TABLE HEADER
========================================= */

.desktop-records {
  width: 100%;

  overflow-x: auto;
}

.table-header,
.event-row {
  min-width:
    950px;

  display: grid;

  grid-template-columns:
    45px
    minmax(210px, 1.5fr)
    minmax(125px, .8fr)
    minmax(150px, 1fr)
    minmax(130px, .9fr)
    105px
    90px;

  align-items: center;

  column-gap: .7rem;

  padding:
    0 1rem;
}

.table-header {
  min-height:
    43px;

  border-bottom:
    1px solid
    var(--border);

  background:
    rgba(39,185,138,.025);

  color:
    var(--text-soft);

  font-size:
    .39rem;

  font-weight:
    900;

  letter-spacing:
    .09em;
}

.event-row {
  min-height:
    78px;

  border-bottom:
    1px solid
    var(--border);

  background:
    transparent;

  transition:
    background .25s ease,
    transform .25s ease;
}

.event-row:last-child {
  border-bottom:
    0;
}

.event-row:hover {
  background:
    linear-gradient(
      90deg,
      rgba(39,185,138,.055),
      transparent
    );
}


/* =========================================
   NUMBER
========================================= */

.number-cell {
  color:
    var(--text-soft);

  font-size:
    .45rem;

  font-weight:
    800;
}

.number-cell span {
  opacity:
    .65;
}


/* =========================================
   EVENT CELL
========================================= */

.event-cell {
  display: flex;

  align-items: center;

  gap: .6rem;

  min-width: 0;
}

.event-avatar {
  width: 36px;
  height: 36px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border:
    1px solid
    rgba(39,185,138,.18);

  border-radius:
    10px;

  background:
    linear-gradient(
      135deg,
      rgba(39,185,138,.17),
      rgba(240,184,61,.08)
    );

  color:
    var(--emerald-bright);

  font-size:
    .48rem;

  font-weight:
    950;

  box-shadow:
    inset 0 0 15px
    rgba(39,185,138,.04);
}

.event-avatar.large {
  width: 45px;
  height: 45px;

  border-radius:
    12px;

  font-size:
    .55rem;
}

.event-main-info {
  min-width: 0;
}

.event-main-info strong,
.event-main-info small {
  display: block;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.event-main-info strong {
  color:
    var(--text);

  font-size:
    .55rem;

  font-weight:
    800;
}

.event-main-info small {
  margin-top:
    .2rem;

  color:
    var(--text-soft);

  font-size:
    .37rem;

  letter-spacing:
    .05em;
}


/* =========================================
   DATE
========================================= */

.date-cell strong,
.date-cell small {
  display: block;
}

.date-cell strong {
  color:
    var(--text);

  font-size:
    .48rem;
}

.date-cell small {
  margin-top:
    .2rem;

  color:
    var(--text-soft);

  font-size:
    .4rem;
}


/* =========================================
   LOCATION
========================================= */

.location-cell {
  display: flex;

  align-items: center;

  gap: .4rem;

  min-width: 0;

  color:
    var(--text-soft);

  font-size:
    .45rem;
}

.location-cell > span:last-child {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.location-icon {
  color:
    var(--gold);

  font-size:
    .75rem;
}


/* =========================================
   ORGANIZER
========================================= */

.organizer-cell {
  display: flex;

  align-items: center;

  gap: .4rem;

  min-width: 0;

  color:
    var(--text-soft);

  font-size:
    .45rem;
}

.organizer-cell > span:last-child {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.organizer-avatar {
  width: 25px;
  height: 25px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  background:
    rgba(240,184,61,.1);

  color:
    var(--gold);

  font-size:
    .38rem;

  font-weight:
    900;
}


/* =========================================
   STATUS
========================================= */

.status-badge {
  display: inline-flex;

  align-items: center;

  gap: .3rem;

  width: fit-content;

  padding:
    .35rem .5rem;

  border:
    1px solid
    transparent;

  border-radius:
    999px;

  font-size:
    .38rem;

  font-weight:
    900;

  white-space:
    nowrap;
}

.status-dot {
  width: 5px;
  height: 5px;

  flex-shrink: 0;

  border-radius: 50%;
}

.status-badge.upcoming {
  border-color:
    rgba(240,184,61,.18);

  background:
    rgba(240,184,61,.07);

  color:
    var(--gold);
}

.status-badge.upcoming
.status-dot {
  background:
    var(--gold);

  box-shadow:
    0 0 6px
    var(--gold);
}

.status-badge.completed {
  border-color:
    rgba(39,185,138,.18);

  background:
    rgba(39,185,138,.07);

  color:
    var(--emerald);
}

.status-badge.completed
.status-dot {
  background:
    var(--emerald);

  box-shadow:
    0 0 6px
    var(--emerald);
}

.status-badge.cancelled {
  border-color:
    rgba(230,79,85,.18);

  background:
    rgba(230,79,85,.07);

  color:
    var(--red);
}

.status-badge.cancelled
.status-dot {
  background:
    var(--red);

  box-shadow:
    0 0 6px
    var(--red);
}


/* =========================================
   ACTIONS
========================================= */

.action-cell {
  display: flex;

  align-items: center;

  gap: .3rem;
}

.row-action {
  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    var(--border);

  border-radius:
    8px;

  background:
    transparent;

  color:
    var(--text-soft);

  transition:
    .2s ease;
}

.row-action:hover {
  transform:
    translateY(-2px);
}

.edit-action:hover {
  border-color:
    rgba(39,185,138,.35);

  background:
    rgba(39,185,138,.09);

  color:
    var(--emerald);
}

.delete-action:hover {
  border-color:
    rgba(230,79,85,.35);

  background:
    rgba(230,79,85,.09);

  color:
    var(--red);
}

.row-action span {
  font-size:
    .7rem;
}


/* =========================================
   MOBILE RECORDS
========================================= */

.mobile-records {
  display: none;
}


/* =========================================
   EMPTY STATE
========================================= */

.empty-records {
  min-height:
    330px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-direction: column;

  padding:
    2rem;

  text-align:
    center;
}

.empty-orbit {
  width: 80px;
  height: 80px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-bottom:
    1rem;

  border:
    1px solid
    rgba(39,185,138,.2);

  border-radius:
    50%;

  background:
    rgba(39,185,138,.035);

  box-shadow:
    0 0 0 12px
    rgba(39,185,138,.025),
    0 0 40px
    rgba(39,185,138,.08);

  animation:
    orbitFloat 3s ease-in-out infinite;
}

.empty-icon {
  width: 40px;
  height: 40px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius:
    11px;

  background:
    rgba(39,185,138,.1);

  color:
    var(--emerald);

  font-size:
    1rem;
}

@keyframes orbitFloat {

  0%,
  100% {
    transform:
      translateY(0);
  }

  50% {
    transform:
      translateY(-6px);
  }

}

.empty-records h3 {
  margin:
    .2rem 0;

  color:
    var(--text);

  font-size:
    .8rem;
}

.empty-records p {
  max-width:
    350px;

  margin:
    .3rem 0;

  color:
    var(--text-soft);

  font-size:
    .48rem;

  line-height:
    1.6;
}

.empty-records small {
  color:
    var(--emerald);

  font-size:
    .43rem;
}


/* =========================================
   RECORD FOOTER
========================================= */

.records-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 1rem;

  padding:
    .65rem 1rem;

  border-top:
    1px solid
    var(--border);

  color:
    var(--text-soft);

  font-size:
    .4rem;
}

.records-footer > div {
  display: flex;

  align-items: center;

  gap: .35rem;
}

.records-footer strong {
  color:
    var(--text);
}

.footer-indicator {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background:
    var(--emerald);

  box-shadow:
    0 0 7px
    var(--emerald);
}


/* =========================================
   MOBILE CARD
========================================= */

.event-mobile-card {
  margin:
    .7rem;

  padding:
    .9rem;

  border:
    1px solid
    var(--border);

  border-radius:
    .9rem;

  background:
    linear-gradient(
      145deg,
      var(--surface-2),
      var(--surface)
    );

  box-shadow:
    0 8px 25px
    var(--shadow);

  transition:
    transform .25s ease,
    border-color .25s ease;
}

.event-mobile-card:hover {
  transform:
    translateY(-2px);

  border-color:
    rgba(39,185,138,.3);
}

.mobile-card-top {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: .6rem;

  padding-bottom:
    .8rem;

  border-bottom:
    1px solid
    var(--border);
}

.mobile-event-identity {
  display: flex;

  align-items: center;

  gap: .6rem;

  min-width: 0;
}

.mobile-event-identity > div:last-child {
  min-width: 0;
}

.mobile-number {
  display: block;

  margin-bottom:
    .15rem;

  color:
    var(--emerald);

  font-size:
    .38rem;

  font-weight:
    900;

  letter-spacing:
    .08em;
}

.mobile-event-identity h3 {
  max-width:
    170px;

  overflow: hidden;

  margin: 0;

  color:
    var(--text);

  font-size:
    .65rem;

  font-weight:
    900;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;
}


/* MOBILE DETAILS */

.mobile-details {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: .7rem;

  padding:
    .8rem 0;
}

.mobile-detail {
  display: flex;

  align-items: flex-start;

  gap: .45rem;

  min-width: 0;
}

.detail-icon {
  color:
    var(--emerald);

  font-size:
    .7rem;
}

.mobile-detail div {
  min-width: 0;
}

.mobile-detail small,
.mobile-detail strong {
  display: block;
}

.mobile-detail small {
  color:
    var(--text-soft);

  font-size:
    .36rem;

  font-weight:
    900;

  letter-spacing:
    .06em;
}

.mobile-detail strong {
  overflow: hidden;

  margin-top:
    .18rem;

  color:
    var(--text);

  font-size:
    .46rem;

  text-overflow:
    ellipsis;

  white-space:
    nowrap;
}

.mobile-description {
  grid-column:
    1 / -1;

  padding-top:
    .5rem;

  border-top:
    1px solid
    var(--border);
}

.mobile-description small {
  color:
    var(--text-soft);

  font-size:
    .36rem;

  font-weight:
    900;

  letter-spacing:
    .06em;
}

.mobile-description p {
  margin:
    .25rem 0 0;

  color:
    var(--text-soft);

  font-size:
    .45rem;

  line-height:
    1.5;
}


/* MOBILE ACTIONS */

.mobile-card-actions {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: .5rem;

  padding-top:
    .7rem;

  border-top:
    1px solid
    var(--border);
}

.mobile-edit-button,
.mobile-delete-button {
  min-height:
    38px;

  border-radius:
    .6rem;

  font-size:
    .45rem;

  font-weight:
    900;

  transition:
    .2s ease;
}

.mobile-edit-button {
  border:
    1px solid
    rgba(39,185,138,.2);

  background:
    rgba(39,185,138,.07);

  color:
    var(--emerald);
}

.mobile-delete-button {
  border:
    1px solid
    rgba(230,79,85,.2);

  background:
    rgba(230,79,85,.06);

  color:
    var(--red);
}

.mobile-edit-button:hover,
.mobile-delete-button:hover {
  transform:
    translateY(-2px);
}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 900px) {

  .table-header,
  .event-row {
    grid-template-columns:
      40px
      minmax(190px, 1.4fr)
      minmax(120px, .8fr)
      minmax(130px, .9fr)
      100px
      85px
      80px;
  }

}

@media (max-width: 700px) {

  .desktop-records {
    display: none;
  }

  .mobile-records {
    display: block;
  }

  .records-topbar {
    padding:
      .7rem .8rem;
  }

  .records-system-status {
    display: none;
  }

  .records-footer {
    padding:
      .6rem .8rem;
  }

}

@media (max-width: 450px) {

  .mobile-details {
    grid-template-columns:
      1fr;
  }

  .mobile-description {
    grid-column:
      auto;
  }

  .mobile-card-top {
    align-items:
      flex-start;
    flex-direction:
      column;
  }

  .mobile-event-identity {
    width: 100%;
  }

  .mobile-event-identity h3 {
    max-width:
      230px;
  }

  .records-footer > span {
    display: none;
  }

}

</style>