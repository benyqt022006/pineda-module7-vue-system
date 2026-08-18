<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  event: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'add-event',
  'update-event',
  'cancel'
])

/* =========================================
   FORM DATA
========================================= */

const form = reactive({
  eventName: '',
  eventDate: '',
  eventTime: '',
  location: '',
  organizer: '',
  description: '',
  status: 'Upcoming'
})

const errors = reactive({
  eventName: '',
  eventDate: '',
  location: '',
  organizer: ''
})

/* =========================================
   EDIT MODE
========================================= */

const isEditing = computed(() => {
  return !!props.event
})

/* =========================================
   LOAD EVENT
========================================= */

function loadEvent() {
  clearErrors()

  if (props.event) {
    form.eventName =
      props.event.eventName || ''

    form.eventDate =
      props.event.eventDate || ''

    form.eventTime =
      props.event.eventTime || ''

    form.location =
      props.event.location || ''

    form.organizer =
      props.event.organizer || ''

    form.description =
      props.event.description || ''

    form.status =
      props.event.status ||
      'Upcoming'
  } else {
    resetForm()
  }
}

watch(
  () => props.event,
  loadEvent,
  {
    immediate: true
  }
)

/* =========================================
   RESET
========================================= */

function resetForm() {
  form.eventName = ''
  form.eventDate = ''
  form.eventTime = ''
  form.location = ''
  form.organizer = ''
  form.description = ''
  form.status = 'Upcoming'

  clearErrors()
}

function clearErrors() {
  errors.eventName = ''
  errors.eventDate = ''
  errors.location = ''
  errors.organizer = ''
}

/* =========================================
   VALIDATION
========================================= */

function validate() {
  clearErrors()

  let valid = true

  if (!form.eventName.trim()) {
    errors.eventName =
      'Event name is required.'

    valid = false
  }

  if (!form.eventDate) {
    errors.eventDate =
      'Event date is required.'

    valid = false
  }

  if (!form.location.trim()) {
    errors.location =
      'Location is required.'

    valid = false
  }

  if (!form.organizer.trim()) {
    errors.organizer =
      'Organizer is required.'

    valid = false
  }

  return valid
}

/* =========================================
   SUBMIT
========================================= */

function submitForm() {
  if (!validate()) {
    return
  }

  const eventData = {
    eventName:
      form.eventName.trim(),

    eventDate:
      form.eventDate,

    eventTime:
      form.eventTime,

    location:
      form.location.trim(),

    organizer:
      form.organizer.trim(),

    description:
      form.description.trim(),

    status:
      form.status
  }

  if (isEditing.value) {
    emit('update-event', {
      ...props.event,
      ...eventData
    })
  } else {
    emit('add-event', eventData)
  }
}

/* =========================================
   CANCEL
========================================= */

function cancelForm() {
  emit('cancel')
}
</script>


<template>

  <section class="event-form-panel">

    <!-- =====================================
         FORM HEADER
    ====================================== -->

    <div class="form-header">

      <div class="form-title-area">

        <div class="form-icon">
          <span>
            {{ isEditing ? '✎' : '+' }}
          </span>
        </div>

        <div>

          <div class="form-eyebrow">
            EVENT MANAGEMENT
          </div>

          <h2>
            {{
              isEditing
                ? 'Edit Event'
                : 'Create New Event'
            }}
          </h2>

          <p>
            {{
              isEditing
                ? 'Update the event information below.'
                : 'Add a new event to your event management system.'
            }}
          </p>

        </div>

      </div>

      <button
        class="close-form"
        type="button"
        aria-label="Close form"
        @click="cancelForm"
      >
        ×
      </button>

    </div>


    <!-- =====================================
         FORM BODY
    ====================================== -->

    <form
      class="event-form"
      @submit.prevent="submitForm"
    >

      <!-- BASIC INFORMATION -->

      <div class="form-section">

        <div class="section-heading">

          <span class="section-number">
            01
          </span>

          <div>
            <strong>
              Basic Information
            </strong>

            <small>
              Enter the main event details
            </small>
          </div>

        </div>


        <div class="form-grid">

          <!-- EVENT NAME -->

          <div class="form-field full-width">

            <label for="eventName">
              Event Name
              <span>*</span>
            </label>

            <div
              class="input-wrapper"
              :class="{
                error:
                  errors.eventName
              }"
            >

              <span class="input-icon">
                ✦
              </span>

              <input
                id="eventName"
                v-model="form.eventName"
                type="text"
                placeholder="e.g. Technology Summit 2026"
                autocomplete="off"
              />

            </div>

            <small
              v-if="errors.eventName"
              class="error-message"
            >
              {{ errors.eventName }}
            </small>

          </div>


          <!-- DATE -->

          <div class="form-field">

            <label for="eventDate">
              Event Date
              <span>*</span>
            </label>

            <div
              class="input-wrapper"
              :class="{
                error:
                  errors.eventDate
              }"
            >

              <span class="input-icon">
                ◷
              </span>

              <input
                id="eventDate"
                v-model="form.eventDate"
                type="date"
              />

            </div>

            <small
              v-if="errors.eventDate"
              class="error-message"
            >
              {{ errors.eventDate }}
            </small>

          </div>


          <!-- TIME -->

          <div class="form-field">

            <label for="eventTime">
              Event Time
            </label>

            <div class="input-wrapper">

              <span class="input-icon">
                ◴
              </span>

              <input
                id="eventTime"
                v-model="form.eventTime"
                type="time"
              />

            </div>

          </div>


          <!-- LOCATION -->

          <div class="form-field">

            <label for="location">
              Location
              <span>*</span>
            </label>

            <div
              class="input-wrapper"
              :class="{
                error:
                  errors.location
              }"
            >

              <span class="input-icon">
                ⌖
              </span>

              <input
                id="location"
                v-model="form.location"
                type="text"
                placeholder="e.g. CHCCI Function Hall"
              />

            </div>

            <small
              v-if="errors.location"
              class="error-message"
            >
              {{ errors.location }}
            </small>

          </div>


          <!-- ORGANIZER -->

          <div class="form-field">

            <label for="organizer">
              Organizer
              <span>*</span>
            </label>

            <div
              class="input-wrapper"
              :class="{
                error:
                  errors.organizer
              }"
            >

              <span class="input-icon">
                ◉
              </span>

              <input
                id="organizer"
                v-model="form.organizer"
                type="text"
                placeholder="e.g. Student Affairs"
              />

            </div>

            <small
              v-if="errors.organizer"
              class="error-message"
            >
              {{ errors.organizer }}
            </small>

          </div>

        </div>

      </div>


      <!-- EVENT STATUS -->

      <div class="form-section">

        <div class="section-heading">

          <span class="section-number">
            02
          </span>

          <div>
            <strong>
              Event Status
            </strong>

            <small>
              Set the current status of this event
            </small>
          </div>

        </div>


        <div class="status-options">

          <!-- UPCOMING -->

          <label
            class="status-option"
            :class="{
              selected:
                form.status ===
                'Upcoming'
            }"
          >

            <input
              v-model="form.status"
              type="radio"
              value="Upcoming"
            />

            <span class="status-radio">
              <span></span>
            </span>

            <div class="status-option-icon upcoming">
              ◷
            </div>

            <div>
              <strong>
                Upcoming
              </strong>

              <small>
                Event is scheduled
              </small>
            </div>

          </label>


          <!-- COMPLETED -->

          <label
            class="status-option"
            :class="{
              selected:
                form.status ===
                'Completed'
            }"
          >

            <input
              v-model="form.status"
              type="radio"
              value="Completed"
            />

            <span class="status-radio">
              <span></span>
            </span>

            <div class="status-option-icon completed">
              ✓
            </div>

            <div>
              <strong>
                Completed
              </strong>

              <small>
                Event has finished
              </small>
            </div>

          </label>


          <!-- CANCELLED -->

          <label
            class="status-option"
            :class="{
              selected:
                form.status ===
                'Cancelled'
            }"
          >

            <input
              v-model="form.status"
              type="radio"
              value="Cancelled"
            />

            <span class="status-radio">
              <span></span>
            </span>

            <div class="status-option-icon cancelled">
              ×
            </div>

            <div>
              <strong>
                Cancelled
              </strong>

              <small>
                Event has been cancelled
              </small>
            </div>

          </label>

        </div>

      </div>


      <!-- DESCRIPTION -->

      <div class="form-section">

        <div class="section-heading">

          <span class="section-number">
            03
          </span>

          <div>
            <strong>
              Additional Details
            </strong>

            <small>
              Add information about the event
            </small>
          </div>

        </div>


        <div class="form-field">

          <label for="description">
            Event Description
          </label>

          <div class="textarea-wrapper">

            <textarea
              id="description"
              v-model="form.description"
              rows="5"
              maxlength="500"
              placeholder="Write a short description about this event..."
            ></textarea>

            <span class="character-count">
              {{ form.description.length }}/500
            </span>

          </div>

        </div>

      </div>


      <!-- FORM FOOTER -->

      <div class="form-footer">

        <div class="required-note">
          <span>*</span>
          Required fields
        </div>

        <div class="form-actions">

          <button
            type="button"
            class="cancel-button"
            @click="cancelForm"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="save-button"
          >

            <span>
              {{ isEditing ? '✓' : '+' }}
            </span>

            {{
              isEditing
                ? 'Update Event'
                : 'Create Event'
            }}

          </button>

        </div>

      </div>

    </form>

  </section>

</template>


<style scoped>

/* =========================================
   FORM PANEL
========================================= */

.event-form-panel {
  position: relative;

  overflow: hidden;

  margin-bottom: 1rem;

  border:
    1px solid
    var(--border);

  border-radius:
    1.2rem;

  background:
    linear-gradient(
      145deg,
      var(--surface-2),
      var(--surface)
    );

  box-shadow:
    0 20px 60px
    var(--shadow);
}


/* TOP GLOW */

.event-form-panel::before {
  content: "";

  position: absolute;

  top: 0;
  left: 0;
  right: 0;

  height: 2px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--emerald),
      var(--gold),
      var(--emerald),
      transparent
    );

  opacity: .8;
}


/* =========================================
   HEADER
========================================= */

.form-header {
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 1rem;

  padding:
    1.4rem 1.5rem;

  border-bottom:
    1px solid
    var(--border);

  background:
    rgba(39,185,138,.025);
}

.form-title-area {
  display: flex;

  align-items: center;

  gap: .85rem;
}

.form-icon {
  width: 48px;
  height: 48px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border:
    1px solid
    rgba(240,184,61,.25);

  border-radius:
    13px;

  background:
    linear-gradient(
      135deg,
      rgba(240,184,61,.15),
      rgba(39,185,138,.08)
    );

  color:
    var(--gold);

  font-size:
    1.2rem;

  box-shadow:
    inset 0 0 20px
    rgba(240,184,61,.04);
}

.form-eyebrow {
  color:
    var(--emerald);

  font-size:
    .42rem;

  font-weight:
    900;

  letter-spacing:
    .14em;
}

.form-header h2 {
  margin:
    .25rem 0;

  color:
    var(--text);

  font-size:
    1.1rem;

  font-weight:
    900;

  letter-spacing:
    -.03em;
}

.form-header p {
  margin: 0;

  color:
    var(--text-soft);

  font-size:
    .5rem;
}

.close-form {
  width: 34px;
  height: 34px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    var(--border);

  border-radius:
    9px;

  background:
    transparent;

  color:
    var(--text-soft);

  font-size:
    1.3rem;

  transition:
    .25s ease;
}

.close-form:hover {
  border-color:
    rgba(230,79,85,.3);

  background:
    rgba(230,79,85,.08);

  color:
    var(--red);

  transform:
    rotate(90deg);
}


/* =========================================
   FORM BODY
========================================= */

.event-form {
  padding:
    1.3rem 1.5rem;
}


/* =========================================
   SECTIONS
========================================= */

.form-section {
  padding:
    .3rem 0 1.4rem;

  margin-bottom:
    1.2rem;

  border-bottom:
    1px solid
    var(--border);
}

.form-section:last-of-type {
  border-bottom: 0;

  margin-bottom: 0;
}

.section-heading {
  display: flex;

  align-items: center;

  gap: .65rem;

  margin-bottom:
    1rem;
}

.section-number {
  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    rgba(39,185,138,.18);

  border-radius:
    8px;

  background:
    rgba(39,185,138,.07);

  color:
    var(--emerald);

  font-size:
    .42rem;

  font-weight:
    900;
}

.section-heading strong,
.section-heading small {
  display: block;
}

.section-heading strong {
  color:
    var(--text);

  font-size:
    .62rem;

  font-weight:
    900;
}

.section-heading small {
  margin-top:
    .15rem;

  color:
    var(--text-soft);

  font-size:
    .43rem;
}


/* =========================================
   FORM GRID
========================================= */

.form-grid {
  display: grid;

  grid-template-columns:
    repeat(2, 1fr);

  gap:
    .9rem;
}

.form-field {
  min-width: 0;
}

.full-width {
  grid-column:
    1 / -1;
}

.form-field label {
  display: block;

  margin-bottom:
    .4rem;

  color:
    var(--text-soft);

  font-size:
    .47rem;

  font-weight:
    800;
}

.form-field label span {
  color:
    var(--gold);
}


/* =========================================
   INPUT
========================================= */

.input-wrapper {
  position: relative;

  display: flex;

  align-items: center;

  border:
    1px solid
    var(--border);

  border-radius:
    .7rem;

  background:
    var(--surface);

  transition:
    border-color .25s ease,
    box-shadow .25s ease,
    background .25s ease;
}

.input-wrapper:focus-within {
  border-color:
    rgba(39,185,138,.5);

  background:
    rgba(39,185,138,.025);

  box-shadow:
    0 0 0 3px
    rgba(39,185,138,.06);
}

.input-wrapper.error {
  border-color:
    rgba(230,79,85,.55);
}

.input-icon {
  width: 42px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color:
    var(--emerald);

  font-size:
    .8rem;
}

.input-wrapper input {
  width: 100%;

  min-width: 0;

  border: 0;

  outline: 0;

  background:
    transparent;

  color:
    var(--text);

  padding:
    .72rem .7rem .72rem 0;

  font-size:
    .54rem;
}

.input-wrapper input::placeholder {
  color:
    var(--text-soft);

  opacity:
    .65;
}


/* DATE / TIME COLOR */

.input-wrapper input[type="date"],
.input-wrapper input[type="time"] {
  color-scheme:
    dark;
}

:global(.light-mode)
.input-wrapper input[type="date"],
:global(.light-mode)
.input-wrapper input[type="time"] {
  color-scheme:
    light;
}


/* =========================================
   ERROR
========================================= */

.error-message {
  display: block;

  margin-top:
    .3rem;

  color:
    var(--red);

  font-size:
    .42rem;
}


/* =========================================
   STATUS OPTIONS
========================================= */

.status-options {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: .6rem;
}

.status-option {
  position: relative;

  display: flex;

  align-items: center;

  gap: .6rem;

  min-width: 0;

  padding:
    .8rem;

  border:
    1px solid
    var(--border);

  border-radius:
    .8rem;

  background:
    var(--surface);

  cursor: pointer;

  transition:
    border-color .25s ease,
    background .25s ease,
    transform .25s ease,
    box-shadow .25s ease;
}

.status-option:hover {
  transform:
    translateY(-2px);

  border-color:
    rgba(39,185,138,.3);
}

.status-option.selected {
  border-color:
    rgba(39,185,138,.45);

  background:
    rgba(39,185,138,.07);

  box-shadow:
    0 8px 25px
    rgba(39,185,138,.05);
}

.status-option input {
  position: absolute;

  opacity: 0;

  pointer-events: none;
}

.status-radio {
  width: 15px;
  height: 15px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border:
    1px solid
    var(--text-soft);

  border-radius: 50%;
}

.status-radio span {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background:
    var(--emerald);

  opacity: 0;

  transform:
    scale(.4);

  transition:
    .2s ease;
}

.status-option.selected
.status-radio {
  border-color:
    var(--emerald);
}

.status-option.selected
.status-radio span {
  opacity: 1;

  transform:
    scale(1);
}

.status-option-icon {
  width: 30px;
  height: 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius:
    8px;

  font-size:
    .7rem;
}

.status-option-icon.upcoming {
  background:
    rgba(240,184,61,.1);

  color:
    var(--gold);
}

.status-option-icon.completed {
  background:
    rgba(39,185,138,.1);

  color:
    var(--emerald);
}

.status-option-icon.cancelled {
  background:
    rgba(230,79,85,.1);

  color:
    var(--red);
}

.status-option strong,
.status-option small {
  display: block;
}

.status-option strong {
  color:
    var(--text);

  font-size:
    .52rem;
}

.status-option small {
  margin-top:
    .15rem;

  color:
    var(--text-soft);

  font-size:
    .4rem;
}


/* =========================================
   TEXTAREA
========================================= */

.textarea-wrapper {
  position: relative;
}

.textarea-wrapper textarea {
  width: 100%;

  min-height: 120px;

  resize: vertical;

  border:
    1px solid
    var(--border);

  border-radius:
    .7rem;

  outline: 0;

  background:
    var(--surface);

  color:
    var(--text);

  padding:
    .8rem;

  font-size:
    .54rem;

  line-height:
    1.6;

  transition:
    border-color .25s ease,
    box-shadow .25s ease;
}

.textarea-wrapper textarea:focus {
  border-color:
    rgba(39,185,138,.5);

  box-shadow:
    0 0 0 3px
    rgba(39,185,138,.06);
}

.textarea-wrapper textarea::placeholder {
  color:
    var(--text-soft);

  opacity:
    .65;
}

.character-count {
  position: absolute;

  right: .7rem;
  bottom: .6rem;

  color:
    var(--text-soft);

  font-size:
    .4rem;

  pointer-events:
    none;
}


/* =========================================
   FOOTER
========================================= */

.form-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 1rem;

  padding-top:
    1.2rem;
}

.required-note {
  color:
    var(--text-soft);

  font-size:
    .43rem;
}

.required-note span {
  color:
    var(--gold);
}

.form-actions {
  display: flex;

  gap: .5rem;
}

.cancel-button,
.save-button {
  min-height: 40px;

  border-radius:
    .65rem;

  padding:
    0 1rem;

  font-size:
    .5rem;

  font-weight:
    900;

  transition:
    transform .25s ease,
    background .25s ease,
    border-color .25s ease,
    box-shadow .25s ease;
}

.cancel-button {
  border:
    1px solid
    var(--border);

  background:
    transparent;

  color:
    var(--text-soft);
}

.cancel-button:hover {
  border-color:
    rgba(230,79,85,.3);

  color:
    var(--red);

  background:
    rgba(230,79,85,.05);
}

.save-button {
  display: flex;

  align-items: center;

  gap: .4rem;

  border:
    1px solid
    rgba(39,185,138,.35);

  background:
    linear-gradient(
      135deg,
      #27b98a,
      #178563
    );

  color:
    white;

  box-shadow:
    0 8px 25px
    rgba(39,185,138,.14);
}

.save-button:hover {
  transform:
    translateY(-2px);

  box-shadow:
    0 12px 30px
    rgba(39,185,138,.22);

  filter:
    brightness(1.08);
}

.cancel-button:active,
.save-button:active {
  transform:
    scale(.96);
}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 750px) {

  .status-options {
    grid-template-columns:
      1fr;
  }

}

@media (max-width: 650px) {

  .event-form {
    padding:
      1rem;
  }

  .form-header {
    padding:
      1rem;
  }

  .form-grid {
    grid-template-columns:
      1fr;
  }

  .full-width {
    grid-column:
      auto;
  }

  .form-footer {
    align-items:
      stretch;

    flex-direction:
      column;
  }

  .form-actions {
    width: 100%;
  }

  .cancel-button,
  .save-button {
    flex: 1;
  }

}

@media (max-width: 450px) {

  .form-title-area {
    align-items:
      flex-start;
  }

  .form-icon {
    width: 40px;
    height: 40px;
  }

  .form-header h2 {
    font-size:
      .95rem;
  }

  .form-header p {
    max-width:
      220px;

    line-height:
      1.4;
  }

}

</style>