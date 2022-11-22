import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken, setToken } from "@/utils/auth";
import { isRelogin } from "@/utils/request";
import auth from "@/plugins/auth";


NProgress.configure({ showSpinner: false });

const whiteList = ["/login", "/auth-redirect", "/bind", "/register"];

router.beforeEach((to, from, next) => {
  NProgress.start();
  let token = to.query.token;

  if (token) {
    store.commit("SET_ROLES", []);
    setToken(token);
    const query = JSON.parse(JSON.stringify(to.query));
    delete query.token;
    next({ path: to.path, query });
    return;
  }

  if (whiteList.indexOf(to.path) !== -1) {
    // 未登录且要跳转的页面不是登录页
    next();
  } else {
    if (getToken()) {
      to.meta.title && store.dispatch("settings/setTitle", to.meta.title);
      if (store.getters.roles.length === 0) {
        // isRelogin.show = true;
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch("GetInfo")
          .then(() => {
            isRelogin.show = false;
            store
              .dispatch("GenerateRoutes", store.getters.permissions)
              .then((accessRoutes) => {
                // 根据roles权限生成可访问的路由表
                // router.addRoutes(accessRoutes); // 动态添加可访问路由表
                next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
              });
          })
          .catch((err) => {
            store.dispatch("LogOut").then(() => {
              Message.error(err);
              next({ path: "/" });
            });
          });
      } else {
        next();
      }
    } else {
      next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
