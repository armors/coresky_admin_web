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
        permissions: ['POST /admin/adv/list'],
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
        permissions: ['POST /admin/user/list'],
        meta: {
          title: "router.userManagement",
          noCache: true,
        },
      },
      {
        path: "airDropScore",
        component: () => import("@/views/userManagement/airDropScore"),
        name: "airDropScore",
        permissions: ['POST /admin/user/airDrop'],
        meta: {
          title: "积分发放",
          noCache: true,
        },
      },
      {
        path: "airDropRewards",
        component: () => import("@/views/userManagement/airDropRewards"),
        name: "airDropRewards",
        permissions: ['POST /admin/user/airDropRewards'],
        meta: {
          title: "彩票发放",
          noCache: true,
        },
      },
    ],
  },
  {
    path: "/category",
    component: Layout,
    alwaysShow: false,
    meta: { title: "router.sortManagement", icon: "table" },
    children: [
      {
        path: "category",
        component: () => import("@/views/category/list"),
        permissions: ['POST /admin/category/list'],
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
        permissions: ['POST /admin/contract/list'],
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
        permissions: ['POST /admin/nft/list'],
        name: "nftList",
        meta: {
          title: "router.nftManagement",
          noCache: true,
        },
      },
    ],
  },
  // {
  //   path: "/config",
  //   component: Layout,
  //   redirect: "noredirect",
  //   meta: {
  //     title: "router.config",
  //     icon: "table",
  //   },
  //   children: [
  //     {
  //       path: "webConfig",
  //       component: () => import("@/views/config/WebConfig"),
  //       name: "webConfig",
  //       meta: {
  //         title: "router.webConfig",
  //         noCache: true,
  //       },
  //     },
  //     {
  //       path: "contractConfig",
  //       component: () => import("@/views/config/ContractConfig"),
  //       name: "contractConfig",
  //       meta: {
  //         title: "router.contractConfig",
  //         noCache: true,
  //       },
  //     },
  //   ],
  // },
  {
    path: "/launchpad",
    component: Layout,
    permissions: ['POST /admin/launchpad/list'],
    meta: {
      title: "launchpad管理",
      icon: "table",
    },
    children: [
      {
        path: "launchpadList",
        component: () => import("@/views/launchpad/launchpadList"),
        name: "launchpadList",
        meta: {
          title: "launchpad管理",
          noCache: true,
        },
      },
      {
        path: "launchpadInfo",
        component: () => import("@/views/launchpad/launchpadInfo"),
        name: "launchpadInfo",
        hidden: true,
        meta: {
          title: "launchpad详情",
          noCache: true,
        },
      },

    ],
  },
  {
    path: "/rewardRule",
    component: Layout,
    meta: { title: "奖励分类管理", icon: "table" },
    children: [
      {
        path: "rewardList",
        component: () => import("@/views/rewardRule/rewardList"),
        name: "rewardList",
        permissions: ['POST /admin/reward/list'],
        meta: {
          title: "奖励分类管理",
          noCache: true,
        },
      }
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
        permissions: ['POST /admin/adminuser/list'],
        meta: {
          title: "router.administratorManagement",
          noCache: true,
        },
      },
      {
        path: "log",
        component: () => import("@/views/sys/log"),
        name: "log",
        permissions: ['POST /admin/log/list'],
        meta: {
          title: "router.operationLog",
          noCache: true,
        },
      },
      {
        path: "role",
        component: () => import("@/views/sys/role"),
        permissions: ['POST /admin/role/list'],
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
];
