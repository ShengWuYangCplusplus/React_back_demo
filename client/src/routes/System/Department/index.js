import React from "react";
import {  Modal, BackTop, Button, Upload, message, Icon,Message } from "antd";
import CustomBreadcrumb from "common/CustomBreadcrumb/index.js";
import { apis } from "src/request/apis";
import MyTable from "common/Ysw_Common/Table.js";
import FileViewer from 'react-file-viewer';
import './index.scss'

class Role extends React.Component {
  constructor() {
    super();
    this.state = {
      visible:false,
      fileObj:{},
      allTableObj: {
        columns: [
          {
            title: "序号",
            dataIndex: "num",
            key: "num",
            align: "center",
            width: "60px",
          },
          {
            title: "名称",
            dataIndex: "name",
            key: "name",
            align: "center",
            width: "300px",
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
          height: "auto",
          bordered: true,
        },
        isLoading: false,
      },
    };
  }
  onchangeFile=(obj)=>{
    if(obj.file.status==='done'){
      if(obj.file.response.code===0){
           Message.info('文件上传成功')
      this.loadData({index:0,size:10})
      }
    }
  }
  preview(i){
    console.log(i)
    this.setState({visible:true,fileType:i.filename.split('.')[1].toLowerCase(),filePath:i.path,fileObj:i})
  }
  handleSize(i, j) {
    this.loadData({ index: i - 1, size: j });
  }
  handleCurrent(i, j) {
    this.loadData({ index: i - 1, size: j });
  }
  loadData(req) {
    this.setState({
      allTableObj: {
        ...this.state.allTableObj,
        isLoading: true,
      },
    });
    apis.System.getDepartmentList({ ...req })
      .then((result) => {
        console.log("result", result);
        if (result.code === 0 && result.data) {
          let res=result.data
          this.setState({
            allTableObj: {
              ...this.state.allTableObj,
              dataSource: res.data.map((item, idx) => {
                return {
                  ...item,
                  key: idx,
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
  componentDidMount() {
    this.loadData({ index: 0, size: 10 });
  }
  addUser=()=>{
    this.props.history.push({
      pathname:'/system/user/add'
    })
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      fileType:'',
      filePath:'',
      fileObj:{}
    });
  };
  handleDelete=(obj)=>{
    console.log(obj)
    apis.File.delete({fileId:obj._id,filePath:obj.path}).then(
      res=>{
        console.log(res)
        if(res.code===0){
          Message.info('删除成功')
        }else{
          Message.error(`删除失败:${res.des}`)
        }
      }
    )
  }

  render() {
    return (
      <div className="department">
        <CustomBreadcrumb arr={["系统管理", "部门列表"]} />
        <MyTable
          dataObj={this.state.allTableObj}
          currentChange={(i, j) => this.handleCurrent(i, j)}
          sizeChange={(i, j) => this.handleSize(i, j)}
        ></MyTable>
        <BackTop visibilityHeight={200} style={{ right: 50 }} />
        <Modal
          title={this.state.fileObj.filename}
          width="80%"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <FileViewer fileType={this.state.fileType} filePath={this.state.filePath}></FileViewer>
        </Modal>
      </div>
    );
  }
}

export default Role;
