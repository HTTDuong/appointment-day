import React, { Component } from 'react';
import { connect } from "react-redux";
import './DetailRecurrence.scss';
import moment from 'moment/moment';
import { LANGUAGES } from '../../../utils';
import { postDetailRecurrence } from '../../../services/userService'
import { FormattedMessage } from 'react-intl';
import { Modal } from 'reactstrap';
import { toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox';

class DetailRecurrence extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allRecurr: [],
            // previewImgURLs: {},
        }
    }

    async componentDidMount() {
        let dataModal = this.props.dataModal;

        if (dataModal) {
            let res = await postDetailRecurrence(dataModal);
            this.setState({
                allRecurr: res.data ? res.data : []
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.dataModal !== prevProps.dataModal) {
            let res = await postDetailRecurrence(this.props.dataModal);
            this.setState({
                allRecurr: res.data ? res.data : []
            })
        }
    }

    closeDetailModal = () => {
        this.setState({
            isOpenModalDetail: false
        })
    }

    convertBase64 = (item) => {
        let imageBase64 = '';
        if (item) {
            imageBase64 = new Buffer(item.data, 'base64').toString('binary');
            return imageBase64;
        }
        return;
    }

    render() {
        let { allRecurr } = this.state;
        let { language, isOpenModal, closeDetailModal, dataModal } = this.props;
        console.log("check all recurr", allRecurr);

        return (
            <>
                <Modal isOpen={isOpenModal} className={'booking-modal-container'}
                    size='lg' centered
                >
                    <div className='booking-modal-content'>
                        <div className='booking-modal-header'>
                            <span className='left'>Lịch sử khám bệnh của bệnh nhân</span>
                            <span className='right' onClick={closeDetailModal}>
                                <i className='fas fa-times' ></i>
                            </span>
                        </div>
                        <div className='doctor-schedule-container'>
                            <div className='all-available-time'>
                                <div className='time-content'>
                                    {allRecurr && allRecurr.length > 0 ?
                                        <>
                                            <div className='time-content-btns'>
                                                {allRecurr.map((item, index) => {
                                                    return (
                                                        <>
                                                            <div key={index}>
                                                                <div>Họ tên bệnh nhân: {item.History.fullName}</div>
                                                                <div>Giới tính: {item.History.gender}</div>
                                                                <div>Ngày khám: {moment.unix(item.History.date / 1000).format('DD/MM/YYYY')}</div>
                                                                <span>Kết quả khám</span>
                                                                <div className='preview-image'
                                                                    style={{ backgroundImage: `url(${this.convertBase64(item.History.files)})` }}
                                                                >
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                })}
                                            </div>
                                        </>
                                        :
                                        <div className='no-schedule'>
                                            <p>Chưa có lịch sử tái khám</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn-booking-cancel'
                                onClick={closeDetailModal}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailRecurrence);
