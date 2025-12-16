<template>
  <section class="page-shell">
    <header>
      <h1>Регистрация</h1>
      <p>Заполните форму, чтобы сохранять историю записок и пожертвований.</p>
    </header>

    <form class="form-card" @submit.prevent="handleSubmit" novalidate>
      <p v-if="submitError" class="form-error">{{ submitError }}</p>

      <AuthorizationInput
        v-model:data="registrationForm.name"
        title="Имя"
        placeholder="Введите имя"
        :validation="vRegistration$.name"
        :type="'text'"
        :error="mapErrors(vRegistration$.name.$errors)[0]"
      />

      <AuthorizationInput
        v-model:data="registrationForm.email"
        title="Электронная почта"
        placeholder="Введите e-mail"
        :validation="vRegistration$.email"
        :type="'email'"
        :error="mapErrors(vRegistration$.email.$errors)[0]"
      />

      <AuthorizationInput
        v-model:data="registrationForm.password"
        title="Пароль"
        placeholder="Введите пароль"
        :validation="vRegistration$.password"
        :type="'password'"
        :error="mapErrors(vRegistration$.password.$errors)[0]"
      />

      <AuthorizationInput
        v-model:data="registrationForm.password_confirmation"
        :title="'Повторите пароль'"
        :placeholder="'Повторите пароль'"
        :validation="vRegistration$.password_confirmation"
        :type="'password'"
        :error="mapErrors(vRegistration$.password_confirmation.$errors)[0]" />
      <button type="submit">Регистрация
      </button>
      <p class="hint">
        Уже есть аккаунт?
        <NuxtLink to="/login">Войти</NuxtLink>
      </p>
    </form>
  </section>
</template>

<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import {email, minLength, required, sameAs} from "@vuelidate/validators";
import {computed, ref} from "vue";
import AuthorizationInput from "~/components/auth/AuthorizationInput.vue";
import authRequests from "~/mixins/requests/auth";
import validation from "~/mixins/validation.js";

const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL || '';

useHead({
  title: 'Регистрация',
  meta: [
    {
      name: 'description',
      content: 'Заполните форму регистрации, чтобы сохранять историю записок и пожертвований. Создайте аккаунт для удобного управления вашими молитвенными просьбами.'
    },
    {
      name: 'robots',
      content: 'noindex, nofollow'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Регистрация - Дом свечи'
    },
    {
      property: 'og:description',
      content: 'Заполните форму регистрации, чтобы сохранять историю записок и пожертвований.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: `${siteUrl}/register`
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${siteUrl}/register`
    }
  ]
});

const {mapErrors} = validation();
const {registration} = authRequests();

const registrationForm = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const emailRef = computed(() => registrationForm.value.password);
const rulesRegistration = {
  name: {required, minLengthTwo: minLength(2)},
  email: {required, email},
  password: {required, minLength: minLength(8)},
  password_confirmation: {required, sameAs: sameAs(emailRef)}
};

const vRegistration$ = useVuelidate(rulesRegistration, registrationForm.value);

let submitError = ref(null);

function handleSubmit() {
  vRegistration$.value.$validate();
  if (!vRegistration$.value.$error) {
    registration(registrationForm.value)
      .then(response => {
        if (response?.data?.error) {
          submitError.value = response.data.message;
        }
        isSubmitting.value = false;
      })
  }


};
</script>


<style scoped>
.page-shell {
  max-width: 560px;
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
  border-radius: 999px;
  border: none;
  background: #16a34a;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

button:hover {
  background: #15803d;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.hint {
  font-size: 0.9rem;
  text-align: center;
  color: #475569;
}

.hint a {
  color: #15803d;
}

.form-error {
  background: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
</style>
