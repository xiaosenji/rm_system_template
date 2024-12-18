export default {
  path: "/room",
  name: "RoomManagement",
  meta: {
    icon: "ep:magic-stick",
    title: "机房管理",
    rank: 2
  },
  children: [
    {
      path: "/room/CreateRoom",
      name: "CreateRoom",
      component: () => import("@/views/room/CreateRoom/index.vue"),
      meta: {
        title: "创建机房"
      }
    },
    {
      path: "/room/RoomList",
      name: "RoomList",
      component: () => import("@/views/room/RoomList/index.vue"),
      meta: {
        title: "我的机房"
      }
    },
    {
      path: "/room/AccessRecord",
      name: "AccessRecord",
      component: () => import("@/views/room/AccessRecord/index.vue"),
      meta: {
        title: "进出记录"
      }
    }
  ]
} satisfies RouteConfigsTable;
