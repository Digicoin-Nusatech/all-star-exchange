import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { History } from 'history';
import { RouterProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import { passwordMinEntropy } from '../../../api/config';
import {
    setDocumentTitle,
    PASSWORD_REGEX,
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
} from '../../../helpers';
import {
    toggle2faFetch,
    selectChangePasswordSuccess,
    changePasswordFetch,
    selectUserInfo,
    User,
    userFetch,
    RootState,
    entropyPasswordFetch,
    selectCurrentPasswordEntropy,
    sendCode,
    verifyPhone,
} from '../../../modules';
import { ModalTwoFa, Modal, CustomInput, PasswordStrengthMeter } from '../../components';
import { CheckIcon, GoogleIcon, KeyIcon, MailIcon, PhoneIcon } from '../../../assets/images/ProfileSecurityIcon';
import { Notification } from '../../../assets/images/Notification';
import { CloseIcon, ModalCloseIcon } from '../../../assets/images/CloseIcon';
interface ProfileSecurityState {
    showTwoFaModal: boolean;
    showTwoFaPhoneModal: boolean;
    showTwoFaPasswordModal: boolean;
    showPhoneModal: boolean;
    showPasswordModal: boolean;
    twoFaCode: string;
    twoFaPhoneCode: string;
    twoFaPasswordCode: string;
    newPhone: string;
    confirmationCode: string;
    passwordNew: string;
    passwordOld: string;
    passwordConfirm: string;
    passwordNewFocus: boolean;
    passwordConfirmFocus: boolean;
    twoFaStatus: boolean;
    passwordMatches: boolean;
    passwordPopUp: boolean;
    passwordErrorFirstSolved: boolean;
    passwordErrorSecondSolved: boolean;
    passwordErrorThirdSolved: boolean;
}

interface OwnProps {
    history: History;
}

interface ReduxProps {
    user: User;
    currentPasswordEntropy: number;
}

interface DispatchProps {
    changePasswordFetch: typeof changePasswordFetch;
    fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
    toggle2faFetch: typeof toggle2faFetch;
}

type Props = RouterProps & IntlProps & OwnProps & DispatchProps & ReduxProps;

class ProfileSecurityComponent extends React.Component<Props, ProfileSecurityState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showTwoFaModal: false,
            showTwoFaPhoneModal: false,
            showTwoFaPasswordModal: false,
            showPhoneModal: false,
            showPasswordModal: false,
            twoFaCode: '',
            twoFaPhoneCode: '',
            twoFaPasswordCode: '',
            newPhone: '',
            confirmationCode: '',
            passwordNew: '',
            passwordOld: '',
            passwordConfirm: '',
            passwordNewFocus: false,
            passwordConfirmFocus: false,
            twoFaStatus: false,
            passwordMatches: true,
            passwordPopUp: false,
            passwordErrorFirstSolved: false,
            passwordErrorSecondSolved: false,
            passwordErrorThirdSolved: false,
        };
    }

    public componentDidMount() {
        setDocumentTitle('Profile Security');
    }

    public componentDidUpdate() {
        // if (this.state.passwordNew !== this.state.passwordConfirm) {
        //     this.setState({ passwordMatches: false });
        // }
        // console.log(this.props.user);
    }

    public render() {
        const {
            twoFaCode,
            twoFaPasswordCode,
            showPhoneModal,
            showPasswordModal,
            twoFaStatus,
            passwordConfirm,
            passwordNew,
            passwordOld,
            passwordErrorFirstSolved,
            passwordErrorSecondSolved,
            passwordErrorThirdSolved,
        } = this.state;

        // handle click menu google authenticator
        const handleClickPassword = () => {
            this.props.user.otp
                ? this.setState({ showPasswordModal: true })
                : this.props.history.push('/two-fa-activation');
        };

        // handle click menu google authenticator
        const handleClickGoogleAuth = () => {
            this.props.user.otp
                ? this.setState({ showTwoFaModal: true })
                : this.props.history.push('/two-fa-activation');
        };

        // handle click menu google authenticator
        const handleClickPhone = () => {
            this.props.user.otp
                ? this.setState({ showPhoneModal: true })
                : this.props.history.push('/two-fa-activation');
        };

        // handle submit google two fa
        const handleSubmitTwoFa = async () => {
            await this.props.toggle2faFetch({ code: twoFaCode, enable: false });
            this.setState({ showTwoFaModal: !this.state.showTwoFaModal });
        };

        return (
            <React.Fragment>
                <div className="profile-security-screen content-wrapper dark-bg-accent pb-5">
                    <div className="header dark-bg-main py-4 px-24 mb-24">
                        <h2 className="mb-0 text-xl white-text font-bold ">Security System</h2>
                    </div>
                    <div className="px-24">
                        <div className="d-flex mb-24">
                            <div className="status d-flex align-items-center">
                                {twoFaStatus ? <CheckIcon /> : ''}
                                <p className="mb-0 white-text text-sm ml-3">
                                    Two-Factor Authentication Testing Page (2FA)
                                </p>
                            </div>
                            <div className="status d-flex align-items-center ml-4">
                                <CheckIcon />
                                <p className="mb-0 white-text text-sm ml-3">Identity Verification</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="notification-warning alert show text-sm white-text font-normal position-relative mb-24">
                                    <Notification className="mr-2" />
                                    To ensure the security of your account, use a combination of Google Verification +
                                    Email Binding or Phone Number Binding
                                    <div className="close-icon pl-3">
                                        <CloseIcon fill="#fff" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-md font-bold white-text mb-4">Authentication</h3>
                        <div className="row">
                            <div className="col-sm-12 col-lg-7">
                                <div className="box">
                                    <div className="d-flex align-items-start">
                                        <GoogleIcon />
                                        <div className="ml-4">
                                            <p className="d-flex mb-1 text-ms white-text font-bold">
                                                Google Authenticator (Recommended)
                                                <CheckIcon className="ml-3" />
                                            </p>
                                            <span className="text-sm grey-text-accent">
                                                Protect your account and withdrawals with a security key such as
                                                Yubikey.
                                            </span>
                                            <div className="d-flex mt-3">
                                                <button
                                                    id="button-remove-2fa"
                                                    type="button"
                                                    onClick={handleClickGoogleAuth}
                                                    className={`btn btn-transparent w-auto font-bold text-sm px-0 ${
                                                        this.props.user.otp ? 'grey-text' : 'gradient-text'
                                                    }`}>
                                                    {this.props.user.otp ? 'Remove' : 'Activate'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-lg-5">
                                <div className="box">
                                    <div className="d-flex align-items-start">
                                        <MailIcon />
                                        <div className="ml-4">
                                            <p className="d-flex mb-1 text-ms white-text font-bold">
                                                Email Address Verification
                                                <CheckIcon className="ml-3" />
                                            </p>
                                            <span className="text-sm grey-text-accent">
                                                Protect your account and transactions.
                                            </span>
                                            <div className="d-flex mt-3">
                                                <Link
                                                    to={'/change-email'}
                                                    className="btn btn-transparent gradient-text font-bold text-sm w-auto px-0 mr-3">
                                                    Change
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12">
                                <div className="box">
                                    <div className="d-flex align-items-start">
                                        <PhoneIcon />
                                        <div className="ml-4">
                                            <p className="d-flex mb-1 text-ms white-text font-bold">
                                                Phone Number Verification
                                                <CheckIcon className="ml-3" />
                                            </p>
                                            <span className="text-sm grey-text-accent">
                                                Protect your account and transactions.
                                            </span>
                                            <div className="d-flex mt-3">
                                                <button
                                                    onClick={() => handleClickPhone()}
                                                    type="button"
                                                    className="btn btn-transparent gradient-text font-bold text-sm w-auto px-0 mr-3">
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-md font-bold white-text mb-4">Advance Security</h3>
                        <div className="col-sm-12">
                            <div className="box">
                                <div className="d-flex align-items-start">
                                    <KeyIcon />
                                    <div className="ml-4">
                                        <p className="d-flex mb-1 text-ms white-text font-bold">
                                            Login Password
                                            <CheckIcon className="ml-3" />
                                        </p>
                                        <span className="text-sm grey-text-accent">
                                            Login password is used to log in to your account.
                                        </span>
                                        <div className="d-flex mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-transparent gradient-text font-bold text-sm w-auto px-0 mr-3"
                                                // onClick={() => this.setState({ showTwoFaPasswordModal: true })}
                                                onClick={() => handleClickPassword()}>
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ModalTwoFa
                    show={this.state.showTwoFaModal}
                    twoFaValue={this.state.twoFaCode}
                    onSubmit={handleSubmitTwoFa}
                    closeModal={() => this.setState({ showTwoFaModal: false })}
                    onChangeValue={(e) => this.setState({ twoFaCode: e })}
                />

                <Modal content={this.modalPhoneContent()} header={this.modalPhoneHeader()} show={showPhoneModal} />
                <Modal
                    content={this.modalPasswordContent()}
                    header={this.modalPasswordHeader()}
                    show={showPasswordModal}
                />
            </React.Fragment>
        );
    }

    // **PHONE NUMBER PUBLIC FUNCTION
    // Render phone modal
    public modalPhoneContent = () => {
        return (
            <React.Fragment>
                <p className="text-sm grey-text mb-24">Set your new Phone number and verifed</p>
                <div className="form">
                    <div className="form-group mb-24">
                        <CustomInput
                            defaultLabel="New Phone Number"
                            inputValue={this.state.newPhone}
                            label="New Phone Number"
                            placeholder="+6281902912921"
                            type="text"
                            labelVisible
                            classNameLabel="white-text text-sm"
                            handleChangeInput={(e) => this.setState({ newPhone: e })}
                        />
                    </div>
                    <div className="form-group mb-24">
                        <label className="white-text text-sm ">Verification Code</label>
                        <div className="d-flex align-items-center">
                            <CustomInput
                                defaultLabel=""
                                inputValue={this.state.confirmationCode}
                                label=""
                                placeholder="_____"
                                type="text"
                                labelVisible={false}
                                classNameLabel="d-none"
                                classNameInput="spacing-10"
                                classNameGroup="mb-0 w-100"
                                handleChangeInput={(e) => this.setState({ confirmationCode: e })}
                            />
                            <button className="btn btn-primary ml-2 text-nowrap">Send Code</button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        data-toggle="modal"
                        data-target="#change-phone"
                        data-dismiss="modal">
                        Change
                    </button>
                </div>
            </React.Fragment>
        );
    };

    public modalPhoneHeader = () => {
        return (
            <React.Fragment>
                <h6 className="text-xl font-bold white-text mb-0">Change Phone Number</h6>
                <ModalCloseIcon
                    className="cursor-pointer ml-4"
                    onClick={() => this.setState({ showPhoneModal: false })}
                />
            </React.Fragment>
        );
    };
    // **END PHONE NUMBER PUBLIC FUNCTION

    // **PASSWORD PUBLIC FUNCTION
    // Render password modal content
    public modalPasswordContent = () => {
        const translate = (key: string) => this.props.intl.formatMessage({ id: key });

        const isValidForm = () => {
            const isOldPasswordValid =
                this.state.passwordOld.match(PASSWORD_REGEX) &&
                this.state.passwordErrorFirstSolved &&
                this.state.passwordErrorSecondSolved &&
                this.state.passwordErrorThirdSolved;
            const isNewPasswordValid =
                this.state.passwordNew.match(PASSWORD_REGEX) &&
                this.state.passwordErrorFirstSolved &&
                this.state.passwordErrorSecondSolved &&
                this.state.passwordErrorThirdSolved;
            const isConfirmPasswordValid = this.state.passwordNew === this.state.passwordConfirm;

            return isOldPasswordValid && isNewPasswordValid && isConfirmPasswordValid;
        };

        return (
            <React.Fragment>
                <>
                    <p className="text-sm grey-text mb-24">
                        Set your new password with strong password incule numbers, letters, and punctuation marks
                    </p>
                    <div className="form">
                        <div className="form-group position-relative mb-24">
                            <CustomInput
                                defaultLabel="Old Password"
                                inputValue={this.state.passwordOld}
                                label="Old Password"
                                placeholder="Old Password"
                                type="password"
                                labelVisible
                                classNameLabel="white-text text-sm"
                                handleChangeInput={(e) => this.setState({ passwordOld: e })}
                            />
                        </div>
                        <div className="form-group position-relative mb-24">
                            <CustomInput
                                defaultLabel="New Password "
                                inputValue={this.state.passwordNew}
                                label="New Password"
                                placeholder="New Password"
                                type="password"
                                labelVisible
                                classNameLabel="white-text text-sm"
                                classNameInput={`${
                                    this.state.passwordNewFocus &&
                                    (!this.state.passwordErrorFirstSolved ||
                                        !this.state.passwordErrorSecondSolved ||
                                        !this.state.passwordErrorThirdSolved) &&
                                    'error'
                                }`}
                                autoFocus={false}
                                handleFocusInput={this.handleFocusNewPassword}
                                handleChangeInput={this.handleChangeNewPassword}
                            />

                            {this.state.passwordNewFocus &&
                                (!this.state.passwordErrorFirstSolved ||
                                    !this.state.passwordErrorSecondSolved ||
                                    !this.state.passwordErrorThirdSolved) && (
                                    <p className="danger-text m-0 mb-24 text-xs">Password Strength must be GOOD</p>
                                )}
                        </div>

                        <div>
                            <PasswordStrengthMeter
                                minPasswordEntropy={passwordMinEntropy()}
                                currentPasswordEntropy={this.props.currentPasswordEntropy}
                                passwordExist={this.state.passwordNew !== ''}
                                passwordErrorFirstSolved={this.state.passwordErrorFirstSolved}
                                passwordErrorSecondSolved={this.state.passwordErrorSecondSolved}
                                passwordErrorThirdSolved={this.state.passwordErrorThirdSolved}
                                passwordPopUp={this.state.passwordPopUp}
                                translate={translate}
                            />
                        </div>
                        <div className="form-group position-relative mb-24">
                            <CustomInput
                                defaultLabel="Confirm Password "
                                inputValue={this.state.passwordConfirm}
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                type="password"
                                labelVisible
                                classNameLabel="white-text text-sm"
                                classNameInput={`${
                                    this.state.passwordConfirmFocus &&
                                    this.state.passwordConfirm != this.state.passwordNew &&
                                    'error'
                                }`}
                                handleFocusInput={this.handleFocusConfirmPassword}
                                handleChangeInput={(e) => this.setState({ passwordConfirm: e })}
                            />

                            {this.state.passwordConfirmFocus &&
                                this.state.passwordConfirm != this.state.passwordNew && (
                                    <p className="text-xs danger-text m-0 mb-24">Password Confirmation doesn't match</p>
                                )}
                        </div>
                        <button
                            disabled={!isValidForm()}
                            onClick={this.handleSubmitChangePassword}
                            type="submit"
                            className="btn btn-primary btn-block"
                            data-dismiss="modal"
                            data-toggle="modal"
                            data-target="#change-phone">
                            Change
                        </button>
                    </div>
                </>
            </React.Fragment>
        );
    };

    public modalPasswordHeader = () => {
        return (
            <React.Fragment>
                <h6 className="text-xl font-bold white-text mb-0">Change Password</h6>
                <ModalCloseIcon
                    className="cursor-pointer ml-4"
                    onClick={() => this.setState({ showPasswordModal: false })}
                />
            </React.Fragment>
        );
    };

    // handle focus password focus
    public handleFocusNewPassword = () => {
        this.setState({ passwordPopUp: !this.state.passwordPopUp });
        this.setState({ passwordNewFocus: !this.state.passwordNewFocus });
    };

    // handle focus confirm password focus
    public handleFocusConfirmPassword = () => {
        this.setState({ passwordConfirmFocus: !this.state.passwordConfirmFocus });
    };

    // handle change new password
    public handleChangeNewPassword = (value: string) => {
        if (passwordErrorFirstSolution(value) && !this.state.passwordErrorFirstSolved) {
            this.setState({ passwordErrorFirstSolved: true });
        } else if (!passwordErrorFirstSolution(value) && this.state.passwordErrorFirstSolved) {
            this.setState({ passwordErrorFirstSolved: false });
        }

        if (passwordErrorSecondSolution(value) && !this.state.passwordErrorSecondSolved) {
            this.setState({ passwordErrorSecondSolved: true });
        } else if (!passwordErrorSecondSolution(value) && this.state.passwordErrorSecondSolved) {
            this.setState({ passwordErrorSecondSolved: false });
        }

        if (passwordErrorThirdSolution(value) && !this.state.passwordErrorThirdSolved) {
            this.setState({ passwordErrorThirdSolved: true });
        } else if (!passwordErrorThirdSolution(value) && this.state.passwordErrorThirdSolved) {
            this.setState({ passwordErrorThirdSolved: false });
        }

        this.setState({ passwordNew: value });
        setTimeout(() => {
            this.props.fetchCurrentPasswordEntropy({ password: value });
        }, 500);
    };

    // handle change password (POST)
    public handleSubmitChangePassword = () => {
        this.props.changePasswordFetch({
            old_password: this.state.passwordOld,
            new_password: this.state.passwordNew,
            confirm_password: this.state.passwordConfirm,
        });

        this.setState({ showPasswordModal: false });
    };
    //**END PASSWORD PUBLIC FUNCTION
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state) => ({
    user: selectUserInfo(state),
    currentPasswordEntropy: selectCurrentPasswordEntropy(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    changePasswordFetch: (credentials) => dispatch(changePasswordFetch(credentials)),
    fetchCurrentPasswordEntropy: (payload) => dispatch(entropyPasswordFetch(payload)),
    toggle2faFetch: (payload) => dispatch(toggle2faFetch(payload)),
});

export const Security = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(ProfileSecurityComponent) as React.ComponentClass;
