import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './History.scss';
import * as actions from "../../../../store/actions";
import moment from 'moment';
import { CommonUtils } from '../../../../utils';
import Lightbox from 'react-image-lightbox';


class History extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allHistories: [],
            previewImgURLs: {},
            isOpen: false,
        }
    }

    async componentDidMount() {
        this.props.loadAllHistories(this.props.userInfo.id);
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (prevProps.allHistoriesRedux !== this.props.allHistoriesRedux) {
            if (this.props.allHistoriesRedux[0]) {
                this.convertBase64(this.props.allHistoriesRedux[0].files)
            }

            this.setState({
                allHistories: this.props.allHistoriesRedux,
                // previewImgURLs: previewImgURLs
            })
        }
    }

    openPreviewImage = () => {
        this.setState({
            isOpen: true
        })
    }

    convertBase64 = (item) => {
        let imageBase64 = '';
        imageBase64 = new Buffer(item.data, 'base64').toString('binary');
        this.setState({
            previewImgURLs: imageBase64
        })
        // return imageBase64;
    }


    render() {
        let allHistories = this.state.allHistories;
        let { language } = this.props;
        let previewImgURLs = this.state.previewImgURLs;
        console.log("check his", allHistories)

        return (
            <>
                <div className='all-histories'>
                    {allHistories && allHistories.length > 0 ?
                        allHistories.map((item, index) => {
                            let nameDoctor = `${item.doctorIdHistory.lastName} ${item.doctorIdHistory.firstName}`;
                            let time = moment.unix(+item.date / 1000).format('DD/MM/YYYY');
                            console.log("check item", item)

                            return (
                                <div className='section-info'>
                                    <div className='customize-info-left'>
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
                                                <span>{item.genderDataHistory.valueVi}</span>
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
                                        <div className='user-item'>
                                            <div className='user-item-left'>
                                                <i class="fas fa-stethoscope"></i>
                                                <span>Bác sĩ: </span>
                                            </div>
                                            <div className='user-item-right'>
                                                <span>{nameDoctor}</span>
                                            </div>
                                        </div>
                                        <div className='user-item'>
                                            <div className='user-item-left'>
                                                <i class="fas fa-calendar-minus"></i>
                                                <span>Ngày khám: </span>
                                            </div>
                                            <div className='user-item-right'>
                                                <span>{time}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='customize-info-right'>
                                        <div className='user-item'>
                                            <div className='user-item-left'>
                                                <i className="far fa-calendar-check"></i>
                                                <span>Kết quả khám: </span>
                                            </div>

                                            <div className='preview-image'
                                                style={{ backgroundImage: `url(${previewImgURLs})` }}
                                                onClick={() => this.openPreviewImage()}
                                            >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <tr>
                            <td style={{ textAlign: "center", width: '990px', paddingTop: '20px' }}>Bạn chưa có lịch sử khám bệnh.</td>
                        </tr>
                    }
                    {this.state.isOpen === true &&
                        <Lightbox
                            mainSrc={previewImgURLs}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                        />
                    }
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allHistoriesRedux: state.admin.allHistories,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadAllHistories: (id) => dispatch(actions.fetchAllHistories(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(History);

