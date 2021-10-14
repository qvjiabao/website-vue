import axios from "axios";
import { Message, MessageBox } from "element-ui";
import { UserModule } from "@/store/modules/user";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
});

// Request interceptors
service.interceptors.request.use(
  config => {
    if (UserModule.token) {
      config.headers["X-Access-Token"] = UserModule.token;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// Response interceptors
service.interceptors.response.use(
  response => {
    // Some example codes here:
    // code == 20000: success
    // code == 50001: invalid access token
    // code == 50002: already login in other place
    // code == 50003: access token expired
    // code == 50004: invalid user (user not exist)
    // code == 50005: username or password is incorrect
    // You can change this part for your own usage.
    const res = response.data;
    if (res.code !== 200) {
      Message({
        message: res.msg || "Error",
        type: "error",
        duration: 5 * 1000
      });
      if (res.code === 500 || res.code === 501 || res.code === 502) {
        MessageBox.confirm(
          "您已注销，请尝试再次登录。",
          "注销",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          UserModule.ResetToken();
          location.reload(); // To prevent bugs from vue-router
        });
      }
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return response.data;
    }
  },
  error => {
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
