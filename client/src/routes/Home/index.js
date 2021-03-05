import React from "react";
import { Carousel } from "antd";
import "./style.css";
import { inject, observer } from "mobx-react/index";
import imgA from "../../assets/img/car_01.jpg";
import imgB from "../../assets/img/car_02.jpg";
import imgC from "../../assets/img/car_03.jpg";
import imgD from "../../assets/img/car_04.jpg";
import ZoomPic from "./js/ZoomPic";
import "./css/css.css";
import { withRouter } from "react-router-dom";
const imgs = [imgA, imgB, imgC, imgD];
import RcViewer from '@hanyk/rc-viewer'

@withRouter
class Home extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="home">
        <div>
          <RcViewer >
            <img src={require("../../assets/img/block/园区1.jpg")} alt="Picture 3" />
        </RcViewer>
        </div>
        <div id="jswbox">
        <pre className="prev">prev</pre>

        <pre className="next">next</pre>

        <ul>
          <li>
            <img src={require("./images/1.jpg")} />
          </li>

          <li>
            <img src={require("./images/2.jpg")} />
          </li>

          <li>
            <img src={require("./images/3.jpg")} />
          </li>

          <li>
            <img src={require("./images/4.jpg")} />
          </li>

          <li>
            <img src={require("./images/5.jpg")} />
          </li>

          <li>
            <img src={require("./images/6.jpg")} />
          </li>

          <li>
            <img src={require("./images/7.jpg")} />
          </li>
        </ul>
      </div>
      </div>
      
    );
  }
  componentDidMount() {
    new ZoomPic("jswbox");
  }
}

const styles = {
  bg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "calc(100vh - 64px)",
  },
};

export default Home;
