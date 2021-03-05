import React, { Component } from "react";
import { Table } from "antd";
class MyTable extends Component {
  constructor(props) {
    super(props);
  }
  changePageSize(i, j) {
    return this.props.sizeChange(i,j)
  }
  changeCurrent(i, j) {
    return this.props.currentChange(i,j)
  }
  render() {
    const thePage = this.props.dataObj.pageData;
    return (
      <div>
        <Table
          size={this.props.dataObj.styleObj.size}
          bordered={this.props.dataObj.styleObj.bordered}
          loading={this.props.dataObj.isLoading}
          pagination={{
            showSizeChanger: true,
            total: thePage.total,
            pageSize: thePage.pageSize,
            current: thePage.currentPage,
            position: "bottom",
            showTotal:()=>{
              return `共${thePage.total}条`
            },
            onShowSizeChange: (current, pageSize) =>
              this.changePageSize(current, pageSize),
            onChange: (current, pageSize) => this.changeCurrent(current, pageSize),
          }}
          columns={this.props.dataObj.columns}
          dataSource={this.props.dataObj.dataSource}
          scroll={{ y: this.props.dataObj.styleObj.height }}
        ></Table>
      </div>
    );
  }
}

export default MyTable;
