import React, { FC, ReactElement, useState, useEffect } from 'react';
import { ProfileAuthDetails } from '../../containers';
import { useDocumentTitle } from 'src/hooks';
import { Link, useHistory } from 'react-router-dom';
import { Notification } from '../../../assets/images/Notification';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import {
    ApiProfileIcon,
    EmailProfileIcon,
    GoogleProfileIcon,
    KycProfileIcon,
    PhoneProfileIcon,
    SecurityProfileIcon,
    CheckIcon,
    SearchIcon,
    DocsIcon,
    SearchCoinIcon,
    SearchDepositIcon,
    SearchOrderIcon,
    SearchTradeIcon,
    SearchWithdrawIcon,
} from '../../../assets/images/ProfileIcon';
import { BtcIcon } from '../../../assets/images/CoinIcon';
import { ProfileDeviceTable } from '../../containers';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUserInfo,
    toggle2faFetch,
    toggle2faData,
    selectTwoFactorAuthSuccess,
    sendPhoneCode,
    selectVerifyPhoneSuccess,
    sendCode,
    changeUserLevel,
    verifyPhone,
} from '../../../modules';
import Tab from '../../containers/TabPane/Tab';
import { TabPane } from '../../containers/TabPane/Tab';
import { Modal, CustomInput } from '../../components';
import { ModalCloseIcon } from '../../../assets/images/CloseIcon';
import closeIcon from '../../../assets/img/icon/times.png';

import { useMasking } from 'src/hooks/useMasking';

import emailIcon from '../../../assets/img/icon/email.png';
import googleIcon from '../../../assets/img/icon/google.png';
import phoneIcon from '../../../assets/img/icon/phone.png';
import lockIcon from '../../../assets/img/icon/lock.png';
import apiIcon from '../../../assets/img/icon/api.png';
import verifyIcon from '../../../assets/img/icon/verify.png';

export const ProfileScreen: FC = (): ReactElement => {
    useDocumentTitle('Profile');
    const user = useSelector(selectUserInfo);

    const verifyPhoneSuccess = useSelector(selectVerifyPhoneSuccess);
    const history = useHistory();
    const dispatch = useDispatch();

    const [showModal2Fa, setShowModal2FA] = useState(false);
    const [showModal2FaGoogle, setShowModal2FAGoogle] = useState(false);
    const [showModalChangePhone, setShowModalChangePhone] = useState(false);
    const [twoFaPhoneValue, settwoFaPhoneValue] = useState('');
    const [twoFaGoogleValue, settwoFaGoogleValue] = useState('');
    const [newPhoneValue, setNewPhoneValue] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const phone = user.phones && user.phones.reverse();

    const handleFetchTwoFaPhone = async () => {
        user.otp ? setShowModalChangePhone(!showModalChangePhone) : history.push('/two-fa-activation');
    };

    const handleSendCodePhone = () => {
        dispatch(sendCode({ phone_number: newPhoneValue }));
    };

    const handleChangePhone = () => {
        dispatch(verifyPhone({ phone_number: newPhoneValue, verification_code: verificationCode }));
    };

    const handleFetchTwoFaGoogle = () => {
        user.otp ? setShowModal2FAGoogle(!showModal2FaGoogle) : history.push('/two-fa-activation');
    };

    const handleDisableTwoFactor = async () => {
        await dispatch(toggle2faFetch({ code: twoFaGoogleValue, enable: false }));
        setShowModal2FAGoogle(!showModal2FaGoogle);
    };

    // Render phone modal
    const modalPhoneContent = () => {
        return (
            <React.Fragment>
                <p className="text-sm grey-text">Set Your {!user.phones[0] ? '' : 'New'} Phone Number And Verifed</p>
                <div className="form">
                    <div className="form-group">
                        <CustomInput
                            // defaultLabel={`${!user.phones[0] ? '' : 'New'} Phone Number`}
                            defaultLabel=""
                            inputValue={newPhoneValue}
                            label={`${!user.phones[0] ? '' : 'New'} Phone Number`}
                            placeholder="+6281902912921"
                            type="text"
                            labelVisible
                            classNameLabel="font-bold text-sm"
                            handleChangeInput={(e) => setNewPhoneValue(e)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="text-sm font-bold">Verification Code</label>
                        <div className="d-flex align-items-center">
                            <CustomInput
                                defaultLabel=""
                                inputValue={verificationCode}
                                label=""
                                placeholder=""
                                type="number"
                                labelVisible={false}
                                classNameLabel="d-none"
                                classNameInput="spacing-10"
                                classNameGroup="mb-0 w-100"
                                handleChangeInput={(e) => setVerificationCode(e)}
                            />
                            <button
                                disabled={newPhoneValue === '' ? true : false}
                                onClick={handleSendCodePhone}
                                className="btn btn-primary ml-2 text-nowrap">
                                Send Code
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        onClick={handleChangePhone}
                        className="btn btn-primary btn-full"
                        data-toggle="modal"
                        data-target="#change-phone"
                        data-dismiss="modal">
                        {!user.phones[0] ? 'Add' : 'Change'}
                    </button>
                </div>
            </React.Fragment>
        );
    };

    const modalPhoneHeader = () => {
        return (
            <React.Fragment>
                <h6 className="text-xl font-bold white-text mb-0">{!user.phones[0] ? 'Add' : 'Change'} Phone Number</h6>
                <div className="cursor-pointer ml-4" onClick={() => setShowModalChangePhone(false)}>
                    <img src={closeIcon} alt="" />
                </div>
                {/* <ModalCloseIcon className="cursor-pointer ml-4" onClick={() => setShowModalChangePhone(false)} /> */}
            </React.Fragment>
        );
    };

    // modal google two fa
    const modalTwoFaGoogleContent = () => {
        return (
            <React.Fragment>
                <p className="text-sm grey-text mb-24">
                    To ensure security, withdrawals, P2P transactions, and red envelopes will be temporarily unavailable
                    for 24 hours after changing the security settings.
                </p>
                <div className="form">
                    <div className="form-group mb-24">
                        <CustomInput
                            defaultLabel="two-fa"
                            inputValue={twoFaGoogleValue}
                            label="2FA Code"
                            placeholder="2FA Code"
                            type="text"
                            labelVisible
                            classNameInput="spacing-10"
                            classNameLabel="white-text text-sm"
                            handleChangeInput={(e) => settwoFaGoogleValue(e)}
                        />
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary btn-full"
                        data-dismiss="modal"
                        onClick={handleDisableTwoFactor}>
                        Disable
                    </button>
                </div>
            </React.Fragment>
        );
    };

    const modalTwoFaGoogleHeader = () => {
        return (
            <React.Fragment>
                <h6 className="text-xl font-bold white-text mb-0">2FA Verification</h6>
                <div className="cursor-pointer ml-4" onClick={() => setShowModal2FAGoogle(false)}>
                    <img src={closeIcon} alt="" />
                </div>
                {/* <ModalCloseIcon className="cursor-pointer" onClick={() => setShowModal2FAGoogle(false)} /> */}
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <section className="profile-page">
                <div className="pt-5">
                    <Tab>
                        <TabPane title="User Profile">
                            <div className="container py-4 profile-screen-info">
                                <div className="card p-3 border-0 shadow-sm rounded-lg">
                                    <h3 className="font-bold">Profile Identity</h3>
                                    <ProfileAuthDetails />
                                </div>
                                <div className="card mt-5 p-3 border-0 shadow-sm rounded-lg">
                                    <h3 className="font-bold">Profile Security</h3>
                                    <div className="row">
                                        <div className="col-lg-6 mt-4">
                                            <div className="row">
                                                <div className="col-7">
                                                    <div className="d-flex align-items-center">
                                                        <img src={emailIcon} alt="" />
                                                        <div className="ml-3">
                                                            <div className="text-dark">Email</div>
                                                            <small>{user.email}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-5 text-right">
                                                    <button className="btn btn-dark btn-md">Can't be Changed</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mt-4">
                                            <div className="row">
                                                <div className="col-7">
                                                    <div className="d-flex align-items-center">
                                                        <img src={googleIcon} alt="" />
                                                        <div className="ml-3">
                                                            <div className="text-dark">Google 2FA Authentication</div>
                                                            <small
                                                                id="two-fa-text"
                                                                className={`d-block font-normal ${
                                                                    user.otp ? 'text-success' : 'text-danger'
                                                                }`}>
                                                                {user.otp ? 'Enabled' : 'Disabled'}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-5 text-right" onClick={handleFetchTwoFaGoogle}>
                                                    <button className="btn btn-primary btn-md">Disable</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mt-4">
                                            <div className="row">
                                                <div className="col-7">
                                                    <div className="d-flex align-items-center">
                                                        <img src={phoneIcon} alt="" />
                                                        <div className="ml-3">
                                                            <div className="text-dark">Phone Number</div>
                                                            <small
                                                                id="two-fa-text"
                                                                className={`d-block font-normal ${
                                                                    !user.phones[0] ? 'text-danger' : 'text-success'
                                                                }`}>
                                                                {!user.phones[0] ? 'Unverified' : 'Verified'}
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-5 text-right" onClick={handleFetchTwoFaPhone}>
                                                    <button className="btn btn-primary btn-md">Set Number</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mt-4">
                                            <div className="row">
                                                <div className="col-7">
                                                    <div className="d-flex align-items-center">
                                                        <img src={lockIcon} alt="" />
                                                        <div className="ml-3">
                                                            <div className="text-dark">Security</div>
                                                            <small
                                                                id="two-fa-text"
                                                                className={`d-block font-normal text-success`}>
                                                                Enabled
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-5 text-right">
                                                    <Link to={'/profile/security'}>
                                                        <button className="btn btn-primary btn-md">Change</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mt-4">
                                            <div className="row">
                                                <div className="col-7">
                                                    <div className="d-flex align-items-center">
                                                        <img src={apiIcon} alt="" />
                                                        <div className="ml-3">
                                                            <div className="text-dark">Api Keys</div>
                                                            <small
                                                                id="two-fa-text"
                                                                className={`d-block font-normal text-gray`}>
                                                                0 Api Created
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-5 text-right">
                                                    <button className="btn btn-primary btn-md">Create API</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 mt-4">
                                            <div className="row">
                                                <div className="col-7">
                                                    <div className="d-flex align-items-center">
                                                        <img src={verifyIcon} alt="" />
                                                        <div className="ml-3">
                                                            <div className="text-dark">KYC Verification</div>
                                                            <small
                                                                id="two-fa-text"
                                                                className={`d-block font-normal text-danger`}>
                                                                Disabeld
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-5 text-right">
                                                    <Link to={'/profile/kyc'}>
                                                        <button className="btn btn-dark btn-md">
                                                            Can't be Changed
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <ProfileDeviceTable />
                            </div>
                        </TabPane>
                        <TabPane title="Security Setting">
                            <div className="container py-4 wallet-screen">
                                <div className="d-flex justify-content-between align-items-center mb-24">
                                    <h2 className="text-lg white-text">Security Setting</h2>
                                </div>
                                <h4>Soon</h4>
                            </div>
                        </TabPane>
                        <TabPane title="Profile Verification">
                            <div className="container py-4 wallet-screen content-wrapper dark-bg-main">
                                <div className="d-flex justify-content-between align-items-center mb-24">
                                    <h2 className="text-lg white-text">Profile Verification</h2>
                                </div>
                                <h4>Soon</h4>
                            </div>
                        </TabPane>
                        <TabPane title="API Management">
                            <div className="container py-4 wallet-screen content-wrapper dark-bg-main">
                                <div className="d-flex justify-content-between align-items-center mb-24">
                                    <h2 className="text-lg white-text">API Management</h2>
                                </div>
                                <h4>Soon</h4>
                            </div>
                        </TabPane>
                        <TabPane title="Referral Code">
                            <div className="container py-4 wallet-screen content-wrapper dark-bg-main">
                                <div className="d-flex justify-content-between align-items-center mb-24">
                                    <h2 className="text-lg white-text">Referral Code</h2>
                                </div>
                                <h4>Soon</h4>
                            </div>
                        </TabPane>
                    </Tab>
                </div>
            </section>

            {/* <div className="profile-screen">
                <div className="content-wrapper container pb-5">
                    <div className="profile-menu px-24">
                        <div className="row">
                            <div className="col-6 col-lg-8">
                                <div className="notification-warning alert show text-ms white-text font-normal position-relative mb-24">
                                    <Notification className="mr-2" />
                                    Complete your identity verify to start trading with heaven exchange
                                    <div className="close-icon">
                                        <CloseIcon fill="#F2F0FF" className="ml-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="menu-item py-24 mb-4">
                            <Link to={'/change-email'}>
                                <div className="d-flex align-items-center position-relative">
                                    <div className="icon-bg"></div>
                                    <div className="ml-3 mr-3">
                                        <p className="mb-1 text-ms font-normal white-text">Email</p>
                                        <span className="d-block text-xs grey-text-accent font-normal ">
                                            {user.email}
                                        </span>
                                        <span className="text-xs grey-text font-normal">Change</span>
                                    </div>
                                    <div className="check">
                                        <CheckIcon />
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="menu-item py-24 mb-4">
                            <Link to={'/change-email'}>
                                <div className="d-flex align-items-center position-relative">
                                    <div className="icon-bg"></div>
                                    <div className="ml-3 mr-3">
                                        <p className="mb-1 text-ms font-normal white-text">Email</p>
                                        <span className="d-block text-xs grey-text-accent font-normal ">
                                            {user.email}
                                        </span>
                                        <span className="text-xs grey-text font-normal">Change</span>
                                    </div>
                                    <div className="check">
                                        <CheckIcon />
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="menu-item py-24 mb-4">
                            <Link to={'/profile/kyc'}>
                                <div className="d-flex align-items-center position-relative">
                                    <div className="icon-bg">
                                        <KycProfileIcon />
                                    </div>
                                    <div className="ml-3 mr-3">
                                        <p className="mb-1 text-ms font-normal white-text">KYC Verification</p>
                                        <span className="d-block text-xs danger-text font-normal ">Disabled</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="menu-item py-24 mb-4">
                            <button className="btn-transparent" onClick={handleFetchTwoFaPhone}>
                                <div className="d-flex align-items-center position-relative">
                                    <div className="icon-bg">
                                        <PhoneProfileIcon />
                                    </div>
                                    <div className="ml-3 mr-3">
                                        <p className="mb-1 text-ms font-normal white-text text-left">Phone</p>
                                        <span className="d-block text-xs grey-text-accent font-normal ">
                                            {phone[0] && phone[0].number && `+ ${phone[0].number}`}
                                        </span>
                                        <span
                                            className={`d-block text-left text-xs  font-normal ${
                                                !user.phones[0] ? 'danger-text' : 'contrast-text'
                                            }`}>
                                            {!user.phones[0] ? 'Unverified' : 'Verified'}
                                        </span>
                                    </div>
                                    {user.phones && user.phones[0] && (
                                        <div className="check">
                                            <CheckIcon />
                                        </div>
                                    )}
                                </div>
                            </button>
                        </div>
                        <div className="menu-item py-24 mb-4">
                            <Link 
                            >
                                <div className="d-flex align-items-center position-relative">
                                    <div className="icon-bg">
                                        <SecurityProfileIcon />
                                    </div>
                                    <div className="ml-3 mr-3">
                                        <p className="mb-1 text-ms font-normal white-text">Security</p>
                                        <span className="d-block text-left text-xs contrast-text font-normal ">
                                            Disabled
                                        </span>
                                    </div>
                                    <div className="check">
                                        <CheckIcon />
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className="menu-item py-24 mb-4">
                            <button className="btn-transparent" onClick={handleFetchTwoFaGoogle}>
                                <div className="d-flex align-items-center position-relative">
                                    <div className="icon-bg">
                                        <GoogleProfileIcon />
                                    </div>
                                    <div className="ml-3 mr-3">
                                        <p className="mb-1 text-ms font-normal white-text">Google Auth</p>
                                        <span
                                            id="two-fa-text"
                                            className={`d-block text-left text-xs font-normal ${
                                                user.otp ? 'contrast-text' : 'danger-text'
                                            }`}>
                                            {user.otp ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </div>
                                    {user.otp && (
                                        <div className="check">
                                            <CheckIcon />
                                        </div>
                                    )}
                                </div>
                            </button>
                        </div>
                        <div className="menu-item py-24 mb-4">
                            <Link to={'/profile/api-key'}>
                                <div className="d-flex align-items-center position-relative">
                                    <div className="icon-bg">
                                        <ApiProfileIcon />
                                    </div>
                                    <div className="ml-3 mr-3">
                                        <p className="mb-1 text-ms font-normal white-text">API</p>
                                        <span className="d-block text-xs grey-text font-normal ">0 API enabled</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <ProfileDeviceTable />
                </div>
            </div> */}

            {/* modal */}
            <Modal content={modalTwoFaGoogleContent()} header={modalTwoFaGoogleHeader()} show={showModal2FaGoogle} />
            <Modal content={modalPhoneContent()} header={modalPhoneHeader()} show={showModalChangePhone} />
        </React.Fragment>
    );
};
