import React, { Component } from 'react';
import {Form,Input,Tooltip,
  Select,
  AutoComplete,
} from 'antd'
import {getAlarmType,getAlarmStatus} from 'src/utils/enumerate-map.js'
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;


class RegistrationForm  extends Component {
  constructor(props){
    super(props)
  }
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
      };
      handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      };
    
      handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
      };
    
      compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
          callback('Two passwords that you enter is inconsistent!');
        } else {
          callback();
        }
      };
    
      validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      };
    
      handleWebsiteChange = value => {
        let autoCompleteResult;
        if (!value) {
          autoCompleteResult = [];
        } else {
          autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
      };
    
      render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;
        const {theAlarm}=this.props.theAlarm
        const formItemLayout = {
          labelCol: {
            span:4
          },
          wrapperCol: {
            span:20
          },
        };
        const prefixSelector = getFieldDecorator('prefix', {
          initialValue: '86',
        })(
          <Select style={{ width: 70 }}>
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
          </Select>,
        );
    
        const websiteOptions = autoCompleteResult.map(website => (
          <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));
    
        return (
          <Form {...formItemLayout} onSubmit={this.handleSubmit} >
            
            <Form.Item label="告警类型">
              {getAlarmType(this.props.theAlarm.type)}
            </Form.Item>
            <Form.Item label="告警时间">
              {this.props.theAlarm.time}
            </Form.Item>
            <Form.Item label="告警地点">
              {this.props.theAlarm.address}
            </Form.Item>
            <Form.Item label="告警状态">
              {getAlarmStatus(this.props.theAlarm.status)}
            </Form.Item>
            <Form.Item label="无人机视频">
            </Form.Item>
            <Form.Item label="现场采样图片">
              <div style={{marginBottom:'20px'}}>
              <img style={{width:'300px',height:'auto'}} src={require('src/assets/img/detail-火灾1.jpg')} alt=""/>

              </div>
              <div style={{marginBottom:'20px'}}>
              <img style={{width:'300px',height:'auto'}} src={require('src/assets/img/detail-交通1.jpg')} alt=""/>

              </div>
              <div style={{marginBottom:'20px'}}>
              <img style={{width:'300px',height:'auto'}} src={require('src/assets/img/detail-警察1.jpg')} alt=""/>

              </div>
            </Form.Item>
          </Form>
        );
      }
}
 
export default Form.create({ name: 'register' })(RegistrationForm);