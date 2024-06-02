import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from "../../../store/actions";
import ReactPaginate from 'react-paginate';

// import style manually
import 'react-markdown-editor-lite/lib/index.css';


class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userRedux: [],
            pageCount: 0,  // Số trang trong phân trang
            currentPage: 0 // Trang hiện tại đang được chọn
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                userRedux: this.props.listUsers,
                pageCount: Math.ceil(this.props.listUsers.length / 5) // Giả sử mỗi trang hiển thị 10 bản ghi
            })
        }
    }

    handlePageChange = (selectedPage) => {
        this.setState({ currentPage: selectedPage.selected });
    };

    handleDeleteUser = (user) => {
        this.props.deleteAUserRedux(user.id);
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user)
    }

    render() {
        let arrUsers = this.state.userRedux;
        const { userRedux, currentPage } = this.state;

        // Tính chỉ số bắt đầu và chỉ số kết thúc của bản ghi hiển thị trên trang hiện tại
        const startIndex = currentPage * 5;
        const endIndex = startIndex + 5;

        // Lấy danh sách bản ghi trên trang hiện tại
        const usersOnPage = userRedux.slice(startIndex, endIndex);


        return (
            <React.Fragment>
                <div className='container-table'>
                    <table id="TableManageUser">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                            {arrUsers && arrUsers.length > 0
                                && usersOnPage.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.email}</td>
                                            <td>{item.firstName}</td>
                                            <td>{item.lastName}</td>
                                            <td>{item.address}</td>
                                            <td>{item.roleData.valueVi}</td>
                                            <td width={280}>
                                                <button className='btn-edit btn-warning'
                                                    onClick={() => this.handleEditUser(item)}>
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                                <button className='btn-delete btn-danger'
                                                    onClick={() => this.handleDeleteUser(item)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </table>

                    <div className='paginate'>
                        <ReactPaginate
                            nextLabel="next >"
                            onPageChange={this.handlePageChange}
                            pageRangeDisplayed={5}
                            marginPagesDisplayed={2}
                            pageCount={this.state.pageCount}
                            previousLabel="< previous"
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
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
