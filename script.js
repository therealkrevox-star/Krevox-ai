const langBtn = document.getElementById("langBtn");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");
const sendBtn = document.getElementById("sendBtn");

let lang = "uz";
let messages = [];

langBtn.addEventListener("click", () => {
  lang = lang === "uz" ? "en" : "uz";
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-uz][data-en]").forEach(el => {
    el.innerHTML = el.dataset[lang];
  });

  messageInput.placeholder =
    messageInput.dataset["placeholder" + (lang === "uz" ? "Uz" : "En")];

  langBtn.textContent = lang === "uz" ? "UZ / EN" : "EN / UZ";
});

function addMessage(role, content) {
  const message = document.createElement("div");
  message.className = "message " + role;

  const name = document.createElement("div");
  name.className = "message-name";
  name.textContent = role === "user" ? "YOU" : "KREVOX AI";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = content;

  message.append(name, bubble);
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return bubble;
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  addMessage("user", text);
  messages.push({ role: "user", content: text });

  messageInput.value = "";
  sendBtn.disabled = true;
  sendBtn.textContent = "...";

  const loadingBubble = addMessage(
    "assistant",
    lang === "uz" ? "Javob tayyorlanmoqda..." : "Preparing a reply..."
  );

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    if (!data.reply) {
      throw new Error("Empty response");
    }

    loadingBubble.textContent = data.reply;
    messages.push({ role: "assistant", content: data.reply });

  } catch (error) {
    loadingBubble.textContent =
      (lang === "uz" ? "Xatolik: " : "Error: ") +
      error.message;

    messages.pop();
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "➤";
    messageInput.focus();
  }
});
