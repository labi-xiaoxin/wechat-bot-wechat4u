import { HttpsProxyAgent } from "https-proxy-agent"
import axios from "axios"
import { PROXY_CONFIG } from "./config/config-proxy.js";
import * as CHATGPT_CONFIG from "./config/config-chatgpt.js"

//代理配置
const agent = new HttpsProxyAgent(PROXY_CONFIG);
//对话参数配置
let data = JSON.stringify({
    "model": CHATGPT_CONFIG.CHATGPT_MODEL,
    "messages": [
        {
            "role": "user",
            "content": "你好？”"
        }
    ],
    "max_tokens": 1024,
    "temperature": 1,
    "stream": false
});
//请求参数配置
let config = {
    timeout: 120000,
    method: 'post',
    maxBodyLength: Infinity,
    url: CHATGPT_CONFIG.CHATGPT_URL,
    headers: {
        'Authorization': `Bearer ${CHATGPT_CONFIG.CHATGPT_API_KEY}`,
        'Content-Type': 'application/json'
    },
    httpsAgent: agent,
    data: data
};

axios.request(config)
    .then((response) => {
        console.log("返回消息：" + JSON.stringify(response.data));
        console.log("\n 测试成功");
    })
    .catch((error) => {
        console.log("异常消息：" + error);
        console.log("\n 测试失败")
    });
