import { log } from "wechaty"
import * as MessageType from "../entity/Message-Type.js"
import * as MYCONFIG from "../../config.js"
import axios from "axios"
import { WxPushData } from "../../wx-push-data.js"



/**
 * 处理消息是否需要回复
 * @param message 消息对象
 */
export async function sendMessage(message) {
    //1、判断消息是否符合逻辑
    var checkResult = checkMessage(message);
    if (!checkResult) {
        return
    }
    //2、发送后端处理消息,并返回发送微信
    forwardMsg(message);
}

/**
 * 判断消息是否符合逻辑
 * 
 * @param {Message} message 消息 
 * @returns 符合逻辑返回true；否则返回false
 */
function checkMessage(message) {
    //消息类型不是文本
    if (message.type() != MessageType.MESSAGE_TYPE_TEXT) {
        return false
    }
    //自己发送的消息不处理
    if (message.self()) {
        return false
    }
    //引用的文本不处理
    const regexp = /「[^」]+」\n- - - - - - - - - - - - - -/;
    if (regexp.test(message.text())) {
        return false
    }
    //非白名单内的不处理
    if (isRoomOrPrivate(message) == 0) {
        return false;
    }
    return true;
}

/**
 * 判断消息是否
 * 
 *      是房间消息且@机器人，则返回1
 *      是私聊且在白名单内，则返回2
 *      否则返回0
 * 
 * @param {Message} message 消息内容
 */
async function isRoomOrPrivate(message) {
    //房间内的消息需要@ 且群聊在名单内
    if (message.room() != null && await message.mentionSelf() == true && MYCONFIG.roomWhiteList.includes((await room?.topic()) || null)) {
        return 1;
    }//非房间内消息，且发送人备注在名单内
    else if (message.room() == null && MYCONFIG.aliasWhiteList.includes(await message.talker().alias())) {
        return 2;
    } else {
        return 0;
    }
}

/**
 * 发送后端处理消息，并返回发送微信
 * @param {Message} message 消息对象
 */
async function forwardMsg(message) {
    log.info(`\n 消息发送时间:${message.date()} 
    消息发送人:${message.talker()} 
    消息类型:${message.type()} 
    消息是否@我:${await message.mentionSelf()} 
    消息内容:${message.text()} `)

    //1、简单返回消息
    // sendSay(message,"你好");

    //2、发送后端
    axios({
        url: MYCONFIG.msgPushUrl,
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(
            new WxPushData(
                //消息
                message.text(),
                //消息发送人备注
                await message.talker().alias(),
                //消息发送者ID 微信ID不是永久性
                message.payload.talkerId,
                //私聊才有listenerID
                message.payload.listenerId == undefined ? null : message.payload.listenerId,
                //群聊才有房间ID
                message.payload.roomId == undefined ? null : message.payload.roomId))
    }).then(result => {
        var reMsg = result.data.msg;
        sendSay(message, reMsg);
    }).catch(response => {
        log.error(`异常响应：${response}`);
        sendSay(message, `异常响应:${response}`);
        return `异常响应：${responese}`;
    })
}

/**
 * 发送回复逻辑
 * 
 *      区分群聊私聊
 * @param {Message} message 消息内容
 * @param {String} reStr 回复内容
 */
async function sendSay(message, reStr) {
    const isROP = await isRoomOrPrivate(message);
    //房间内消息
    if (isROP == 1) {
        message.room().say(`${(reStr)}\n @by ${MYCONFIG.robotName}`, message.talker())
    } else if (isROP == 2) {
        //私聊消息
        message.talker().say(`${(reStr)}\n @by ${MYCONFIG.robotName}`)
    }
}