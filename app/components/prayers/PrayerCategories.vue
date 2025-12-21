<template>
  <div class="categories-section">
    <h2>Разделы молитв</h2>
    <div class="categories-grid">
      <NuxtLink
          v-for="category in categories"
          :key="category.id"
          :to="`/prayers/category/${category.id}`"
          class="category-card"
      >
        {{ category.name }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const categories = [
  { id: 'tolkovye-molitvoslovy', name: 'Толковые молитвословы' },
  { id: 'glavnye-molitvy', name: 'Главные молитвы' },
  { id: 'ko-presvyatoj-bogoroditse', name: 'Ко Пресвятой Богородице' },
  { id: 'molitvy-v-prodolzhenie-dnya', name: 'Молитвы в продолжение дня' },
  { id: 'psaltir', name: 'Псалтирь' },
  { id: 'kanony-i-molitvy-dlya-podgotovki-k-tainstvam', name: 'Каноны и молитвы для подготовки к Таинствам Покаяния и Святого Причащения' },
  { id: 'molitvy-velikogo-posta', name: 'Молитвы Великого поста' },
  { id: 'molitvy-pashi', name: 'Молитвы Пасхи' },
  { id: 'fragmenty-tserkovnyh-bogosluzhenij', name: 'Фрагменты церковных богослужений' },
  { id: 'molitvy-na-raznye-sluchai-zhizni', name: 'МОЛИТВЫ НА РАЗНЫЕ СЛУЧАИ ЖИЗНИ' },
  { id: 'smert-i-pominovenie-usopshih', name: 'Смерть и поминовение усопших' },
  { id: 'molitvy-raznye', name: 'Молитвы разные' },
  { id: 'kanony', name: 'Каноны' },
  { id: 'akafisty', name: 'Акафисты' },
  { id: 'molitvy-angelam', name: 'Молитвы Ангелам' },
  { id: 'molitvy-ko-svyatym', name: 'Молитвы ко святым' },
  { id: 'tropari-kondaki-i-velichaniya', name: 'Тропари, кондаки и величания' },
  { id: 'prokimny-i-alliluiarii', name: 'Прокимны и аллилуиарии' },
  { id: 'apokrificheskie-molitvy', name: 'Апокрифические молитвы' },
  { id: 'tserkovnoslavyanskij-shrift', name: 'Церковнославянский шрифт' }
];
</script>

<style scoped lang="scss">
.categories-section {
  margin-bottom: 2.5rem;

  h2 {
    font-size: 1.5rem;
    color: #0f172a;
    margin-bottom: 1.5rem;
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;

    .category-card {
      padding: 1.25rem;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #fff;
      color: #475569;
      font-size: 0.95rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 60px;
      display: flex;
      align-items: center;
      text-decoration: none;

      &:hover {
        border-color: #0ea5e9;
        color: #0ea5e9;
        box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
      }

      &.active {
        background: #0ea5e9;
        border-color: #0ea5e9;
        color: #fff;
      }
    }
  }
}

@media (max-width: 640px) {
  .categories-section {
    h2 {
      font-size: 1.25rem;
    }

    .categories-grid {
      grid-template-columns: 1fr;
      gap: 0.75rem;

      .category-card {
        padding: 1rem;
        font-size: 0.9rem;
        min-height: 50px;
      }
    }
  }
}
</style>

