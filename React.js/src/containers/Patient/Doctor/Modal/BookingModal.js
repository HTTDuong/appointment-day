import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { postPatientBookingAppointment } from '../../../../services/userService'
import { toast } from 'react-toastify';
import moment from 'moment';
import Record from '../Record/Record';
import { getAllRecords } from '../../../../services/userService';
import LoadingOverlay from 'react-loading-overlay';

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doctorId: '',
            timeType: '',
            arrRecords: [],
            isShowLoading: false
        }
    }

    async componentDidMount() {
        this.props.loadAllRecords(this.props.userInfo.id);
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) { }

        if (prevProps.allRecordRedux !== this.props.allRecordRedux) {
            this.setState({
                arrRecords: this.props.allRecordRedux
            })
        }

        if (this.props.dataTime !== prevProps.dataTime) {
            if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId;
                let timeType = this.props.dataTime.timeType;
                this.setState({
                    doctorId: doctorId,
                    timeType: timeType
                })
            }
        }

    }

    handleConfirmBooking = async (item) => {
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);
        this.setState({
            isShowLoading: true
        })

        let res = await postPatientBookingAppointment({
            doctorId: this.state.doctorId,
            recordId: item.id,
            patientId: item.userId,
            email: this.props.userInfo.email,
            fullName: item.fullName,
            timeType: this.state.timeType,
            date: this.props.dataTime.date,
            language: this.props.language,
            timeString: timeString,
            doctorName: doctorName
        })

        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Booking a new appointment succeed!');
            this.props.closeBookingModal();
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Booking a new appointment error!')
        }
    }

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let date = language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY')
            return (
                `${time} - ${date}`
            )
        }
        return ''
    }

    buildDoctorName = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let name = language === LANGUAGES.VI ?
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
                :
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`

            return name;
        }
        return ''
    }


    render() {
        let { isOpenModal, closeBookingModal, dataTime } = this.props;
        let arrRecords = this.state.arrRecords;
        let doctorId = '';
        if (dataTime && !_.isEmpty(dataTime)) {
            doctorId = dataTime.doctorId
        }

        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                ></LoadingOverlay>
                <Modal isOpen={isOpenModal} className={'booking-modal-container'}
                    size='lg' centered
                >
                    <div className='booking-modal-content'>
                        <div className='booking-modal-header'>
                            <span className='left'><FormattedMessage id="patient.booking-modal.title" /></span>
                            <span className='right' onClick={closeBookingModal}>
                                <i className='fas fa-times' ></i>
                            </span>
                        </div>
                        <div className='booking-modal-body'>
                            <div className='doctor-infor'>
                                <ProfileDoctor
                                    doctorId={doctorId}
                                    isShowDescriptionDoctor={false}
                                    dataTime={dataTime}
                                    isShowLinkDetail={false}
                                    isShowPrice={true}
                                />
                            </div>
                            <div className='row'>
                                {arrRecords && arrRecords.length > 0
                                    && arrRecords.map((item, index) => {
                                        let genderSelected;
                                        if (item.gender === 'M') {
                                            genderSelected = 'Nam'
                                        } else {
                                            genderSelected = 'Nữ'
                                        }
                                        return (
                                            <div className='section-info' onClick={() => this.handleConfirmBooking(item)}>
                                                <div className='customize-info'>
                                                    <div className='user-item'>
                                                        <div className='user-item-left'>
                                                            <i className="fas fa-user-circle"></i>
                                                            <span>Họ và tên: </span>
                                                        </div>
                                                        <div className='user-item-right'>
                                                            <span>{item.fullName}</span>
                                                        </div>
                                                    </div>
                                                    <div className='user-item'>
                                                        <div className='user-item-left'>
                                                            <i className="fas fa-phone fa-flip-horizontal"></i>
                                                            <span>Số điện thoại: </span>
                                                        </div>
                                                        <div className='user-item-right'>
                                                            <span>{item.phoneNumber}</span>
                                                        </div>
                                                    </div>
                                                    <div className='user-item'>
                                                        <div className='user-item-left'>
                                                            <i className="fas fa-user-graduate"></i>
                                                            <span>Giới tính: </span>
                                                        </div>
                                                        <div className='user-item-right'>
                                                            <span>{genderSelected}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            {/* <button className='btn-booking-confirm'
                            onClick={() => this.handleConfirmBooking()}
                        >
                            <FormattedMessage id="patient.booking-modal.btn-confirm" />
                        </button> */}
                            <button className='btn-booking-cancel'
                                onClick={closeBookingModal}
                            >
                                <FormattedMessage id="patient.booking-modal.btn-cancel" />
                            </button>
                        </div>
                    </div>
                </Modal >
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        allRecordRedux: state.admin.allRecords,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
        loadAllRecords: (id) => dispatch(actions.fetchAllRecords(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
