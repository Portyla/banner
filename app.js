const tg = window.Telegram.WebApp;
tg.expand();

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer');

// Определяем базовый URL для API
const BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'http://192.168.1.212:5000';  // Используем локальный IP-адрес сервера

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Добавляем приветственное сообщение и информацию о подключении
addMessage('Бот готов к общению! Напишите ваше сообщение.');
addMessage(`Подключение к серверу: ${BASE_URL}`);

// Проверка доступности сервера
async function testConnection() {
    try {
        addMessage('🔄 Проверка подключения к серверу...');

        const response = await fetch(`${BASE_URL}/test`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        if (data.status === 'ok') {
            addMessage('✅ Сервер доступен и отвечает');
            return true;
        } else {
            addMessage('❌ Сервер отвечает некорректно');
            return false;
        }
    } catch (error) {
        addMessage(`❌ Ошибка подключения к серверу: ${error.message}`);
        addMessage('💡 Возможные причины:');
        addMessage('1. Сервер не запущен');
        addMessage('2. Брандмауэр Windows блокирует подключение');
        addMessage('3. Неверный IP-адрес сервера');
        addMessage(`4. CORS не настроен (проверьте консоль F12)`);
        console.error('Ошибка проверки сервера:', error);
        return false;
    }
}

// Запускаем проверку при загрузке
testConnection();

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    messageInput.value = '';
    addMessage(message, true);
    sendButton.disabled = true;

    try {
        console.log('Отправка запроса на:', `${BASE_URL}/api/chat/`);
        const response = await fetch(`${BASE_URL}/api/chat/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                user_id: tg.initDataUnsafe?.user?.id || '12345'
            })
        });

        console.log('Получен ответ:', response);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
        }

        const data = await response.json();
        console.log('Данные ответа:', data);

        if (data.response) {
            addMessage(data.response);
        } else if (data.error) {
            addMessage(`Ошибка: ${data.error}`);
        }
    } catch (error) {
        console.error('Ошибка при отправке:', error);
        addMessage(`❌ Ошибка: ${error.message}`);
        // Повторная проверка соединения при ошибке
        testConnection();
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
