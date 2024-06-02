import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor, postSendRemedy, saveHistory } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay';
import DoctorSchedule from './DoctorSchedule';
import DetailRecurrence from './DetailRecurrence';
import ReactPaginate from 'react-paginate';

class ManagePatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            isOpenModalBooking: false,
            isOpenModalDetail: false,
            dataModal: {},
            isShowLoading: false,
            pageCount: 0,
            currentPage: 0,
            perPage: 5 // Số bản ghi hiển thị trên mỗi trang
        }
    }

    async componentDidMount() {
        this.getDataPatient()
    }

    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formattedDate = new Date(currentDate).getTime();

        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formattedDate
        })

        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language || this.state.dataPatient !== prevState.dataPatient) {
            const { perPage } = this.state;
            const pageCount = Math.ceil(this.state.dataPatient.length / perPage);
            this.setState({
                pageCount
            });
        }

    }

    handleOnchangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient()
        })
    }

    handleBtnConfirm = (item) => {
        console.log("item", item)
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            recordId: item.recordId,
            date: item.date,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.recordIdTypeData.fullName,
            address: item.recordIdTypeData.address,
            phoneNumber: item.recordIdTypeData.phoneNumber,
            gender: item.recordIdTypeData.gender,
            bookingId: item.id
        }
        console.log("check data", item)

        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        console.log("check data", dataChild)
        console.log("check modal", dataModal)
        this.setState({
            isShowLoading: true
        })

        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            recordId: dataModal.recordId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName
        })

        if (res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })

            await saveHistory({
                patientId: dataModal.patientId,
                doctorId: dataModal.doctorId,
                recordId: dataModal.recordId,
                date: dataModal.date,
                files: dataChild.imgBase64,
                fullName: dataModal.patientName,
                address: dataModal.address,
                phoneNumber: dataModal.phoneNumber,
                gender: dataModal.gender,
                bookingId: dataModal.bookingId
            })

            toast.success('Send Remedy succeeds');
            this.closeRemedyModal();
            await this.getDataPatient();
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Something wrong...');
            console.log('error send remedy: ', res)
        }
    }

    handleBtnRemedy = () => {

    }

    handleBtnReExamination = (item) => {
        this.setState({
            isOpenModalBooking: true,
            dataModal: item
        })
    }

    updateDataPatient = async () => {
        await this.getDataPatient();
    };

    handleDetail = (item) => {
        this.setState({
            isOpenModalDetail: true,
            dataModal: item
        })
    }

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    closeDetailModal = () => {
        this.setState({
            isOpenModalDetail: false
        })
    }

    handlePageClick = (data) => {
        const selectedPage = data.selected;
        this.setState({
            currentPage: selectedPage
        });
    };

    render() {
        let { dataPatient, isOpenRemedyModal, dataModal, isOpenModalBooking, isOpenModalDetail, currentPage, perPage } = this.state;
        let { language, user } = this.props;
        const offset = currentPage * perPage;
        const currentData = dataPatient.slice(offset, offset + perPage);

        return (
            <>
                <LoadingOverlay
                    active={this.state.isShowLoading}
                    spinner
                    text='Loading...'
                >
                    <div className='manage-patient-container'>
                        <div className='m-p-title'>
                            Quản lý bệnh nhân khám bệnh
                        </div>
                        <div className='manage-patient-body row'>
                            <div className='col-4 form-group'>
                                <label>Chọn ngày khám</label>
                                <DatePicker
                                    onChange={this.handleOnchangeDatePicker}
                                    className="form-control"
                                    value={this.state.currentDate}
                                />
                            </div>
                            <div className='col-12 table-manage-patient'>
                                <table style={{ width: '100%' }}>
                                    <tbody>
                                        <tr>
                                            <th>STT</th>
                                            <th>Thời gian</th>
                                            <th>Họ và tên</th>
                                            <th>Địa chỉ</th>
                                            <th>Giới tính</th>
                                            <th>Lịch sử khám</th>
                                            <th>Actions</th>
                                        </tr>
                                        {dataPatient && dataPatient.length > 0 ?
                                            currentData.map((item, index) => {
                                                let time = language === LANGUAGES.VI ?
                                                    item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn;
                                                let gender = language === LANGUAGES.VI ?
                                                    item.recordIdTypeData.genderDataRecord.valueVi : item.recordIdTypeData.genderDataRecord.valueEn
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{time}</td>
                                                        <td>{item.recordIdTypeData.fullName}</td>
                                                        <td>{item.recordIdTypeData.address}</td>
                                                        <td>{gender}</td>
                                                        <td onClick={() => this.handleDetail(item)}>
                                                            <i className="fa fa-info-circle"></i> Chi tiết
                                                        </td>
                                                        {item.statusId === "S2" ?
                                                            <td>
                                                                <button className='mp-btn-confirm'
                                                                    onClick={() => this.handleBtnConfirm(item)}
                                                                >
                                                                    Xác nhận
                                                                </button>
                                                            </td>
                                                            :
                                                            <td>
                                                                <button disabled={true} className='btn'>
                                                                    Đã hoàn thành
                                                                </button>
                                                                <button className='btn btn-warning'
                                                                    onClick={() => this.handleBtnReExamination(item)}
                                                                >
                                                                    Hẹn tái khám
                                                                </button>
                                                            </td>
                                                        }

                                                    </tr>
                                                )
                                            })
                                            :
                                            <tr>
                                                <td colSpan="6" style={{ textAlign: "center" }}>no data</td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>

                                <div className='paginate'>
                                    <ReactPaginate
                                        nextLabel={"> next"}
                                        onPageChange={this.handlePageClick}
                                        pageRangeDisplayed={5}
                                        marginPagesDisplayed={2}
                                        pageCount={this.state.pageCount}
                                        previousLabel={"< previous"}
                                        pageClassName="page-item"
                                        pageLinkClassName="page-link"
                                        previousClassName="page-item"
                                        previousLinkClassName="page-link"
                                        nextClassName="page-item"
                                        nextLinkClassName="page-link"
                                        breakLabel="..."
                                        breakClassName="page-item"
                                        breakLinkClassName="page-link"
                                        containerClassName="pagination"
                                        activeClassName="active"
                                        renderOnZeroPageCount={null}
                                    />
                                </div>
                            </div>
                        </div>
                    </div >
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />

                    <DoctorSchedule
                        isOpenModal={isOpenModalBooking}
                        closeBookingModal={this.closeBookingModal}
                        doctorIdFromParent={user.id}
                        dataModal={dataModal}
                        updateDataPatient={this.updateDataPatient}
                    />

                    <DetailRecurrence
                        isOpenModal={isOpenModalDetail}
                        closeDetailModal={this.closeDetailModal}
                        dataModal={dataModal}
                    />

                </LoadingOverlay >
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
