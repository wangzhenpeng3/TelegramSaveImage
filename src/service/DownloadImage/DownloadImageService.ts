import axios from "axios";
import FilesService from "../Files";
import { Status } from "src/types";

// 图片服务
class DownloadImageService {
    private downloadPath = '';
    setDownloadPath(downloadPath = '') {
        this.downloadPath = downloadPath;
    }
    async downloadImage({ imageArr, on, error }: { imageArr: any[], on: Function, error?: Function }) {
        let totalProgress = imageArr.length
        let currentProgress = 0
        try {
            if (!this.downloadPath) {
                throw '下载路径不存在'
            }
            const Files = new FilesService(this.downloadPath)
            for (let i = 0; i < imageArr.length; i++) {
                try {
                    axios({
                        method: 'GET',
                        url: imageArr[i],
                        responseType: 'stream' // 使用流来处理图片数据
                    }).then((response) => {
                        Files.createWriteStream({
                            fileName: `${i + 1}.jpg`, pipe: response.data, success: async () => {
                                currentProgress++
                                on({ currentProgress, totalProgress, status: currentProgress === totalProgress ? Status.success : Status.progress })
                            }, fail: (error: any) => {
                                currentProgress++
                                error({ currentProgress, totalProgress, status: Status.error })
                            }
                        })
                    });
                } catch (error) {
                    error({ currentProgress, totalProgress, msg: error, status: Status.error })
                    break;
                    // 根据你的需要，你可以在这里决定是中断循环还是继续
                    // break; // 如果你想在遇到错误时停止请求
                    // continue; // 如果你想忽略错误并继续下一个请求
                }
            }
        } catch (errorInfo) {
            error({ currentProgress, totalProgress, msg: errorInfo, status: Status.error })
        }
    }
}

export default DownloadImageService;