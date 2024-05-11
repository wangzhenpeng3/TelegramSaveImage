import { Context } from "koa"
import path from "path";
import fs from "fs";
import DownloadImageService from "src/service/DownloadImage/DownloadImageService";
import ParseHtmlService from "src/service/DownloadImage/ParseHtmlService";
import { DownloadPath, Status } from "src/types";
import FilesService from "src/service/Files";
const { PassThrough } = require("stream");

// 进度事件发射器
// const downloadProgressEmitter = new EventEmitter();

export const downloadImageHandler = async (ctx: Context, next: () => Promise<any>) => {
  const { url, folderName, id } = ctx.query;
  if (!url) {
    ctx.status = 400
    ctx.body = { code: 400, message: 'url参数不能为空' }
    return
  }
  // https://blog.csdn.net/qq_40074694/article/details/120250835 参考文档 Server Sent Events 通信
  ctx.request.socket.setTimeout(0); // 这个方法用于设置socket的超时时间。当设置为0时，表示socket永不超时。这意味着连接将保持打开状态，直到客户端或服务器主动关闭连接。这在长连接和实时通信场景（如SSE - Server-Sent Events）中非常有用。
  ctx.req.socket.setNoDelay(true); // 这个方法用于启用或禁用Nagle算法。当参数为true时，禁用Nagle算法，允许小包的即时传输。这可以减少通信延迟，因为不会等待缓冲区填满再发送数据。这在要求低延迟的应用程序中十分有用，比如实时游戏或交互式应用。
  ctx.req.socket.setKeepAlive(true);  // 这个方法用于设置TCP KeepAlive。当参数为true时，启用TCP的KeepAlive机制，这会定期发送心跳包以维持连接的活跃状态，即使没有数据传输。这有助于确保长时间打开的连接不会由于网络设备的超时设置而被无意中关闭。
  // 设置响应头为事件流
  ctx.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });
  const stream = new PassThrough();
  ctx.status = 200;
  ctx.body = stream;
  ctx.req.on('close', () => {
    console.log('close')
    // 清理工作
    // ImaeService = null;
    // https://telegra.ph/XiuRen-秀人-No8337-雅茹老师-红色情趣服饰性感写真-04-12
    // console.log('https://telegra.ph/HuaYang-花漾show-Vol576-王雨纯-红色轻透上衣性感写真-05-08')
  });
  // 解析url,和文件名
  const pathRegex = /\/([^\/]+)$/;
  const match = (url as string).match(pathRegex);
  if (!match) {
    ctx.status = 400
    ctx.body = { code: 400, message: 'url参数不能为空' }
    return
  }
  const _folderName = folderName as string || match[1]
  const _path = `${__dirname}/${_folderName}`
  const Files = new FilesService(_path);
  const isExist = await Files.hasFolder()
  if (isExist) {
    ctx.body = stream
    stream.write(`data: ${JSON.stringify({ currentProgress: 0, totalProgress: 0, status: Status.error, id, name: _folderName, msg: '该文件夹已存在' })}\n\n`);
    return;
  }
  // 解析html中img src
  const ParseHtml = new ParseHtmlService(url as string)
  const { code, data, msg } = await ParseHtml.getImageBySrcArr()
  if (code !== Status.success) {
    stream.write(`data: ${JSON.stringify({ currentProgress: 0, totalProgress: 0, status: Status.error, id, name: _folderName, msg: 'html解析失败' })}\n\n`);
    return
  }
  let ImaeService = new DownloadImageService()
  ImaeService.setDownloadPath(_path)
  const result: any = await ImaeService.downloadImage({
    imageArr: data, on: (progress: any) => {
      stream.write(`data: ${JSON.stringify({ ...progress, id, name: _folderName })}\n\n`);
    }, error: (progress: any) => {
      stream.write(`data: ${JSON.stringify({ ...progress, id, name: _folderName })}\n\n`);
    }
  })
  ImaeService = null;
}

export const getFileAllHandler = (ctx: Context, next: () => Promise<any>) => {
  ctx.body = 'Not Found'
}
export const errorHandler = (ctx: Context, next: () => Promise<any>) => {
  ctx.body = 'Not Found'
}
export const testHandler = (ctx: Context, next: () => Promise<any>) => {
  // ctx.body = 'Not Found'
}
// Server Sent Events 协议测试
export const sseHandler = (ctx: Context, next: () => Promise<any>) => {
  ctx.request.socket.setTimeout(0);
  ctx.req.socket.setNoDelay(true);
  ctx.req.socket.setKeepAlive(true);

  ctx.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });
  const stream = new PassThrough();

  ctx.status = 200;
  ctx.body = stream;

  setInterval(() => {
    stream.write(`data: ${new Date()}\n\n`);
  }, 1000);

}
