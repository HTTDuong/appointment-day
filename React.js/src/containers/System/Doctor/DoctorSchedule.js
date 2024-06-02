import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss';
import moment from 'moment/moment';
import { LANGUAGES } from '../../../utils';
import { getScheduleDoctorByDate, postBookingRecurrence } from '../../../services/userService'
import { FormattedMessage } from 'react-intl';
import { Modal } from 'reactstrap';
import { toast } from 'react-toastify';

class DoctorSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvalableTime: [],
            dataScheduleTimeModal: {}
        }
    }

    async componentDidMount() {
        let { language } = this.props;
        let allDays = this.getArrDays(language);
        if (this.props.doctorIdFromParent) {
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvalableTime: res.data ? res.data : []
            })
        }
        this.setState({
            allDays: allDays,
        })
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    getArrDays = (language) => {
        let allDays = []
        for (let i = 0; i < 7; i++) {
            let object = {};
            if (language === LANGUAGES.VI) {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Hôm nay - ${ddMM}`;
                    object.label = today
                } else {
                    let labelVi = object.label = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                    object.label = this.capitalizeFirstLetter(labelVi)
                }
            } else {
                if (i === 0) {
                    let ddMM = moment(new Date()).format('DD/MM');
                    let today = `Today - ${ddMM}`;
                    object.label = today
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM');
                }
            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            allDays.push(object);
        }

        return allDays;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({
                allDays: allDays,
            })
        }
        if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language)
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
            this.setState({
                allAvalableTime: res.data ? res.data : []
            })
        }
    }

    handleOnChangeSelect = async (event) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = event.target.value;
            let res = await getScheduleDoctorByDate(doctorId, date)

            if (res && res.errCode === 0) {

                this.setState({
                    allAvalableTime: res.data ? res.data : []
                })
            }
        }
    }

    handleClickScheduleTime = async (time) => {
        let dataModal = this.props.dataModal;
        if (time.currentNumber < time.maxNumber) {
            this.setState({
                isOpenModalBooking: true,
                dataScheduleTimeModal: time
            })
            let res = await postBookingRecurrence({
                doctorId: time.doctorId,
                recordId: dataModal.recordId,
                patientId: dataModal.patientId,
                timeType: time.timeType,
                date: time.date,
                bookingRecurr: dataModal.id,
                oldAppointmentId: dataModal.oldAppointmentId,
                language: this.props.language
            })

            if (res && res.errCode === 0) {
                toast.success('Appointment recurrence book succeed!');
                this.props.updateDataPatient();
                this.props.closeBookingModal();
            } else {
                toast.error('Booking a new appointment error!')
            }
        } else {
            toast.error('Khoảng thời gian này đã full. Vui lòng chọn khoảng thời gian khác!');
            return;
        }
    }

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    render() {
        let { allDays, allAvalableTime, } = this.state;
        let { language, isOpenModal, closeBookingModal } = this.props;
        return (
            <>
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
                        <div className='doctor-schedule-container'>
                            <div className='all-schedule'>
                                <select onChange={(event) => this.handleOnChangeSelect(event)}>
                                    {allDays && allDays.length > 0 &&
                                        allDays.map((item, index) => {
                                            return (
                                                <option value={item.value} key={index}>
                                                    {item.label}
                                                </option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='all-available-time'>
                                <div className='text-calendar'>
                                    <i className='fas fa-calendar-alt'>
                                        <span><FormattedMessage id="patient.detail-doctor.schedule" /></span>
                                    </i>
                                </div>
                                <div className='time-content'>
                                    {allAvalableTime && allAvalableTime.length > 0 ?
                                        <>
                                            <div className='time-content-btns'>
                                                {allAvalableTime.map((item, index) => {
                                                    let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn
                                                    return (
                                                        <button key={index}
                                                            className={language === LANGUAGES.VI ? 'btn-vie' : 'btn-en'}
                                                            onClick={() => this.handleClickScheduleTime(item)}
                                                        >
                                                            {timeDisplay}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </>
                                        :
                                        <div className='no-schedule'>
                                            <FormattedMessage id="patient.detail-doctor.no-schedule" />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn-booking-cancel'
                                onClick={closeBookingModal}
                            >
                                <FormattedMessage id="patient.booking-modal.btn-cancel" />
                            </button>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
