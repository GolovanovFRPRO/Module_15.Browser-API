const condition = document.querySelector('#condition');
const btnSend = document.querySelector('.btnSend');
const btnGeolocation = document.querySelector('.btnGeolocation');
const textInput = document.querySelector('#textInput');
const chatWindow = document.querySelector('#chatWindow');
const mapLink = document.querySelector('#map-link');

const ws = new WebSocket('wss://echo.websocket.org');

ws.onopen = () => {
    condition.textContent = 'Соединение установлено';
};

ws.onmessage = (event) => {
    addMessageToChat(event.data, 'received');
};

ws.onerror = (error) => {
    condition.textContent = `Ошибка: ${error.message}`;
};

ws.onclose = () => {
    condition.textContent = 'Соединение закрыто';
};

btnSend.addEventListener('click', () => {
    const message = textInput.value;
    if (message) {
        addMessageToChat(message, 'sent');
        ws.send(message);
        textInput.value = '';
    }
});

const addMessageToChat = (message, type) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = type === 'sent' ? `Вы: ${message}` : `Сервер: ${message}`;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Прокручиваем вниз
};

// Функция, выводящая текст об ошибке
const error = () => {
    condition.textContent = 'невозможно получить ваше месторасположение';
};

// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = "Геолокация";
    mapLink.style.display = 'block';
};

btnGeolocation.addEventListener('click', () => {
    mapLink.href = '';
    mapLink.textContent = '';

    if (!navigator.geolocation) {
        condition.textContent = 'geolocation не поддерживается вашим браузером';
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
});