const socket = new WebSocket('ws://3.140.207.175:80/');
const chatOutput = document.getElementById('chat-output');


document.getElementById('message-input').focus();
function displaySentMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'sent-message';
  messageElement.innerHTML = message;
  chatOutput.appendChild(messageElement);
  scrollToBottom();
}

function displayReceivedMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.className = 'received-message';
  messageElement.innerHTML = message;
  chatOutput.appendChild(messageElement);
  scrollToBottom();
  playNotificationSound();
}

socket.addEventListener('message', event => {
  let messageData;
  let messageTimestamp = getTimestamp();
  // Check if the data is a JSON string
  let isJSON = true;
  try {
    messageData = JSON.parse(event.data);
  } catch (error) {
    isJSON = false;
  }

  // Handle messages in JSON format
  if (isJSON) {
    displayReceivedMessage(`<p><strong>${messageData.nickname}:</strong> ${messageData.message}<span>${messageTimestamp}</span></p>`);
  } else {
    // If it's not JSON, handle it as a simple text message
    const message = event.data;
    displayReceivedMessage(`<p>${message}<span>${messageTimestamp}</span></p>`);
  }
});

function sendMessage() {
  const messageInput = document.getElementById('message-input');
  const nickName = getNickname();
  const timeStamp = getTimestamp();
  const message = messageInput.value;
  if (message.trim() !== '') {
    const data = {
      message: message,
      nickname: nickName,
    };
    displaySentMessage(`<p><strong>${nickName}:</strong> ${message}<span>${timeStamp}</span></p>`);
    socket.send(JSON.stringify(data));
  }
  messageInput.value = '';
}

function handleKeyPress(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMessage();
  }  
}

function getTimestamp() {
  const now = new Date();
  const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  return now.toLocaleTimeString('en-US', options);
}

function submitNickname() {
  const nickname = document.getElementById('nickname-input').value;
  if (nickname.trim() !== '') {
    document.getElementById('dialog-overlay').style.display = 'none'; 
    document.getElementById('phone-frame').classList.remove('blurred'); 
    // Save the nickname for future messages
    localStorage.setItem('nickname', nickname);
  }
}

function getNickname() {
  return localStorage.getItem('nickname');
}

function scrollToBottom() {
  chatOutput.scrollTop = chatOutput.scrollHeight;
}

function playNotificationSound() {
  const notificationSound = new Audio('notification-sound.mp3');
  notificationSound.play();
}