import LoadableComponent from "src/utils/LoadableComponent";
export const AllRoute = [
    {
        component:{Home: LoadableComponent(() => import("src/routes/Home/index"))},
        path: "/home",
        auth:'Home'
      },
    {
      component:{ User:LoadableComponent(() => import("src/routes/System/User/index"))},
      path: "/system/user",
      auth:'User',
      children: [
        {
          component: {AddUser:LoadableComponent(() =>
          import("src/routes/System/User/add/index")
        )},
          path: "/system/user/add",
          auth:'AddUser'
        },
      ],
    },
    {
      component:{Role: LoadableComponent(() => import("src/routes/System/Role/index"))},
      path: "/system/role",
      auth:'Role'
    },
    {
      component:{Department: LoadableComponent(() =>
      import("src/routes/System/Department/index")
    )},
      path: "/system/department",
      auth:'Department'
    },
    {
      component: {File:LoadableComponent(() => import("src/routes/File/index"))},
      path: "/file",
      auth:'File'
    },
    {
      component: {Notice:LoadableComponent(() => import("src/routes/Notice/index"))},
      path: "/notice",
      auth:'Notice',
      children: [
        {
          component: {AddNotice:LoadableComponent(() =>
          import("src/routes/Notice/add/index")
        )},
          path: "/notice/add",
          auth:'AddNotice'
        },
        {
          component: {DetailNotice:LoadableComponent(() =>
          import("src/routes/Notice/detail/index")
        )},
          path: "/notice/detail",
          auth:'DetailNotice'
        },
      ],
    },
    {
      component: {Chat:LoadableComponent(() => import("src/routes/Chat/index"))},
      path: "/chat",
      auth:'Chat'
    },
  
  ];

  export const AllMenu = [
    {
      title: '首页',
      icon: 'icon-daohangshouye',
      auth:"Home",
      key: '/home'
    },
    {
      title: '文件管理',
      icon: 'icon-wenjianjia',
      auth:"File",
      key: '/file'
    },
    {
      title: '通知管理',
      icon: 'icon-tongzhi',
      auth:"Notice",
      key: '/notice'
    },
    {
      title: '聊天室',
      icon: 'icon-xiaoxi',
      auth:"Chat",
      key: '/chat'
    },
    {
      title: '系统管理',
      icon: 'icon-shezhi',
      auth:"System",
      key: '/system',
      subs:[
        {key: '/system/user', title: '用户管理',auth:"User", icon: 'icon-youjiantou',},
        {key: '/system/role', title: '角色管理', auth:"Role",icon: 'icon-youjiantou',},
        {key: '/system/department', title: '部门管理', auth:"Department",icon: 'icon-youjiantou',},
      ]
    },
  ]
  