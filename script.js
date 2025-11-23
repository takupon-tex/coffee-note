// 写真付きでログを保存（安定版）

function saveData() {
    const beanName = document.getElementById("beanName").value || "";
    const roast = document.getElementById("roast").value || "";
    const brew = document.getElementById("brew").value || "";
    const rate = document.getElementById("rate").value || "";
    const memo = document.getElementById("memo").value || "";

    // 写真inputが存在しない場合でも落ちないようにする
    const photoInput = document.getElementById("photo");
    const file = (photoInput && photoInput.files && photoInput.files[0]) ? photoInput.files[0] : null;

    // 入力チェックは一旦ナシ（とにかく保存はされるようにする）
    // 必須チェックは後でつけ直せる

    if (file && file.type && file.type.indexOf("image") === 0) {
        // 画像あり：FileReaderでBase64に変換
        const reader = new FileReader();
        reader.onload = function (e) {
            const photoDataUrl = e.target.result;
            saveLog(beanName, roast, brew, rate, memo, photoDataUrl);
        };
        reader.onerror = function () {
            // 画像読み込み失敗してもテキストだけは保存する
            saveLog(beanName, roast, brew, rate, memo, null);
        };
        reader.readAsDataURL(file);
    } else {
        // 画像なし
        saveLog(beanName, roast, brew, rate, memo, null);
    }
}

function saveLog(beanName, roast, brew, rate, memo, photoDataUrl) {
    // 既存データを読み込み（壊れてたら空配列にする）
    let logs;
    try {
        const raw = localStorage.getItem("coffeeLogs");
        logs = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(logs)) logs = [];
    } catch (e) {
        logs = [];
    }

    const data = {
        beanName,
        roast,
        brew,
        rate,
        memo,
        photo: photoDataUrl || null,
        date: new Date().toLocaleDateString()
    };

    logs.push(data);

    try {
        localStorage.setItem("coffeeLogs", JSON.stringify(logs));
    } catch (e) {
        alert("保存に失敗しました（容量オーバーの可能性があります）。");
        return;
    }

    // フォームリセット
    document.getElementById("beanName").value = "";
    document.getElementById("rate").value = "";
    document.getElementById("memo").value = "";
    const photoInput = document.getElementById("photo");
    if (photoInput) photoInput.value = "";

    showLogs();
}

// ログ一覧表示（新しいものを上に）
function showLogs() {
    let logs;
    try {
        const raw = localStorage.getItem("coffeeLogs");
        logs = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(logs)) logs = [];
    } catch (e) {
        logs = [];
    }

    const list = document.getElementById("logList");
    if (!list) return;
    list.innerHTML = "";

    logs.slice().reverse().forEach(log => {
        const div = document.createElement("div");
        div.className = "card";

        const photoHtml = log.photo
            ? `<div class="log-thumb-wrapper">
                   <img class="log-thumb" src="${log.photo}" alt="coffee photo">
               </div>`
            : "";

        div.innerHTML = `
            <div class="log-header">
                <span class="log-date">${log.date || ""}</span>
                <span class="log-rate">${log.rate ? "★" + log.rate : ""}</span>
            </div>
            <div class="log-main">${log.beanName || "（豆名なし）"}</div>
            <div class="log-sub">
                焙煎：${log.roast || "-"} ／ 抽出：${log.brew || "-"}
            </div>
            ${photoHtml}
            ${log.memo ? `<div class="log-memo">${log.memo}</div>` : ""}
        `;
        list.appendChild(div);
    });
}

// 初期表示
showLogs();
