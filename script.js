// ページ読み込み時にログを表示
document.addEventListener('DOMContentLoaded', () => {
    renderLogs();

    // 保存ボタンのイベント
    document.getElementById('saveBtn').addEventListener('click', saveLog);
});

// ログを保存する関数
function saveLog() {
    // 入力値の取得
    const beanName = document.getElementById('beanName').value;
    const roast = document.getElementById('roast').value;
    const brewMethod = document.getElementById('brewMethod').value;
    const rating = document.getElementById('rating').value;
    const memo = document.getElementById('memo').value;

    // 必須チェック（豆の名前が空なら保存しない）
    if (!beanName) {
        alert("豆の名前を入力してください");
        return;
    }

    // 日付の取得
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

    // データオブジェクト作成
    const logData = {
        id: Date.now(), // ユニークID
        date: dateStr,
        beanName,
        roast,
        brewMethod,
        rating,
        memo
    };

    // ローカルストレージから既存データを取得
    let logs = JSON.parse(localStorage.getItem('coffeeLogs')) || [];
    
    // 新しいデータを追加（先頭に）
    logs.unshift(logData);

    // ローカルストレージに保存
    localStorage.setItem('coffeeLogs', JSON.stringify(logs));

    // フォームをリセット
    document.getElementById('beanName').value = '';
    document.getElementById('memo').value = '';
    document.getElementById('rating').value = 3;
    document.getElementById('ratingVal').innerText = 3;

    alert('保存しました！☕');
    
    // 一覧を再描画
    renderLogs();
}

// ログを表示する関数
function renderLogs() {
    const listContainer = document.getElementById('logList');
    const logs = JSON.parse(localStorage.getItem('coffeeLogs')) || [];

    listContainer.innerHTML = ''; // 一旦クリア

    logs.forEach(log => {
        // 星の表示を作る
        const stars = '★'.repeat(Math.floor(log.rating)) + (log.rating % 1 !== 0 ? '☆' : '');

        const html = `
            <div class="log-card">
                <div class="log-header">
                    <div class="log-title">${log.beanName}</div>
                    <div class="log-date">${log.date}</div>
                </div>
                <div class="log-details">
                    <span>${log.roast}</span>
                    <span>${log.brewMethod}</span>
                    <span style="color: #f57f17; font-weight:bold;">${stars} (${log.rating})</span>
                </div>
                <div class="log-memo">${log.memo}</div>
                <button class="delete-btn" onclick="deleteLog(${log.id})">削除</button>
            </div>
        `;
        listContainer.insertAdjacentHTML('beforeend', html);
    });
}

// ログを削除する関数
function deleteLog(id) {
    if (!confirm('この記録を削除しますか？')) return;

    let logs = JSON.parse(localStorage.getItem('coffeeLogs')) || [];
    logs = logs.filter(log => log.id !== id);
    localStorage.setItem('coffeeLogs', JSON.stringify(logs));
    
    renderLogs();
}