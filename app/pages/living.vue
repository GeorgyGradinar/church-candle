<template>
  <section class="page-shell">
    <header>
      <p class="eyebrow">Молитвы о здравии</p>
      <h1>За здравие</h1>
      <p>
        Подайте имена живых, за которых просите молитвы о здравии, укреплении и благополучии.
      </p>
    </header>

    <div class="icons-grid">
      <article
        v-for="(icon, index) in iconBlocks"
        :key="icon.id"
        class="icon-card"
      >
        <div class="icon-visual" aria-hidden="true">
          <span>Икона</span>
        </div>
        <h3>{{ icon.title }}</h3>
        <p>Сейчас горит {{ icon.candles }} свеч{{ icon.candlesWord }}</p>
        <button type="button" @click="openForm(index)">
          Поставить свечу
        </button>

        <div v-if="icon.showForm" class="candle-form">
          <label>
            Имя молящегося
            <input
              v-model="icon.name"
              :disabled="icon.anonymous"
              :class="{ disabled: icon.anonymous }"
              type="text"
              placeholder="Например: раба Божия Анна"
            >
          </label>
          <label class="checkbox">
            <input
              type="checkbox"
              :checked="icon.anonymous"
              @change="toggleAnonymous(index)"
            >
            <span>Оставить анонимно</span>
          </label>
        </div>
      </article>
    </div>

    <form class="form-card" @submit.prevent>
      <label>
        Имена живых
        <textarea name="names" rows="4" placeholder="Например: раба Божия Анна" required></textarea>
      </label>
      <label>
        Особые прошения
        <textarea name="notes" rows="3" placeholder="Например: о благополучном путешествии"></textarea>
      </label>
      <label>
        Служба
        <select name="service">
          <option value="liturgy">Божественная литургия</option>
          <option value="moleben">Молебен</option>
          <option value="akathist">Акафист</option>
        </select>
      </label>
      <label>
        Пожертвование
        <input type="number" min="0" step="50" name="donation" placeholder="Сумма, ₽">
      </label>
      <button type="submit">Отправить записку</button>
      <p class="hint">
        Записки принимаются ежедневно, в день службы их передают на клирос.
      </p>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

type IconBlock = {
  id: number;
  title: string;
  candles: number;
  candlesWord: string;
  showForm: boolean;
  name: string;
  anonymous: boolean;
};

const iconBlocks = ref<IconBlock[]>(
  Array.from({ length: 5 }, (_, idx) => {
    const candles = 5 + idx * 3;
    const candlesWord =
      candles === 1 ? "а" : candles >= 2 && candles <= 4 ? "и" : "ей";
    return {
      id: idx,
      title: `Икона №${idx + 1}`,
      candles,
      candlesWord,
      showForm: false,
      name: "",
      anonymous: false,
    };
  }),
);

const openForm = (index: number) => {
  const item = iconBlocks.value[index];
  if (!item) return;
  item.showForm = true;
};

const toggleAnonymous = (index: number) => {
  const item = iconBlocks.value[index];
  if (!item) return;
  item.anonymous = !item.anonymous;
  if (item.anonymous) item.name = "";
};
</script>

<style scoped>
.page-shell {
  max-width: 640px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

header {
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
  line-height: 1.5;
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2.5rem;
}

.icon-card {
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.5rem;
  background-color: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.icon-visual {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  border: 1px dashed #cbd5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 0.95rem;
  background: linear-gradient(145deg, #f8fafc, #ffffff);
}

.icon-card h3 {
  color: #0f172a;
  font-size: 1.15rem;
}

.icon-card p {
  color: #475569;
}

.icon-card button {
  margin-top: auto;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: none;
  background: #0ea5e9;
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.icon-card button:hover {
  background: #0284c7;
}

.candle-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
  text-align: left;
}

.candle-form label {
  font-size: 0.9rem;
  color: #0f172a;
}

.candle-form input[type="text"] {
  width: 100%;
  border: 1px solid #cbd5f5;
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  font-size: 0.95rem;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.candle-form input.disabled {
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #94a3b8;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
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
  gap: 0.35rem;
  font-size: 0.95rem;
  color: #0f172a;
}

textarea,
select,
input {
  border: 1px solid #cbd5f5;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  font-family: inherit;
}

textarea {
  resize: vertical;
}

button {
  padding: 0.95rem 1rem;
  border-radius: 999px;
  border: none;
  background: #10b981;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: #059669;
}

.hint {
  text-align: center;
  font-size: 0.9rem;
  color: #475569;
}
</style>


