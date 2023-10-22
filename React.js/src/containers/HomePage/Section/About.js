import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './About.scss';

class About extends Component {

    render() {

        return (
            <div className='section-share section-about-detail'>
                <div className='section-about-content'>
                    <div class="container-fluid">

                        <div class="section-header text-center">
                            <h2>Discover the Online Appointment!</h2>
                            <p class="sub-title">A step-by-step guide to build an on-demand appointment for patients</p>
                        </div>

                        <div class="row blog-grid-row">
                            <div class="col-lg-4">
                                <div class="box_feat" id="step_1">
                                    <span></span>
                                    <h3>Find a Doctor</h3>
                                    <p>With more than 1000+ doctors and on mission to provide best care Health Care Service</p>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="box_feat" id="step_2">
                                    <span></span>
                                    <h3>View Doctor</h3>
                                    <p>Share your health concern here and we shall assign you a top doctor across the North East</p>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="box_feat" id="step_3">
                                    <h3>Book a visit</h3>
                                    <p>Book your time slot with doctor from your comfort zone</p>
                                </div>
                            </div>
                        </div>

                        <div class="text-center mobi-pdb-20">
                            <a href="#" class="theme-btn">Find Doctor <i class="fas fa-arrow-right"></i> </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        //inject
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
