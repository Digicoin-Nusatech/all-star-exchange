import React, { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { CodeVerification } from '../../components';
import { signInRequire2FA } from '../../../modules';

import patternDots from '../../../assets/img/pattern-dots.png';
import heroSignin from '../../../assets/img/hero-sign-in.png';

export interface TwoFactorAuthProps {
    isMobile?: boolean;
    isLoading?: boolean;
    onSubmit: () => void;
    title: string;
    buttonLabel: string;
    message: string;
    otpCode: string;
    handleOtpCodeChange: (otp: string) => void;
    handleClose2fa: () => void;
}

export const TwoFactorAuthComponent: React.FC<TwoFactorAuthProps> = ({
    isMobile,
    isLoading,
    otpCode,
    buttonLabel,
    onSubmit,
    handleOtpCodeChange,
}) => {
    const dispatch = useDispatch();

    const handleEnterPress = React.useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' && otpCode.length >= 6) {
                event.preventDefault();
                onSubmit();
            }
        },
        [onSubmit, otpCode]
    );

    const handleRemoveRequire2Fa = useCallback(() => {
        dispatch(signInRequire2FA({ require2fa: false }));
    }, [dispatch]);

    return (
        <React.Fragment>
            <section className="py-5 mt-5 two-fa-section">
                <img src={patternDots} alt="#" className="left" />
                <img src={patternDots} alt="#" className="right" />
                <div className="container">
                    <div className="card bg-light p-5 shadow-sm border-0">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="p-5">
                                    <img src={heroSignin} alt="hero-images" className="w-100" />
                                </div>
                            </div>

                            <div className="col-lg-6">
                                <div className="card p-3 border-0">
                                    <div className="mb-1">
                                        <h2>2FA Verification</h2>
                                        <p>Please enter 6 Digits authentication code from your App</p>
                                    </div>
                                    <form>
                                        <CodeVerification
                                            code={otpCode}
                                            onChange={handleOtpCodeChange}
                                            onSubmit={handleEnterPress}
                                            codeLength={6}
                                            type="number"
                                            placeholder="Number Verification"
                                            className="form-control"
                                            inputMode="decimal"
                                            showPaste2FA={true}
                                            isMobile={isMobile}
                                        />
                                        <div className="d-grid gap-2">
                                            <Button
                                                className="btn-full mt-3"
                                                disabled={isLoading || otpCode.length < 6}
                                                onClick={onSubmit}
                                                size="lg"
                                                variant="primary">
                                                {isLoading ? 'Loading...' : buttonLabel ? buttonLabel : 'Sign in'}
                                            </Button>
                                        </div>
                                    </form>
                                    {/* <div className="mt-4">{renderRegister}</div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <form>
                <h1>Testing</h1>
                <CodeVerification
                    code={otpCode}
                    onChange={handleOtpCodeChange}
                    onSubmit={handleEnterPress}
                    codeLength={6}
                    type="text"
                    placeholder="X"
                    inputMode="decimal"
                    showPaste2FA={false}
                    isMobile={isMobile}
                />
                <Link to={`/lost-two-fa`}>
                    <div className="w-100 mb-24 text-right text-xs grey-text">Lost Your 2FA?</div>
                </Link>

                <Button disabled={isLoading || otpCode.length < 6} onClick={onSubmit} size="lg" variant="primary" block>
                    {isLoading ? 'Loading...' : buttonLabel ? buttonLabel : 'Sign in'}
                </Button>
            </form>
            <div className="mt-3">
                <button
                    type="button"
                    onClick={handleRemoveRequire2Fa}
                    className="cursor-pointer btn btn-primary btn-outline btn-block">
                    <span className="gradient-text">+ Sign In With Another Account</span>
                </button>
            </div> */}
        </React.Fragment>
    );
};

export const TwoFactorAuth = React.memo(TwoFactorAuthComponent);
