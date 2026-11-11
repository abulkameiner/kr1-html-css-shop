// Валидация формы заявки через классы Bootstrap (без реальной отправки)
(function () {
  var form = document.getElementById('orderForm');
  var success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add('was-validated');

    if (!form.checkValidity()) {
      success.classList.add('d-none');
      var firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    success.classList.remove('d-none');
    success.focus();
    form.reset();
    form.classList.remove('was-validated');
  });
})();
