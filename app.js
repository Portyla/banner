const tg = window.Telegram.WebApp;
tg.expand();

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer');

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Добавляем приветственное сообщение
addMessage('Бот готов к общению! Напишите ваше сообщение.');

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    messageInput.value = '';
    addMessage(message, true);
    sendButton.disabled = true;

    try {
        console.log('Отправка запроса...');
        const response = await fetch('http://localhost:5000/api/chat/', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        console.log('Получен ответ:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
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
        addMessage(`Ошибка соединения: ${error.message}`);
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
