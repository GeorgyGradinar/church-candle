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
      <IconCard
        v-for="(icon, index) in iconsRepose"
        :key="icon.documentId || icon.id"
        :icon="icon"
        :base-url="baseUrl"
        :candles-count="getCandlesCount(index)"
        name-label="Имя усопшего"
        placeholder="Например: раба Божия Мария"
        theme="repose"
      />
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
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import iconsRequests from "~/mixins/requests/icons";
import candlesRequests from "~/mixins/requests/candles";
import { useReposeIconsStore } from "~/stores/reposeIconsStore.js";
import { useAuthStore } from "~/stores/mainStore.js";
import IconCard from "~/components/IconCard.vue";

const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

useHead({
  title: 'Молитвы об усопших - Записки об упокоении',
  meta: [
    {
      name: 'description',
      content: 'Подайте имена усопших, за которых хотите заказать поминовение. Просим указывать имена в родительном падеже. После оформления с вами свяжется дежурный, чтобы подтвердить детали.'
    },
    {
      name: 'keywords',
      content: 'молитвы об усопших, записки об упокоении, поминовение усопших, панихида, сорокоуст, литургия об упокоении, церковные записки об усопших'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Молитвы об усопших - Записки об упокоении'
    },
    {
      property: 'og:description',
      content: 'Подайте имена усопших, за которых хотите заказать поминовение. Просим указывать имена в родительном падеже.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: `${siteUrl}/repose`
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
      content: 'Молитвы об усопших - Записки об упокоении'
    },
    {
      name: 'twitter:description',
      content: 'Подайте имена усопших, за которых хотите заказать поминовение. Просим указывать имена в родительном падеже.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${siteUrl}/repose`
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Молитвы об усопших',
        description: 'Подайте имена усопших, за которых хотите заказать поминовение. Просим указывать имена в родительном падеже.',
        url: `${siteUrl}/repose`,
        inLanguage: 'ru-RU',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Дом свечи',
          url: siteUrl
        },
        about: {
          '@type': 'Thing',
          name: 'Молитвы об усопших',
          description: 'Церковные записки и поминовение об упокоении усопших'
        }
      })
    }
  ]
});

const iconsStore = useReposeIconsStore();
const { iconsRepose } = storeToRefs(iconsStore);
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
  if (!iconsRepose.value) {
    getAllIcons(false);
  }

  // Загружаем свечи из localStorage для незалогиненных пользователей
  iconsStore.loadCandlesFromStorage();

  // Запрашиваем свечи только если пользователь залогинен
  if (user.value && user.value.accessToken) {
    getAllCandles();
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
      color: #7a6b5a;
      font-size: 0.75rem;
      margin-bottom: 1rem;
      font-weight: 500;

      @media (min-width: 768px) {
        font-size: 0.8rem;
      }
    }

    h1 {
      margin-bottom: 1rem;
      color: #2a241c;
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
      color: #5a4f45;
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
    border: 1px solid #d8d0c4;
    background: linear-gradient(to bottom, #f8f6f2, #f3f0eb);
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
      color: #3a3228;
      font-weight: 500;

      @media (min-width: 768px) {
        font-size: 1rem;
      }
    }

    textarea,
    select,
    input {
      border: 1.5px solid #c8beb0;
      border-radius: 10px;
      padding: 0.875rem 1.15rem;
      font-size: 0.95rem;
      font-family: inherit;
      background: #fff;
      color: #2a241c;
      transition: all 0.2s ease;

      @media (min-width: 768px) {
        padding: 1rem 1.25rem;
        font-size: 1rem;
      }

      &:focus {
        outline: none;
        border-color: #a89682;
        box-shadow: 0 0 0 3px rgba(168, 150, 130, 0.1);
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
      background: linear-gradient(135deg, #7a5f4a, #6a4f3a);
      color: #fff;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(106, 79, 58, 0.2);

      @media (min-width: 768px) {
        padding: 1.125rem 2.5rem;
        font-size: 1.05rem;
      }

      &:hover {
        background: linear-gradient(135deg, #6a4f3a, #5a3f2a);
        box-shadow: 0 4px 8px rgba(106, 79, 58, 0.3);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .hint {
      text-align: center;
      font-size: 0.875rem;
      color: #6b5f52;
      line-height: 1.6;
      margin-top: 0.5rem;

      @media (min-width: 768px) {
        font-size: 0.9rem;
      }
    }
  }
}
</style>


