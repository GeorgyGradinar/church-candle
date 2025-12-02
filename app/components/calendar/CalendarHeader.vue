<template>
  <header class="page-header">
    <p class="eyebrow">Церковный календарь</p>
    <h1>Православный календарь</h1>
    <p class="description">
      Праздники, дни памяти святых и другие значимые события церковного года
    </p>
  </header>
</template>

<style scoped lang="scss">
.page-header {
  margin-bottom: 2.5rem;
  text-align: center;

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
    font-size: 2.5rem;
  }

  .description {
    color: #475569;
    line-height: 1.5;
    max-width: 600px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .page-header {
    h1 {
      font-size: 1.75rem;
    }
  }
}
</style>

