<template>
  <section class="page-shell">
    <header class="page-header">
      <p class="eyebrow">Церковный календарь</p>
      <h1>Православный календарь</h1>
      <p class="description">
        Праздники, дни памяти святых и другие значимые события церковного года
      </p>
    </header>

    <!-- Переключатель вида -->
    <div class="view-switcher">
      <button
        @click="viewMode = 'calendar'"
        :class="['view-btn', { active: viewMode === 'calendar' }]"
      >
        📅 Календарь
      </button>
      <button
        @click="viewMode = 'list'"
        :class="['view-btn', { active: viewMode === 'list' }]"
      >
        📋 Список
      </button>
    </div>

    <!-- Фильтры -->
    <CalendarFilters
      v-model:selected-category="selectedCategory"
    />

    <!-- Вид календарем -->
    <div v-if="viewMode === 'calendar'" class="calendar-view">
      <MonthNavigation
        :month-name="currentMonthName"
        :year="currentYear"
        @previous="previousMonth"
        @next="nextMonth"
        @today="goToToday"
      />

      <CalendarGrid
        :calendar-days="calendarDays"
        :selected-date="selectedDate"
        @select-date="selectDate"
      />
    </div>

    <!-- Вид списком -->
    <EventsList
      v-if="viewMode === 'list'"
      :events="filteredListEvents"
      v-model:selected-month="selectedMonth"
      @select-event="selectEvent"
    />

    <!-- Модальное окно с деталями -->
    <DayDetailsModal
      :show="showModal"
      :selected-date="selectedDate"
      :events="selectedDateEvents"
      @close="closeModal"
      @light-candle="lightCandle"
    />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  monthNames,
  getEventsByDate,
  getEventsByMonth,
} from '~/configs/orthodoxCalendarData.js';
import CalendarFilters from '~/components/calendar/CalendarFilters.vue';
import MonthNavigation from '~/components/calendar/MonthNavigation.vue';
import CalendarGrid from '~/components/calendar/CalendarGrid.vue';
import EventsList from '~/components/calendar/EventsList.vue';
import DayDetailsModal from '~/components/calendar/DayDetailsModal.vue';

// SEO - получаем URL сайта из переменных окружения
const config = useRuntimeConfig();
const siteUrl = config.public.SITE_URL;

useHead({
  title: 'Православный календарь 2024-2025 - Церковные праздники и дни памяти святых',
  meta: [
    {
      name: 'description',
      content: 'Православный церковный календарь на весь год с двунадесятыми праздниками, днями памяти святых, постами и важными датами. Узнайте о церковных праздниках и святых каждого дня.'
    },
    {
      name: 'keywords',
      content: 'православный календарь, церковный календарь, праздники, святые, двунадесятые праздники, посты, дни памяти святых, православие, церковные даты'
    },
    // Open Graph
    {
      property: 'og:title',
      content: 'Православный календарь - Церковные праздники и святые'
    },
    {
      property: 'og:description',
      content: 'Полный православный календарь с праздниками, днями памяти святых и важными датами церковного года'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: `${siteUrl}/calendar`
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
      content: 'Православный календарь - Церковные праздники и святые'
    },
    {
      name: 'twitter:description',
      content: 'Полный православный календарь с праздниками, днями памяти святых и важными датами церковного года'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${siteUrl}/calendar`
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Православный календарь',
        description: 'Православный церковный календарь с праздниками и днями памяти святых',
        url: `${siteUrl}/calendar`,
        inLanguage: 'ru-RU',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Дом свечи',
          url: siteUrl
        },
        about: {
          '@type': 'Thing',
          name: 'Православие',
          description: 'Православные праздники, святые и церковный календарь'
        },
        keywords: 'православный календарь, церковные праздники, святые, двунадесятые праздники, посты'
      })
    }
  ]
});

const router = useRouter();

// Состояние компонента
const viewMode = ref<'calendar' | 'list'>('calendar');
const selectedCategory = ref<string | null>(null);
const currentMonth = ref(new Date().getMonth() + 1); // 1-12
const currentYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedDate = ref<any>(null);
const showModal = ref(false);

// Текущая дата
const today = new Date();
const todayYear = today.getFullYear();
const todayMonth = today.getMonth() + 1;
const todayDay = today.getDate();

// Вычисляемые свойства
const currentMonthName = computed(() => monthNames[currentMonth.value - 1] || '');

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  
  const days: any[] = [];
  
  // Функция для фильтрации событий по категории
  const filterEvents = (events: any[]) => {
    if (!selectedCategory.value) return events;
    return events.filter(e => e.type === selectedCategory.value);
  };
  
  // Дни предыдущего месяца
  const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    days.push({
      day,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isToday: false,
      events: filterEvents(getEventsByDate(prevMonth, day))
    });
  }
  
  // Дни текущего месяца
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = year === todayYear && month === todayMonth && day === todayDay;
    days.push({
      day,
      month,
      year,
      isCurrentMonth: true,
      isToday,
      events: filterEvents(getEventsByDate(month, day))
    });
  }
  
  // Дни следующего месяца
  const remainingDays = 42 - days.length; // 6 недель x 7 дней
  for (let day = 1; day <= remainingDays; day++) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    days.push({
      day,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      isToday: false,
      events: filterEvents(getEventsByDate(nextMonth, day))
    });
  }
  
  return days;
});

const filteredListEvents = computed(() => {
  let events = getEventsByMonth(selectedMonth.value);
  
  // Фильтр по категории
  if (selectedCategory.value) {
    events = events.filter(e => e.type === selectedCategory.value);
  }
  
  // Сортировка по дате
  return events.sort((a, b) => a.day - b.day);
});

const selectedDateEvents = computed(() => {
  if (!selectedDate.value) return [];
  return selectedDate.value.events || [];
});

// Методы навигации
function previousMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function goToToday() {
  currentMonth.value = todayMonth;
  currentYear.value = todayYear;
}

// Методы выбора даты/события
function selectDate(day: any) {
  selectedDate.value = day;
  showModal.value = true;
}

function selectEvent(event: any) {
  const day = {
    day: event.day,
    month: event.month,
    year: currentYear.value,
    events: [event]
  };
  selectedDate.value = day;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  setTimeout(() => {
    selectedDate.value = null;
  }, 300);
}

function lightCandle(event: any) {
  // Редирект на страницу постановки свечи
  const candleType = event.type === 'saint' ? 'living' : 'living';
  router.push({
    path: `/${candleType}`,
    query: {
      saint: event.title,
      date: `${event.day}.${event.month}`
    }
  });
}
</script>

<style scoped lang="scss">
.page-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

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

.view-switcher {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;

  .view-btn {
    padding: 0.75rem 1.5rem;
    border: 1px solid #cbd5f5;
    border-radius: 12px;
    background: #fff;
    color: #475569;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;

    &:hover {
      border-color: #0ea5e9;
      color: #0ea5e9;
    }

    &.active {
      background: #0ea5e9;
      border-color: #0ea5e9;
      color: #fff;
    }
  }
}

@media (max-width: 768px) {
  .page-shell {
    padding: 2rem 1rem 3rem;
  }

  .page-header {
    h1 {
      font-size: 1.75rem;
    }
  }

  .view-switcher .view-btn {
    font-size: 0.9rem;
    padding: 0.65rem 1.25rem;
  }
}
</style>
