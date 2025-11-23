// ===== メイン保存処理 =====

function saveData() {
    const beanName = document.getElementById("beanName").value || "";
    const roast    = document.getElementById("roast").value || "";
    const brew     = document.getElementById("brew").value || "";
    const rate     = document.getElementById("rate").value || "";
    const memo     = document.getElementById("memo").value || "";

    const photoInput = document.getElementById("photo");
    const file = (photoInput && photoInput.files && photoInput.files[0]) ? photoInput.files[0] : null;

    // 写真あり → 圧縮してから保存
    if (file && file.type && file.type.indexOf("image") === 0) {
        compressImage(file, 800, 800, 0.7, function (compressedDataUrl) {
            saveLog(beanName, roast, brew, rate, memo, compressedDataUrl);
        }, function () {
            // 圧縮失敗してもテキストだけ保存
            saveLog(beanName, roast, brew, rate, memo, null);
        });
    } else {
        // 写真なし
        saveLog(beanName, roast, brew, rate, memo, null);
    }
}

// 画像圧縮（Canvasで縮小＆JPEG化）
function compressImage(file, maxWidth, maxHeight, quality, onSuccess, onError) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            let width  = img.width;
            let height = img.height;

            // 比率を保ったまま最大サイズに縮小
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                width  = width * ratio;
                height = height * ratio;
            }

            const canvas = document.createElement("canvas");
            canvas.width  = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            try {
                const dataUrl = canvas.toDataURL("image/jpeg", quality);
                onSuccess(dataUrl);
            } catch (err) {
                console.error("toDataURL error", err);
                onError();
            }
        };
        img.onerror = function () {
            console.error("image load error");
            onError();
        };
        img.src = e.target.result;
    };
    reader.onerror = function () {
        console.error("file read error");
        onError();
    };
    reader.readAsDataURL(file);
}

// ログ1件を配列に追加して保存
function saveLog(beanName, roast, brew, rate, memo, photoDataUrl) {
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
        console.error(e);
        alert("保存に失敗しました（容量オーバーの可能性があります）。\n「全てのログを削除」で一度リセットすると直る場合があります。");
        return;
    }

    // フォームリセット
    document.getElementById("beanName").value = "";
    document.getElementById("rate").value     = "";
    document.getElementById("memo").value     = "";
    const photoInput = document.getElementById("photo");
    if (photoInput) photoInput.value = "";

    showLogs();
}

// ===== ログ一覧表示 =====

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
                焙煎：${log.roast || "-"} ／ 抽出：${log.brew || "-"}</div>
            ${photoHtml}
            ${log.memo ? `<div class="log-memo">${log.memo}</div>` : ""}
        `;
        list.appendChild(div);
    });
}

// ===== ログ全削除 =====
function clearLogs() {
    if (!confirm("本当に全てのログを削除しますか？\n（元に戻せません）")) return;
    localStorage.removeItem("coffeeLogs");
    showLogs();
}

// 初期表示
showLogs();
