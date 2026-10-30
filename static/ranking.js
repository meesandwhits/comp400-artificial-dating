const rankList = document.getElementById("rank-list");
const rankingInput = document.getElementById("ranking-input");
let rankingBuilt = false;

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Writes the current order into the hidden input, so it's submitted with the form
function saveRanking() {
    const ranked = Array.from(rankList.children).map(function (li) {
        return { source: li.dataset.source, text: li.textContent };
    });
    rankingInput.value = JSON.stringify(ranked);
}

function buildRanking() {
    const items = [{ source: "original", text: opener }];

    // The AI's replies, in order (these variables come from chat.js)
    history.filter(function (m) { return m.role === "assistant"; }).forEach(function (m, i) {
        items.push({ source: "ai_" + (i + 1), text: m.content });
    });

    // Your own openers for the profile this participant saw
    const option = document.querySelector('.profile-option[data-preference="' + profileKey + '"]');
    JSON.parse(option.dataset.openers).forEach(function (text, i) {
        items.push({ source: "researcher_" + (i + 1), text: text });
    });

    shuffle(items).forEach(function (item) {
        const li = document.createElement("li");
        li.dataset.source = item.source;
        li.textContent = item.text;
        rankList.appendChild(li);
    });

    new Sortable(rankList, {
        animation: 150,
        delay: 100,
        delayOnTouchOnly: true,     // on phones, a short press is needed to drag, so scrolling still works
        onEnd: saveRanking,
    });
    saveRanking();
}

document.addEventListener("stepchange", function (e) {
    if (e.detail === 5 && !rankingBuilt) {     // the 6th step, counting from 0
        rankingBuilt = true;
        buildRanking();
    }
});