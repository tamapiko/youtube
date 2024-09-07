const API_KEY = 'AIzaSyCP3uRQEPmUjnoQt2wbZKeHHChKvDTPOpo';

// チャンネルIDを設定（「スク解」と「タマピコチャンネル」）
const channelAId = 'UC76hHFZxOpcHs77FXAKXJyw';  // スク解のチャンネルID
const channelBId = 'UCHiu0WbHj7wdyaPSIEKLuYQ';  // タマピコチャンネルのチャンネルID

// チャンネル名を設定
const channelAName = 'スク解';
const channelBName = 'タマピコチャンネル';

document.getElementById('compareForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const resultDiv = document.getElementById('result');

    const [subscribersA, channelAInfo] = await getChannelData(channelAId);
    const [subscribersB, channelBInfo] = await getChannelData(channelBId);

    let resultHTML = '';
    if (subscribersA !== null && subscribersB !== null) {
        resultHTML += `
            <div class="channel-info">
                <img src="${channelAInfo.iconUrl}" alt="${channelAName}のアイコン">
                <div>${channelAName} の登録者数: ${subscribersA}</div>
            </div>
            <div class="channel-info">
                <img src="${channelBInfo.iconUrl}" alt="${channelBName}のアイコン">
                <div>${channelBName} の登録者数: ${subscribersB}</div>
            </div>
        `;

        if (subscribersA > subscribersB) {
            resultHTML += `${channelAName} の登録者数が ${channelBName} より多いです。`;
        } else if (subscribersA < subscribersB) {
            resultHTML += `${channelBName} の登録者数が ${channelAName} より多いです。`;
        } else {
            resultHTML += `両方のチャンネルの登録者数は同じです。`;
        }
    } else {
        resultHTML = `1つまたは両方のチャンネルのデータ取得に失敗しました。`;
    }

    resultDiv.innerHTML = resultHTML;
});

async function getChannelData(channelId) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`);
        const data = await response.json();
        const item = data.items[0];
        const subscriberCount = item.statistics.subscriberCount;
        const iconUrl = item.snippet.thumbnails.default.url;
        return [parseInt(subscriberCount, 10), { iconUrl }];
    } catch (error) {
        console.error(`チャンネル ${channelId} のデータ取得エラー:`, error);
        return [null, { iconUrl: '' }];
    }
}
