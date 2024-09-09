document.addEventListener('DOMContentLoaded', () => {
    const chatbotIcon = document.querySelector('img[alt="Chatbot Logo"]');
    const chatbox = document.createElement('div');
    const chatHistory = document.createElement('div');
    const chatInput = document.createElement('input');
    const chatSendButton = document.createElement('button');

    // Chatbox Styles
    chatbox.style.position = 'fixed';
    chatbox.style.bottom = '100px';
    chatbox.style.right = '30px';
    chatbox.style.width = '300px';
    chatbox.style.height = '400px';
    chatbox.style.backgroundColor = 'white';
    chatbox.style.borderRadius = '10px';
    chatbox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    chatbox.style.display = 'none';
    chatbox.style.flexDirection = 'column';

    // Chat history styles
    chatHistory.style.flexGrow = '1';
    chatHistory.style.padding = '10px';
    chatHistory.style.overflowY = 'auto';

    // Chat input styles
    chatInput.type = 'text';
    chatInput.placeholder = 'Type a message...';
    chatInput.style.width = '80%';
    chatInput.style.padding = '10px';
    chatInput.style.border = 'none';

    // Chat send button
    chatSendButton.textContent = 'Send';
    chatSendButton.style.width = '20%';
    chatSendButton.style.padding = '10px';
    chatSendButton.style.backgroundColor = '#4CAF50';
    chatSendButton.style.color = 'white';
    chatSendButton.style.border = 'none';

    // Append elements to chatbox
    chatbox.appendChild(chatHistory);
    chatbox.appendChild(chatInput);
    chatbox.appendChild(chatSendButton);
    document.body.appendChild(chatbox);

    // Toggle chatbox visibility
    chatbotIcon.addEventListener('click', () => {
        chatbox.style.display = chatbox.style.display === 'none' ? 'flex' : 'none';
    });

    // Send message to chatbot
    chatSendButton.addEventListener('click', async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to chat history
        const userMessage = document.createElement('div');
        userMessage.textContent = `You: ${message}`;
        chatHistory.appendChild(userMessage);

        // Clear input
        chatInput.value = '';

        // Send message to server
        const response = await fetch('/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        // Add chatbot response to chat history
        const botMessage = document.createElement('div');
        botMessage.textContent = `Bot: ${data.reply}`;
        chatHistory.appendChild(botMessage);

        // Scroll to the bottom of chat history
        chatHistory.scrollTop = chatHistory.scrollHeight;
    });
});
