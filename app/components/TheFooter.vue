<script setup>
import { computed } from 'vue';
import FAITH_ICON from "../../public/images/svg/faith.svg";

const currentYear = computed(() => new Date().getFullYear());
</script>

<template>
  <footer class="site-footer">
    <div class="footer-content">
      <div class="footer-brand">
        <NuxtLink to="/" class="brand-link">
          <FAITH_ICON class="brand-icon" />
          <span>Слово веры</span>
        </NuxtLink>
        <p class="footer-description">
          Место тихой молитвы. Подайте записки о здравии и упокоении, зажгите свечу, узнайте о церковных праздниках.
        </p>
      </div>

      <nav class="footer-nav">
        <div class="nav-column">
          <h3>Навигация</h3>
          <ul>
            <li>
              <NuxtLink to="/">Главная</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/living">За здравие</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/repose">За упокой</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/prayers">Молитвы</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/calendar">Календарь</NuxtLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} Слово веры. Все права защищены.</p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.site-footer {
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
  margin-top: 4rem;
  padding: 3rem 1.5rem 1.5rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
  }
}

.footer-brand {
  .brand-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    text-decoration: none;
    color: #0f172a;
    font-weight: 600;
    font-size: 1.05rem;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }

  .brand-icon {
    width: 24px;
    height: 24px;
    display: block;
    flex-shrink: 0;
  }

  .footer-description {
    color: #64748b;
    font-size: 0.95rem;
    line-height: 1.6;
    max-width: 500px;
    margin: 0;
  }
}

.footer-nav {
  .nav-column {
    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 1rem;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    li {
      margin: 0;
    }

    a {
      color: #475569;
      text-decoration: none;
      font-size: 0.95rem;
      transition: color 0.2s ease;

      &:hover {
        color: #0ea5e9;
      }
    }
  }
}

.footer-bottom {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
  text-align: center;

  p {
    color: #94a3b8;
    font-size: 0.875rem;
    margin: 0;
  }
}

@media (max-width: 767px) {
  .site-footer {
    padding: 2rem 1rem 1rem;
  }

  .footer-content {
    gap: 2rem;
  }

  .footer-nav {
    .nav-column {
      h3 {
        font-size: 0.95rem;
      }

      ul {
        gap: 0.625rem;
      }

      a {
        font-size: 0.9rem;
      }
    }
  }
}
</style>

