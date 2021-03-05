import React, { Component } from "react";
import { Button } from "antd";
import "./Header.scss";
import {getDayTime} from 'src/utils/Moment.js'
const hashHistory = require("history").createHashHistory()
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: getDayTime(),
    };
  }
  componentDidMount() {
    this.timerID = setInterval(
        () => this.tick(),
        1000
      );
  }
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  tick() {
    this.setState({
      time: getDayTime()
    });
  }
  goPrev(){
    hashHistory.goBack();
  }
  render() {
    return (
      <div className="header-container">
        <div className="back">
          <Button shape="circle"  icon="arrow-left" onClick={()=>this.goPrev()}>
          </Button>
        </div>
        <div className="title">{this.props.title}</div>
        <div className="time">{this.state.time}</div>
      </div>
    );
  }
}
export default Header;
