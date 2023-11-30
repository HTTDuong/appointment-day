import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './Record.scss';
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import RecordModal from '../Modal/RecordModal';
import { getAllRecords } from '../../../../services/userService'


class Record extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrRecords: [],
            isOpenModalBooking: false,
        }
    }

    async componentDidMount() {
        this.props.loadAllRecords(this.props.userInfo.id);
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allRecordRedux !== this.props.allRecordRedux) {
            this.setState({
                arrRecords: this.props.allRecordRedux
            })
        }
    }

    handleClickAddRecord = () => {
        this.setState({
            isOpenModalBooking: true,
        })
    }

    handleDeleteRecord = (item) => {
        this.props.deleteARecordRedux(item.id);
    }

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    createRecord = async (data) => {
        let record = await getAllRecords(data.userId);

        if (record && record.errCode === 0) {
            this.setState({
                arrRecords: record.data
            })
        }
    }


    render() {
        let arrRecords = this.state.arrRecords;
        let { language } = this.props;
        let { isOpenModalBooking } = this.state;

        return (
            <>
                <div className='all-records'>
                    <div className='content-btn'>
                        <button className='btn-add' onClick={() => this.handleClickAddRecord()}>
                            <i class="fas fa-plus"></i>Thêm hồ sơ
                        </button>
                    </div>
                    {arrRecords && arrRecords.length > 0 ?
                        arrRecords.map((item, index) => {
                            let genderSelected;
                            if (item.gender === 'M') {
                                genderSelected = 'Nam'
                            } else {
                                genderSelected = 'Nữ'
                            }
                            return (
                                <div className='section-info'>
                                    <div className='customize-info'>
                                        <div className='user-item'>
                                            <div className='user-item-left'>
                                                <i class="fas fa-user-circle"></i>
                                                <span>Họ và tên: </span>
                                            </div>
                                            <div className='user-item-right'>
                                                <span>{item.fullName}</span>
                                            </div>
                                        </div>
                                        <div className='user-item'>
                                            <div className='user-item-left'>
                                                <i class="fas fa-phone fa-flip-horizontal"></i>
                                                <span>Số điện thoại: </span>
                                            </div>
                                            <div className='user-item-right'>
                                                <span>{item.phoneNumber}</span>
                                            </div>
                                        </div>
                                        <div className='user-item'>
                                            <div className='user-item-left'>
                                                <i class="fas fa-user-graduate"></i>
                                                <span>Giới tính: </span>
                                            </div>
                                            <div className='user-item-right'>
                                                <span>{genderSelected}</span>
                                            </div>
                                        </div>
                                        <div className='user-item'>
                                            <div className='user-item-left'>
                                                <i class="fas fa-map-marker-alt"></i>
                                                <span>Địa chỉ: </span>
                                            </div>
                                            <div className='user-item-right'>
                                                <span>{item.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='customize-info-bottom'>
                                        <button className='btn-delete'
                                            onClick={() => this.handleDeleteRecord(item)}>
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <tr>
                            <td style={{ textAlign: "center", width: '990px' }}>no data</td>
                        </tr>
                    }
                </div>
                <RecordModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingModal={this.closeBookingModal}
                    createRecord={this.createRecord}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allRecordRedux: state.admin.allRecords,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadAllRecords: (id) => dispatch(actions.fetchAllRecords(id)),
        deleteARecordRedux: (id) => dispatch(actions.deleteARecord(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Record);
