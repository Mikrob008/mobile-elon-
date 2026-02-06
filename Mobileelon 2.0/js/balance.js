// Управление балансом пользователя

// Функция показа баланса
function showBalance(amount) {
  const balanceAmountEl = document.getElementById('balanceAmount');
  if (!balanceAmountEl) {
    console.warn('Элемент суммы баланса не найден');
    return;
  }
  const formattedAmount = formatCurrency(amount);
  balanceAmountEl.textContent = formattedAmount;
}

// Функция форматирования валюты
function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  return amount.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Функция обновления баланса (для демонстрации)
function updateBalance(newAmount) {
  showBalance(newAmount);
}

// Функция добавления средств к балансу
function addToBalance(amount) {
  const balanceAmountEl = document.getElementById('balanceAmount');
  if (!balanceAmountEl) {
    console.warn('Элемент суммы баланса не найден');
    return;
  }
  
  const currentAmount = parseFloat(balanceAmountEl.textContent.replace(/\s/g, '')) || 0;
  const newAmount = currentAmount + parseFloat(amount);
  
  showBalance(newAmount);
}
