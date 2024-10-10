const API_KEY = 'AIzaSyCP3uRQEPmUjnoQt2wbZKeHHChKvDTPOpo';  // 提供されたYouTube Data APIキー
const channelAId = 'UC76hHFZxOpcHs77FXAKXJyw';  // スク解のチャンネルID
const channelBId = 'UCHiu0WbHj7wdyaPSIEKLuYQ';  // タマピコチャンネルのチャンネルID
const channelAName = 'スク解';
const channelBName = 'タマピコ';

let notificationInterval;

document.getElementById('startBtn').addEventListener('click', function() {
    if (Notification.permission === 'granted') {
        startNotifications();
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                startNotifications();
            }
        });
    }
});

document.getElementById('stopBtn').addEventListener('click', function() {
    stopNotifications();
});

document.getElementById('testNotificationBtn').addEventListener('click', function() {
    testNotification();
});

function startNotifications() {
    document.getElementById('status').innerText = '通知を開始しました。';
    updateChannelData();
    notificationInterval = setInterval(checkTimeAndNotify, 60000); // 1分ごとに時間をチェック
}

function stopNotifications() {
    clearInterval(notificationInterval);
    document.getElementById('status').innerText = '通知を停止しました。';
}

async function checkTimeAndNotify() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // 06:00, 12:00, 18:00, 21:00に通知を送信
    if ((hours === 6 && minutes === 0) || 
        (hours === 12 && minutes === 0) || 
        (hours === 18 && minutes === 0) || 
        (hours === 21 && minutes === 0)) {
        updateChannelData();
    }
}

async function updateChannelData() {
    const [subscribersA] = await getChannelData(channelAId);
    const [subscribersB] = await getChannelData(channelBId);
    const lastUpdated = new Date().toLocaleTimeString();

    if (subscribersA !== null && subscribersB !== null) {
        const channelData = document.getElementById('channelData');
        channelData.innerHTML = `
            <tr>
                <td class="channel-info"><i class="fab fa-youtube"></i>${channelAName}</td>
                <td>${subscribersA}人</td>
                <td>${lastUpdated}</td>
            </tr>
            <tr>
                <td class="channel-info"><i class="fab fa-youtube"></i>${channelBName}</td>
                <td>${subscribersB}人</td>
                <td>${lastUpdated}</td>
            </tr>
        `;

        // 通知を表示
        const notificationText = `『${channelAName}』: ${subscribersA}人\n『${channelBName}』: ${subscribersB}人`;
        new Notification('YouTubeチャンネルの登録者数', {
            body: notificationText
        });
    } else {
        console.error('チャンネルデータの取得に失敗しました。');
    }
}

async function getChannelData(channelId) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${API_KEY}`);
        const data = await response.json();
        const item = data.items[0];
        const subscriberCount = parseInt(item.statistics.subscriberCount, 10).toLocaleString();
        return [subscriberCount];
    } catch (error) {
        console.error(`チャンネル ${channelId} のデータ取得エラー:`, error);
        return [null];
    }
}

function testNotification() {
    document.getElementById('status').innerText = '10秒後にテスト通知を送信します...';
    setTimeout(() => {
        new Notification('テスト通知', {
            body: 'これはテスト通知です。'
        });
        document.getElementById('status').innerText = 'テスト通知が送信されました。';
    }, 10000);
}
