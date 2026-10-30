const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const history = [];
let chatStarted = false;
let opener = "";
let profileKey = "";
const MAX_PROMPTS = 3;
let promptsUsed = 0;
const promptsLeftEl = document.getElementById("prompts-left");

function addBubble(text, who) {
    const div = document.createElement("div");
    div.className = "bubble " + who;      // "user", "bot" or "note"
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendToBot(text) {
    history.push({ role: "user", content: text });
    chatSend.disabled = true;
    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: history, opener: opener, profile: profileKey }),   // <-- added profile
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Request failed");
        history.push({ role: "assistant", content: data.reply });
        addBubble(data.reply, "bot");
    } catch (err) {
        history.pop();
        addBubble("Sorry, something went wrong. Please try again.", "bot");
    } finally {
        chatSend.disabled = promptsUsed >= MAX_PROMPTS;   // stays disabled once they're out of prompts
    }
}

chatSend.addEventListener("click", function () {
    if (promptsUsed >= MAX_PROMPTS) return;
    const text = chatInput.value.trim();
    if (!text) return;
    addBubble(text, "user");
    chatInput.value = "";
    sendToBot(text);
});

chatInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        chatSend.click();
    }
});

document.addEventListener("stepchange", function (e) {
    if (e.detail === 4 && !chatStarted) {
        chatStarted = true;
        opener = document.querySelector('input[name="pickup_line"]').value.trim();
        profileKey = document.querySelector('input[name="preference"]:checked').value;   // <-- new
        addBubble('Your opener: "' + opener + '"', "note");
        chatInput.focus();
    }
});

function updatePromptsLeft() {
    const left = MAX_PROMPTS - promptsUsed;
    promptsLeftEl.textContent = left + (left === 1 ? " prompt" : " prompts");   // "1 prompt", "2 prompts"
    if (left === 0) {
        chatInput.disabled = true;
        chatSend.disabled = true;
        chatInput.placeholder = "You've used all your prompts.";
    }
}