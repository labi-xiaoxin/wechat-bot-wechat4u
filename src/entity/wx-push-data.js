/*
 * @Descripttion: 微信消息推送对象
 * @version: 0.0.1
 * @Author: xiaoxin
 * @Date: 2024-02-02 17:37:47
 * @LastEditors: xiaoxin
 * @LastEditTime: 2024-02-04 16:24:59
 */
export class WxPushData {
    /**
     * 消息内容
     */
    content;
    /**
     * 消息发送人
     */
    contact;
    /**
     * 消息发送人ID
     */
    talkerId;
    /**
     * 监听ID 私聊才有
     */
    listenerId;
    /**
     * 房间ID 群聊才有
     */
    roomId;


    /**
     * 构造器
     * @param content 消息内容 
     * @param contact  消息发送人
     */
    constructor(content, contact,talkerId,listenerId,roomId) {
        this.content = content;
        this.contact = contact;
        this.talkerId = talkerId;
        this.listenerId = listenerId;
        this.roomId = roomId;
    }
}

 