import React from "react";
import { Layout } from "antd";
import SiderNav from "../../components/SiderNav";
import ContentMain from "../../components/ContentMain";
import HeaderBar from "../../components/HeaderBar";
import { getUser, initWebSocket,getRoute } from "src/store/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {AllRoute,AllMenu} from 'src/config/route.js'

const { Sider, Header, Content, Footer } = Layout;

const store = connect(
  (state) => ({ user: state.user, websocket: state.websocket,routeArr:state.routeArr,menus:state.menus }),
  (dispatch) => bindActionCreators({ getUser, initWebSocket,getRoute }, dispatch)
);

@store
class Index extends React.Component {
  state = {
    collapsed: false,
  };
  componentWillMount() {
   
    this.init();
  }
  componentWillUnmount() {
    const websocket = this.props.websocket;
    websocket && websocket.close();
  }
  toggle = () => {
    // console.log(this)  状态提升后，到底是谁调用的它
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  init = async () => {
    const userId = localStorage.getItem("userId");
    await this.props.getUser({ userId:userId });
    await this.props.initWebSocket(this.props.user);
    console.log("?????????",this.props.user)
    this.props.getRoute(this.props.user.auth,AllRoute,AllMenu);
  };

  render() {
    // 设置Sider的minHeight可以使左右自适应对齐
    return (
      <div id="page">
        <Layout>
          <Sider collapsible trigger={null} collapsed={this.state.collapsed}>
            <SiderNav menus={this.props.menus} />
          </Sider>
          <Layout>
            <Header style={{ background: "#fff", padding: "0 16px" }}>
              <HeaderBar
                user={this.state.user}
                collapsed={this.state.collapsed}
                onToggle={this.toggle}
              />
            </Header>
            <Content>
              <ContentMain routeArr={this.props.routeArr}/>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              React-Admin @2020 Created by 906536167@qq.com{" "}
              <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com/ShengWuYang"
              >
                github地址
              </a>
            </Footer>
          </Layout>
        </Layout>
      </div>
    );
  }
}
export default Index;
