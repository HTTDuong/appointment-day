import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from '../containers/Header/Header';
import { withRouter } from 'react-router';

class Home extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         menuApp: []
    //     }
    // }

    componentDidMount() {
        // console.log("from home", this.props)
    }

    render() {
        const { isLoggedIn, userInfo } = this.props;
        let linkToRedirect;
        if (isLoggedIn) {
            if (userInfo.roleId === 'R1') {
                linkToRedirect = '/system/user-manage'
            }
            if (userInfo.roleId === 'R2') {
                linkToRedirect = '/doctor/manage-schedule'
            }
            if (userInfo.roleId === 'R3') {
                linkToRedirect = '/home'
            }
        } else {
            console.log("check login")
            linkToRedirect = '/login'
        }

        return (
            <React.Fragment>
                {isLoggedIn && <Header />}
                <Redirect to={linkToRedirect} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
