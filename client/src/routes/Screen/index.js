import React, { Component } from "react";
import Header from "../Emergency/Header.js";
import Right from "./Right";
import { apis } from "src/request/apis.js";
import {
  getAlarmType,
  getAlarmStatus,
  getAlarmLevel,
} from "src/utils/enumerate-map.js";
import YSW_TOOLS from "src/utils/Ysw_tools.js";
import "./index.scss";


const hashHistory = require("history").createHashHistory()
//注入需要的store并将Todo组件定义为数据的观察者
//注意顺序 inject在先  observer在后

class Screen extends Component {
  constructor() {
    super();
    this.state = {
      menuArr:[
        {label:'应急指挥',value:'emergency',route:'/emergency'},
        {label:'空气质量监测',value:'air',route:'/air'},
        {label:'违章建筑识别',value:'build',route:'/build'},
        {label:'绿化统计',value:'green',route:'/green'},
        {label:'河道管理',value:'river',route:'/river'},
        {label:'危险品仓库',value:'danger',route:'/danger'},
        {label:'区块管理',value:'block',route:'/block'},
        {label:'智慧文旅',value:'travel',route:'/travel'},
      ],
      theMap: null,
    };
  }
  loadMarker() {
    apis.Alarm.getList({ index: 0, size: 10000 }).then((res) => {
      if (res.code === 0 && res.data) {
        this.state.allMarkerPos = res.data;
        this.renderIcon(res.data);
        this.changeCenter(res.data);
      } else message.error(`数据加载失败:${res.des}`);
    });
  }
  initMap() {
    var opts = {
      subdistrict: 0,
      extensions: "all",
      level: "city",
    };
    var district = new AMap.DistrictSearch(opts);
    district.search(
      "青浦区",
      function (status, result) {
        var bounds = result.districtList[0].boundaries;
        var mask = [];
        for (var i = 0; i < bounds.length; i += 1) {
          mask.push([bounds[i]]);
        }
        var map = new AMap.Map("container", {
          resizeEnable: true,
          rotateEnable: true,
          pitchEnable: true,
          rotation: 0,
          viewMode: "3D", //开启3D视图,默认为关闭
          buildingAnimation: true, //楼块出现是否带动画
          expandZoomRange: true,
          mask: mask,
          center: [121.1, 31.1],
          disableSocket: true,
          showLabel: true,
          labelzIndex: 130,
          pitch: 30,
          zoom: 12,
          features: ["bg", "point",'road', "building"],
          // mapStyle:'amap://styles/a695b01eea0337ab7e4448ddef392ef1'
          // mapStyle: "amap://styles/whitesmoke",
          layers: [
            new AMap.TileLayer.Satellite(),
            new AMap.Buildings({
              zooms: [11, 18],
              zIndex: 10,
              heightFactor: 2, //2倍于默认高度，3D下有效
            }),
          ],
        });
        map.on(
          "complete",
          function () {
            this.loadMarker();
          }.bind(this)
        );
        //添加高度面
        var object3Dlayer = new AMap.Object3DLayer({ zIndex: 1 });
        map.add(object3Dlayer);
        var height = -8000;
        var color = "#8470FF"; //rgba
        var wall = new AMap.Object3D.Wall({
          path: bounds,
          height: height,
          color: color,
        });
        wall.transparent = true;
        object3Dlayer.add(wall);
        //添加描边
        for (let i = 0; i < bounds.length; i += 1) {
          new AMap.Polyline({
            path: bounds[i],
            strokeColor: "Cyan",
            strokeWeight: 4,
            map: map,
          });
        }
        this.setState({
          theMap: map,
        });
      }.bind(this)
    );
  }
  renderIcon(arr) {
    this.setState({
      ...this.state,
      markerList: [],
    });
    var zoomStyleMapping1 = {
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 0,
      18: 0,
      19: 0,
      20: 0,
      21: 0,
      22: 0,
      23: 0,
    };
    var infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(0, -20),
    });
    function markerClick(e) {
      infoWindow.setContent(e.target.content);
      infoWindow.open(this.state.theMap, e.target.getPosition());
      setTimeout(function(){
        var theBtn=document.getElementById('screen-detail')
        theBtn.addEventListener('click',()=>{
          this.props.history.push({pathname:'/emergency'})
        })
      }.bind(this),300)
    }
    for (let data of arr) {
      let marker = new AMap.ElasticMarker({
        position: data.position.split(","),
        zooms: [3, 20],
        styles: [
          {
            icon: {
              img:
                data.type === 1
                  ? require("src/assets/img/火.png")
                  : data.type === 2
                  ? require("src/assets/img/交通事故.png")
                  : require("src/assets/img/报警管理.png"),
              size: [36, 36], //可见区域的大小
              ancher: [20, 20],
              fitZoom: 16, //最合适的级别
              scaleFactor: 2, //地图放大一级的缩放比例系数
              maxScale: 1.6, //最大放大比例
              minScale: 1.0, //最小放大比例
            },
          },
        ],
        zoomStyleMapping: zoomStyleMapping1,
      });
      marker.content = `<div class="screenwindow">
      <div class="screenwindow-title"><span class="text">${getAlarmType(
        data.type
      )}</span></div>
      <div class="screenwindow-content">
        <span class="text screenwindow-address">${data.address}</span>
        <span class="text screenwindow-time">${data.time}</span>
        <span class="text screenwindow-level">${getAlarmLevel(data.level)}</span>
        <span class="text">${getAlarmStatus(data.status)}</span>
        <button class="screenwindow-detail" id="screen-detail">查看详情</button>
      </div>
    </div>`;
      marker.on("click", markerClick.bind(this));
      this.state.markerList.push(marker);
    }
    this.state.theMap.add(this.state.markerList);
  }
  componentDidMount() {
    this.initMap();
  }
  componentWillUnmount() {
      clearInterval(this.state.loopCenter);
  }
  changeCenter(arr) {
    if (this.state.loopCenter) {
      clearInterval(this.state.loopCenter);
    }
    var clickHandler = function (e) {
      new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20),
        content: `<div class="screenwindow">
                  <div class="screenwindow-title"><span class="text">${getAlarmType(
                    e.data.type
                  )}</span></div>
                  <div class="screenwindow-content">
                    <span class="text screenwindow-address">${
                      e.data.address
                    }</span>
                    <span class="text screenwindow-time">${e.data.time}</span>
                    <span class="text screenwindow-level">${getAlarmLevel(
                      e.data.level
                    )}</span>
                    <span class="text">${getAlarmStatus(e.data.status)}</span>
                    <button class="screenwindow-detail" id="screen-testdetail">查看详情</button>
                  </div>
                </div>`,
      }).open(this.state.theMap, e.lnglat);
      setTimeout(function(){
        var theBtn=document.getElementById('screen-testdetail')
        theBtn.addEventListener('click',()=>{
          this.props.history.push({pathname:'/emergency'})
        })
      }.bind(this),300)
    }.bind(this);
    this.state.loopCenter = setInterval(
      function () {
        let idx = YSW_TOOLS.getRandomItem(0, arr.length);
        console.log(idx);
        this.state.theMap.on("dbclick", clickHandler);
        // this.state.theMap.setZoomAndCenter(12, arr[idx].position.split(","));
        console.log("onedata", arr[idx]);
        this.state.theMap.emit("dbclick", {
          lnglat: arr[idx].position.split(","),
          data: arr[idx],
        });
      }.bind(this),
      5000
    );
  }
  render() {
    return (
      <div style={{ position: "relative" }} className="screen">
        <div id="container" style={{ width: "100%", height: "100vh" }}></div>
        <div
          className="the-head"
          style={{
            height: "80px",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#0A133F",
            opacity: 0.7,
          }}
        >
          <Header title="智慧城市沙盘演示系统"></Header>
        </div>
        <Right menuArr={this.state.menuArr}></Right>
      </div>
    );
  }
}

export default Screen;
