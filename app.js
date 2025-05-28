const tg = window.Telegram.WebApp;
tg.expand();

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer');

// Определяем базовый URL в зависимости от протокола
const BASE_URL = window.location.protocol === 'https:'
    ? 'https://your-production-server.com'  // Здесь нужно будет указать ваш реальный сервер
    : 'http://localhost:5000';

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Добавляем приветственное сообщение
addMessage('Бот готов к общению! Напишите ваше сообщение.');
addMessage(`Используется сервер: ${BASE_URL}`);

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    messageInput.value = '';
    addMessage(message, true);
    sendButton.disabled = true;

    try {
        console.log('Отправка запроса...');
        const response = await fetch(`${BASE_URL}/api/chat/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
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
        addMessage(`Ошибка соединения: ${error.message}. Убедитесь, что сервер запущен на ${BASE_URL}`);
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
