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
    //消息类型
    const type = message.type();
    //是否是自己发送 是：true；否：false
    const myself = message.self();
    //是否是房间消息 是：true；否： null
    const room = message.room();
    //是否@我
    const mentionSelf = await message.mentionSelf();
    // 备注名称
    const remarkName = await message.talker().alias();
    // 群名称
    const roomName = (await room?.topic()) || null;
    // 消息发送人
    const talker = message.talker();

    //这里只处理文本、私聊在白名单、群聊@机器人并且在白名单 的消息，如需处理其他消息自行修改
    //只处理文本消息 且不是自己发送的
    if (type === MessageType.MESSAGE_TYPE_TEXT && myself === false) {
        //房间内的消息需要@ 且群聊在名单内
        if ((room != null && mentionSelf == true && MYCONFIG.roomWhiteList.includes(roomName))
            ||
            (room == null && MYCONFIG.aliasWhiteList.includes(remarkName))
        ) {
            reMsg(message);
        }
    }
}

/**
 * 回复的消息的逻辑
 * @param message 消息对象
 */
async function reMsg(message) {
    //是否是房间消息 是：true；否： null
    const room = message.room();
    //是否@我
    const mentionSelf = await message.mentionSelf();
    // 群名称
    const roomName = (await room?.topic()) || null;
    // 备注名称
    const remarkName = await message.talker().alias();
    // 消息发送人
    const talker = message.talker();

    log.info(`\n 消息发送时间:${message.date()} \n 消息发送人:${talker} \n 消息类型:${message.type()} \n 消息是否@我:${mentionSelf} \n 消息内容:${message.text()} `)

    //1、简单返回消息
    //房间内的消息需要@ 且群聊在名单内
    // if (room != null && mentionSelf == true && MYCONFIG.roomWhiteList.includes(roomName)) {
    //     room.say(`房间内消息自动回复 @by ${MYCONFIG.robotName}`, talker)
    // }//非房间内消息，且发送人备注在名单内
    // else if (room == null && MYCONFIG.aliasWhiteList.includes(remarkName)) {
    //     talker.say(`私聊消息自动回复 @by ${MYCONFIG.robotName}`)
    // }

    //2、这里通过接口进行返回，后端接口地址在config.js中，可以自行配置后端，可接入各类AI接口进行消息处理
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
                message.payload.listenerId == undefined ? null : message.payload.listenerId ,
                //群聊才有房间ID
                message.payload.roomId == undefined ? null : message.payload.roomId))
    }).then(result => {
        var reMsg = result.data.msg;
        //房间内的消息需要@ 且群聊在名单内
        if (room != null && mentionSelf == true && MYCONFIG.roomWhiteList.includes(roomName)) {
            room.say(`${(reMsg)}\n @by ${MYCONFIG.robotName}`, talker)
        }//非房间内消息，且发送人备注在名单内
        else if (room == null && MYCONFIG.aliasWhiteList.includes(remarkName)) {
            talker.say(`${(reMsg)}\n @by ${MYCONFIG.robotName}`)
        }
    }).catch(response => {
        log.error(`异常响应：${response}`);
        return `异常响应：${responese}`;
    })
}