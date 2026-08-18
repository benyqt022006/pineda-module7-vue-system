<script setup>
defineProps({
  mobileMenuOpen: {
    type: Boolean,
    default: false
  },

  notificationOpen: {
    type: Boolean,
    default: false
  },

  notificationCount: {
    type: Number,
    default: 0
  },

  darkMode: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'toggle-menu',
  'toggle-notifications',
  'toggle-theme',
  'add-event'
])
</script>

<template>
  <header class="app-header">

    <div class="header-inner">

      <!-- LEFT SIDE -->
      <div class="header-left">

        <!-- HAMBURGER -->
        <button
          class="hamburger-button"
          :class="{
            active: mobileMenuOpen
          }"
          aria-label="Open menu"
          @click="
            emit('toggle-menu')
          "
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- BRAND -->
        <div class="header-brand">

          <div class="brand-mark">
            <span>✦</span>
          </div>

          <div class="brand-text">

            <strong>
              EVENTORA
            </strong>

            <small>
              EVENT MANAGEMENT
            </small>

          </div>

        </div>

      </div>


      <!-- RIGHT SIDE -->
      <div class="header-actions">

        <!-- SYSTEM STATUS -->
        <div class="header-status">

          <span class="status-pulse"></span>

          <span class="status-text">
            SYSTEM ONLINE
          </span>

        </div>


        <!-- THEME BUTTON -->
        <button
          class="header-icon-button theme-button"
          :title="
            darkMode
              ? 'Switch to light mode'
              : 'Switch to night mode'
          "
          @click="
            emit('toggle-theme')
          "
        >

          <span
            v-if="darkMode"
            class="theme-icon"
          >
            ☾
          </span>

          <span
            v-else
            class="theme-icon"
          >
            ☀
          </span>

        </button>


        <!-- NOTIFICATIONS -->
        <button
          class="header-icon-button notification-button"
          :class="{
            active: notificationOpen
          }"
          title="Notifications"
          @click="
            emit('toggle-notifications')
          "
        >

          <span class="notification-icon">
            ♢
          </span>

          <span
            v-if="notificationCount > 0"
            class="notification-count"
          >
            {{
              notificationCount > 9
                ? '9+'
                : notificationCount
            }}
          </span>

        </button>


        <!-- NEW EVENT -->
        <button
          class="header-new-event"
          @click="
            emit('add-event')
          "
        >

          <span class="new-event-plus">
            +
          </span>

          <span class="new-event-text">
            NEW EVENT
          </span>

        </button>

      </div>

    </div>

  </header>
</template>


<style scoped>

/* =========================================
   HEADER
========================================= */

.app-header {
  position: sticky;

  top: 0;

  z-index: 80;

  width: 100%;

  height: 72px;

  border-bottom:
    1px solid
    var(--border);

  background:
    rgba(6, 16, 13, .88);

  backdrop-filter:
    blur(20px);

  -webkit-backdrop-filter:
    blur(20px);

  transition:
    background .35s ease,
    border-color .35s ease;
}


/* LIGHT MODE */

:global(.light-mode) .app-header {
  background:
    rgba(255, 255, 255, .9);
}


/* =========================================
   HEADER INNER
========================================= */

.header-inner {
  width: 100%;

  height: 100%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 1rem;

  padding:
    0 clamp(.8rem, 2.5vw, 2rem);
}


/* =========================================
   LEFT
========================================= */

.header-left {
  display: flex;

  align-items: center;

  gap: .85rem;

  min-width: 0;
}


/* =========================================
   HAMBURGER
========================================= */

.hamburger-button {
  position: relative;

  width: 42px;
  height: 42px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-direction: column;

  gap: 5px;

  flex-shrink: 0;

  border:
    1px solid
    var(--border);

  border-radius: 11px;

  background:
    rgba(39, 185, 138, .045);

  color: var(--text);

  transition:
    transform .25s ease,
    background .25s ease,
    border-color .25s ease,
    box-shadow .25s ease;
}

.hamburger-button:hover {
  transform:
    translateY(-2px);

  border-color:
    rgba(39, 185, 138, .4);

  background:
    rgba(39, 185, 138, .1);

  box-shadow:
    0 7px 25px
    rgba(39, 185, 138, .08);
}

.hamburger-button:active {
  transform:
    scale(.94);
}

.hamburger-button span {
  width: 18px;
  height: 2px;

  border-radius: 10px;

  background:
    var(--text-soft);

  transition:
    transform .3s ease,
    width .3s ease,
    opacity .3s ease,
    background .3s ease;
}

.hamburger-button:hover span {
  background:
    var(--emerald);
}

.hamburger-button.active span:nth-child(1) {
  transform:
    translateY(7px)
    rotate(45deg);
}

.hamburger-button.active span:nth-child(2) {
  opacity: 0;

  width: 5px;
}

.hamburger-button.active span:nth-child(3) {
  transform:
    translateY(-7px)
    rotate(-45deg);
}


/* =========================================
   BRAND
========================================= */

.header-brand {
  display: flex;

  align-items: center;

  gap: .65rem;

  min-width: 0;
}

.brand-mark {
  width: 39px;
  height: 39px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  background:
    linear-gradient(
      135deg,
      #f0b83d,
      #d89419
    );

  color: white;

  box-shadow:
    0 0 25px
    rgba(240, 184, 61, .15);

  position: relative;

  overflow: hidden;
}

.brand-mark::before {
  content: "";

  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      120deg,
      transparent,
      rgba(255,255,255,.3),
      transparent
    );

  transform:
    translateX(-100%);

  animation:
    brandShine 4s infinite;
}

.brand-mark span {
  position: relative;

  z-index: 1;

  font-size: 1.05rem;

  line-height: 1;
}

@keyframes brandShine {

  0% {
    transform:
      translateX(-120%);
  }

  30%,
  100% {
    transform:
      translateX(120%);
  }

}


/* BRAND TEXT */

.brand-text {
  min-width: 0;
}

.brand-text strong,
.brand-text small {
  display: block;

  white-space: nowrap;
}

.brand-text strong {
  color:
    var(--text);

  font-size:
    .78rem;

  font-weight:
    950;

  letter-spacing:
    .14em;
}

.brand-text small {
  margin-top:
    2px;

  color:
    var(--text-soft);

  font-size:
    .38rem;

  font-weight:
    800;

  letter-spacing:
    .13em;
}


/* =========================================
   RIGHT ACTIONS
========================================= */

.header-actions {
  display: flex;

  align-items: center;

  gap: .45rem;
}


/* =========================================
   SYSTEM STATUS
========================================= */

.header-status {
  display: flex;

  align-items: center;

  gap: .4rem;

  margin-right: .35rem;

  padding:
    .45rem .65rem;

  border:
    1px solid
    rgba(39, 185, 138, .12);

  border-radius:
    999px;

  background:
    rgba(39, 185, 138, .045);
}

.status-pulse {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background:
    var(--emerald);

  box-shadow:
    0 0 8px
    var(--emerald);

  animation:
    statusPulse 2s infinite;
}

.status-text {
  color:
    var(--emerald);

  font-size:
    .39rem;

  font-weight:
    900;

  letter-spacing:
    .08em;
}

@keyframes statusPulse {

  0%,
  100% {
    opacity: .5;

    transform:
      scale(.85);
  }

  50% {
    opacity: 1;

    transform:
      scale(1.15);
  }

}


/* =========================================
   ICON BUTTONS
========================================= */

.header-icon-button {
  position: relative;

  width: 42px;
  height: 42px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    var(--border);

  border-radius:
    11px;

  background:
    rgba(39, 185, 138, .035);

  color:
    var(--text-soft);

  transition:
    transform .25s ease,
    color .25s ease,
    background .25s ease,
    border-color .25s ease,
    box-shadow .25s ease;
}

.header-icon-button:hover {
  transform:
    translateY(-2px);

  color:
    var(--emerald);

  border-color:
    rgba(39, 185, 138, .35);

  background:
    rgba(39, 185, 138, .09);

  box-shadow:
    0 7px 22px
    rgba(39, 185, 138, .08);
}

.header-icon-button:active {
  transform:
    scale(.94);
}

.header-icon-button.active {
  color:
    var(--emerald);

  border-color:
    rgba(39, 185, 138, .35);

  background:
    rgba(39, 185, 138, .1);
}


/* =========================================
   THEME
========================================= */

.theme-icon {
  display: block;

  font-size:
    1rem;

  line-height: 1;

  transition:
    transform .4s ease;
}

.theme-button:hover .theme-icon {
  transform:
    rotate(25deg)
    scale(1.1);
}


/* =========================================
   NOTIFICATION
========================================= */

.notification-icon {
  display: block;

  font-size:
    1.15rem;

  transform:
    rotate(45deg);

  line-height: 1;
}

.notification-button:hover
.notification-icon {
  animation:
    bellShake .45s ease;
}

@keyframes bellShake {

  0%,
  100% {
    transform:
      rotate(45deg);
  }

  25% {
    transform:
      rotate(32deg);
  }

  75% {
    transform:
      rotate(58deg);
  }

}

.notification-count {
  position: absolute;

  top: -4px;
  right: -4px;

  min-width: 17px;
  height: 17px;

  display: flex;

  align-items: center;
  justify-content: center;

  padding:
    0 4px;

  border:
    2px solid
    var(--bg);

  border-radius:
    999px;

  background:
    var(--gold);

  color:
    #201707;

  font-size:
    .38rem;

  font-weight:
    950;

  box-shadow:
    0 0 10px
    rgba(240, 184, 61, .3);

  animation:
    notificationPop .3s ease;
}

@keyframes notificationPop {

  0% {
    transform:
      scale(.5);
  }

  70% {
    transform:
      scale(1.15);
  }

  100% {
    transform:
      scale(1);
  }

}


/* =========================================
   NEW EVENT BUTTON
========================================= */

.header-new-event {
  height: 42px;

  display: flex;

  align-items: center;

  gap: .4rem;

  border:
    1px solid
    rgba(240, 184, 61, .4);

  border-radius:
    11px;

  background:
    linear-gradient(
      135deg,
      #f0b83d,
      #d99519
    );

  color:
    white;

  padding:
    0 .85rem;

  font-size:
    .48rem;

  font-weight:
    950;

  letter-spacing:
    .05em;

  box-shadow:
    0 7px 25px
    rgba(240, 184, 61, .12);

  transition:
    transform .25s ease,
    box-shadow .25s ease,
    filter .25s ease;
}

.header-new-event:hover {
  transform:
    translateY(-2px);

  filter:
    brightness(1.08);

  box-shadow:
    0 10px 30px
    rgba(240, 184, 61, .22);
}

.header-new-event:active {
  transform:
    scale(.95);
}

.new-event-plus {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 18px;
  height: 18px;

  border-radius: 5px;

  background:
    rgba(255,255,255,.18);

  font-size:
    .9rem;

  line-height:
    1;
}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 850px) {

  .header-status {
    display: none;
  }

}

@media (max-width: 600px) {

  .app-header {
    height: 64px;
  }

  .header-inner {
    padding:
      0 .7rem;
  }

  .brand-text small {
    display: none;
  }

  .brand-text strong {
    font-size:
      .68rem;

    letter-spacing:
      .11em;
  }

  .brand-mark {
    width: 35px;
    height: 35px;
  }

  .hamburger-button,
  .header-icon-button {
    width: 38px;
    height: 38px;
  }

  .header-actions {
    gap: .3rem;
  }

  .header-new-event {
    width: 38px;
    height: 38px;

    justify-content:
      center;

    padding: 0;
  }

  .new-event-text {
    display: none;
  }

  .new-event-plus {
    width: 20px;
    height: 20px;

    background:
      transparent;

    font-size:
      1.1rem;
  }

}

@media (max-width: 400px) {

  .header-brand {
    gap: .45rem;
  }

  .brand-mark {
    display: none;
  }

  .header-icon-button {
    width: 35px;
    height: 35px;
  }

  .hamburger-button {
    width: 35px;
    height: 35px;
  }

}

</style>

