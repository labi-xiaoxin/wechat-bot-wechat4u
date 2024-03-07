/*
 * @Descripttion: 
 * @version: 0.0.1
 * @Author: xiaoxin
 * @Date: 2024-03-06 13:22:07
 * @LastEditors: xiaoxin
 * @LastEditTime: 2024-03-06 15:58:03
 */
/**
 * 这里只封装一些常用对象，如需微调自行查看https://platform.openai.com/docs/api-reference/chat/create文档进行微调
 */
export class ChatGPTModel {
    /**
     * 模型
     * 获取：https://platform.openai.com/docs/models/model-endpoint-compatibility
     * string
     */
    model;
    /**
     * 对话消息
     * array
     */
    messages;
    /**
     * 聊天完成过程中可以生成的最大令牌数。
     * integer or null 
     * 默认值为不同模型不同的值
     */
    max_tokens;
    /**
     * 使用的采样温度，介于0和2之间。较高的值(如0.8)将使输出更具随机性，而较低的值(如0.2)将使输出更具针对性和确定性。
     * number or null
     * 默认1
     */
    temperature;
    /**
     * 流输出
     */
    stream;


    /**
     * 构造器
     */
    constructor(model, messages,max_tokens,temperature) {
        this.model = model;
        this.messages = messages;
        this.max_tokens = max_tokens;
        this.temperature = temperature;
        this.stream = false
    }
}

 