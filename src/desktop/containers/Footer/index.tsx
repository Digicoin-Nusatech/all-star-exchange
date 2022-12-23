import { History } from 'history';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Link, RouteProps, withRouter, useLocation } from 'react-router-dom';
import { compose } from 'redux';
import {
    changeLanguage,
    changeUserDataFetch,
    RootState,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectUserInfo,
    selectUserLoggedIn,
    User,
} from '../../../modules';
import { Logo } from '../../../assets/images/Logo';
import youtubeIcon from '../../../assets/img/icon/youtube.png';
import linkedinIcon from '../../../assets/img/icon/linkedin.png';
import facebookIcon from '../../../assets/img/icon/facebook.png';
import bitcoinCircleIcon from '../../../assets/img/icon/bitcoin-circle.png';

interface State {
    isOpenLanguage: boolean;
}

interface DispatchProps {
    changeLanguage: typeof changeLanguage;
}

interface ReduxProps {
    lang: string;
    colorTheme: string;
    isLoggedIn: boolean;
    user: User;
}

interface OwnProps {
    onLinkChange?: () => void;
    history: History;
    location: {
        pathnname: string;
    };
    changeUserDataFetch: typeof changeUserDataFetch;
}

type Props = OwnProps & ReduxProps & RouteProps & DispatchProps;

class FooterContainer extends React.Component<Props, State> {
    public render() {
        const { isLoggedIn, lang } = this.props;

        return (
            <footer className="py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 mb-4 mb-lg-0 font-bold">
                            <div className="logo mb-3">
                                <Logo />
                            </div>
                            Through many of its unique properties, Bitcoin allows exciting uses that could not be
                            covered by any previous payment system.
                        </div>
                        <div className="col-lg-2 mb-4 mb-lg-0 font-bold">
                            <h4 className="text-primary text-uppercase mb-3">Links</h4>
                            <div className="mb-2">
                                <a href="#">How it works</a>
                            </div>
                            <div className="mb-2">
                                <a href="#">Cryptos</a>
                            </div>
                            <div className="mb-2">
                                <a href="#">Features</a>
                            </div>
                            <div className="mb-2">
                                <a href="#">Testimonial</a>
                            </div>
                            <div className="mb-2">
                                <a href="#">Blogs</a>
                            </div>
                        </div>
                        <div className="col-lg-3 mb-4 mb-lg-0 font-bold">
                            <h4 className="text-primary text-uppercase mb-3">Legal</h4>
                            <div className="mb-2">
                                <a href="#">Terms of use</a>
                            </div>
                            <div className="mb-2">
                                <a href="#">Terms of conditions</a>
                            </div>
                            <div className="mb-2">
                                <a href="#">Privecy policy</a>
                            </div>
                            <div className="mb-2">
                                <a href="#">Cookie policy</a>
                            </div>
                        </div>
                        <div className="col-lg-4 mb-4 mb-lg-0">
                            <h4 className="text-primary text-uppercase mb-3">Newsletter</h4>
                            Over 25000 people have subscribed
                            <form className="f-form mt-3">
                                <input type="email" className="form-control" placeholder="Enter your email" />
                                <button className="btn btn-primary">Subscribe</button>
                            </form>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 mt-4 text-center text-lg-left font-bold">
                            <a href="#" className="mr-3 text-dark">
                                Privacy & Terms
                            </a>
                            <a href="#" className="text-dark">
                                Contact Us
                            </a>
                        </div>
                        <div className="col-lg-4 mt-4 text-center text-dark text-lg-center">
                            Copyright @ 2022 Heaven Exchange
                        </div>
                        <div className="col-lg-4 mt-4 text-center text-dark text-lg-right">
                            <a href="#" className="ml-3 text-dark">
                                <img src={youtubeIcon} alt="#" />
                            </a>
                            <a href="#" className="ml-3 text-dark">
                                <img src={linkedinIcon} alt="#" />
                            </a>
                            <a href="#" className="ml-3 text-dark">
                                <img src={facebookIcon} alt="#" />
                            </a>
                            <a href="#" className="ml-3 text-dark">
                                <img src={bitcoinCircleIcon} alt="#" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

    private handleClick = () => {
        alert('ini untuk footer');
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    isLoggedIn: selectUserLoggedIn(state),
    lang: selectCurrentLanguage(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    changeLanguage: (payload) => dispatch(changeLanguage(payload)),
    changeUserDataFetch: (payload) => dispatch(changeUserDataFetch(payload)),
});

export const Footer = compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(FooterContainer) as React.ComponentClass;
