import React from "react";
import {  BackTop, Button, Modal, message, Icon,Message } from "antd";
const { confirm } = Modal;
import CustomBreadcrumb from "common/CustomBreadcrumb/index.js";
import { apis } from "src/request/apis";
import MyTable from "common/Ysw_Common/Table.js";
import YSW_TOOLS from "src/utils/Ysw_tools.js";
import FileViewer from 'react-file-viewer';
import './index.scss'
import { ExclamationCircleOutlined } from '@ant-design/icons';


class Notice extends React.Component {
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
            title: "账号",
            dataIndex: "Account",
            key: "Account",
            align: "center",
            width: "300px",
          },
          {
            title: "注册时间",
            dataIndex: "time",
            key: "time",
            align: "center",
            width: "200px",
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            width: "220px",
            render: (record) => (
              <span>
                <Button type="link" style={{color:'red'}} onClick={()=>this.handleDelete(record)}>删除</Button>
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
          height: "auto",
          bordered: true,
        },
        isLoading: false,
      },
    };
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
    apis.System.getUserList({ ...req })
      .then((result) => {
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
    var that=this;
    confirm({
      title: '确定删除该用户?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        apis.System.deleteUser({_id:obj._id}).then(
          res=>{
            if(res.code===0){
              message.success('删除成功!')
              that.loadData({index:that.state.allTableObj.pageData.currentPage-1,size:that.state.allTableObj.pageData.pageSize})
            }else{
              message.error(`删除失败:${res.des}`)
            }
          }
        )
      },
      onCancel() {
        console.log('Cancel');
      },
    });
    
  }
  render() {
    return (
      <div className="user">
        <CustomBreadcrumb arr={["系统管理", "用户列表"]} />
        <div style={{marginBottom:20}}>
          <Button type="primary" onClick={this.addUser}>新增用户</Button>
        </div>
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

export default Notice;
