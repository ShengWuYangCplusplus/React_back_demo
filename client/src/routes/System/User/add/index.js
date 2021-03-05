import React, { Component } from "react";
import { Form, Input, Button, Select, message } from "antd";
const { Option } = Select;
import CustomBreadcrumb from "common/CustomBreadcrumb/index.js";
import {apis} from 'src/request/apis.js'
import "./index.scss";
import axios from 'axios'
class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleList:[],
      departmentList:[]
    };
  }
  loadData(){
    function getRole(){
      return apis.System.getRoleList({index:0,size:100})
    }
    function getDepartment(){
      return apis.System.getDepartmentList({index:0,size:100})
    }
    axios.all([getRole(),getDepartment()]).then(
      res=>{
        console.log("roledeaprt",res)
        this.setState({roleList:res[0].data.data,departmentList:res[1].data.data})
      }
    )
  }
  componentDidMount(){
    this.loadData()
  }
  render() {
    const layout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    };
    const tailLayout = {
      wrapperCol: { offset: 2, span: 22 },
    };
    const onFinish = (values) => {
      console.log("Success:", values);
      apis.System.addUser(values).then(
        res=>{
          if(res.code===0){
            message.success('添加成功')
            this.props.history.go(-1)
          }else{
            message.error(`添加失败:${res.des}`)
          }
        }
      )
    };
    return (
      <div className="addUser">
        <CustomBreadcrumb
          arr={[
            "系统管理",
            { title: "用户列表", to: "/system/user" },
            "添加通知",
          ]}
        ></CustomBreadcrumb>
        <Form
          {...layout}
          name="basic"
          onFinish={onFinish}
        >
          <Form.Item
            label="账号"
            name="account"
            rules={[{ required: true, message: "请输入账号!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="部门"
            name="departmentId"
            rules={[{ required: true, message: "请选择部门!" }]}
          >
            <Select>
              {this.state.departmentList.map((item,idx)=>{
                return <Option key={idx} value={item.intId}>{item.name}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="角色"
            name="roleId"
            rules={[{ required: true, message: "请选择角色!" }]}
          >
            <Select>
              {this.state.roleList.map((item,idx)=>{
                return <Option key={idx} value={item.intId}>{item.name}</Option>
              })}
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default AddUser;
