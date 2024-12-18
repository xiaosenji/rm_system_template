export default {
  path: "/request",
  name: "RequestManagement",
  meta: {
    icon: "ep:magic-stick",
    title: "进出管理",
    rank: 3
  },
  children: [
    {
      path: "/request/CreateRequest",
      name: "CreateRequest",
      component: () => import("@/views/request/CreateRequest/index.vue"),
      meta: {
        title: "创建申请"
      }
    },
    {
      path: "/request/MyRequest",
      name: "MyRequest",
      component: () => import("@/views/request/MyRequest/index.vue"),
      meta: {
        title: "我的申请"
      }
    }
  ]
} satisfies RouteConfigsTable;
