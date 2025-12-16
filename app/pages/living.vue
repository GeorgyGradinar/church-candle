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
      <IconCard
        v-for="(icon, index) in iconsLiving"
        :key="icon.documentId || icon.id"
        :icon="icon"
        :base-url="baseUrl"
        :candles-count="getCandlesCount(index)"
        name-label="Имя молящегося"
        placeholder="Например: раба Божия Анна"
        theme="living"
      />
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

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import iconsRequests from "~/mixins/requests/icons";
import candlesRequests from "~/mixins/requests/candles";
import { useLivingIconsStore } from "~/stores/livingIconsStore.js";
import { useAuthStore } from "~/stores/mainStore.js";
import IconCard from "~/components/IconCard.vue";

const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

useHead({
  title: 'Молитвы о здравии - Записки о здравии',
  meta: [
    {
      name: 'description',
      content: 'Подайте имена живых, за которых просите молитвы о здравии, укреплении и благополучии. Записки принимаются ежедневно, в день службы их передают на клирос.'
    },
    {
      name: 'keywords',
      content: 'молитвы о здравии, записки о здравии, поминовение о здравии, церковные записки, молебен о здравии, акафист о здравии, литургия о здравии'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Молитвы о здравии - Записки о здравии'
    },
    {
      property: 'og:description',
      content: 'Подайте имена живых, за которых просите молитвы о здравии, укреплении и благополучии.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: `${siteUrl}/living`
    },
    {
      property: 'og:locale',
      content: 'ru_RU'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Молитвы о здравии - Записки о здравии'
    },
    {
      name: 'twitter:description',
      content: 'Подайте имена живых, за которых просите молитвы о здравии, укреплении и благополучии.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${siteUrl}/living`
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Молитвы о здравии',
        description: 'Подайте имена живых, за которых просите молитвы о здравии, укреплении и благополучии.',
        url: `${siteUrl}/living`,
        inLanguage: 'ru-RU',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Дом свечи',
          url: siteUrl
        },
        about: {
          '@type': 'Thing',
          name: 'Молитвы о здравии',
          description: 'Церковные записки и поминовение о здравии живых'
        }
      })
    }
  ]
});

const iconsStore = useLivingIconsStore();
const { iconsLiving } = storeToRefs(iconsStore);
const { getAllIcons } = iconsRequests();
const { getAllCandles } = candlesRequests();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const baseUrl = 'https://strapi.botinex.ru';

function getCandlesCount(index) {
  return 3 + index * 2;
}

onMounted(() => {
  // Запрашиваем иконы только если их нет в сторе
  if (!iconsLiving.value) {
    getAllIcons(true);
  }

  // Загружаем свечи из localStorage для незалогиненных пользователей
  iconsStore.loadCandlesFromStorage();

  // Запрашиваем свечи только если пользователь залогинен
  if (user.value && user.value.accessToken) {
    getAllCandles()
      .then(response => {
        console.log('Candles loaded:', response);
      })
      .catch(error => {
        console.error('Error loading candles:', error);
      });
  }
});
</script>

<style scoped lang="scss">
.page-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;

  @media (min-width: 768px) {
    padding: 3rem 2rem 5rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem 2rem 6rem;
  }

  header {
    margin-bottom: 3rem;
    text-align: center;

    @media (min-width: 768px) {
      margin-bottom: 4rem;
      text-align: left;
      max-width: 800px;
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #8b7355;
      font-size: 0.75rem;
      margin-bottom: 1rem;
      font-weight: 500;

      @media (min-width: 768px) {
        font-size: 0.8rem;
      }
    }

    h1 {
      margin-bottom: 1rem;
      color: #2c2416;
      font-size: 2rem;
      font-weight: 400;
      line-height: 1.2;

      @media (min-width: 768px) {
        font-size: 2.5rem;
      }

      @media (min-width: 1024px) {
        font-size: 3rem;
      }
    }

    p {
      color: #5a4a3a;
      line-height: 1.7;
      font-size: 0.95rem;

      @media (min-width: 768px) {
        font-size: 1rem;
        max-width: 600px;
      }
    }
  }

  .icons-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 3rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 2.5rem;
      margin-bottom: 4rem;
    }
  }

  .form-card {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid #e8e0d4;
    background: linear-gradient(to bottom, #fefcf9, #faf8f4);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

    @media (min-width: 768px) {
      padding: 2.5rem;
      border-radius: 20px;
      gap: 2rem;
    }

    @media (min-width: 1024px) {
      padding: 3rem;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.95rem;
      color: #3d3325;
      font-weight: 500;

      @media (min-width: 768px) {
        font-size: 1rem;
      }
    }

    textarea,
    select,
    input {
      border: 1.5px solid #d4c9b8;
      border-radius: 10px;
      padding: 0.875rem 1.15rem;
      font-size: 0.95rem;
      font-family: inherit;
      background: #fff;
      color: #2c2416;
      transition: all 0.2s ease;

      @media (min-width: 768px) {
        padding: 1rem 1.25rem;
        font-size: 1rem;
      }

      &:focus {
        outline: none;
        border-color: #b8a082;
        box-shadow: 0 0 0 3px rgba(184, 160, 130, 0.1);
      }
    }

    textarea {
      resize: vertical;
      min-height: 100px;
    }

    button {
      padding: 1rem 2rem;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #6b8e5a, #5a7a4a);
      color: #fff;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(90, 122, 74, 0.2);

      @media (min-width: 768px) {
        padding: 1.125rem 2.5rem;
        font-size: 1.05rem;
      }

      &:hover {
        background: linear-gradient(135deg, #5a7a4a, #4a6a3a);
        box-shadow: 0 4px 8px rgba(90, 122, 74, 0.3);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .hint {
      text-align: center;
      font-size: 0.875rem;
      color: #6b5d47;
      line-height: 1.6;
      margin-top: 0.5rem;

      @media (min-width: 768px) {
        font-size: 0.9rem;
      }
    }
  }
}
</style>


