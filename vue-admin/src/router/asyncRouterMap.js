import Layout from "@/layout";
export default [
  {
    path: "/homeConfig",
    name: "homeConfig",
    component: Layout,
    alwaysShow: false,
    meta: { title: "router.homeConfig", icon: "table" },
    children: [
      {
        path: "index",
        component: () => import("@/views/homeConfig/index"),
        name: "homeConfigIndex",
        meta: {
          title: "router.homeConfig",
          noCache: true,
        },
      },
    ],
  },
  {
    path: "/userManagement",
    name: "userManagement",
    component: Layout,
    alwaysShow: false,
    meta: { title: "router.userManagement", icon: "table" },
    children: [
      {
        path: "userData",
        component: () => import("@/views/userManagement/userData"),
        name: "userData",
        meta: {
          title: "router.userManagement",
          noCache: true,
        },
      },
    ],
  },
  {
    path: "/category",
    component: Layout,
    meta: { title: "router.sortManagement", icon: "table" },
    children: [
      {
        path: "category",
        component: () => import("@/views/category/list"),
        name: "category",
        meta: {
          noCache: true,
          title: "router.sortManagement",
        },
      },
    ],
  },
  {
    path: "/contract",
    component: Layout,
    meta: { title: "router.contract", icon: "table" },
    children: [
      {
        path: "contract",
        component: () => import("@/views/contract/list"),
        name: "contract",
        meta: {
          noCache: true,
          title: "router.contract",
        },
      },
    ],
  },
  {
    path: "/nft",
    component: Layout,
    redirect: "noredirect",
    name: "nftManagement",
    meta: {
      title: "router.nftManagement",
      icon: "table",
    },
    children: [
      {
        path: "/list",
        component: () => import("@/views/nft/list"),
        name: "nftList",
        meta: {
          title: "router.nftManagement",
          noCache: true,
        },
      },
    ],
  },
  {
    path: "/config",
    component: Layout,
    redirect: "noredirect",
    meta: {
      title: "router.config",
      icon: "table",
    },
    children: [
      {
        path: "webConfig",
        component: () => import("@/views/config/WebConfig"),
        name: "webConfig",
        meta: {
          title: "router.webConfig",
          noCache: true,
        },
      },
      {
        path: "contractConfig",
        component: () => import("@/views/config/ContractConfig"),
        name: "contractConfig",
        meta: {
          title: "router.contractConfig",
          noCache: true,
        },
      },
    ],
  },
  {
    path: "/sys",
    component: Layout,
    redirect: "noredirect",
    name: "system",
    meta: {
      title: "router.systemManagement",
      icon: "system",
    },
    children: [
      {
        path: "admin",
        component: () => import("@/views/sys/admin"),
        name: "admin",
        meta: {
          title: "router.administratorManagement",
          noCache: true,
        },
      },
      {
        path: "log",
        component: () => import("@/views/sys/log"),
        name: "log",
        meta: {
          title: "router.operationLog",
          noCache: true,
        },
      },
      {
        path: "role",
        component: () => import("@/views/sys/role"),
        name: "role",
        meta: {
          title: "router.roleManagement",
          noCache: true,
        },
      },
    ],
  },
  {
    path: "/profile",
    component: Layout,
    redirect: "noredirect",
    name: "profile",
    meta: {
      title: "router.setting",
      icon: "system",
    },
    children: [
      {
        path: "password",
        component: () => import("@/views/profile/password"),
        name: "password",
        meta: {
          title: "router.passwordUpdate",
          noCache: true,
        },
      },
      {
        path: "language",
        component: () => import("@/views/test/index"),
        name: "language",
        meta: {
          title: "router.languageUpdate",
          noCache: true,
        },
      },
    ],
    hidden: true,
  },
  // {
  //   path: "/analysis",
  //   component: Layout,
  //   meta: { title: "数据分析", icon: "table" },
  //   children: [
  //     {
  //       path: "talentAnalysis",
  //       component: () => import("@/views/test/index"),
  //       name: "talentAnalysis",
  //       meta: { title: "数据分析", noCache: true },
  //     },
  //   ],
  // },
];
