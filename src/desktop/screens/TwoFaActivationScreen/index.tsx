import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '../../../assets/images/ArrowLeftIcon';
import { CopyButton } from '../../../assets/images/CopyButton';
import { QRCode } from '../../../components';
import { copy } from '../../../helpers';
import { CustomInput } from '../../components';
import { CopyableTextField } from '../../../components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import {
    alertPush,
    selectTwoFactorAuthBarcode,
    selectTwoFactorAuthQR,
    selectTwoFactorAuthSuccess,
    toggle2faFetch,
    generate2faQRFetch,
} from '../../../modules';

export const TwoFaActivationScreen: React.FC = () => {
    const [twoFaValue, setTwoFaValue] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();

    // const twoFactorBarcode = useSelector(selectTwoFactorAuthBarcode);
    const twoFactorAuthQr = useSelector(selectTwoFactorAuthQR);
    const twoFactorEnabledSucces = useSelector(selectTwoFactorAuthSuccess);

    const secretRegex = /secret=(\w+)/;
    const secretMatch = twoFactorAuthQr.match(secretRegex);
    const secret = secretMatch ? secretMatch[1] : null;

    useEffect(() => {
        dispatch(generate2faQRFetch());
    }, []);

    useEffect(() => {
        if (twoFactorEnabledSucces) {
            history.push('/profile');
        }
    }, [twoFactorEnabledSucces]);

    const handleTwoFactorAuth = (e) => {
        e.preventDefault();
        dispatch(toggle2faFetch({ code: twoFaValue, enable: true }));
    };

    const doCopy = () => {
        copy('referral-id');
        dispatch(alertPush({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success' }));
    };

    return (
        <React.Fragment>
            <section className="py-5 two-fa-section">
                <div className="container">
                    <div className="d-flex align-items-center mb-4">
                        <a href="#" className="text-dark fw-bold d-flex align-items-center">
                            Back to Home
                        </a>
                        <span className="mx-2 fs-lg">|</span>Activate 2FA
                    </div>
                    <h4 className="fw-bold mb-4">Security Google 2FA Verification</h4>
                    <ol className="pl-3">
                        <li>
                            Download and install Google Authenticator application from{' '}
                            <span className="text-primary fw-bold">AppStore</span> or{' '}
                            <span className="text-primary fw-bold">Google play</span>
                        </li>
                        <li>
                            Scan QR code or use secret MFA code:* Save this secret in a secure location. This code can
                            be used to gain 2FA access from a different device.
                        </li>
                    </ol>
                    <div className="row ">
                        <div className="col-lg-7">
                            <form>
                                <div className="text-dark fw-bold">
                                    Scan The QR Code to get 2FA or Copy Keys below :
                                </div>
                                <div className="row align-items-center no-gutters mt-4">
                                    {/* <div className="col">
                                        <label className="text-dark fw-bold mb-0">MVA CODE</label>
                                    </div>
                                    <div className="col-10">
                                        <div className="card b-form px-3 py-2 rounded-lg">
                                            <div onClick={doCopy}>
                                                {secret && (
                                                    <CopyableTextField
                                                        className="copy-mva"
                                                        fieldId="referal-id"
                                                        value={secret}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div> */}

                                    <div className="col-3">
                                        <label className="text-dark fw-bold mb-0">MVA CODE</label>
                                    </div>
                                    <div className="col-9">
                                        {secret && (
                                            <div onClick={doCopy}>
                                                <CopyableTextField
                                                    className="copy-mva"
                                                    fieldId="referal-id"
                                                    value={secret}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* <div className="input-2fa">
                                    <div className="col-3 bg-warning">
                                        <label className="text-dark fw-bold mb-0">2FA Code</label>
                                    </div>
                                    <div className="col-9">
                                        <form onSubmit={handleTwoFactorAuth}>
                                            <CustomInput
                                                placeholder="2FA Code"
                                                defaultLabel=""
                                                type="text"
                                                label=""
                                                classNameInput="custom-input-code"
                                                inputValue={twoFaValue}
                                                handleChangeInput={(e) => setTwoFaValue(e)}
                                            />
                                            <button type="submit" className="btn btn-primary w-100 mt-4">
                                                Enable 2FA
                                            </button>
                                        </form>
                                    </div>
                                </div> */}

                                <div className="row align-items-start no-gutters mt-4">
                                    <div className="col-3">
                                        <label className="text-dark fw-bold mt-1">2FA CODE</label>
                                    </div>
                                    <div className="col-9 form-code">
                                        <CustomInput
                                            placeholder="2FA Code"
                                            defaultLabel=""
                                            type="text"
                                            label=""
                                            classNameInput="custom-input-code"
                                            inputValue={twoFaValue}
                                            handleChangeInput={(e) => setTwoFaValue(e)}
                                        />
                                        <button
                                            onClick={handleTwoFactorAuth}
                                            type="submit"
                                            className="btn btn-primary w-100">
                                            Enable 2FA
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg-4">
                            <div className="qr-code p-2">
                                <QRCode data={twoFactorAuthQr} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};
