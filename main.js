
import { TelegramClient, Api, client } from 'telegram';
import { StringSession, Session, StoreSession } from 'telegram/sessions/index.js'
import readline from 'readline'
import axios from 'axios';
import dotenv from 'dotenv';
import { error } from 'console';
import { start } from 'repl';

dotenv.config({path: "./.env"})

const PHONE_NUMBER = process.env.PHONE_NUMBER;
const API_ID = parseInt(process.env.API_ID);
const API_HASH = process.env.API_HASH;
const THIRTY_MINUTES = 1800000;
const MIN_POINTS = parseInt(process.env.MIN_POINTS);
const MAX_POINTS = parseInt(process.env.MAX_POINTS)

console.log(PHONE_NUMBER)
console.log(API_ID)
console.log(API_HASH)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

//OLD HEADERS FOR BALANCE AND OTHERS
let headers = {
    'Accept': '*/*',
    'Accept-Language': 'ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
    'Connection': 'keep-alive',
    'Origin': 'https://game-domain.blum',
    'Referer': 'https://game-domain.blum/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
    'sec-ch-ua': '"Microsoft Edge";v="123", "Not:A-Brand";v="8", "Chromium";v="123", "Microsoft Edge WebView2";v="123"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
}

const login = async (client) => {
    const viewRequest = new Api.messages.RequestWebView({
        peer: "BlumCryptoBot",
        bot: "BlumCryptoBot",
        platform: "android",
        fromBotMenu: false,
        url: "https://telegram.blum.codes/"
    })

    const wview = await client.invoke(viewRequest);
    const url = wview.url;
    const webData = url.split('tgWebAppData=')[1].split('&tgWebAppVersion')[0]
    const dec = decodeURIComponent(decodeURIComponent(webData))
    const json_data = { 'query': dec }

    const resp = await axios.post("https://user-domain.blum.codes/api/v1/auth/provider/PROVIDER_TELEGRAM_MINI_APP",
        json_data,
        {
            headers: headers
        }
    )

    console.log("LOGIN STATUS: " + resp.status)
    const bd = resp.data
    const brr = "Bearer " + bd.token.access;
    console.log("BRR: "+ brr)
    headers["Authorization"] = brr;
    return(brr);
}

const balance = async (brr) => {
    const response = await axios.get('https://game-domain.blum.codes/api/v1/user/balance', 
    {
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "Authorization": `${brr}`,
            "Lang": "en",
            "Priority": "u=1, i",
            "sec-ch-ua": "\"Telegram\";v=\"10.0\", \"Android\";v=\"11\"",
            "sec-ch-ua-mobile": "?1",
            "sec-ch-ua-platform": "\"Android\"",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G960F Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 TelegramBot (like TwitterBot)"
        },
        timeout: 60000, //optional
    })

    return response.data;
}


const randomTimeout = async (min, max) => {
    const randomTime = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, randomTime));
}

const tgLogin = async () => {
    const stringSession = new StoreSession("/sessions");
    const client = new TelegramClient(stringSession, API_ID, API_HASH, {
        connectionRetries: 5,
    });

    console.log(stringSession)

    const _ = await client.start({
        phoneNumber: PHONE_NUMBER,
        phoneCode: async () =>
            new Promise((resolve) =>
                rl.question("Please enter the code you received: ", resolve)
            ),
        password: async () =>
        new Promise((resolve) =>
            rl.question("Please enter 2FA code: ", resolve)
        ),
        onError: (err) => console.log(err),
    })

    client.session.save();
    return client;
}

const gamePlay = async(brr) => {
    console.log("GAME HAS STARTED")

    const response = await axios.post("https://game-domain.blum.codes/api/v1/game/play", null, 
        {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "Authorization": `${brr}`,
                "Lang": "en",
                "Priority": "u=1, i",
                "sec-ch-ua": "\"Telegram\";v=\"10.0\", \"Android\";v=\"11\"",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; SM-G960F Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 TelegramBot (like TwitterBot)"
            },
            timeout: 60000, //optional
        },
    )

    console.log("RESPONSE STATUS: " + response.status + "\n\n\n")
    return (response.data);
}

const gameClaim = async(brr, gameData) => {
    console.log("END OF GAME")

    const response = await axios.post("https://game-domain.blum.codes/api/v1/game/claim", gameData, 
        {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": `${brr}`,
                "content-type": "application/json",
                "lang": "en",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Telegram\";v=\"128\"",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "user-agent": "Mozilla/5.0 (Linux; Android 10; SM-G960F Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36 TelegramBot (like TwitterBot)"
            },
            timeout: 60000, //optional
        },
    )

    console.log("GAME END RESP RAW!!!: " + response.data)
    console.log("GAME END RESP STATUS!!!: " + response.status + "\n\n\n")
    console.log("TOKENS: " + gameData.points)
}

const randomPoints = () => {
    const points = Math.floor(Math.random() * (MAX_POINTS - MIN_POINTS + 1)) + MIN_POINTS;
    return points;
}

const processGame = async (client, brr, startTimestamp, playPasses, points) => {
    while (playPasses != 0 ) {

            
        const gameData = await gamePlay(brr);
        console.log("GAME DATA BEFORE POINTS " + JSON.stringify(gameData))
        await randomTimeout(33000, 45000);
        gameData.points = randomPoints();
        points += gameData.points;
        console.log("GAME DATA " + JSON.stringify(gameData))
        await gameClaim(brr, gameData);

        await randomTimeout(2000, 5000);
        
        const data = await balance(brr);

        if ((data.timestamp - startTimestamp) > THIRTY_MINUTES) {
            brr = await login(client);
            startTimestamp = data.timestamp;
        }

        playPasses = data.playPasses;
        console.log("BALANCE: " + data.availableBalance);
        console.log("PLAY PASSES LEFT: " + playPasses)
        console.log("TOKENS HAVE BEEN FARMED: " + points)
    }
    return points;
}

const main = async () => {
    try {
        const client = await tgLogin();
        console.log('loged in tg!');
        let brr = await login(client);

        const dataPlay = await balance(brr);
        let playPasses = dataPlay.playPasses;
        let points = 0;
        console.log("PLAY PASSES LEFT: " + playPasses)

        const startTimestamp = dataPlay.timestamp;
        const endPoints = await processGame(client, brr, startTimestamp, playPasses, points);
        console.log("\n\n\n\n\n")
        console.log("Succes, total tokens have been farmed: " + endPoints)
    }
    catch (error) {
        errorHandler(error)
    }

}

const errorHandler = (error) => {
    if (error.code === 'ECONNABORTED') {
        console.error('TIMEOUT EXCEED ERROR');
    } else if (axios.isAxiosError(error)) {
        console.error('Axios ERROR:', error.message);

    } else {
        console.error('UNDEFINED ERROR:', error);
    }
}

main()
