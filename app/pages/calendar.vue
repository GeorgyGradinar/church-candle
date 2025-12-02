<template>
  <section class="page-shell">
    <CalendarHeader />

    <!-- Переключатель вида -->
    <ViewSwitcher
      :view-mode="viewMode"
      @update:view-mode="switchView"
    />

    <!-- Фильтры -->
    <CalendarFilters
      v-model:selected-category="selectedCategory"
    />

    <!-- Вид календарем -->
    <div v-if="viewMode === 'calendar'" class="calendar-view">
      <MonthNavigation
        :month-name="currentMonthName"
        :year="currentYear"
        :month="currentMonth"
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
      :selected-month="selectedMonth"
      :selected-year="selectedYear"
      @update:selected-month="updateSelectedMonth"
      @update:selected-year="updateSelectedYear"
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
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  monthNames,
  getEventsByDate,
  getEventsByMonth,
} from '~/configs/orthodoxCalendarData.js';
import CalendarHeader from '~/components/calendar/CalendarHeader.vue';
import CalendarFilters from '~/components/calendar/CalendarFilters.vue';
import MonthNavigation from '~/components/calendar/MonthNavigation.vue';
import CalendarGrid from '~/components/calendar/CalendarGrid.vue';
import EventsList from '~/components/calendar/EventsList.vue';
import DayDetailsModal from '~/components/calendar/DayDetailsModal.vue';
import ViewSwitcher from '~/components/calendar/ViewSwitcher.vue';

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
const route = useRoute();

// Состояние компонента
const viewMode = ref<'calendar' | 'list'>('calendar');
const selectedCategory = ref<string | null>(null);
const currentMonth = ref(new Date().getMonth() + 1); // 1-12
const currentYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);
const selectedYear = ref(new Date().getFullYear()); // Для режима списка
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
  // Преобразуем getDay() для недели, начинающейся с понедельника
  // 0 (Вс) -> 6, 1 (Пн) -> 0, 2 (Вт) -> 1, и т.д.
  const startDayOfWeek = (firstDay.getDay() + 6) % 7;
  
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

// Переключение вида отображения
function switchView(view: 'calendar' | 'list') {
  viewMode.value = view;
  
  // Обновляем URL
  const query: any = {
    view
  };
  
  // Убираем date если модалка закрыта
  if (route.query.date && showModal.value) {
    query.date = route.query.date;
  }
  
  // В режиме календаря добавляем год и месяц
  if (view === 'calendar') {
    query.year = currentYear.value;
    query.month = currentMonth.value;
  }
  
  // В режиме списка добавляем месяц и год
  if (view === 'list') {
    query.month = selectedMonth.value;
    query.year = selectedYear.value;
  }
  
  router.push({ query });
}

// Обновление выбранного месяца в списке
function updateSelectedMonth(month: number) {
  selectedMonth.value = month;
  
  // Обновляем URL
  if (viewMode.value === 'list') {
    router.push({
      query: {
        ...route.query,
        month,
        year: selectedYear.value
      }
    });
  }
}

// Обновление выбранного года в списке
function updateSelectedYear(year: number) {
  selectedYear.value = year;
  
  // Обновляем URL
  if (viewMode.value === 'list') {
    router.push({
      query: {
        ...route.query,
        month: selectedMonth.value,
        year
      }
    });
  }
}

// Методы навигации
function previousMonth() {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
  
  // Обновляем URL
  updateCalendarUrl();
}

function nextMonth() {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
  
  // Обновляем URL
  updateCalendarUrl();
}

function goToToday() {
  currentMonth.value = todayMonth;
  currentYear.value = todayYear;
  
  // Обновляем URL
  updateCalendarUrl();
}

// Обновление URL для режима календаря
function updateCalendarUrl() {
  if (viewMode.value === 'calendar') {
    router.push({
      query: {
        ...route.query,
        view: 'calendar',
        year: currentYear.value,
        month: currentMonth.value
      }
    });
  }
}

// Методы выбора даты/события
function selectDate(day: any) {
  selectedDate.value = day;
  showModal.value = true;
  
  // Добавляем параметр в URL
  const dateString = `${day.year}-${String(day.month).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
  router.push({
    query: {
      ...route.query,
      date: dateString
    }
  });
}

function selectEvent(event: any) {
  // В режиме списка используем selectedYear
  const yearToUse = viewMode.value === 'list' ? selectedYear.value : currentYear.value;
  
  const day = {
    day: event.day,
    month: event.month,
    year: yearToUse,
    events: [event]
  };
  selectedDate.value = day;
  showModal.value = true;
  
  // Добавляем параметр в URL
  const dateString = `${yearToUse}-${String(event.month).padStart(2, '0')}-${String(event.day).padStart(2, '0')}`;
  router.push({
    query: {
      ...route.query,
      date: dateString
    }
  });
}

function closeModal() {
  showModal.value = false;
  
  // Убираем параметр из URL
  const query = { ...route.query };
  delete query.date;
  router.push({ query });
  
  // Не сбрасываем selectedDate, чтобы дата оставалась подсвеченной
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

// Проверяем URL при загрузке страницы
onMounted(() => {
  // Восстанавливаем тип отображения из URL
  const viewParam = route.query.view as string;
  if (viewParam === 'list' || viewParam === 'calendar') {
    viewMode.value = viewParam;
  }
  
  // Восстанавливаем год и месяц для режима календаря
  if (viewMode.value === 'calendar') {
    const yearParam = route.query.year as string;
    const monthParam = route.query.month as string;
    
    if (yearParam) {
      const year = parseInt(yearParam);
      if (year >= 1900 && year <= 2100) {
        currentYear.value = year;
      }
    }
    
    if (monthParam) {
      const month = parseInt(monthParam);
      if (month >= 1 && month <= 12) {
        currentMonth.value = month;
      }
    }
  }
  
  // Восстанавливаем месяц и год для режима списка
  if (viewMode.value === 'list') {
    const yearParam = route.query.year as string;
    const monthParam = route.query.month as string;
    
    if (yearParam) {
      const year = parseInt(yearParam);
      const currentYear = new Date().getFullYear();
      // Разрешаем только текущий и будущие годы (до +10 лет)
      if (year >= currentYear && year <= currentYear + 10) {
        selectedYear.value = year;
      }
    }
    
    if (monthParam) {
      const month = parseInt(monthParam);
      if (month >= 1 && month <= 12) {
        selectedMonth.value = month;
      }
    }
  }
  
  // Восстанавливаем дату из URL
  const dateParam = route.query.date as string;
  if (dateParam) {
    // Парсим дату из URL формата YYYY-MM-DD
    const [year, month, day] = dateParam.split('-').map(Number);
    
    if (year && month && day) {
      // Устанавливаем текущий месяц и год
      currentYear.value = year;
      currentMonth.value = month;
      
      // Если в режиме списка, обновляем selectedMonth
      if (viewMode.value === 'list') {
        selectedMonth.value = month;
      }
      
      // Получаем события для этой даты
      const events = getEventsByDate(month, day);
      
      // Создаем объект дня и открываем модальное окно
      const dateObj = {
        day,
        month,
        year,
        isCurrentMonth: true,
        isToday: false,
        events
      };
      
      selectedDate.value = dateObj;
      showModal.value = true;
    }
  }
});
</script>

<style scoped lang="scss">
.page-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

@media (max-width: 1024px) {
  .page-shell {
    padding: 2.5rem 1rem 3.5rem;
  }
}

@media (max-width: 768px) {
  .page-shell {
    padding: 2rem 0.75rem 3rem;
  }
}

@media (max-width: 480px) {
  .page-shell {
    padding: 1.5rem 0.5rem 2.5rem;
  }

  .page-header {
    h1 {
      font-size: 1.5rem;
    }
  }
}
</style>
