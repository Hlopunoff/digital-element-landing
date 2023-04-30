import { EmptyFieldError, InvalidEmailError } from './customErrors';

export const modal = () => {
  const openModalBtn = document.querySelector('.cta__btn');
  const closeModalBtn = document.querySelector('.form__close');
  const submitBtn = document.querySelector('.form__submit');
  const documentBody = document.querySelector('body');
  const modalWrap = document.querySelector('.modal');
  const modalForm = document.querySelector('.form');

  // Показ/скрытие модального окна
  const toggleModal = () => {
    documentBody.classList.toggle('scroll_disabled');
    modalWrap.classList.toggle('modal_shown');
  };

  // Обработчик события на фоновую тень
  const handleModalWrapClick = (currentTarget, target) => {
    if (currentTarget === target) {
      toggleModal();
    }
  };

  // Обработчик события на кнопку Let's talk
  openModalBtn.addEventListener('click', () => {
    toggleModal();
  });

  // Обработчик события на крестик
  closeModalBtn.addEventListener('click', () => {
    toggleModal();
  });

  modalWrap.addEventListener('click', ({ currentTarget, target }) => {
    handleModalWrapClick(currentTarget, target);
  });

  // Создание оповещения об ошибке при заполнении формы
  const createErrorBlock = (message, target) => {
    const errorField = target === 'name' || target === 'email' ? 
      document.querySelector(`.form__input[name=${target}]`).parentElement : 
      document.querySelector('.form__message').parentElement;

    const errorMessage = document.createElement('span');
    errorMessage.textContent = message;
    errorMessage.classList.add('form__input_error');

    errorField.appendChild(errorMessage);
  };

  // Удаление оповещения об ошибке при заполнении формы
  const removeErrorBlock = (target) => {
    const errorField = target === 'name' || target === 'email' ? 
      document.querySelector(`.form__input[name=${target}]`).parentElement : 
      document.querySelector('.form__message').parentElement;

    if (errorField.lastChild.classList?.contains('form__input_error')) {
      errorField.lastChild.remove();
    }
  };

  // Проверка на пустоту полей ввода формы
  const checkInputFieldEmpty = (data) => {
    try {
      for (const [name, value] of data) {
        if (value.length === 0) {
          throw new EmptyFieldError('This field must not be empty!', name);
        }
      }

      return true;
    } catch (error) {
      switch (error.property) {
        case 'name':
          createErrorBlock(error.message, 'name');
          break;
        case 'email':
          removeErrorBlock('name');
          createErrorBlock(error.message, 'email');
          break;
        case 'message':
          removeErrorBlock('email');
          createErrorBlock(error.message, 'message');
          break;
        default:
          break;
      }
    }
  };

  // Проверка на корректность введенной почты
  const isEmailCorrect = () => {
    try {
      const pattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

      if (!document.querySelector('.form__input[name=email]').value.match(pattern)) {
        throw new InvalidEmailError('Incorrect type of an email!', 'email');
      }

      return true;
    } catch (error) {
      if (error instanceof InvalidEmailError) {
        createErrorBlock(error.message, error.property);
      }
    }
  };

  // Создание pop up
  const showPopup = (status) => {
    const popup = document.createElement('span');
    if (status === 'error') {
      popup.classList.add('popup', 'popup_error');
      popup.textContent = 'Something went wrong!\nTry again later.';
    } else {
      popup.classList.add('popup', 'popup_success');
      popup.textContent = 'Your message successfully sent';
    }

    documentBody.appendChild(popup);

    setTimeout(() => {
      documentBody.removeChild(popup);
    }, 3000);
  }

  const validateForm = (data) => {
    if (checkInputFieldEmpty(data) && isEmailCorrect()) {
      return true;
    }

    return false;
  };

  // Конвертация объекта formData в JSON, для того чтобы запрос на сервер прошел успешно
  const convertToJSON = (formData) => {
    const result = {};

    for (const [name, value] of formData) {
      result[name] = value;
    }

    return JSON.stringify(result);
  };

  // Очистка полей формы
  const clearAllFields = () => {
    const inputs = document.querySelectorAll('.form__input');
    const textarea = document.querySelector('.form__message');

    inputs.forEach(field => {
      field.value = '';
      removeErrorBlock(field.getAttribute('name'));
    });
    textarea.value = '';
    removeErrorBlock(textarea.getAttribute('name'));
  };

  // Отправка формы
  const submitModal = async (e) => {
    try {
      e.stopPropagation();
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Loading...';
      const formData = new FormData(modalForm);

      if (validateForm(formData)) {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json; charset-UTF-8'
          },
          body: {
            title: 'Fake request',
            userId: 1,
            body: convertToJSON(formData)
          }
        });

        if(!response.ok) {
          throw new Error('Something went wrong');
        }

        toggleModal();
        showPopup('success');
        clearAllFields();
      }
    } catch (error) {
      toggleModal();
      showPopup('error');
      clearAllFields();
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  };

  // Обработчик события на отправку формы
  modalForm.addEventListener('submit', (e) => {
    submitModal(e);
  });
};
