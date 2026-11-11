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

/* ===== Практические занятия №15–16: данные каталога и функции обработки ===== */

// №15: форматирование цены, скидка, статус, краткое описание
function formatPrice(price) {
  return `${price} руб.`;
}

function calculateDiscount(price, discountPercent) {
  return price * discountPercent / 100;
}

function calculateFinalPrice(price, discountPercent) {
  const discountValue = calculateDiscount(price, discountPercent);
  return price - discountValue;
}

function getProductStatus(item) {
  if (item.isAvailable) {
    return 'В наличии';
  }
  return 'Нет в наличии';
}

function createProductSummary(item) {
  const finalPrice = calculateFinalPrice(item.price, item.discountPercent);
  const status = getProductStatus(item);
  return `${item.title}: ${formatPrice(finalPrice)}. Статус: ${status}.`;
}

// №16: работа с массивом товаров (map, filter, find, sort, reduce)
function getProductTitles(list) {
  return list.map((item) => item.title);
}

function getAvailableProducts(list) {
  return list.filter((item) => item.isAvailable);
}

function searchProducts(list, query) {
  const normalizedQuery = String(query).trim().toLowerCase();
  if (normalizedQuery === '') {
    return list;
  }
  return list.filter((item) => item.title.toLowerCase().includes(normalizedQuery));
}

function filterProductsByCategory(list, category) {
  if (category === 'all') {
    return list;
  }
  return list.filter((item) => item.category === category);
}

function sortProductsByPrice(list, direction = 'asc') {
  const listCopy = [...list];
  if (direction === 'desc') {
    return listCopy.sort((a, b) => b.price - a.price);
  }
  return listCopy.sort((a, b) => a.price - b.price);
}

function findProductById(list, id) {
  return list.find((item) => item.id === id);
}

function calculateTotalPrice(list) {
  return list.reduce((sum, item) => sum + item.price, 0);
}

function countAvailableProducts(list) {
  return list.filter((item) => item.isAvailable).length;
}

function calculateAveragePrice(list) {
  if (list.length === 0) {
    return 0;
  }
  return Math.round(calculateTotalPrice(list) / list.length);
}

function getPreparedProducts(list, query, category, sortDirection) {
  let result = [...list];
  result = searchProducts(result, query);
  result = filterProductsByCategory(result, category);
  result = sortProductsByPrice(result, sortDirection);
  return result;
}

// Короткие псевдонимы (те же функции под другими именами)
const getProductNames = getProductTitles;
const filterByCategory = filterProductsByCategory;
const sortByPrice = sortProductsByPrice;
const prepareProducts = getPreparedProducts;

// Вывод в консоль и на страницу. Если data.js не подключён, блок пропускается.
if (typeof products !== 'undefined' && Array.isArray(products)) {
  console.log('Файл main.js подключён');

  console.group('Практическое занятие №15: один товар');
  if (typeof product !== 'undefined') {
    console.table(product);
    console.log('Цена:', formatPrice(product.price));
    console.log('Размер скидки:', calculateDiscount(product.price, product.discountPercent));
    console.log('Итоговая цена:', calculateFinalPrice(product.price, product.discountPercent));
    console.log('Статус:', getProductStatus(product));
    console.log('Описание:', createProductSummary(product));
  }
  console.groupEnd();

  console.group('Практическое занятие №16: массив товаров');
  console.log('Все товары:');
  console.table(products);
  console.log('Названия товаров:', getProductTitles(products));
  console.log('Товары в наличии:');
  console.table(getAvailableProducts(products));
  console.log('Поиск по названию "ко":');
  console.table(searchProducts(products, 'ко'));
  console.log('Категория "coffee":');
  console.table(filterProductsByCategory(products, 'coffee'));
  console.log('Сортировка по цене (по возрастанию):');
  console.table(sortProductsByPrice(products, 'asc'));
  console.log('Сортировка по цене (по убыванию):');
  console.table(sortProductsByPrice(products, 'desc'));
  const foundProduct = findProductById(products, 3);
  console.log('Товар с id 3:', foundProduct ? foundProduct.title : 'Товар не найден');
  console.log('Общая стоимость:', calculateTotalPrice(products));
  console.log('Товаров в наличии:', countAvailableProducts(products));
  console.log('Средняя цена:', calculateAveragePrice(products));
  console.log('Поиск "ко" + категория "coffee" + по возрастанию цены:');
  console.table(getPreparedProducts(products, 'ко', 'coffee', 'asc'));
  console.groupEnd();

  // Вывод на страницу только через textContent (не innerHTML).
  const summaryElement = document.getElementById('product-summary');
  if (summaryElement && typeof product !== 'undefined') {
    summaryElement.textContent = createProductSummary(product);
  }

  const statsElement = document.getElementById('catalog-stats');
  if (statsElement) {
    statsElement.textContent = [
      `Всего товаров: ${products.length}`,
      `В наличии: ${countAvailableProducts(products)}`,
      `Средняя цена: ${formatPrice(calculateAveragePrice(products))}`,
      `Общая стоимость: ${formatPrice(calculateTotalPrice(products))}`
    ].join(' · ');
  }
}