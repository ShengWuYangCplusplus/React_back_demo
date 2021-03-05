import React from "react";
import {
  Badge,
  Dropdown,
  Menu,
  Modal,
  Row,
  Col,
  Upload,
  Button,
  Avatar,
  Input,
  Divider,
  message,
} from "antd";
import screenfull from "screenfull";
import { Link, withRouter } from "react-router-dom";
import YSW_TOOLS from "src/utils/Ysw_tools.js";
import { createFromIconfontCN } from "@ant-design/icons";
import { getUser } from "src/store/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./index.scss";
import { apis } from "../../request/apis";

const store = connect(
  (state) => ({ user: state.user }),
  (dispatch) => bindActionCreators({ getUser }, dispatch)
);

const IconFont = createFromIconfontCN({
  scriptUrl: ["//at.alicdn.com/t/font_1296985_2fkg7vd3vkv.js"],
});
@withRouter
@store
//withRouter一定要写在前面，不然路由变化不会反映到props中去
class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.changeSelf = this.changeSelf.bind(this);
    this.handleName = this.handleName.bind(this);
  }
  state = {
    icon: "arrows-alt",
    count: 100,
    visible: false,
    avatar: this.props.user.avatar,
    showSelf: false,
  };

  componentDidMount() {
    screenfull.onchange(() => {
      this.setState({
        icon: screenfull.isFullscreen ? "shrink" : "arrows-alt",
      });
    });
  }

  componentWillUnmount() {
    screenfull.off("change");
  }

  toggle = () => {
    this.props.onToggle();
  };
  screenfullToggle = () => {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  };
  logout() {
    localStorage.removeItem("token");
    this.props.history.push("/login");
  }
  changeSelf() {
    this.setState({
      showSelf: true,
    });
  }
  onchangeFile = (obj) => {
    if (obj.file.status === "done") {
      if (obj.file.response.code === 0) {
        message.success("头像修改成功");
        this.props.getUser({userId:localStorage.getItem('userId')})
      }
    }
  };
  handleName(){
    // alert("???")
    let value=this.refs.theUserName.state.value
    if(!value.trim()){
      message.error('请输入昵称')
      return false
    }
    apis.System.updateUser({name:value.trim()}).then(
      res=>{
        if(res.code===0){
          message.success('昵称修改成功')
          this.props.getUser({userId:localStorage.getItem('userId')})
        }else{
          message.error(`昵称修改失败:${res.des}`)
        }
      }
    )
  }
  render() {
    const defaultUser={
      avatar: require("./img/04.jpg"), name: "游客" 
    }
    // let theUser = defaultUser;
    let theUser=null;
    if (this.props.user) {
      theUser = this.props.user
    } else if(localStorage.getItem('user')) {
      theUser = JSON.parse(localStorage.getItem('user'))
    }else{
      theUser=defaultUser
    }
    const avatar = theUser.avatar;
    const name = theUser.name;
    const { count, visible } = this.state;
    const { user, collapsed, location } = this.props;
    const notLogin = (
      <div>
        <Link
          to={{ pathname: "/login", state: { from: location } }}
          style={{ color: "rgba(0, 0, 0, 0.65)" }}
        >
          登录
        </Link>
        &nbsp;
        <img src={avatar} alt="" />
      </div>
    );
    const menu = (
      <Menu className="menu">
        <Menu.ItemGroup title="用户中心" className="menu-group">
          <Menu.Item>你好 - {name}</Menu.Item>
          <Menu.Item>
            <span onClick={this.changeSelf}>个人设置</span>
          </Menu.Item>
          <Menu.Item>
            <span onClick={this.logout}>退出登录</span>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    );
    const login = (
      <Dropdown overlay={menu}>
        <img
          onClick={() => this.setState({ visible: true })}
          src={avatar}
          alt=""
        />
      </Dropdown>
    );
    const isLogin = localStorage.getItem("token");
    return (
      <div className="headerbar">
        <IconFont
          type={collapsed ? "icon-liebiaoxiangyou" : "icon-liebiaoxiangzuo"}
          className="trigger"
          onClick={this.toggle}
        />
        <div style={{ lineHeight: "64px", float: "right" }}>
          <ul className="header-ul">
            <li>
              <IconFont type="icon-quanping_huaban" style={{fontSize:'20px'}} onClick={this.screenfullToggle} />
            </li>
            <li onClick={() => this.setState({ count: 0 })}>
              <Badge
                count={isLogin ? count : 0}
                overflowCount={99}
                style={{ marginRight: -17 }}
              >
                <IconFont type="icon-tongzhi1" style={{fontSize:'20px'}} />
              </Badge>
            </li>
            <li>{isLogin ? login : notLogin}</li>
          </ul>
        </div>
        <Modal
          footer={null}
          closable={false}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.setState({ visible: false })}
        >
          <img src={avatar} alt="" width="100%" />
        </Modal>
        <Modal
          title="个人信息"
          footer={null}
          visible={this.state.showSelf}
          onCancel={() => this.setState({ showSelf: false })}
          wrapClassName="userinfo"
        >
          <Row justify="space-around">
            <Col span={4}>修改头像</Col>
            <Col span={12}>
              <Upload
                listType={null}
                name="avatar"
                action="/api/avatar"
                onChange={this.onchangeFile}
                beforeUpload={YSW_TOOLS.beforeAvatarUpload}
                headers={{
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                }}
              >
                <Avatar src={avatar} size="large" />
              </Upload>
            </Col>
            <Col span={4}></Col>
          </Row>
          <Divider></Divider>
          <Row justify="space-around" className="oneRow">
            <Col span={4}>修改昵称</Col>
            <Col span={12}>
              <Input
                placeholder="昵称"
                defaultValue={this.props.user.username}
                ref="theUserName"
              ></Input>
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={this.handleName}>确认修改</Button>
            </Col>
          </Row>
          <Divider></Divider>
          <Row justify="space-around" className="oneRow">
            <Col span={4}>旧密码</Col>
            <Col span={12}>
              <Input placeholder="旧密码"></Input>
            </Col>
            <Col span={4}></Col>
          </Row>
          <Row justify="space-around" className="oneRow">
            <Col span={4}>新密码</Col>
            <Col span={12}>
              <Input placeholder="新密码"></Input>
            </Col>
            <Col span={4}>
              <Button type="primary">确认修改</Button>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

export default HeaderBar;
