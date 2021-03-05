import React, { Component } from "react";
import CustomBreadcrumb from "common/CustomBreadcrumb/index.js";
import { Form, Button, Input, Select, message } from "antd";
import "./index.scss";
import "braft-editor/dist/index.css";
import BraftEditor from "braft-editor";
import { apis } from "../../../request/apis";
const { Option } = Select;
class AddNotice extends Component {
  constructor() {
    super();
    this.state = {
      title: "标题1",
      editorState: BraftEditor.createEditorState(""), // 设置编辑器初始内容
      outputHTML: "",
      userList: []
    };
    this.changeTitle = this.changeTitle.bind(this);
  }
  loadData() {
    apis.System.getUserList({ index: 0, size: 1000 }).then(
      res => {
        console.log("users", res)
        this.setState({ userList: res.data.data })
      }
    )
  }
  componentDidMount() {
    this.loadData()
    this.isLivinig = true;
  }

  componentWillUnmount() {
    this.isLivinig = false;
  }

  handleChange = (editorState) => {
    console.log(editorState.toHTML());
    this.setState({
      editorState: editorState,
      outputHTML: editorState.toHTML(),
    });
  };
  // setEditorContentAsync = () => {
  //   this.isLivinig &&
  //     this.setState({
  //       editorState: BraftEditor.createEditorState("<p>你好，<b>世界!</b><p>"),
  //     });
  // };
  changeTitle(event) {
    console.log(event);
  }
  render() {
    const onFinish = (values) => {
      console.log(values)
      if (!this.state.outputHTML || this.state.outputHTML === '<p></p>') {
        message.error('请输入通知内容')
        return false
      }
      console.log("hhhhhhhh", this.state.outputHTML)
      apis.Notice.add({...values,outputHTML:this.state.outputHTML}).then(
        res=>{
          if(res.code===0){
            message.success('发布成功')
            this.props.history.go(-1)
          }else{
            message.error(`发布失败:${res.des}`)
          }
        }
      )
    };
    const { editorState } = this.state;
    const formItemLayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 2,
        },
        sm: {
          span: 16,
          offset: 2,
        },
      },
    };
    return (
      <div className="addNotice">
        <CustomBreadcrumb
          arr={[{ title: "通知管理", to: "/notice" }, "添加通知"]}
        ></CustomBreadcrumb>

        <Form
          {...formItemLayout}
          style={{ marginTop: 20 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入标题" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="通知类型"
            name="type"
            rules={[{ required: true, message: "请选择通知类型" }]}
          >
            <Select>
              <Option value="会议通知">会议通知</Option>
              <Option value="普通通知">普通通知</Option>
              <Option value="节假日通知">节假日通知</Option>
              <Option value="其他通知">其他通知</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="接收人"
            name="users"
            rules={[{ required: true, message: "请选择接收人" }]}
          >
            <Select mode="multiple" filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
              {this.state.userList.map((item, idx) => {
                return <Option key={idx} value={`${item._id}-${item.name}`}>{item.name}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item label="内容">
            <div className="editor-wrapper">
              <BraftEditor value={editorState} onChange={this.handleChange} />
            </div>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button
              type="info"
              style={{ marginLeft: "20px" }}
              onClick={() => this.props.history.go(-1)}
            >
              取消
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default AddNotice;
