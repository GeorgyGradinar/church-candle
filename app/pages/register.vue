<template>
  <section class="page-shell">
    <header>
      <p class="eyebrow">Новый аккаунт</p>
      <h1>Регистрация прихожанина</h1>
      <p>Заполните форму, чтобы сохранять историю записок и пожертвований.</p>
    </header>

    <form class="form-card" @submit.prevent>
      <label>
        Полное имя
        <input type="text" name="fullName" placeholder="Иван Иванов" required>
      </label>
      <label>
        Электронная почта
        <input type="email" name="email" placeholder="name@example.com" required>
      </label>
      <label>
        Телефон
        <input type="tel" name="phone" placeholder="+7 (___) ___-__-__">
      </label>
      <label>
        Пароль
        <input type="password" name="password" placeholder="••••••••" required minlength="6">
      </label>
      <button type="submit">Создать аккаунт</button>
      <p class="hint">
        Уже есть аккаунт?
        <NuxtLink to="/login">Войти</NuxtLink>
      </p>
    </form>
  </section>
</template>

<style scoped>
.page-shell {
  max-width: 560px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}

h1 {
  margin-bottom: 0.5rem;
  color: #0f172a;
}

header p {
  color: #475569;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  background-color: #fff;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  gap: 0.25rem;
  color: #0f172a;
}

input {
  border: 1px solid #cbd5f5;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
}

button {
  margin-top: 0.5rem;
  padding: 0.9rem 1rem;
  border-radius: 999px;
  border: none;
  background: #16a34a;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: #15803d;
}

.hint {
  font-size: 0.9rem;
  text-align: center;
  color: #475569;
}

.hint a {
  color: #15803d;
}
</style>


