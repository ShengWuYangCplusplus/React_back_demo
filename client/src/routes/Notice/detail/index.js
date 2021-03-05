import React, { Component } from "react";
import CustomBreadcrumb from "common/CustomBreadcrumb/index.js";
import { Form, message ,Row} from "antd";
import "./index.scss";
import "braft-editor/dist/index.css";
import BraftEditor from "braft-editor";
import { apis } from "../../../request/apis";
class AddNotice extends Component {
  constructor() {
    super();
    this.state = {
      theForm:{},
      title: "标题1",
      editorState: BraftEditor.createEditorState("<p>Hello <b>World!</b></p>"), // 设置编辑器初始内容
      outputHTML: "<p></p>",
    };
    this.changeTitle = this.changeTitle.bind(this);
  }
  loadData(){
    this.isLivinig = true;
    console.log('receive',JSON.parse(sessionStorage.getItem('theNotice')))
    let theData=JSON.parse(sessionStorage.getItem('theNotice'));
    console.log("thedata",theData)
    this.setState({
      theForm:{...theData}
    })
  }
  componentWillMount() {

    this.loadData()
    // 3秒后更改编辑器内容
  }

  componentWillUnmount() {
    this.isLivinig = false;
  }

  changeTitle(event) {
    console.log(event);
  }
  render() {
    const { editorState } = this.state;
    const formItemLayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };
    return (
      <div className="detailNotice">
        <CustomBreadcrumb
          arr={[{ title: "通知管理", to: "/notice" }, "通知详情"]}
        ></CustomBreadcrumb>
        <Form
          {...formItemLayout}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="标题"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            {this.state.theForm.title}
          </Form.Item>
          <Form.Item
            label="通知类型"
           
            rules={[{ required: true, message: "请选择通知类型" }]}
          >
           {this.state.theForm.type}
          </Form.Item>
          <Form.Item label="内容">
            <div dangerouslySetInnerHTML = {{__html:this.state.theForm.outputHTML}} ></div>
          </Form.Item>
          <Form.Item label="发布时间">
            {this.state.theForm.addTime}
          </Form.Item>
          <Form.Item label="接收者" >
            {this.state.theForm.users.map((item,idx)=>{
              return (
                <Row key={idx} >
                  <span style={{display:'block',width:'200px'}}>姓名:{item.name}</span>
                  <span style={{display:'block',width:'200px'}}>是否已读:{item.hasRead?'已读':'未读'}</span>
                </Row>
              )
            })}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default AddNotice;
