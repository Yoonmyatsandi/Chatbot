// Selecting elements
const userChatting = document.querySelector(".chatting textarea");
const sendBtn = document.querySelector(".chatting span");
const chatBox = document.querySelector(".chatbox");
const chatClickToggle = document.querySelector(".chatbot-click-toggle");
const chatCloseBtn = document.querySelector(".close-btn");

// Variables
let userChat;
const API_KEY = "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";
const messageBoxHeight = userChatting.scrollHeight;

// Create a chat message element
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);

  const chatText = className === "user"
    ? `<p>${message}</p>`
    : `<div class="robot-message"><span><i class="bi bi-robot"></i></span><p>${message}</p></div>`;

  chatLi.innerHTML = chatText;
  return chatLi;
};

// Reply by chatbot
const replyByBot = (userChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageEle = userChatLi.querySelector("p");

  const replyOpt = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userChat }]
    })
  };

  fetch(API_URL, replyOpt)
    .then(res => res.json())
    .then(data => {
      messageEle.textContent = data.choices[0].message.content;
    })
    .catch(() => {
      messageEle.classList.add("error");
      messageEle.textContent = "Oops! Something went wrong. Please try again.";
    })
    .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
};

// Display user chat message
const displayChat = () => {
  userChat = userChatting.value.trim();
  if (!userChat) return;
  userChatting.value = "";
  userChatting.style.height = `${messageBoxHeight}px`;

  chatBox.appendChild(createChatLi(userChat, "user"));
  chatBox.scrollTo(0, chatBox.scrollHeight);

  setTimeout(() => {
    const userChatLi = createChatLi("...", "robot");
    chatBox.appendChild(userChatLi);
    chatBox.scrollTo(0, chatBox.scrollHeight);
    replyByBot(userChatLi);
  }, 600);
};

// Event listeners
userChatting.addEventListener("input", () => {
  userChatting.style.height = `${messageBoxHeight}px`;
  userChatting.style.height = `${userChatting.scrollHeight}px`;
});

userChatting.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    displayChat();
  }
});

sendBtn.addEventListener("click", displayChat);

chatClickToggle.addEventListener("click", () => document.body.classList.toggle("appear-chat"));

chatCloseBtn.addEventListener("click", () => document.body.classList.remove("appear-chat"));
