<template>
  <div class="actions">
    <NuxtLink to="/repose" class="action-card">
      <h3>За упокой</h3>
      <p>Подать записку о упокоении близких.</p>
    </NuxtLink>
    <NuxtLink to="/living" class="action-card">
      <h3>За здравие</h3>
      <p>Помолиться о здравии родных и друзей.</p>
    </NuxtLink>
    <NuxtLink to="/prayers" class="action-card">
      <h3>Молитвы</h3>
      <p>Основные православные молитвы для ежедневного чтения.</p>
    </NuxtLink>
    <NuxtLink to="/saints" class="action-card">
      <h3>Святые</h3>
      <p>Жития православных святых - подвижников, мучеников и угодников Божиих.</p>
    </NuxtLink>
    <NuxtLink to="/calendar" class="action-card calendar-card">
      <h3>📅 Календарь</h3>
      <p>Православные праздники, дни памяти святых и важные даты.</p>
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
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

  &:hover {
    border-color: #cbd5f5;
    transform: translateY(-2px);
  }

  &.calendar-card {
    background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%);
    border-color: #fde68a;

    &:hover {
      border-color: #fbbf24;
    }
  }

  h3 {
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    color: #0f172a;
  }

  p {
    color: #475569;
  }
}
</style>

