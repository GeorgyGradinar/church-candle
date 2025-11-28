<template>
  <section class="page-shell">
    <header>
      <p class="eyebrow">Молитвы об усопших</p>
      <h1>За упокой</h1>
      <p>
        Подайте имена усопших, за которых хотите заказать поминовение.
        Просим указывать имена в родительном падеже.
      </p>
    </header>

    <div class="icons-grid">
      <article
        v-for="(icon, index) in iconBlocks"
        :key="icon.documentId || icon.id"
        class="icon-card"
      >
        <div class="icon-visual" aria-hidden="true">
          <img
            v-if="icon.image && icon.image.length > 0 && icon.image[0]"
            :src="`${baseUrl}${icon.image[0].url}`"
            :alt="icon.title"
          >
          <span v-else>Икона</span>
        </div>
        <h3>{{ icon.title }}</h3>
        <p>Сейчас горит {{ icon.candles }} свеч{{ icon.candlesWord }}</p>

        <div class="candle-form">
          <label>
            Имя усопшего
            <input
              v-model="icon.name"
              :disabled="icon.anonymous"
              :class="{ disabled: icon.anonymous }"
              type="text"
              placeholder="Например: раба Божия Мария"
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
          <button type="button" @click="() => submitCandle(index)" class="submit-candle-btn">
            Установить свечу
          </button>
        </div>
      </article>
    </div>

    <form class="form-card" @submit.prevent>
      <label>
        Имена усопших
        <textarea name="names" rows="4" placeholder="Например: раба Божия Марии" required></textarea>
      </label>
      <label>
        Служба
        <select name="service">
          <option value="liturgy">Божественная литургия</option>
          <option value="panikhida">Панихида</option>
          <option value="sorokoust">Сорокоуст</option>
        </select>
      </label>
      <label>
        Пожертвование
        <input type="number" min="0" step="50" name="donation" placeholder="Сумма, ₽">
      </label>
      <button type="submit">Отправить записку</button>
      <p class="hint">
        После оформления с вами свяжется дежурный, чтобы подтвердить детали.
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import iconsRequests from "~/mixins/requests/icons";
import candlesRequests from "~/mixins/requests/candles";
import { useIconsStore } from "~/stores/iconsStore.js";

const { getAllIcons } = iconsRequests();
const { getAllCandles, createCandle } = candlesRequests();
const iconsStore = useIconsStore();
const { icons } = storeToRefs(iconsStore);

const baseUrl = 'https://strapi.botinex.ru';

const iconBlocks = ref([]);

function updateIconBlocks() {
  if (!icons.value || icons.value.length === 0) {
    iconBlocks.value = [];
    return;
  }

  iconBlocks.value = icons.value.map((icon, idx) => {
    const candles = 3 + idx * 2;
    const candlesWord =
      candles === 1 ? "а" : candles >= 2 && candles <= 4 ? "и" : "ей";
    
    return {
      id: icon.id,
      documentId: icon.documentId,
      title: icon.title,
      description: icon.description,
      prayer: icon.prayer,
      image: icon.image || [],
      candles,
      candlesWord,
      showForm: false,
      name: "",
      anonymous: false,
      type: "medium",
    };
  });
}

watch(icons, () => {
  updateIconBlocks();
}, { immediate: true });

const toggleAnonymous = (index) => {
  const item = iconBlocks.value[index];
  if (!item) return;
  item.anonymous = !item.anonymous;
  if (item.anonymous) item.name = "";
};

async function submitCandle(index) {
  const item = iconBlocks.value[index];
  if (!item) return;

  if (!item.anonymous && !item.name) {
    alert('Пожалуйста, введите имя или выберите анонимно');
    return;
  }

  try {
    const requestBody = {
      iconId: item.id,
      type: item.type || 'medium',
    };

    // Отправляем имя только если не анонимно
    if (!item.anonymous && item.name) {
      requestBody.name = item.name;
    }

    const response = await createCandle(requestBody);

    if (response) {
      alert('Свеча успешно установлена');
      item.name = '';
      item.anonymous = false;
    }
  } catch (error) {
    console.error('Error creating candle:', error);
    alert('Ошибка при установке свечи');
  }
}

onMounted(() => {
  getAllIcons({ locale: 'ru', page: 1, pageSize: 10 })
    .then(response => {
      console.log('Icons loaded:', response);
      updateIconBlocks();
    })
    .catch(error => {
      console.error('Error loading icons:', error);
    });

  getAllCandles()
    .then(response => {
      console.log('Candles loaded:', response);
    })
    .catch(error => {
      console.error('Error loading candles:', error);
    });
});
</script>

<style scoped lang="scss">
.page-shell {
  max-width: 640px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;

  header {
    margin-bottom: 2rem;

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

    p {
      color: #475569;
      line-height: 1.5;
    }
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
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
      }

      span {
        padding: 1rem;
      }
    }

    h3 {
      color: #0f172a;
      font-size: 1.15rem;
    }

    p {
      color: #475569;
    }

    button {
      margin-top: auto;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      border: none;
      background: #ef4444;
      color: #fff;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: #dc2626;
      }
    }

    .candle-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
      text-align: left;

      label {
        font-size: 0.9rem;
        color: #0f172a;
      }

      input[type="text"] {
        border: 1px solid #cbd5f5;
        border-radius: 10px;
        padding: 0.65rem 0.85rem;
        font-size: 0.95rem;
        transition: background 0.2s ease, border-color 0.2s ease;

        &.disabled {
          background: #f1f5f9;
          border-color: #e2e8f0;
          color: #94a3b8;
        }
      }

      .checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: #475569;
      }

      .submit-candle-btn {
        margin-top: 0.5rem;
        padding: 0.75rem 1rem;
        border-radius: 10px;
        border: none;
        background: #ef4444;
        color: #fff;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background 0.2s ease;

        &:hover {
          background: #dc2626;
        }
      }
    }
  }

  .form-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
    background-color: #fff;

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
      background: #dc2626;
      color: #fff;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: #b91c1c;
      }
    }

    .hint {
      text-align: center;
      font-size: 0.9rem;
      color: #475569;
    }
  }
}
</style>


