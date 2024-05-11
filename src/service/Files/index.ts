import { Status } from "src/types";

const fs = require('fs');
const path = require('path');

export default class FilesService {
    private dirPath = ''
    // private static instance: FilesService;
    // // 3. 公共静态方法，用于获取单例实例
    // public static getInstance(): FilesService {
    //     // 如果实例不存在，通过私有构造函数创建它
    //     if (!FilesService.instance) {
    //         FilesService.instance = new FilesService();
    //     }
    //     // 返回单例实例
    //     return FilesService.instance;
    // }
    constructor(_path = '') {
        this.dirPath = path.join(_path);
    }
    // 获取全部文件及文件夹
    getFilesAndFolderAll() {
        return new Promise((resolve, reject) => {
            fs.readdir(this.dirPath, (err: any, items: any) => {
                if (err) {
                    return reject(err);
                }

                // 创建一个数组来保存结果
                const results = [];

                // 记录待检查的项数
                let pending = items.length;
                if (!pending) {
                    // 如果没有项，直接返回空数组
                    return resolve(results);
                }

                // 遍历文件夹中的每一项
                items.forEach((item) => {
                    const itemPath = path.join(this.dirPath, item);

                    // 获取文件或文件夹的状态
                    fs.stat(itemPath, (err: any, stats: any) => {
                        if (err) {
                            return reject(err);
                        }

                        // 根据状态判断是文件还是文件夹，并添加到结果中
                        if (stats.isFile()) {
                            results.push({ item: item, type: 'file' });
                        } else if (stats.isDirectory()) {
                            results.push({ item: item, type: 'folder' });
                        }
                        // 当所有项都检查完毕时，返回结果
                        if (!--pending) {
                            resolve(results)
                        }
                    });
                });
            });
        });
    }
    // 获取当前目录的文件夹
    async getFolders() {
        try {
            const filesAndDirs = await fs.readdir(this.dirPath);
            const dirs = [];
            for (const fileOrDir of filesAndDirs) {
                const fullPath = path.join(this.dirPath, fileOrDir);
                const stat = await fs.stat(fullPath);

                if (stat.isDirectory()) {
                    dirs.push(fileOrDir);
                }
            }

            return dirs;
        } catch (err) {
            console.error('Error reading directory:', err);
            throw err; // 抛出错误，以便可以在函数外部捕获
        }
    }
    // 获取文件夹是否存在
    async hasFolder() {
        return fs.existsSync(this.dirPath)
    }

    // 删除文件夹
    async delFolder() {
        try {
            return await fs.rmSync(`${this.dirPath}`, { recursive: true });
        } catch (error) {
            return false;
        }
    }
    // 创建文件或者文件夹
    syncCreateFolder() {
        return fs.mkdirSync(`${this.dirPath}`, { recursive: true });
    }
    // 写入文件流
    createWriteStream({ fileName, pipe, success, fail }) {
        fs.mkdirSync(this.dirPath, { recursive: true });
        // 创建一个写入流
        const localFilePath = `${this.dirPath}/${fileName}` // 文件下载路径
        const fileStream = fs.createWriteStream(localFilePath);
        if (!pipe) {
            throw new Error('pipe not a function')
        }
        // 将响应流通过管道重定向到文件写入流
        pipe.pipe(fileStream);
        // 文件结束时，关闭流
        fileStream.on('finish', function () {
            fileStream.close();
            // console.log('Download completed!');
            success?.(Status.success)
        });
        fileStream.on("error", function (error: any) {
            fileStream.close();
            // console.log(error, 'Download error!');
            fail?.(Status.error)
        });
    }

}