/*
 * @Descripttion: 
 * @version: 0.0.1
 * @Author: xiaoxin
 * @Date: 2024-02-21 16:23:39
 * @LastEditors: xiaoxin
 * @LastEditTime: 2024-02-27 18:56:09
 */
// 导包
import { WechatyBuilder, ScanStatus, log } from "wechaty"
import qrcodeTerminal from "qrcode-terminal"
import { sendMessage } from './src/core/sendMessage.js'
import { robotName } from "./config/config.js"

// 扫描二维码
function onScan(qrCode,status){
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        // 在控制台显示二维码
        qrcodeTerminal.generate(qrCode, { small: true })
        const qrcodeImageUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrCode)].join('')
        console.log(`二维码地址: ${qrcodeImageUrl}`)
      } else {
        log.info(`二维码扫描结果: ${ScanStatus[status]} ${status}`)
      }
}

//登录
function onLogin(user){
    log.warn(`当前时间: ${new Date()} --- 机器人:${user} --- 登录成功`)
}

//注销
function onLoout(user){
    log.warn("当前时间: %s --- 机器人:%s --- 登出",new Date(),user)
}

//接收消息
async function onMessage(message){
    await sendMessage(message)
}


//初始化机器人
const bot = WechatyBuilder.build({
    name: robotName,
    puppet: 'wechaty-puppet-wechat4u'
})

//机器人监听事件
bot
.on("scan", onScan)
.on("login",onLogin)
.on("logout", onLoout)
.on("message", onMessage)

//启动机器人
bot
.start()
.then(() => {
    log.warn(`机器人启动成功`);
})
.catch((e) => log.error(e))