import axios from "axios";
import { Notification, MessageBox, Message, Loading } from "element-ui";
import store from "@/store";
import { getToken, removeToken } from "@/utils/auth";
import errorCode from "@/utils/errorCode";
import { tansParams, blobValidate } from "@/utils/ruoyi";
import { saveAs } from "file-saver";
import qs from "qs";

let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = { show: false };
let baseURL = process.env.VUE_APP_BASE_API;
// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: baseURL,
  // 超时
  timeout: 10000,
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    var method = config.method.toLowerCase();

    // console.log(baseURL + "/admin/storage/upload", config.url);
    if (config.url == (baseURL + "/admin/storage/create")) {
      // config.headers = { "Content-Type": "multipart/form-data" };
      // config.data = data;
      console.log(config);
    } else {
      if (method == "post") {
        config.data = qs.stringify(config.data);
      } else {
        config.data = data;
      }
    }

    if (getToken()) {
      config.headers["Coresky-Admin-Token"] = getToken();
    }
    // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = config.url + "?" + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.errno || 0;
    // 获取错误信息
    const msg = errorCode[code] || res.data.errmsg || errorCode["default"];
    // 二进制数据则直接返回
    if (
      res.request.responseType === "blob" ||
      res.request.responseType === "arraybuffer"
    ) {
      return res.data;
    }
    if (code === 506) {
      if (!isRelogin.show) {
        isRelogin.show = true;
        MessageBox.confirm(
          "登录状态已过期，您可以继续留在该页面，或者重新登录",
          "系统提示",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            isRelogin.show = false;
            removeToken();
            location.reload();
            // store.dispatch("LogOut").then(() => {
            //   // location.href = location.href;
            //   location.reload();
            // });
          })
          .catch(() => {
            isRelogin.show = false;
          });
      }
      return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
    } else if (code !== 0) {
      Notification({
        message: msg,
        duration: 1 * 1000,
        type: "error",
      });
      return Promise.reject(new Error(msg));
    } else {
      return res.data;
    }
  },
  (error) => {
    console.log("err" + error);
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    Notification({
      message: message,
      duration: 3 * 1000,
      type: "error",
    });
    return Promise.reject(error);
  }
);

// 通用下载方法
export function download(url, params, filename) {
  downloadLoadingInstance = Loading.service({
    text: "正在下载数据，请稍候",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
  return service
    .post(url, params, {
      transformRequest: [
        (params) => {
          return tansParams(params);
        },
      ],
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      responseType: "blob",
    })
    .then(async (data) => {
      const isLogin = await blobValidate(data);
      if (isLogin) {
        const blob = new Blob([data]);
        saveAs(blob, filename);
      } else {
        const resText = await data.text();
        const rspObj = JSON.parse(resText);
        const errMsg =
          errorCode[rspObj.code] || rspObj.msg || errorCode["default"];
        Message.error(errMsg);
      }
      downloadLoadingInstance.close();
    })
    .catch((r) => {
      console.error(r);
      Message.error("下载文件出现错误，请联系管理员！");
      downloadLoadingInstance.close();
    });
}

export default service;
