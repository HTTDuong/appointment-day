import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageClinic.scss';
import * as actions from "../../../store/actions";


class TableManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userRedux: []
        }
    }

    componentDidMount() {
        this.props.fetchAllClinic();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listClinics !== this.props.listClinics) {
            this.setState({
                userRedux: this.props.listClinics
            })
        }
    }

    handleDeleteUser = (user) => {
        // console.log(this.props)
        this.props.deleteAClinic(user.id);
    }

    handleEditUser = (clinic) => {
        this.props.handleEditUserFromParentKey(clinic)
    }

    render() {
        let arrClinics = this.state.userRedux;
        // console.log("ThuyDuong", arrClinics)

        return (
            <React.Fragment>
                <table id="TableManageClinic">
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                        {arrClinics && arrClinics.length > 0
                            && arrClinics.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className='btn-edit'
                                                onClick={() => this.handleEditUser(item)}>
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button className='btn-delete'
                                                onClick={() => this.handleDeleteUser(item)}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>

            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        listClinics: state.admin.clinics
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllClinic: () => dispatch(actions.fetchAllClinic()),
        deleteAClinic: (id) => dispatch(actions.deleteAClinic(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageClinic);
