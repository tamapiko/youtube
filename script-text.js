const API_KEY = 'AIzaSyCP3uRQEPmUjnoQt2wbZKeHHChKvDTPOpo';  // 提供されたYouTube Data APIキー

// チャンネルIDを設定（「スク解」と「タマピコチャンネル」）
const channelAId = 'UC76hHFZxOpcHs77FXAKXJyw';  // スク解のチャンネルID
const channelBId = 'UCHiu0WbHj7wdyaPSIEKLuYQ';  // タマピコチャンネルのチャンネルID

// チャンネル名を設定
const channelAName = 'スク解';
const channelBName = 'タマピコ';

document.addEventListener('DOMContentLoaded', () => {
    updateChannelData();
    setInterval(updateChannelData, 1000); // 1秒ごとに更新
});

async function updateChannelData() {
    const resultDiv = document.getElementById('result');
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

    resultDiv.innerText = resultHTML;
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
