import React from "react";
import {  Modal, BackTop, Button, Upload, message, Icon,Message } from "antd";
const { confirm } = Modal;
import CustomBreadcrumb from "../../components/CustomBreadcrumb/index.js";
import { apis } from "../../request/apis";
import MyTable from "common/Ysw_Common/Table.js";
import YSW_TOOLS from "src/utils/Ysw_tools.js";
import FileViewer from 'react-file-viewer';
import './index.scss'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {baseUrl} from 'src/config/linux-config.js'
import { UploadOutlined  } from '@ant-design/icons';

class File extends React.Component {
  getToken = () => {
      return this.props.appStore.getToken();
    };
  constructor() {
    super();
    this.state = {
      userToken:null,
      visible:false,
      fileObj:{},
      excelObj:{},
      excelVisible:false,
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
            title: "文件名",
            dataIndex: "filename",
            key: "filename",
            align: "center",
            width: "300px",
          },
          {
            title: "文件大小",
            dataIndex: "size",
            key: "size",
            align: "center",
            width: "100px",
          },
          {
            title: "上传时间",
            dataIndex: "time",
            key: "time",
            align: "center",
            width: "200px",
          },
          {
            title: "上传者",
            dataIndex: "userName",
            key: "userName",
            align: "center",
          },
          {
            title: "备注",
            dataIndex: "department",
            key: "department",
            align: "center",
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            width: "220px",
            render: (record) => (
              <span>
                <Button type="link" onClick={() => this.preview(record)}>预览</Button>
                <a style={{marginLeft:'20px'}} name="file" href={`${baseUrl}/${record.path}`} download={record.filename} target="_blank">下载</a>
                <Button type="link" style={{color:'red',marginLeft:'20px'}} onClick={()=>this.handleDelete(record)}>删除</Button>
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
    let fileType=i.filename.split('.')[1].toLowerCase();
    if(fileType=='xls'||fileType=='xlsx'){
      const url=baseUrl+i.path;
      let parseUrl=encodeURIComponent(url);
      window.open(`http://view.xdocin.com/xdoc?_xdoc=${parseUrl}`)
    }else{
      this.setState({visible:true,fileType:i.filename.split('.')[1].toLowerCase(),filePath:i.path,fileObj:i})
    }
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
    apis.File.getList({ ...req })
      .then((res) => {
        console.log("result", res);
        if (res.code === 0 && res.data) {
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
    let token=localStorage.getItem('token')
    console.log(token)
    this.setState({...this.state,userToken:token})
  }
  handleCancel = () => {
    this.setState({
      visible: false,
      fileType:'',
      filePath:'',
      fileObj:{}
    });
  };
  handleExcelCancel = () => {
    this.setState({
      excelVisible: false,
      fileType:'',
      filePath:'',
      excelObj:{}
    });
    document.getElementById('result').innerHTML=''
  };
  handleDelete=(obj)=>{
    var that=this
    console.log(obj)
    confirm({
      title: '确定删除该文件?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        apis.File.delete({fileId:obj._id,filePath:obj.path}).then(
          res=>{
            if(res.code===0){
              Message.info('删除成功')
              that.loadData({index:that.state.allTableObj.pageData.currentPage-1,size:that.state.allTableObj.pageData.pageSize})
            }else{
              Message.error(`删除失败:${res.des}`)
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
      <div className="file">
        <CustomBreadcrumb arr={["文件管理", "文件列表"]} />
        <div style={{marginBottom:20}}>
          <Upload listType={null} name="file" action="/api/file" onChange={this.onchangeFile} beforeUpload={YSW_TOOLS.beforeFileUpload} headers={ {authorization: `Bearer ${this.state.userToken}`}}>
            <Button type="primary">
            <UploadOutlined /> 上传文件
            </Button>
            
          </Upload>
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
        <Modal
          title={this.state.excelObj.filename}
          width="80%"
          visible={this.state.excelVisible}
          onCancel={this.handleExcelCancel}
          footer={null}
        >
          <div id="result">

          </div>
        </Modal>
      </div>
    );
  }
}

export default File;
