import axios from "axios";
import * as cheerio from 'cheerio';
import { ParseHtmlTag, Status } from "src/types";

class ParseHtmlService {
    private url: string = ''; // 你要解析的网址
    constructor(url = '') {
        if (!url) {
            throw new Error('url not a null')
        }
        this.url = url
    }
    async getImageBySrcArr(tag = ParseHtmlTag.image) {
        const urlRegex = /^(?:https?:\/\/)?(?:www\.)?([^\/\n]+)/;
        const match = this.url.match(urlRegex);
        try {
            // 使用axios获取网页内容
            const response = await axios.get(this.url);
            const html = response.data;
            // 使用cheerio加载HTML
            const $ = cheerio.load(html);
            // 举例：获取所有的链接
            const imgUrlArr = [];
            $(tag).each((i, element: any) => {
                if (element.name === ParseHtmlTag.image) {
                    imgUrlArr.push(`${match[0]}${element.attribs.src}`)
                }
            });
            // 设置响应体为提取的元素
            return { code: Status.success, data: imgUrlArr }
        } catch (error) {
            return { code: Status.error, msg: `错误信息${error}` }
        }
    }
}
export default ParseHtmlService;