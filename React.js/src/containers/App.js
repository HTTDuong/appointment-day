import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';
import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';
import { path } from '../utils'
import Home from '../routes/Home';
import Login from './Auth/Login';
import System from '../routes/System';
import HomePage from './HomePage/HomePage';
import CustomScrollbars from '../components/CustomScrollbars';
import DetailDoctor from './Patient/Doctor/DetailDoctor';
import Doctor from '../routes/Doctor';
import VerifyEmail from './Patient/VerifyEmail';
import DetailSpecialty from './Patient/Specialty/DetailSpecialty';
import DetailClinic from './Patient/Clinic/DetailClinic';
import DetailHandBook from './Patient/HandBook/DetailHandBook';
import Register from './Auth/Register';
import UserRecord from './Patient/Doctor/Record/UserRecord';

class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        // console.log("check from app", this.props);
        const { userInfo, isLoggedIn } = this.props;
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                                <Switch>
                                    <Route path={path.HOME} exact component={userIsAuthenticated(Home)} />
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.REGISTER} component={userIsNotAuthenticated(Register)} />
                                    {userInfo && userInfo.roleId === 'R1' && <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />}
                                    {userInfo && userInfo.roleId === 'R2' && <Route path={path.DOCTOR} component={userIsAuthenticated(Doctor)} />}
                                    {userInfo && userInfo.roleId === 'R3' && <Route path={path.HOMEPAGE} component={userIsAuthenticated(HomePage)} />}

                                    <Route path={path.DETAIL_DOCTOR} component={userIsAuthenticated(DetailDoctor)} />
                                    <Route path={path.DETAIL_SPECIALTY} component={userIsAuthenticated(DetailSpecialty)} />
                                    <Route path={path.DETAIL_CLINIC} component={userIsAuthenticated(DetailClinic)} />
                                    <Route path={path.DETAIL_HANDBOOK} component={userIsAuthenticated(DetailHandBook)} />
                                    <Route path={path.RECORD} component={userIsAuthenticated(UserRecord)} />
                                    <Route path={path.VERIFY_EMAIL_BOOKING} component={VerifyEmail} />
                                    <Redirect to={path.LOGIN} />

                                </Switch>
                            </CustomScrollbars>
                        </div>

                        <ToastContainer
                            position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);