<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import {useAuthStore} from "~/stores/mainStore";
import FAITH_ICON from "../../public/images/svg/faith.svg";

const authStore = useAuthStore();
const {user} = storeToRefs(authStore);

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<template>
  <header class="site-header">
    <div class="brand">
      <NuxtLink to="/" @click="closeMenu" class="brand-link">
        <FAITH_ICON filled class="brand-icon" />
        <span>Слово веры</span>
      </NuxtLink>
    </div>

    <button class="burger" type="button" @click="toggleMenu">
      <span :class="{ open: isMenuOpen }" />
      <span :class="{ open: isMenuOpen }" />
      <span :class="{ open: isMenuOpen }" />
    </button>

    <nav :class="['nav-links', { open: isMenuOpen }]">
      <NuxtLink to="/living" @click="closeMenu">За здравие</NuxtLink>
      <NuxtLink to="/repose" @click="closeMenu">За упокой</NuxtLink>
      <NuxtLink to="/prayers" @click="closeMenu">Молитвы</NuxtLink>
      <NuxtLink to="/calendar" @click="closeMenu">Календарь</NuxtLink>
    </nav>

    <NuxtLink to="/login" class="login-btn" v-if="!user">Войти</NuxtLink>
  </header>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 50;
}

.brand a {
  font-weight: 600;
  font-size: 1.05rem;
  color: #0f172a;
  text-decoration: none;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-icon {
  width: 24px;
  height: 24px;
  display: block;
  flex-shrink: 0;
}

.nav-links {
  display: flex;
  gap: 1rem;
  font-size: 0.95rem;
}

.nav-links a {
  color: #475569;
  text-decoration: none;
  padding: 0.35rem 0.5rem;
  border-radius: 8px;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: #e0f2fe;
  color: #0369a1;
}

.login-btn {
  padding: 0.55rem 1.1rem;
  border-radius: 999px;
  border: 1px solid #0ea5e9;
  color: #0ea5e9;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease;
}

.login-btn:hover {
  background: #0ea5e9;
  color: #fff;
}

.burger {
  display: none;
  flex-direction: column;
  gap: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.35rem;
}

.burger span {
  width: 22px;
  height: 2px;
  background: #0f172a;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.burger span.open:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.burger span.open:nth-child(2) {
  opacity: 0;
}

.burger span.open:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

@media (max-width: 768px) {
  .site-header {
    flex-direction: row;
    gap: 0.75rem;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: #fff;
    padding: 1rem 1.5rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: none;
  }

  .nav-links.open {
    display: flex;
  }

  .login-btn {
    display: none;
  }

  .burger {
    display: flex;
  }
}
</style>