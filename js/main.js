'use strict';

// Обрабатываются только модальное окно и учебные формы. Данные не отправляются.
const orderDialog = document.getElementById('order-dialog');
const successMessage = document.getElementById('success-message');
let dialogTrigger = null;

function setProduct(form, product) {
  const select = form.elements.namedItem('product');
  const hidden = form.elements.namedItem('selected-product');
  if (!select || !hidden) return;
  if (Array.from(select.options).some((option) => option.value === product)) {
    select.value = product;
    hidden.value = product;
  }
}

if (orderDialog) {
  document.querySelectorAll('[data-product]').forEach((button) => {
    button.addEventListener('click', () => {
      dialogTrigger = button;
      setProduct(orderDialog.querySelector('form'), button.dataset.product);
      successMessage.hidden = true;
      orderDialog.showModal();
    });
  });

  orderDialog.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => orderDialog.close());
  });

  // Escape и удержание фокуса внутри окна обеспечивает нативный dialog.
  orderDialog.addEventListener('close', () => {
    if (dialogTrigger) dialogTrigger.focus();
  });
}

function errorText(field) {
  if (field.validity.valueMissing) {
    if (field.type === 'checkbox') return 'Подтвердите согласие для демонстрации отправки.';
    if (field.tagName === 'SELECT') return 'Выберите товар или консультацию.';
    return 'Заполните это поле.';
  }
  if (field.validity.typeMismatch) return 'Введите адрес вида name@example.com.';
  if (field.validity.patternMismatch) return 'Используйте формат +7 (900) 000-00-00.';
  if (field.validity.tooShort) return 'Введите не менее двух символов.';
  return 'Проверьте значение поля.';
}

function clearError(field) {
  field.removeAttribute('aria-invalid');
  const error = document.getElementById(`${field.id}-error`);
  if (error) error.textContent = '';
}

document.querySelectorAll('.order-form').forEach((form) => {
  const summary = form.querySelector('.order-form__summary');
  const fields = Array.from(form.elements).filter((field) => field.willValidate);
  const product = form.elements.namedItem('product');
  product.addEventListener('change', () => {
    form.elements.namedItem('selected-product').value = product.value;
  });

  fields.forEach((field) => {
    field.addEventListener('input', () => clearError(field));
    field.addEventListener('change', () => clearError(field));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    fields.forEach(clearError);
    summary.hidden = true;
    const name = form.elements.namedItem('name');
    name.value = name.value.trim();
    name.setCustomValidity(name.value.length > 0 && name.value.length < 2 ? 'Введите не менее двух символов.' : '');

    const invalidFields = fields.filter((field) => !field.checkValidity());
    if (invalidFields.length) {
      invalidFields.forEach((field) => {
        field.setAttribute('aria-invalid', 'true');
        const error = document.getElementById(`${field.id}-error`);
        if (error) error.textContent = field.validity.customError ? field.validationMessage : errorText(field);
      });
      summary.textContent = `Проверьте отмеченные поля: ${invalidFields.length}. Заявка не отправлена.`;
      summary.hidden = false;
      invalidFields[0].focus();
      return;
    }

    form.reset();
    fields.forEach(clearError);
    name.setCustomValidity('');
    if (orderDialog && orderDialog.open) orderDialog.close();
    successMessage.hidden = false;
    successMessage.focus();
  });

  // Прямая ссылка с карточки заполняет выбор в полной форме.
  if (form.id === 'order-form') {
    setProduct(form, new URLSearchParams(window.location.search).get('product'));
  }
});
