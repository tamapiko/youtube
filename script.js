const API_KEY = 'AIzaSyCP3uRQEPmUjnoQt2wbZKeHHChKvDTPOpo';  // YouTube Data APIキー
const channelAId = 'UC76hHFZxOpcHs77FXAKXJyw';  // スク解のチャンネルID
const channelBId = 'UCHiu0WbHj7wdyaPSIEKLuYQ';  // タマピコチャンネルのチャンネルID
const channelAName = 'スク解';
const channelBName = 'タマピコ';

document.addEventListener('DOMContentLoaded', () => {
    updateChannelData();
    setInterval(updateChannelData, 3600000); // 1時間ごとに更新
    setupNotification();
    registerServiceWorker(); // Service Workerを登録
});

// Service Workerの登録
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
        .then(function(registration) {
            console.log('Service Worker 登録成功:', registration);
        })
        .catch(function(error) {
            console.error('Service Worker 登録失敗:', error);
        });
    }
}

// 通知のセットアップ
function setupNotification() {
    document.getElementById('subscribeBtn').addEventListener('click', function() {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                console.log('通知が許可されました。');
            } else {
                console.log('通知が拒否されました。');
            }
        });
    });

    document.getElementById('testNotificationBtn').addEventListener('click', function() {
        setTimeout(() => {
            showNotification('スクタマ分析', 'スクタマ分析のお時間です (テスト)'); // 5秒後に「(テスト)」を追加して通知
        }, 5000); // 5秒後に通知を表示
    });
}

// 通知を表示
function showNotification(title, body) {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification(title, {
                body: body,
                icon: 'icon.png'
            });
        });
    }
}

// YouTubeチャンネルデータの更新
async function updateChannelData() {
    const resultDiv = document.getElementById('result');
    const analysis = await generateAnalysis();
    resultDiv.innerText = analysis;

    // 通知も送信
    showNotification('スクタマ分析', 'スクタマ分析のお時間です');
}

// 分析結果を生成
async function generateAnalysis() {
    const [subscribersA] = await getChannelData(channelAId);
    const [subscribersB] = await getChannelData(channelBId);

    let resultHTML = '';
    if (subscribersA !== null && subscribersB !== null) {
        resultHTML += `『${channelAName}』\n${subscribersA}人\n\n`;
        resultHTML += `『${channelBName}』\n${subscribersB}人\n\n`;

        const diff = Math.abs(subscribersA - subscribersB);

        if (subscribersA > subscribersB) {
            resultHTML += `『分析結果』\n『${channelAName}』の登録者数が『${channelBName}』より${diff}人多いです。`;
        } else if (subscribersA < subscribersB) {
            resultHTML += `『分析結果』\n『${channelBName}』の登録者数が『${channelAName}』より${diff}人多いです。`;
        } else {
            resultHTML += `『分析結果』\n同じチャンネル登録者数です。`;
        }
    } else {
        resultHTML = `チャンネルデータの取得に失敗しました。`;
    }

    return resultHTML;
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
