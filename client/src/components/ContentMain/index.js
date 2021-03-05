import React from "react";
import { withRouter, Switch, Redirect } from "react-router-dom";
import LoadableComponent from "../../utils/LoadableComponent";
import { getUser, initWebSocket } from "src/store/actions";
import PrivateRoute from "../PrivateRoute";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
const store = connect(
  (state) => ({ user: state.user, websocket: state.websocket }),
  (dispatch) => bindActionCreators({ getUser, initWebSocket }, dispatch)
);


@withRouter @store
class ContentMain extends React.Component {
  constructor(props){
    super(props)
    this.state={
      endList:[]
    }
  }
  componentWillMount(){

  }
  render() {
    return (
      <div style={{ padding: 16, position: "relative" }}>
        <Switch>
          {this.props.routeArr.map((item,idx)=>{
            return (
              <PrivateRoute key={idx} exact path={item.path} component={item.component[item.auth]} />
            )
          })}
          <Redirect exact from="/" to="/home" />
        </Switch>
      </div>
    );
  }
}

export default ContentMain;
