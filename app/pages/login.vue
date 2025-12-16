<template>
  <section class="page-shell">
    <header>
      <h1>Войти в личный кабинет</h1>
      <p>Используйте e-mail и пароль, указанные при регистрации.</p>
    </header>

    <form class="form-card" @submit.prevent="handleSubmit" novalidate>
      <p v-if="submitError" class="form-error">{{ submitError }}</p>

      <AuthorizationInput
        v-model:data="loginForm.email"
        title="Электронная почта"
        placeholder="name@example.com"
        :validation="vLogin$.email"
        :type="'email'"
        :error="mapErrors(vLogin$.email.$errors)[0]"
      />

      <AuthorizationInput
        v-model:data="loginForm.password"
        title="Пароль"
        placeholder="••••••••"
        :validation="vLogin$.password"
        :type="'password'"
        :error="mapErrors(vLogin$.password.$errors)[0]"
      />

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Входим..." : "Войти" }}
      </button>
      <p class="hint">
        Еще не зарегистрированы?
        <NuxtLink to="/register">Создать аккаунт</NuxtLink>
      </p>
    </form>
  </section>
</template>

<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import {email, minLength, required} from "@vuelidate/validators";
import {ref} from "vue";
import AuthorizationInput from "~/components/auth/AuthorizationInput.vue";
import validation from "~/mixins/validation";
import authRequests from "~/mixins/requests/auth";

const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

useHead({
  title: 'Вход в личный кабинет',
  meta: [
    {
      name: 'description',
      content: 'Войдите в личный кабинет, чтобы сохранять историю записок и пожертвований. Используйте e-mail и пароль, указанные при регистрации.'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Вход в личный кабинет - Слово веры'
    },
    {
      property: 'og:description',
      content: 'Войдите в личный кабинет, чтобы сохранять историю записок и пожертвований.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: `${siteUrl}/login`
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${siteUrl}/login`
    }
  ]
});

const {mapErrors} = validation();
const {login} = authRequests();

const loginForm = ref({
  email: "",
  password: "",
});

const rulesLogin = {
  email: {required, email},
  password: {required, minLength: minLength(6)},
};

const vLogin$ = useVuelidate(rulesLogin, loginForm);
const submitError = ref<string | null>(null);
const isSubmitting = ref(false);

function handleSubmit() {
  submitError.value = null;
  vLogin$.value.$touch();
  if (vLogin$.value.$error) return;

  isSubmitting.value = true;
  login({
    email: loginForm.value.email,
    password: loginForm.value.password,
  })
    .then(response => {
      if (response?.data?.error) {
        submitError.value = response.data.message;
      }
      isSubmitting.value = false;
    })
}
</script>

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
  background-color: #fde68a;
}

button {
  margin-top: 0.5rem;
  padding: 0.9rem 1rem;
  border-radius: 10px;
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

.form-error {
  color: #b91c1c;
  font-size: 0.9rem;
}
</style>
