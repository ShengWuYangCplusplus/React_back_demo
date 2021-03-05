import React, { Component } from 'react';
import {Link} from 'react-router-dom'
class Right extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    goRoute(){
        alert("///")
    }
    render() { 
        return ( 
            <div className="right">
                {
                    this.props.menuArr.map((item,idx)=>{
                        return (
                            <div key={item.value} className="menu-item" >
                                <div className="link-container">
                                    <Link to={item.route}>{item.label} </Link>    
                                </div>
                            </div>
                        )
                    })
                }
            </div>
         );
    }
}
 
export default Right;