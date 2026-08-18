<template>
  <footer class="app-footer">

    <div class="footer-inner">

      <!-- BRAND -->
      <div class="footer-brand">

        <div class="footer-logo">
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

      </div>


      <!-- SYSTEM STATUS -->
      <div class="footer-status">

        <span class="footer-status-dot"></span>

        <span>
          SYSTEM OPERATIONAL
        </span>

      </div>


      <!-- COPYRIGHT -->
      <div class="footer-copy">

        <span>
          © {{ new Date().getFullYear() }}
          Eventora
        </span>

        <span class="footer-separator">
          •
        </span>

        <span>
          Event Management System
        </span>

      </div>

    </div>

  </footer>
</template>


<style scoped>

.app-footer {
  width: 100%;

  margin-top: 1rem;

  border-top:
    1px solid
    var(--border);

  background:
    rgba(6, 16, 13, .55);

  transition:
    background .3s ease;
}

:global(.light-mode) .app-footer {
  background:
    rgba(255, 255, 255, .65);
}


/* =========================================
   FOOTER INNER
========================================= */

.footer-inner {
  width: min(1500px, 100%);

  min-height: 75px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 1rem;

  margin: auto;

  padding:
    1rem clamp(1rem, 3vw, 3rem);
}


/* =========================================
   BRAND
========================================= */

.footer-brand {
  display: flex;

  align-items: center;

  gap: .6rem;
}

.footer-logo {
  width: 32px;
  height: 32px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background:
    linear-gradient(
      135deg,
      #f0b83d,
      #d99519
    );

  color: white;

  font-size: .85rem;

  box-shadow:
    0 0 18px
    rgba(240,184,61,.12);
}

.footer-brand strong,
.footer-brand small {
  display: block;
}

.footer-brand strong {
  color:
    var(--text);

  font-size:
    .6rem;

  font-weight:
    950;

  letter-spacing:
    .12em;
}

.footer-brand small {
  margin-top:
    .12rem;

  color:
    var(--text-soft);

  font-size:
    .34rem;

  letter-spacing:
    .1em;
}


/* =========================================
   STATUS
========================================= */

.footer-status {
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
    .07em;
}

.footer-status-dot {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background:
    var(--emerald);

  box-shadow:
    0 0 8px
    var(--emerald);

  animation:
    footerPulse 2s infinite;
}

@keyframes footerPulse {

  0%,
  100% {
    opacity: .5;

    transform:
      scale(.85);
  }

  50% {
    opacity: 1;

    transform:
      scale(1.1);
  }

}


/* =========================================
   COPYRIGHT
========================================= */

.footer-copy {
  display: flex;

  align-items: center;

  gap: .5rem;

  color:
    var(--text-soft);

  font-size:
    .4rem;
}

.footer-separator {
  color:
    var(--gold);
}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 750px) {

  .footer-inner {
    flex-wrap: wrap;

    justify-content: center;

    gap: .7rem;
  }

  .footer-brand {
    width: 100%;

    justify-content: center;
  }

}

@media (max-width: 450px) {

  .footer-status {
    display: none;
  }

  .footer-copy {
    justify-content: center;

    text-align: center;

    line-height: 1.5;
  }

  .footer-separator {
    display: none;
  }

}
</style>