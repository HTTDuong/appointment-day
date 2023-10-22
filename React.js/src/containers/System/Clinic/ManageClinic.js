import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageClinic.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { CommonUtils, LANGUAGES, CRUD_ACTIONS } from '../../../utils';
import { createNewSpectialty, createNewClinic } from '../../../services/userService'
import { toast } from 'react-toastify';
import Lightbox from 'react-image-lightbox';
import * as actions from "../../../store/actions";
import TableManageClinic from './TableManageClinic';

const mdParser = new MarkdownIt();

class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            previewImgURL: '',
            isOpen: false,
            action: '',

            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            clinicId: ''
        }
    }

    async componentDidMount() {

    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
        if (prevProps.listClinics !== this.props.listClinics) {
            this.setState({
                name: '',
                address: '',
                imageBase64: '',
                action: CRUD_ACTIONS.CREATE,
                descriptionHTML: '',
                descriptionMarkdown: '',
                previewImgURL: '',
            })
        }

    }

    handleOnChangeInput = (event, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);

            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                imageBase64: base64
            })
        }
    }

    handleSaveNewClinic = async () => {
        let { action } = this.state;
        // if (action === '') {
        //     action = CRUD_ACTIONS.CREATE
        // }
        if (action === CRUD_ACTIONS.CREATE) {
            let res = await createNewClinic(this.state)
            if (res && res.errCode === 0) {
                toast.success('Add new clinic succeed!')
                this.setState({
                    name: '',
                    imageBase64: '',
                    address: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                    action: CRUD_ACTIONS.CREATE,
                })
            } else {
                toast.error('Something wrong...')
                console.log("Check response: ", res)
            }
            this.props.fetchAllClinic();
        }
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.editClinic({
                name: this.state.name,
                image: this.state.imageBase64,
                address: this.state.address,
                descriptionHTML: this.state.descriptionHTML,
                descriptionMarkdown: this.state.descriptionMarkdown,
                id: this.state.clinicId
            })
            // this.setState({
            //     name: '',
            //     imageBase64: '',
            //     address: '',
            //     descriptionHTML: '',
            //     descriptionMarkdown: '',
            //     action: CRUD_ACTIONS.CREATE,
            // })
        }
    }

    openPreviewImage = () => {
        if (!this.state.previewImgURL) return;
        this.setState({
            isOpen: true
        })
    }

    handleEditUserFromParent = (user) => {
        // console.log(user)
        let imageBase64 = '';
        if (user.image) {
            imageBase64 = user.image.toString('binary');
        }
        this.setState({
            name: user.name,
            imageBase64: user.image,
            previewImgURL: imageBase64,
            address: user.address,
            descriptionHTML: user.descriptionHTML,
            descriptionMarkdown: user.descriptionMarkdown,
            action: CRUD_ACTIONS.EDIT,
            clinicId: user.id
        })
    }


    render() {
        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>
                    Quản lý phòng khám
                </div>
                <div className='all-new-specialty row'>
                    <div className='col-4 form-group'>
                        <label>Tên phòng khám</label>
                        <input className='form-control' type='text'
                            value={this.state.name}
                            onChange={(event) => this.handleOnChangeInput(event, 'name')}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>Địa chỉ phòng khám</label>
                        <input className='form-control' type='text'
                            value={this.state.address}
                            onChange={(event) => this.handleOnChangeInput(event, 'address')}
                        />
                    </div>
                    <div className='col-4 form-group preview-img-container'>
                        <input id='previewImg' type='file' hidden
                            onChange={(event) => this.handleOnchangeImage(event)}
                        />
                        <label className='label-upload' htmlFor='previewImg'>Tải ảnh <i className="fas fa-upload"></i></label>
                        <div className='preview-image'
                            style={{ backgroundImage: `url(${this.state.previewImgURL})` }}
                            onClick={() => this.openPreviewImage()}
                        >
                        </div>
                    </div>
                    <div className='col-12'>
                        <MdEditor style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    {/* <div className='col-12'>
                        <button className='btn-save-specialty'
                            onClick={() => this.handleSaveNewClinic()}
                        >
                            Save
                        </button>
                    </div> */}
                    <div className='col-12 my-3'>
                        <button className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning' : 'btn btn-primary'}
                            onClick={() => this.handleSaveNewClinic()}
                        >
                            {this.state.action === CRUD_ACTIONS.EDIT ?
                                <FormattedMessage id="manage-user.edit" /> :
                                <FormattedMessage id="manage-user.save" />}
                        </button>
                    </div>
                </div>
                <div className='col-12 mb-5'>
                    <TableManageClinic
                        handleEditUserFromParentKey={this.handleEditUserFromParent}
                        action={this.state.action}
                    />
                </div>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        listClinics: state.admin.clinics
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllClinic: () => dispatch(actions.fetchAllClinic()),
        editClinic: (data) => dispatch(actions.editClinic(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
