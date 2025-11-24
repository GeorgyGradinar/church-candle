<template>
  <section class="page-shell">
    <header>
      <h1>Войти в личный кабинет</h1>
      <p>Используйте e-mail и пароль, указанные при регистрации.</p>
    </header>

    <form class="form-card" @submit.prevent>
      <label>
        Электронная почта
        <input type="email" name="email" placeholder="name@example.com" required>
      </label>
      <label>
        Пароль
        <input type="password" name="password" placeholder="••••••••" required minlength="6">
      </label>
      <button type="submit">Войти</button>
      <p class="hint">
        Еще не зарегистрированы?
        <NuxtLink to="/register">Создать аккаунт</NuxtLink>
      </p>
    </form>
  </section>
</template>

<style scoped>
.page-shell {
  max-width: 480px;
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
  background: #3b82f6;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: #2563eb;
}

.hint {
  font-size: 0.9rem;
  text-align: center;
  color: #475569;
}

.hint a {
  color: #2563eb;
}
</style>


