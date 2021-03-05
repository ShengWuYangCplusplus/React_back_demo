import React from "react";
import BGParticle from "../../utils/BGParticle";
import { Form, Input, Button, Checkbox, notification,message } from "antd";
import "./style.scss";
import { withRouter } from "react-router-dom";
import Loading2 from "../../components/Loading2";
// import {preloadingImages} from '../../utils/utils'
import "animate.css";

import login_back from "../../assets/img/city_02.jpg";
import axios from 'axios'
import Base64 from 'base-64'

const url = require("src/assets/img/car_01.jpg");
// const imgs = [
//   'https://github.com/zhangZhiHao1996/image-store/blob/master/react-admin-master/slide1.jpg?raw=true',
//   'https://github.com/zhangZhiHao1996/image-store/blob/master/react-admin-master/slide2.jpg?raw=true',
//   'https://github.com/zhangZhiHao1996/image-store/blob/master/react-admin-master/slide3.jpg?raw=true',
//   'https://github.com/zhangZhiHao1996/image-store/blob/master/react-admin-master/slide4.jpg?raw=true'
// ]
@withRouter
class Login extends React.Component {
  state = {
    showBox: "login", //展示当前表单
    url: "", //背景图片
    loading: false,
    loading2: false,
  };
  componentDidMount() {
    localStorage.clear();
    setTimeout(() => {
      this.initPage();
      
    }, 300);
    // preloadingImages(imgs)
    //预加载下一个页面的图片，预加载了第二次为什么还会去请求图片资源？
  }

  componentWillUnmount() {
    this.particle && this.particle.destory();
    notification.destroy();
  }
  //载入页面时的一些处理
  initPage = () => {
    this.setState({
      loading: false,
    });
    this.loadImageAsync(url)
      .then((url) => {
        this.setState({
          loading: false,
          // url
        });
      })
      .then(() => {
        //为什么写在then里？id为backgroundBox的DOM元素是在loading为false时才有，而上面的setState可能是异步的，必须等到setState执行完成后才去获取dom
        this.particle = new BGParticle("backgroundBox");
        this.particle.init();
        notification.open({
          message: (
            <ul>
              <li>初始账号：admin</li>
              <li>初始密码：654321</li>
            </ul>
          ),
          duration: 0,
          className: "login-notification",
        });
      });
  };
  //切换showbox
  switchShowBox = (box) => {
    this.setState({
      showBox: box,
    });
  };

  //登录的背景图太大，等载入完后再显示，实际上是图片预加载，
  loadImageAsync(url) {
    return new Promise(function (resolve, reject) {
      const image = new Image();
      image.onload = function () {
        resolve(url);
      };
      image.onerror = function () {
        console.log("图片载入错误");
      };
      image.src = url;
    });
  }
  onFinish = (values) => {
    let str = values.username.trim() + ":" + values.password.trim();
    let tempStr = Base64.encode(str);
    let obj = {};
    axios
      .post("/token", obj, {
        headers: {
          Authorization: "Basic " + tempStr,
        },
      })
      .then((result) => {
        let res = result.data;
        console.log("theres", res);
        if (res.code === 0) {
          const { from } = this.props.location.state || {
            from: { pathname: "/" },
          };
          localStorage.setItem('user',JSON.stringify(res.data))
          localStorage.setItem('userId',res.data._id)
          localStorage.setItem("token", res.token);
          this.props.history.push(from);
        } else {
          message.error(`${res.des}`)
        }
      }).catch(
        err=>{
          console.log(JSON.stringify(err))
          message.error(`${err.response.data}`)
        }
      );
  };
  render() {
    const { showBox, loading } = this.state;
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const tailLayout = {
      wrapperCol: { offset: 4, span: 20 },
    };

    return (
      <div id="login-page">
        {loading ? (
          <div>
            <h3 style={styles.loadingTitle} className="animated bounceInLeft">
              载入中...
            </h3>
            <Loading2 />
          </div>
        ) : (
          <div>
            <div id="backgroundBox" style={styles.backgroundBox} />
            <div className="container">
              <Form
                {...layout}
                onFinish={this.onFinish}
                name="basic"
                initialValues={{ remember: true }}
              >
                <Form.Item
                  label="账号"
                  name="username"
                  rules={[{ required: true, message: "请输入账号!" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="密码"
                  name="password"
                  rules={[{ required: true, message: "请输入密码!" }]}
                >
                  <Input type="password" />
                </Form.Item>

                <Form.Item
                  {...tailLayout}
                  name="remember"
                  valuePropName="checked"
                >
                  <Checkbox>记住密码</Checkbox>
                </Form.Item>

                <Form.Item {...tailLayout}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const styles = {
  backgroundBox: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${login_back})`,
    backgroundSize: "100% 100%",
    transition: "all .5s",
  },
  focus: {
    // transform: 'scale(0.7)',
    width: "20px",
    opacity: 1,
  },
  loadingBox: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  loadingTitle: {
    position: "fixed",
    top: "50%",
    left: "50%",
    marginLeft: -45,
    marginTop: -18,
    color: "#000",
    fontWeight: 500,
    fontSize: 24,
  },
};

export default Login;
