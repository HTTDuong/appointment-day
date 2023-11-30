import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../../../HomePage/HomeHeader';
import Record from './Record';
import History from './History';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import './UserRecord.scss';



class UserRecord extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }


    render() {
        let { language } = this.props;

        return (
            <>
                <HomeHeader isShowBanner={false} />

                <div className='user-container'>
                    <Router>
                        <div className='content-left'>
                            <div tabindex="1">
                                <li className='nav-text'>
                                    <Link to={`/user/record`} >
                                        <i className="fas fa-address-book"></i>
                                        <span>Hồ sơ bệnh nhân</span>
                                    </Link>
                                </li>
                            </div>
                            <div tabindex="2">
                                <li className='nav-text'>
                                    <Link to={`/user/history`}>
                                        <i className="fas fa-notes-medical"></i>
                                        <span>Lịch sử khám bệnh</span>
                                    </Link>
                                </li>
                            </div>
                        </div>

                        <div className='content-right'>
                            <Switch>
                                <Route path='/user/record' component={Record} />
                                <Route path='/user/history' component={History} />
                            </Switch>
                        </div>

                    </Router >
                </div >
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserRecord));
