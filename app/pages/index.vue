<template>
  <section class="page-shell">
    <div class="hero">
      <h1>Место тихой молитвы</h1>
      <p>Ваш маленький свет в большой молитве</p>
    </div>

    <div class="actions">
      <NuxtLink to="/repose" class="action-card">
        <h3>За упокой</h3>
        <p>Подать записку о упокоении близких.</p>
      </NuxtLink>
      <NuxtLink to="/living" class="action-card">
        <h3>За здравие</h3>
        <p>Помолиться о здравии родных и друзей.</p>
      </NuxtLink>
      <NuxtLink to="/login" class="action-card">
        <h3>Личный кабинет</h3>
        <p>Войдите, чтобы отслеживать историю поданных прошений.</p>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.page-shell {
  max-width: 960px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.hero {
  text-align: center;
  margin-bottom: 2.5rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.hero h1 {
  font-size: clamp(2rem, 6vw, 3rem);
  margin-bottom: 0.75rem;
  color: #0f172a;
}

.hero p {
  color: #475569;
  line-height: 1.6;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

.action-card {
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  background: #ffffff;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.action-card:hover {
  border-color: #cbd5f5;
  transform: translateY(-2px);
}

.action-card h3 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  color: #0f172a;
}

.action-card p {
  color: #475569;
}
</style>


