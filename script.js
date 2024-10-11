const API_KEY = 'AIzaSyCP3uRQEPmUjnoQt2wbZKeHHChKvDTPOpo';
const channelAId = 'UC76hHFZxOpcHs77FXAKXJyw';  
const channelBId = 'UCHiu0WbHj7wdyaPSIEKLuYQ';
const channelAName = 'スク解';
const channelBName = 'タマピコ';
const notificationTimes = ['06:00', '12:00', '18:00', '21:00'];

document.addEventListener('DOMContentLoaded', () => {
    updateChannelData();
    setupNotification();
    registerServiceWorker();

    setInterval(checkTimeForNotification, 60000);
});

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
        .then(function(registration) {
            console.log('Service Worker registered:', registration);
        })
        .catch(function(error) {
            console.error('Service Worker registration failed:', error);
        });
    }
}

function setupNotification() {
    document.getElementById('subscribeBtn').addEventListener('click', function() {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                console.log('Notifications granted.');
            } else {
                console.log('Notifications denied.');
            }
        });
    });

    document.getElementById('testNotificationBtn').addEventListener('click', function() {
        setTimeout(() => {
            showNotification('スクタマ分析', 'スクタマ分析のお時間です (テスト)');
        }, 5000);
    });
}

function showNotification(title, body) {
    if (Notification.permission === 'granted') {
        fetch('./push', {
            method: 'POST',
            body: JSON.stringify({ title: title, body: body }),
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

function checkTimeForNotification() {
    const currentTime = new Date();
    const currentHours = String(currentTime.getHours()).padStart(2, '0');
    const currentMinutes = String(currentTime.getMinutes()).padStart(2, '0');
    const formattedTime = `${currentHours}:${currentMinutes}`;

    if (notificationTimes.includes(formattedTime)) {
        showNotification('スクタマ分析', 'スクタマ分析のお時間です');
    }
}

// チャンネルデータ更新
async function updateChannelData() {
    const resultDiv = document.getElementById('result');
    const analysis = await generateAnalysis();
    resultDiv.innerText = analysis;
}

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
            resultHTML += `『${channelBName}』の登録者数が『${channelAName}』より${diff}人多いです。`;
        } else {
            resultHTML += `『分析結果』\n同じチャンネル登録者数です。`;
        }
    } else {
        resultHTML = `チャンネルデータの取得に失敗しました。`;
    }

    return resultHTML;
}

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
