import React, { Component } from "react";
import { inject, observer } from "mobx-react/index";


//注入需要的store并将Todo组件定义为数据的观察者
//注意顺序 inject在先  observer在后
@inject("appStore")
@observer
class GMap extends Component {
  constructor() {
    super();
    this.state = {
      theMap: null,
    };
  }
  add = () => {
    //被注入的store可以通过props访问
    this.props.appStore.plus();
  };
  minus = () => {
    this.props.appStore.minus();
  };
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
          zoom: this.props.zoom,
          features: ["bg", "point", "road", "building"],
          layers: [
            // 高德默认标准图层
            new AMap.TileLayer.Satellite(),
            // 楼块图层
            new AMap.Buildings({
              zooms: [11, 18],
              zIndex: 10,
              heightFactor: 2, //2倍于默认高度，3D下有效
            }),
          ],
        });
        //添加高度面
        var object3Dlayer = new AMap.Object3DLayer({ zIndex: 1 });
        map.add(object3Dlayer);
        var height = -8000;
        var color = "#0088ffcc"; //rgba
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
            strokeColor: "#99ffff",
            strokeWeight: 4,
            map: map,
          });
        }
        this.setState({
          theMap: map,
        });
        this.renderIcon();
      }.bind(this)
    );
  }
  renderIcon() {
    var infoWindowContent = `<div class="infoContainer">
      <div class="oneRow"><span class="text name">yyyyy</span></div>
      <div class="oneRow"><span class="text name"><button id="btnOne">详情</button></span></div>
    </div>`;
    var infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(0, -20),
      content: infoWindowContent,
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
    function markerClick(e) {
      infoWindow.open(this.state.theMap, e.target.getPosition());
    }
    let marker = new AMap.ElasticMarker({
      position: [121.1, 31.2],
      zooms: [3, 20],
      styles: [
        {
          icon: {
            img: require("src/assets/img/building.png"),
            size: [24, 24], //可见区域的大小
            ancher: [16, 16],
            fitZoom: 16, //最合适的级别
            scaleFactor: 2, //地图放大一级的缩放比例系数
            maxScale: 1.6, //最大放大比例
            minScale: 1.0, //最小放大比例
          },
        },
      ],
      zoomStyleMapping: zoomStyleMapping1,
    });

    marker.on("click", markerClick.bind(this));
    this.state.theMap.add(marker);
  }
  componentDidMount() {
    this.initMap();
  }
  render() {
    return (
        <div id="container" style={{ width: "100%", height: "100%" }}></div>
    );
  }
}

export default GMap;
