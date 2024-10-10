const API_KEY = 'AIzaSyCP3uRQEPmUjnoQt2wbZKeHHChKvDTPOpo';  // YouTube Data APIキー
const channelAId = 'UC76hHFZxOpcHs77FXAKXJyw';  // スク解のチャンネルID
const channelBId = 'UCHiu0WbHj7wdyaPSIEKLuYQ';  // タマピコチャンネルのチャンネルID

document.addEventListener('DOMContentLoaded', () => {
    updateChannelData();
    setInterval(updateChannelData, 3600000); // 1時間ごとに更新
    setupNotification();
});

// 通知のセットアップ
function setupNotification() {
    document.getElementById('subscribeBtn').addEventListener('click', function() {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                console.log('通知が許可されました。');
                document.getElementById('status').innerText = '通知が許可されました。';
            } else {
                console.log('通知が拒否されました。');
                document.getElementById('status').innerText = '通知が拒否されました。';
            }
        });
    });

    document.getElementById('testNotificationBtn').addEventListener('click', function() {
        setTimeout(() => {
            showNotification('テスト通知', 'これはスクタマ分析のテスト通知です。');
        }, 10000); // 10秒後に通知を表示
    });
}

// 通知を表示
function showNotification(title, body) {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'icon.png'
        });
    }
}

// YouTubeチャンネルデータの更新
async function updateChannelData() {
    const resultDiv = document.getElementById('result');
    const [subscribersA] = await getChannelData(channelAId);
    const [subscribersB] = await getChannelData(channelBId);

    let resultHTML = '';
    if (subscribersA !== null && subscribersB !== null) {
        resultHTML += `『スク解』\n${subscribersA}人\n\n`;
        resultHTML += `『タマピコ』\n${subscribersB}人\n\n`;

        const diff = Math.abs(subscribersA - subscribersB);

        if (subscribersA > subscribersB) {
            resultHTML += `『分析結果』\n『スク解』の登録者数が『タマピコ』より${diff}人多いです。`;
        } else if (subscribersA < subscribersB) {
            resultHTML += `『分析結果』\n『タマピコ』の登録者数が『スク解』より${diff}人多いです。`;
        } else {
            resultHTML += `『分析結果』\n同じチャンネル登録者数です。`;
        }
    } else {
        resultHTML = `チャンネルデータの取得に失敗しました。`;
    }

    resultDiv.innerText = resultHTML;
}

// チャンネルデータを取得
async function getChannelData(channelId) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`);
        const data = await response.json();
        const item = data.items[0];
        const subscriberCount = item.statistics.subscriberCount;
        return [parseInt(subscriberCount, 10)];
    } catch (error) {
        console.error(`チャンネル ${channelId} のデータ取得エラー:`, error);
        return [null];
    }
}
