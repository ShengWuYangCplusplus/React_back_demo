import React from 'react'
import CustomMenu from "../CustomMenu/index";

// const menus = [
//   // {
//   //   title: '综合大屏',
//   //   icon: 'line-chart',
//   //   key: '/screen'
//   // },
//   {
//     title: '首页',
//     icon: 'icon-daohangshouye',
//     key: '/home'
//   },
//   {
//     title: '文件管理',
//     icon: 'icon-wenjianjia',
//     key: '/home/file'
//   },
//   {
//     title: '通知管理',
//     icon: 'icon-tongzhi',
//     key: '/notice'
//   },
//   {
//     title: '聊天室',
//     icon: 'icon-xiaoxi',
//     key: '/chat'
//   },
//   {
//     title: '系统管理',
//     icon: 'icon-shezhi',
//     key: '/system',
//     subs:[
//       {key: '/system/user', title: '用户管理', icon: 'icon-youjiantou',},
//       {key: '/system/role', title: '角色管理', icon: 'icon-youjiantou',},
//       {key: '/system/department', title: '部门管理', icon: 'icon-youjiantou',},
//     ]
//   },
// ]


class SiderNav extends React.Component {
  render() {

    return (
      <div style={{height: '100vh',overflowY:'scroll'}}>
        <div style={styles.logo}></div>
        <CustomMenu menus={this.props.menus}/>
      </div>
    )
  }
}

const styles = {
  logo: {
    height: '32px',
    background: 'rgba(255, 255, 255, .2)',
    margin: '16px'
  }
}

export default SiderNav