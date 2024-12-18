export default {
  path: "/approval",
  name: "ApprovalManagement",
  meta: {
    icon: "ep:magic-stick",
    title: "审批管理",
    rank: 4
  },
  children: [
    {
      path: "/request/MyApproval",
      name: "MyApproval",
      component: () => import("@/views/approval/MyApproval/index.vue"),
      meta: {
        title: "我的审批"
      }
    },
    {
      path: "/approval/ApprovalList",
      name: "ApprovalList",
      component: () => import("@/views/approval/ApprovalList/index.vue"),
      meta: {
        title: "审批记录"
      }
    }
  ]
} satisfies RouteConfigsTable;
