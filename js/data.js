'use strict';

// Учебные данные каталога. Файл подключается с defer раньше main.js.

// Практическое занятие №15: один объект товара.
const product = {
  id: 1,
  title: 'Бразилия Серрадо',
  category: 'coffee',
  price: 790,
  discountPercent: 10,
  rating: 4.7,
  isAvailable: true
};

// Практическое занятие №16: массив товаров с одинаковой структурой объектов.
const products = [
  { id: 1, title: 'Бразилия Серрадо', category: 'coffee', price: 790, discountPercent: 10, rating: 4.7, isAvailable: true },
  { id: 2, title: 'Эфиопия Сидамо', category: 'coffee', price: 990, discountPercent: 0, rating: 4.8, isAvailable: true },
  { id: 3, title: 'Колумбия Уила', category: 'coffee', price: 890, discountPercent: 5, rating: 4.6, isAvailable: true },
  { id: 4, title: 'Вечерняя смена (декаф)', category: 'coffee', price: 1090, discountPercent: 0, rating: 4.4, isAvailable: true },
  { id: 5, title: 'Воронка 02', category: 'accessories', price: 1590, discountPercent: 15, rating: 4.5, isAvailable: true },
  { id: 6, title: 'Кружка «Пауза»', category: 'accessories', price: 1290, discountPercent: 0, rating: 4.3, isAvailable: false },
  { id: 7, title: 'Кения АА', category: 'coffee', price: 1190, discountPercent: 10, rating: 4.9, isAvailable: false },
  { id: 8, title: 'Фильтры для воронки 02', category: 'accessories', price: 350, discountPercent: 0, rating: 4.2, isAvailable: true }
];
