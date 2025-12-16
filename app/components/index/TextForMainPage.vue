<script setup lang="ts">

</script>

<template>
  <div class="content-text">
    <div>
      <h2> О сайте</h2>
      <p> Этот сайт создан как спокойное и удобное пространство для тех, кто ищет молитву, духовную поддержку и
        информацию о
        православной традиции. Здесь можно поставить свечу в молитвенном намерении, найти молитвы на разные случаи
        жизни,
        а также узнать о церковных праздниках и памятных днях по православному календарю.</p>

      <p> Проект ориентирован на простоту и доступность. Он подойдёт как людям, которые регулярно обращаются к молитве,
        так
        и тем, кто делает это время от времени — в важные, трудные или памятные моменты жизни. Все материалы собраны в
        одном месте и поданы без лишней сложности и навязчивых формулировок.</p>

    </div>

    <div>
      <h2>Свеча как знак молитвы и памяти</h2>

      <p> Свеча в православной традиции — это видимый знак молитвы, памяти и внутреннего обращения. Она может быть
        поставлена за здравие живых, за упокой усопших, в благодарность или с личным прошением. Для многих людей свеча
        является важной частью молитвенного настроя и духовного сосредоточения.</p>

      <p>На сайте можно поставить свечу онлайн в тех случаях, когда нет возможности посетить храм лично. Такой жест не
        заменяет церковную молитву и участие в богослужении, но может стать напоминанием о молитве, знаком памяти и
        внутреннего внимания к духовной стороне жизни.</p>
      <p>Онлайн-свеча помогает сохранить связь с молитвенной традицией независимо от времени и места, оставаясь при этом
        уважительным и осознанным действием.</p>
    </div>

    <div>
      <h2> Молитвы на разные случаи жизни</h2>

      <p> В разделе молитв собраны тексты, которые чаще всего используются в повседневной духовной жизни. Здесь можно
        найти
        молитвы за здравие, молитвы за упокой, молитвы о помощи, утешении, укреплении в трудных обстоятельствах, а также
        краткие молитвенные обращения.</p>

      <p>Все молитвы представлены в удобном формате, чтобы можно было быстро найти нужный текст и сосредоточиться на
        молитве, не отвлекаясь на поиск. Раздел подходит как для личной молитвы, так и для семейного чтения.</p>


      <p>Молитвы могут быть использованы в любое время дня, в спокойной обстановке или в моменты, когда особенно важно
        найти слова для внутреннего обращения и поддержки.</p>
    </div>

    <div>
      <h2>Церковные праздники и календарь</h2>

      <p>Православный календарь помогает ориентироваться в церковном годе и его событиях. На сайте представлена
        информация
        о главных православных праздниках, днях памяти святых, постах и памятных датах.</p>

      <p>Календарь позволяет узнать, какой сегодня церковный день, какое событие вспоминается и какое значение оно имеет
        в
        православной традиции. Это удобно как для тех, кто только начинает знакомство с церковной жизнью, так и для тех,
        кто хочет глубже понимать ритм православного года.</p>

      <p> Информация подаётся в сдержанном и понятном виде, без излишних подробностей, но с сохранением смысла и
        традиционного содержания.</p>
    </div>

    <div>
      <h2>Как можно использовать сайт</h2>

      <p>Православный сайт будет полезен:</p>
      <ul>
        <li>тем, кто ищет молитвы за здравие и за упокой</li>
        <li>тем, кто хочет поставить свечу онлайн</li>
        <li>тем, кто интересуется православными праздниками и календарём</li>
        <li>тем, кто ищет спокойный духовный ресурс без навязчивых призывов</li>
      </ul>

      <p>Сайт подходит для ежедневного использования и для редких обращений — в памятные, сложные или важные моменты жизни.</p>
    </div>

    <div>
      <h2>Уважительное отношение к традиции</h2>

      <p> Все материалы на сайте созданы с уважением к православной традиции. Здесь нет навязчивых призывов, громких
        обещаний или упрощённого отношения к вере. Цель проекта — дать возможность спокойно обратиться к молитве, памяти
        и
        духовному смыслу, не заменяя при этом церковную жизнь и участие в таинствах.</p>

    </div>
  </div>
</template>

<style scoped lang="scss">
// Переменные
$color-text-primary: #334155;
$color-text-secondary: #475569;
$color-heading-primary: #0f172a;
$color-heading-secondary: #1e293b;
$color-link: #0ea5e9;
$color-link-hover: #0284c7;
$color-marker: #0ea5e9;
$color-marker-nested: #64748b;
$color-quote-text: #64748b;
$color-quote-border: #cbd5e1;
$color-quote-bg: #f8fafc;

$line-height-base: 1.85;
$line-height-heading: 1.3;
$line-height-heading-h3: 1.4;

$font-size-base: 1.0625rem;
$font-size-h2: 1.75rem;
$font-size-h3: 1.5rem;
$font-size-marker: 1.5rem;
$font-size-marker-nested: 1.25rem;

$spacing-paragraph: 1.75rem;
$spacing-list: 2rem;
$spacing-list-item: 1rem;
$spacing-h2-top: 3rem;
$spacing-h2-bottom: 1.5rem;
$spacing-h3-top: 2.5rem;
$spacing-h3-bottom: 1.25rem;
$spacing-quote: 2.5rem;

.content-text {
  max-width: 1200px;
  color: $color-text-primary;
  line-height: $line-height-base;
  font-size: $font-size-base;

  h2 {
    font-size: $font-size-h2;
    font-weight: 600;
    color: $color-heading-primary;
    margin-top: $spacing-h2-top;
    margin-bottom: $spacing-h2-bottom;
    padding-top: 1rem;
    line-height: $line-height-heading;
  }

  h3 {
    font-size: $font-size-h3;
    font-weight: 600;
    color: $color-heading-secondary;
    margin-top: $spacing-h3-top;
    margin-bottom: $spacing-h3-bottom;
    padding-top: 0.75rem;
    line-height: $line-height-heading-h3;
  }

  p {
    margin-bottom: $spacing-paragraph;
    color: $color-text-secondary;
    line-height: $line-height-base;

    &:last-child {
      margin-bottom: 0;
    }
  }

  // Стилизация списков
  ul,
  ol {
    margin: $spacing-list 0;
    padding-left: 0;
    color: $color-text-secondary;
    list-style: none;
  }

  ul {
    position: relative;

    li {
      position: relative;
      padding-left: 2rem;
      margin-bottom: $spacing-list-item;
      line-height: $line-height-base;

      &::before {
        content: '•';
        position: absolute;
        left: 0.5rem;
        color: $color-marker;
        font-size: $font-size-marker;
        font-weight: bold;
        line-height: 1.2;
      }
    }

    // Вложенные списки
    ul,
    ol {
      margin-top: 0.75rem;
      margin-bottom: 0.75rem;
      margin-left: 1rem;

      li::before {
        content: '◦';
        color: $color-marker-nested;
        font-size: $font-size-marker-nested;
      }
    }
  }

  ol {
    counter-reset: list-counter;
    padding-left: 0;

    li {
      position: relative;
      padding-left: 2.5rem;
      margin-bottom: $spacing-list-item;
      line-height: $line-height-base;
      counter-increment: list-counter;

      &::before {
        content: counter(list-counter) '.';
        position: absolute;
        left: 0.5rem;
        color: $color-marker;
        font-weight: 600;
        font-size: 1rem;
        min-width: 1.5rem;
      }
    }

    // Вложенные списки
    ol,
    ul {
      margin-top: 0.75rem;
      margin-bottom: 0.75rem;
      margin-left: 1rem;
    }
  }

  li:last-child {
    margin-bottom: 0;
  }

  strong {
    font-weight: 600;
    color: $color-heading-secondary;
  }

  em {
    font-style: italic;
    color: $color-text-secondary;
  }

  a {
    color: $color-link;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.2s ease;

    &:hover {
      color: $color-link-hover;
    }
  }

  blockquote {
    margin: $spacing-quote 0;
    padding: 1.5rem 1.5rem 1.5rem 2rem;
    border-left: 4px solid $color-quote-border;
    background-color: $color-quote-bg;
    border-radius: 0 8px 8px 0;
    color: $color-quote-text;
    font-style: italic;
    line-height: 1.75;
  }

  // Адаптивность
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2.5rem;
    padding: 1.5rem 0;

    h2 {
      font-size: 1.5rem;
      margin-top: 2.5rem;
      margin-bottom: 1.25rem;
    }

    h3 {
      font-size: 1.25rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    p {
      margin-bottom: 1.5rem;
    }

    ul,
    ol {
      margin: 1.5rem 0;

      li {
        padding-left: 1.75rem;
        margin-bottom: 0.875rem;
      }
    }

    blockquote {
      margin: 2rem 0;
      padding: 1.25rem 1.25rem 1.25rem 1.5rem;
    }
  }
}
</style>