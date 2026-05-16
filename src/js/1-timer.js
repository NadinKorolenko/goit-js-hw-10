import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Елементи
const startBtn = document.querySelector("[data-start]");
const input = document.querySelector("#datetime-picker");

const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

// Кнопка спочатку неактивна
startBtn.disabled = true;

// Змінні
let userSelectedDate = null;
let timerId = null;

// Налаштування flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    // Якщо дата в минулому
    if (selectedDate <= new Date()) {
      startBtn.disabled = true;

      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });

      return;
    }

    // Якщо дата валідна
    userSelectedDate = selectedDate;
    startBtn.disabled = false;
  },
};

// Ініціалізація календаря
flatpickr(input, options);

// Клік по кнопці Start
startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  input.disabled = true;

  timerId = setInterval(() => {
    const currentTime = new Date();

    const deltaTime = userSelectedDate - currentTime;

    // Якщо таймер завершився
    if (deltaTime <= 0) {
      clearInterval(timerId);

      updateTimer({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });

      input.disabled = false;

      return;
    }

    // Конвертуємо мс у дні/години/хвилини/секунди
    const time = convertMs(deltaTime);

    // Оновлюємо інтерфейс
    updateTimer(time);
  }, 1000);
});

// Оновлення значень таймера
function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// Додає 0 спереду
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// Конвертація мілісекунд
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);

  const hours = Math.floor((ms % day) / hour);

  const minutes = Math.floor(((ms % day) % hour) / minute);

  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}