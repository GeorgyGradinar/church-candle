export default function validation() {

  function mapErrors(errors) {
    return errors.map(e => {
      switch (e.$validator) {
        case 'required':
          return 'Обязательное поле';
        case 'email':
          return 'Некорректный E-mail';
        case 'minLength':
          return 'Пароль должен содержать не менее 8 символов';
        case 'minLengthTwo':
          return 'Имя должно содержать не менее 2 символов';
        case 'minLengthThree':
          return 'Имя должно содержать не менее 3 символов';
        case 'minLengthFiled':
          return 'Поле должно содержать не менее 3 символов';
        case 'minValue':
          return 'Минимальная сумма 10 рублей';
        case 'sameAs':
          return 'Пароли должны совпадать';
        case 'maxLength':
          return 'Текст должен содержать максимум 2000 символов';
        case 'serverValidation':
          return e.$message;
        default:
          return 'Что-то не так';
      }
    });
  }

  return {mapErrors};
}