import { History } from 'history';
import * as React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { captchaType } from '../../../api/config';
import { IntlProps } from '../../../';
import { Captcha } from '../../../components';
import { EMAIL_REGEX, setDocumentTitle } from '../../../helpers';
import {
    emailVerificationFetch,
    GeetestCaptchaResponse,
    resetCaptchaState,
    RootState,
    selectCaptchaResponse,
    selectCurrentLanguage,
    selectGeetestCaptchaSuccess,
    selectMobileDeviceState,
    selectRecaptchaSuccess,
    selectSendEmailVerificationError,
    selectSendEmailVerificationLoading,
    selectSendEmailVerificationSuccess,
    selectUserInfo,
    User,
    createConfirmationCodeFetch,
    selectConfirmationCodeCreateSuccess,
} from '../../../modules';
import { CommonError } from '../../../modules/types';
import PinInput from 'react-pin-input';

import patternDots from '../../../assets/img/pattern-dots2.png';
import heroSignin from '../../../assets/img/hero-sign-in.png';

interface OwnProps {
    history: History;
    location: {
        state: {
            email: string;
        };
    };
    success: boolean;
    error?: CommonError;
}

interface DispatchProps {
    emailVerificationFetch: typeof emailVerificationFetch;
    resetCaptchaState: typeof resetCaptchaState;
    createConfirmationCodeFetch: typeof createConfirmationCodeFetch;
}

interface ReduxProps {
    emailVerificationLoading: boolean;
    isMobileDevice: boolean;
    captcha_response?: string | GeetestCaptchaResponse;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
    user: User;
    ConfirmationCodeCreateSuccess: boolean;
}

type Props = DispatchProps & ReduxProps & OwnProps & IntlProps;

class EmailVerificationComponent extends React.Component<Props> {
    public readonly state = {
        code: '',
    };
    public componentDidMount() {
        setDocumentTitle('Email verification');

        if (!this.props.location.state) {
            this.props.history.push('/login');
        }
    }

    public componentDidUpdate(prevProps: Props) {
        const { history, ConfirmationCodeCreateSuccess } = this.props;
        if (ConfirmationCodeCreateSuccess === true) {
            history.push('/login');
        }
    }

    public translate = (id: string) => this.props.intl.formatMessage({ id });

    public renderCaptcha = () => {
        const { error, success } = this.props;

        return <Captcha error={error} success={success} />;
    };

    public render() {
        const { emailVerificationLoading } = this.props;

        const button = this.props.intl.formatMessage({ id: 'page.resendConfirmation' });

        return (
            <React.Fragment>
                <section className="py-5 mt-5 email-verification">
                    <img src={patternDots} alt="#" className="right" />
                    <img src={patternDots} alt="#" className="left" />
                    <div className="container">
                        <div className="card bg-light p-5 shadow-sm border-0 radius-8">
                            <div className="row align-items-center">
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <img src={heroSignin} alt="#" className="w-100" />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="card p-3 border-0">
                                        <div className="text-left">
                                            <h3 className="text-dark mb-4">Enter The Verification Code</h3>
                                        </div>
                                        <form>
                                            <label>Email Verification</label>
                                            <PinInput
                                                length={6}
                                                onChange={this.handleChangeConfirmChange}
                                                onComplete={this.handleChangeConfirmChange}
                                                type="numeric"
                                                inputMode="number"
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '8px',
                                                    borderColor: '#5b46f6',
                                                }}
                                                inputStyle={{
                                                    borderColor: '#F2F0FF',
                                                    background: '#F2F0FF',
                                                    borderRadius: '4px',
                                                    fontSize: '20px',
                                                    color: '#23262F',
                                                }}
                                                inputFocusStyle={{ fontSize: '20px', color: 'color: #23262F' }}
                                                autoSelect={true}
                                                regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                                            />
                                            <div className="text-right">
                                                {emailVerificationLoading ? (
                                                    <Spinner animation="border" variant="primary" />
                                                ) : (
                                                    <button
                                                        className="btn btn-link text-primary mt-3"
                                                        onClick={this.handleClick}
                                                        disabled={this.disableButton()}>
                                                        {/* {button} */}
                                                        Resend Code
                                                    </button>
                                                )}
                                            </div>
                                            <div className="mt-2 mb-4">{this.renderCaptcha()}</div>
                                            <Button
                                                block={true}
                                                type="button"
                                                disabled={this.disableButton()}
                                                onClick={this.codeConfirm}
                                                size="lg"
                                                className="btn-full"
                                                variant="primary">
                                                Activate Account
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }

    private handleChangeConfirmChange = (value: string) => {
        this.setState({
            code: value,
        });
    };

    private codeConfirm = () => {
        const payload = {
            email: this.props.location.state.email,
            code: this.state.code,
        };
        this.props.createConfirmationCodeFetch(payload);
    };

    private handleClick = () => {
        const { captcha_response } = this.props;

        switch (captchaType()) {
            case 'recaptcha':
            case 'geetest':
                this.props.emailVerificationFetch({
                    email: this.props.location.state.email,
                    captcha_response,
                });
                break;
            default:
                this.props.emailVerificationFetch({
                    email: this.props.location.state.email,
                });
                break;
        }

        this.props.resetCaptchaState();
    };

    private disableButton = (): boolean => {
        const { location, geetestCaptchaSuccess, reCaptchaSuccess } = this.props;
        const captchaTypeValue = captchaType();

        if (location.state && location.state.email && !location.state.email.match(EMAIL_REGEX)) {
            return true;
        }

        if (captchaTypeValue === 'recaptcha' && !reCaptchaSuccess) {
            return true;
        }

        if (captchaTypeValue === 'geetest' && !geetestCaptchaSuccess) {
            return true;
        }

        return false;
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state) => ({
    emailVerificationLoading: selectSendEmailVerificationLoading(state),
    i18n: selectCurrentLanguage(state),
    isMobileDevice: selectMobileDeviceState(state),
    error: selectSendEmailVerificationError(state),
    success: selectSendEmailVerificationSuccess(state),
    captcha_response: selectCaptchaResponse(state),
    reCaptchaSuccess: selectRecaptchaSuccess(state),
    geetestCaptchaSuccess: selectGeetestCaptchaSuccess(state),
    user: selectUserInfo(state),
    ConfirmationCodeCreateSuccess: selectConfirmationCodeCreateSuccess(state),
});

const mapDispatchToProps = {
    emailVerificationFetch,
    resetCaptchaState,
    createConfirmationCodeFetch,
};

export const EmailVerificationScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(EmailVerificationComponent) as React.ComponentClass;
