const tg = window.Telegram.WebApp;
tg.expand();

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer');

<<<<<<< HEAD:docs/app.js
=======
// Определяем базовый URL в зависимости от протокола
const BASE_URL = window.location.protocol === 'https:'
    ? 'https://your-production-server.com'  // Здесь нужно будет указать ваш реальный сервер
    : 'http://localhost:5000';

>>>>>>> dd144f44df32861c37fdfd4ed728e92428f3e48b:app.js
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Добавляем приветственное сообщение
addMessage('Бот готов к общению! Напишите ваше сообщение.');
<<<<<<< HEAD:docs/app.js
=======
addMessage(`Используется сервер: ${BASE_URL}`);
>>>>>>> dd144f44df32861c37fdfd4ed728e92428f3e48b:app.js

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    messageInput.value = '';
    addMessage(message, true);
    sendButton.disabled = true;

    try {
<<<<<<< HEAD:docs/app.js
        const response = await fetch('http://localhost:5000/api/chat/', {
=======
        console.log('Отправка запроса...');
        const response = await fetch(`${BASE_URL}/api/chat/`, {
>>>>>>> dd144f44df32861c37fdfd4ed728e92428f3e48b:app.js
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
<<<<<<< HEAD:docs/app.js
            body: JSON.stringify({
                message: message,
                user_id: tg.initDataUnsafe?.user?.id || '12345'
            })
=======
            body: JSON.stringify({ message: message })
>>>>>>> dd144f44df32861c37fdfd4ed728e92428f3e48b:app.js
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.response) {
            addMessage(data.response);
        } else if (data.error) {
            addMessage(`Ошибка: ${data.error}`);
        }
    } catch (error) {
        console.error('Ошибка при отправке:', error);
<<<<<<< HEAD:docs/app.js
        addMessage(`Ошибка соединения: ${error.message}`);
=======
        addMessage(`Ошибка соединения: ${error.message}. Убедитесь, что сервер запущен на ${BASE_URL}`);
>>>>>>> dd144f44df32861c37fdfd4ed728e92428f3e48b:app.js
    } finally {
        sendButton.disabled = false;
    }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}); 