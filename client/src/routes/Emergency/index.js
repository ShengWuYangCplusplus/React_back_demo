import React, { Component } from "react";
import "./style.scss";
//注入需要的store并将Todo组件定义为数据的观察者
//注意顺序 inject在先  observer在后
// import MyCharts from 'NODE_PATH/components/Ysw_Common/Echart.js'
import MyCharts from "common/Ysw_Common/Echart.js";
import Header from "./Header";
import { theChartData } from "./theChartData";
import axios from "axios";
import { Tag, Modal, message,Carousel } from "antd";
import MyTable from "common/Ysw_Common/Table.js";
import { apis } from "src/request/apis.js";
import {
  getAlarmType,
  getAlarmStatus,
  getAlarmLevel,
} from "src/utils/enumerate-map.js";
import TheForm from "./components/alarm-detail";
import YSW_TOOLS from "src/utils/Ysw_tools.js";
import { flow } from "mobx";

class Emergency extends Component {
  constructor() {
    super();
    this.state = {
      loopCenter: null,
      theAlarmArea: [
        { area: "夏阳街道", value: 7, key: "all" },
        { area: "西虹桥", value: 3, key: "four" },
        { area: "徐泾", value: 12, key: "five" },
        { area: "赵巷", value: 4, key: "not" },
        { area: "练塘", value: 7, key: "four" },
        { area: "白鹤镇", value: 2, key: "five" },
        { area: "重固", value: 5, key: "all" },
        { area: "金泽", value: 3, key: "four" },
        { area: "金花桥", value: 9, key: "not" },
        { area: "朱家角", value: 12, key: "five" },
        { area: "盈浦街道", value: 10, key: "all" },
        { area: "华新镇", value: 6, key: "four" },
      ],
      theMap: null,
      markerList: [],
      allMarkerPos: [],
      ...theChartData,
      theAlarmModal: {
        visible: false,
        confirmLoading: false,
        detailData: {},
      },
      allTableObj: {
        columns: [
          {
            title: "告警时间",
            dataIndex: "time",
            key: "time",
            align: "center",
            width:'150px'
          },
          {
            title: "告警地点",
            dataIndex: "address",
            key: "address",
            align: "center",
            width: "200px",
          },
          // {
          //   title: "告警状态",
          //   key: "status",
          //   dataIndex: "status",
          //   align: "center",
          //   render: (status) => {
          //     let color, txt;
          //     switch (status) {
          //       case 1:
          //         (color = "red"), (txt = "红色告警");
          //         break;
          //       case 2:
          //         (color = "orange"), (txt = "橙色告警");
          //         break;
          //       case 3:
          //         (color = "blue"), (txt = "蓝色告警");
          //         break;
          //       default:
          //         (color = "grey"), (txt = "已消除");
          //     }
          //     return (
          //       <span>
          //         <Tag color={color} key={txt}>
          //           {txt}
          //         </Tag>
          //       </span>
          //     );
          //   },
          // },
          {
            title: "操作",
            key: "action",
            align: "center",
            width:'50px',
            render: (record) => (
              <span>
                <a onClick={() => this.showModal(record)}>详情</a>
                {/* <Divider type="vertical" />
                <a>Delete</a> */}
              </span>
            ),
          },
        ],
        dataSource: [],
        pageData: {
          pageSize: 5,
          currentPage: 1,
          total: 20,
          showTotal: {
            render: (total) => `共${total}条`,
          },
        },
        styleObj: {
          size: "small",
          height: 270,
          bordered: true,
        },
        isLoading: false,
      },
    };
  }
  showModal = (item) => {
    console.log(item);
    this.setState({
      theAlarmModal: {
        ...this.state.theAlarmModal,
        detailData: { ...item },
      },
      visible: true,
    });
  };
  handleOk = () => {
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 500);
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  handleSize(i, j) {
    this.loadData({ index: i - 1, size: j });
  }
  handleCurrent(i, j) {
    this.loadData({ index: i - 1, size: j });
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
  loadData(req) {
    this.setState({
      allTableObj: {
        ...this.state.allTableObj,
        isLoading: true,
      },
    });
    apis.Alarm.getList({ ...req })
      .then((res) => {
        if (res.code === 0 && res.data) {
          this.setState({
            allTableObj: {
              ...this.state.allTableObj,
              dataSource: res.data.map((item, idx) => {
                return {
                  ...item,
                  key: item._id,
                  num: res.index * res.size + idx + 1,
                };
              }),
              isLoading: false,
              pageData: {
                ...this.state.allTableObj.pageData,
                currentPage: res.index + 1,
                pageSize: res.size,
                total: res.total,
              },
            },
          });
        } else {
          message.error(`数据加载失败:${res.des}`);
        }
      })
      .finally(() => {
        this.setState({
          allTableObj: {
            ...this.state.allTableObj,
            isLoading: false,
          },
        });
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
          features: ["bg", "point", "building"],
          // mapStyle:'amap://styles/a695b01eea0337ab7e4448ddef392ef1'
          mapStyle: "amap://styles/whitesmoke",
          // layers: [
          //   new AMap.TileLayer.Satellite(),
          //   new AMap.Buildings({
          //     zooms: [11, 18],
          //     zIndex: 10,
          //     heightFactor: 2, //2倍于默认高度，3D下有效
          //   }),
          // ],
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
      marker.content = `<div class="infoContainer">
      <div class="infowindow-title"><span class="text">${getAlarmType(
        data.type
      )}</span></div>
      <div class="infowindow-content">
        <span class="text infowindow-address">${data.address}</span>
        <span class="text infowindow-time">${data.time}</span>
        <span class="text infowindow-level">${getAlarmLevel(data.level)}</span>
        <span class="text">${getAlarmStatus(data.status)}</span>
      </div>
    </div>`;
      marker.on("click", markerClick.bind(this));
      this.state.markerList.push(marker);
    }
    this.state.theMap.add(this.state.markerList);
  }
  componentDidMount() {
    this.loadData({ index: 0, size: 10 });
    this.initMap();
  }
  componentWillUnmount() {
    if (this.state.loopCenter) {
      clearInterval(this.state.loopCenter);
    }
  }
  changeCenter(arr) {
    if (this.state.loopCenter) {
      clearInterval(this.state.loopCenter);
    }
    var clickHandler = function (e) {
      new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20),
        content: `<div class="infoContainer">
                  <div class="infowindow-title"><span class="text">${getAlarmType(
                    e.data.type
                  )}</span></div>
                  <div class="infowindow-content">
                    <span class="text infowindow-address">${
                      e.data.address
                    }</span>
                    <span class="text infowindow-time">${e.data.time}</span>
                    <span class="text infowindow-level">${getAlarmLevel(
                      e.data.level
                    )}</span>
                    <span class="text">${getAlarmStatus(e.data.status)}</span>
                  </div>
                </div>`,
      }).open(this.state.theMap, e.lnglat);
    }.bind(this);
    this.state.loopCenter = setInterval(
      function () {
        let idx = YSW_TOOLS.getRandomItem(0, arr.length);
        console.log(idx);
        this.state.theMap.on("dbclick", clickHandler);
        this.state.theMap.setZoomAndCenter(12, arr[idx].position.split(","));
        console.log("onedata", arr[idx]);
        this.state.theMap.emit("dbclick", {
          lnglat: arr[idx].position.split(","),
          data: arr[idx],
        });
        this.refs.chartA.initChart("emergency-chartA");
        this.refs.chartB.initChart("emergency-chartB");
      }.bind(this),
      5000
    );
  }
  render() {
    const { visible, confirmLoading } = this.state;
    return (
      <div className="emergency">
        <div className="header">
          <Header title="应急指挥"></Header>
        </div>
        <div className="content">
          <div className="left">
            <div className="left-one">
              <video
                src={require("../../assets/videos/航拍青浦.mp4")}
                controls="controls"
                width="100%"
                height="300px"
                autoPlay="autoplay"
                loop
                preload="auto"
                loopposter="../../assets/img/car_02.jpg"
              >
                your browser does not support the video tag
              </video>
            </div>
            <div className="area-container left-one">
              <div className="area-title">告警区域分布</div>
              <Carousel className="emergency_Carousel" autoplay>
                <div style={{width:'100%',height:'100%'}}>
                  <div className="area-content">
                    {this.state.theAlarmArea.slice(0,4).map((item, idx) => {
                      return (
                        <div className="area-one" key={idx} id={item.key}>
                          <div>
                            <span className={item.key}>{item.value}</span>
                          </div>
                          <div>
                            <span>{item.area}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{width:'100%',height:'100%'}}>
                  <div className="area-content">
                    {this.state.theAlarmArea.slice(4,8).map((item, idx) => {
                      return (
                        <div className="area-one" key={idx} id={item.key}>
                          <div>
                            <span className={item.key}>{item.value}</span>
                          </div>
                          <div>
                            <span>{item.area}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{width:'100%',height:'100%'}}>
                  <div className="area-content">
                    {this.state.theAlarmArea.slice(8).map((item, idx) => {
                      return (
                        <div className="area-one" key={idx} id={item.key}>
                          <div>
                            <span className={item.key}>{item.value}</span>
                          </div>
                          <div>
                            <span>{item.area}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </Carousel>
             
            </div>
            <div className="left-one">
              <MyCharts
                ref="chartA"
                key="emergency-aaa"
                edata={this.state.dataThree}
                chartId="emergency-chartA"
              ></MyCharts>
            </div>
          </div>
          <div className="middle">
            <div id="container" style={{ width: "100%", height: "100%" }}></div>
          </div>
          <div className="right">
            <div className="right-one">
              <MyCharts
                ref="chartB"
                key="emergency-bbb"
                edata={this.state.dataFive}
                chartId="emergency-chartB"
              ></MyCharts>
            </div>
            <div style={{paddingTop:'30px'}} className="right-one">
              <div className="table-title">
                <span>告警管理</span>
              </div>
              <MyTable
                dataObj={this.state.allTableObj}
                currentChange={(i, j) => this.handleCurrent(i, j)}
                sizeChange={(i, j) => this.handleSize(i, j)}
              ></MyTable>
            </div>
          </div>
        </div>
        <Modal
          width="40%"
          title={null}
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          footer={null}
          wrapClassName={'my-modal'}//对话框外部的类名，主要是用来修改这个modal的样式的
        >
          <TheForm theAlarm={this.state.theAlarmModal.detailData} ></TheForm>
        </Modal>
      </div>
    );
  }
}

export default Emergency;
