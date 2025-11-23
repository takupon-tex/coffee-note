// 写真付きでログを保存する

function saveData() {
    const beanName = document.getElementById("beanName").value;
    const roast = document.getElementById("roast").value;
    const brew = document.getElementById("brew").value;
    const rate = document.getElementById("rate").value;
    const memo = document.getElementById("memo").value;
    const photoInput = document.getElementById("photo");
    const file = photoInput.files[0];

    // 画像がある場合は FileReader で読み込んでから保存
    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const photoDataUrl = e.target.result;
            saveLog(beanName, roast, brew, rate, memo, photoDataUrl);
        };
        reader.readAsDataURL(file);
    } else {
        // 写真なし
        saveLog(beanName, roast, brew, rate, memo, null);
    }
}

function saveLog(beanName, roast, brew, rate, memo, photoDataUrl) {
    const data = {
        beanName: beanName,
        roast: roast,
        brew: brew,
        rate: rate,
        memo: memo,
        photo: photoDataUrl, // ← 写真のデータURL
        date: new Date().toLocaleDateString()
    };

    const logs = JSON.parse(localStorage.getItem("coffeeLogs") || "[]");
    logs.push(data);
    localStorage.setItem("coffeeLogs", JSON.stringify(logs));

    // フォームをリセット
    document.getElementById("beanName").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("memo").value = "";
    document.getElementById("photo").value = "";

    showLogs();
}

// ログ一覧を表示（写真サムネ付き）
function showLogs() {
    const logs = JSON.parse(localStorage.getItem("coffeeLogs") || "[]");
    const list = document.getElementById("logList");
    list.innerHTML = "";

    // 新しいログを上にしたいので reverse()
    logs.slice().reverse().forEach(log => {
        const div = document.createElement("div");
        div.className = "card";

        // 写真があればサムネ用HTML
        const photoHtml = log.photo
            ? `<div class="log-thumb-wrapper">
                   <img class="log-thumb" src="${log.photo}" alt="coffee photo">
               </div>`
            : "";

        div.innerHTML = `
            <div class="log-header">
                <span class="log-date">${log.date}</span>
                <span class="log-rate">★${log.rate || "-"}</span>
            </div>
            <div class="log-main">${log.beanName || "（豆名なし）"}</div>
            <div class="log-sub">
                焙煎：${log.roast} ／ 抽出：${log.brew}
            </div>
            ${photoHtml}
            ${log.memo ? `<div class="log-memo">${log.memo}</div>` : ""}
        `;
        list.appendChild(div);
    });
}

// 初期表示
showLogs();
