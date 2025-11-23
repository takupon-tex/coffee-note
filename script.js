function saveData() {
    const data = {
        beanName: document.getElementById("beanName").value,
        roast: document.getElementById("roast").value,
        brew: document.getElementById("brew").value,
        rate: document.getElementById("rate").value,
        memo: document.getElementById("memo").value,
        date: new Date().toLocaleDateString()
    };

    // 保存（ローカルストレージ）
    const logs = JSON.parse(localStorage.getItem("coffeeLogs") || "[]");
    logs.push(data);
    localStorage.setItem("coffeeLogs", JSON.stringify(logs));

    // 更新表示
    showLogs();
}

function showLogs() {
    const logs = JSON.parse(localStorage.getItem("coffeeLogs") || "[]");
    const list = document.getElementById("logList");
    list.innerHTML = "";

    logs.slice().reverse().forEach(log => { // 新しい順に表示
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <div class="log-header">
                <span class="log-date">${log.date}</span>
                <span class="log-rate">★${log.rate}</span>
            </div>
            <div class="log-main">${log.beanName || "（豆名なし）"}</div>
            <div class="log-sub">
                焙煎：${log.roast} ／ 抽出：${log.brew}
            </div>
            ${log.memo ? `<div class="log-memo">${log.memo}</div>` : ""}
        `;
        list.appendChild(div);
    });
}

showLogs();
