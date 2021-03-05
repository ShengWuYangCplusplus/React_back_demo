import React, { Component } from "react";
// 引入 ECharts 主模块
import echarts from "echarts";

class MyCharts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData:props.edata,
      chartId: props.chartId
    };
  }
  // 首次加载初始化视图
  componentDidMount() {
    this.initChart(this.state.chartId);
  }
  initChart = (id) => {
    let option = this.state.chartData;
    let myChart = echarts.init(document.getElementById(id));
    myChart.clear();
    // 绘制图表
    myChart.setOption(option);
    window.addEventListener("resize", function () {
      myChart.resize();
    });
  };

  render() {
    // const height=this.props.style.height||'300px'
    return (
      <div
        id={this.state.chartId}
        style={{ width: "100%", height: "100%" }}
      ></div>
    );
  }
}
export default MyCharts;
