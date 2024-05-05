import { Context } from "koa"
import path from "path";
import fs from "fs";
import DownloadImageService from "src/service/DownloadImageService";
import ParseHtmlService from "src/service/ParseHtmlService";
import { DownloadPath, Status } from "src/types";



export const downloadImageHandler = async (ctx: Context, next: () => Promise<any>) => {
  const { url, folderName, isDel } = ctx.query;
  if (!url) {
    ctx.status = 400
    ctx.body = 'url参数不能为空'
  }
  const pathRegex = /\/([^\/]+)$/;
  const match = (url as string).match(pathRegex);
  const _folderName = folderName as string || match[1]
  const _path = path.resolve(`${DownloadPath.image}/${_folderName}`);
  if (isDel) {
    try {
      fs.rmSync(`${_path}`, { recursive: true });
      ctx.status = 200
      ctx.body = '文件夹清空'
    } catch(err) {
      ctx.status = 200
      ctx.body = '文件夹清空'
    }
    return
  }
  const ParseHtml = new ParseHtmlService(url as string)
  const { code, data, msg } = await ParseHtml.getImageBySrcArr()
  if (code !== Status.success) {
    ctx.status = 500
    ctx.body = msg
    return
  }

  const ImaeService = new DownloadImageService({ imageArr: data, filePath: DownloadPath.image, folderName: _folderName })
  ImaeService.createFolder(ImaeService.getFilePath()) // 创建路径
  ImaeService.createFolder(`${ImaeService.getFilePath()}/${ImaeService.getFolderName()}`) // 创建路径
  const result = await ImaeService.downloadImage(data)
  ImaeService.destroy();
  if (result.code !== Status.success) {
    ctx.status = 500
  } else {
    ctx.status = 200
  }
  ctx.body = result.msg
}

export const errorHandler = (ctx: Context, next: () => Promise<any>) => {
  ctx.body = 'Not Found'
}