const tg = window.Telegram.WebApp;
tg.expand();

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer');

let isProcessing = false;

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
    if (isProcessing || !messageInput.value.trim()) return;

    const message = messageInput.value.trim();
    messageInput.value = '';
    addMessage(message, true);

    isProcessing = true;
    sendButton.disabled = true;

    try {
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tg.initData}`
            },
            body: JSON.stringify({
                message: message,
                init_data: tg.initData
            })
        });

        const data = await response.json();

        if (response.ok) {
            addMessage(data.response);
        } else {
            addMessage(`Ошибка: ${data.error}`);
        }
    } catch (error) {
        addMessage(`Ошибка: ${error.message}`);
    } finally {
        isProcessing = false;
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
