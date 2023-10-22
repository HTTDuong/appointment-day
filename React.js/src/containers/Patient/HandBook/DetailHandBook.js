import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DetailHandBook.scss';
import HomeHeader from '../../HomePage/HomeHeader';
import { getAllDetailHandbookById } from '../../../services/userService';
import _ from 'lodash';
import { LANGUAGES } from '../../../utils';

class DetailHandBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataDetailHandbook: {},
        }
    }

    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getAllDetailHandbookById({
                id: id,
            });
            if (res && res.errCode === 0) {
                this.setState({
                    dataDetailHandbook: res.data,
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }

    }

    render() {
        let { dataDetailHandbook } = this.state;
        // console.log("check state: ", this.state)

        let { language } = this.props;
        return (
            <div className='detail-specialty-container'>
                <HomeHeader />
                <div className='detail-specialty-body'>
                    <div className='description-specialty'>
                        {dataDetailHandbook && !_.isEmpty(dataDetailHandbook)
                            &&
                            <>
                                <h3><b>{dataDetailHandbook.name}</b></h3>
                                <div dangerouslySetInnerHTML={{ __html: dataDetailHandbook.descriptionHTML }}>

                                </div>
                            </>
                        }

                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailHandBook);
