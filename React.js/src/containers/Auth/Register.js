import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Register.scss';
import { handleRegisterApi } from '../../services/userService';
import imgLogin from '../../assets/app-service-1.png';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            fullName: '',
            phoneNumber: '',
            isShowPassword: false,
            errMessage: ''
        }

    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleOnChangeFullname = (event) => {
        this.setState({
            fullName: event.target.value
        })
    }

    handleOnChangePhonenumber = (event) => {
        this.setState({
            phoneNumber: event.target.value
        })
    }

    handleRegister = async () => {
        this.setState({
            errMessage: ''
        })

        try {
            let data = await handleRegisterApi(this.state)
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if (data && data.errCode === 0) {
                this.props.userRegisterSuccess(data.user)
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.keyCode === 13) {
            this.handleRegister();
        }
    }


    render() {

        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-login'>Sign up</div>
                        <div className='col-12 form-group login-input'>
                            <label>Email</label>
                            <input type='text'
                                className='form-control'
                                placeholder='Enter your email'
                                value={this.state.username}
                                onChange={(event) => this.handleOnChangeUsername(event)}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password</label>
                            <div className='custom-input-password'>
                                <input type={this.state.isShowPassword ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Enter your password'
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                    onKeyDown={(event) => this.handleKeyDown(event)}
                                />
                                <span onClick={() => this.handleShowHidePassword()}>
                                    <i className={this.state.isShowPassword ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                </span>
                            </div>
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Fullname</label>
                            <input type='text'
                                className='form-control'
                                placeholder='Enter your fullname'
                                value={this.state.fullName}
                                onChange={(event) => this.handleOnChangeFullname(event)}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Phonenumber</label>
                            <input type='text'
                                className='form-control'
                                placeholder='Enter your phone number'
                                value={this.state.phoneNumber}
                                onChange={(event) => this.handleOnChangePhonenumber(event)}
                            />
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12'>
                            <button className='btn-login' onClick={() => this.handleRegister()}>
                                Sign up
                            </button>
                        </div>
                    </div>
                </div>
                <div className='img-login'>
                    <img className='img-login-src' src={imgLogin} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userRegisterSuccess: (userInfor) => dispatch(actions.userRegisterSuccess(userInfor))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
