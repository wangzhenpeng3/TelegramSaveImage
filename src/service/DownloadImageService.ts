import axios from "axios";
import path from "path";
import fs from "fs";
import { Status } from "src/types";
// 图片服务
class DownloadImageService {
    private count = 0;
    private total = 0;
    private filePath = '';
    private folderName = '';
    constructor({ imageArr = [], filePath = '', folderName = '' }) {
        this.total = imageArr.length;
        this.filePath = filePath;
        this.folderName = folderName;
    }
    setFilePath(path = '') {
        this.filePath = path;
    }
    getFilePath() {
        return this.filePath || __dirname
    }
    getFolderName() {
        return this.folderName || '新建文件夹'
    }
    setFolderName(name = '') {
        this.folderName = name;
    }
    getMsg() {
        return `共计${this.total}张图片,已下载${this.count}`
    }
    success() {
        return { code: Status.success, msg: this.getMsg() };
    }
    error(error:any) {
        return { code: Status.error, msg: `${this.getMsg()},下载异常,错误信息${error}` }
    }
    async createFolder(filePath = '') {
        const _path =  path.resolve(filePath);
        // 检查文件夹是否存在
        if (!fs.existsSync(_path)) {
            // 如果文件夹不存在，则创建文件夹
            fs.mkdirSync(_path);
            // console.log('Folder created successfully');
        } else {
            // 如果文件夹已存在
            console.log('Folder already exists');
        }
    }
    async downloadImage(imageArr: any[] = []) {
        console.log(this.getMsg(), 'download-->')
        try {
            const response = await axios({
                method: 'GET',
                url: imageArr[0],
                responseType: 'stream' // 使用流来处理图片数据
            });
            // 创建一个可写流来将数据写入文件
            this.count++
            const imagePath = path.resolve(this.getFilePath(), this.getFolderName(), `${this.count}.jpg`); // 服务器上的保存路径
            const writer = fs.createWriteStream(imagePath);

            // 通过管道将数据写入文件
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            imageArr.splice(0, 1)
            if (imageArr.length > 0) {
                return await this.downloadImage(imageArr)
            } else {
                return this.success()
            }
        } catch (error) {
            return this.error(error)
        }
    }
    destroy() {
        this.total = 0;
        this.count = 0;
        this.filePath = ''
        this.folderName = ''
    }
}

export default DownloadImageService;