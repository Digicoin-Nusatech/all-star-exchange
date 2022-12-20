import cr from 'classnames';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { CustomInput } from '../../components';
import { captchaLogin } from '../../../api';
import { EMAIL_REGEX } from '../../../helpers';
import { GeetestCaptchaResponse } from '../../../modules';
import { selectMobileDeviceState } from '../../../modules/public/globalSettings';

import patternDots from '../../../assets/img/pattern-dots.png';
import heroSignin from '../../../assets/img/hero-sign-in.png';

export interface SignInProps {
    labelSignIn?: string;
    labelSignUp?: string;
    emailLabel?: string;
    passwordLabel?: string;
    receiveConfirmationLabel?: string;
    forgotPasswordLabel?: string;
    isLoading?: boolean;
    title?: string;
    onForgotPassword: (email?: string) => void;
    onConfirmationResend?: (email?: string) => void;
    onSignUp: () => void;
    onSignIn: () => void;
    className?: string;
    email: string;
    emailError: string;
    password: string;
    passwordError: string;
    emailFocused: boolean;
    emailPlaceholder: string;
    passwordFocused: boolean;
    passwordPlaceholder: string;
    phoneNumber: string;
    phoneNumberError: string;
    phoneNumberPlaceholder: string;
    phoneNumberFocused: boolean;
    phoneNumberLabel?: string;
    isFormValid: () => void;
    refreshError: () => void;
    handleChangeFocusField: (value: string) => void;
    changePassword: (value: string) => void;
    changeEmail: (value: string) => void;
    changePhoneNumber: (value: string) => void;
    captchaType?: 'recaptcha' | 'geetest' | 'none';
    renderCaptcha?: JSX.Element | null;
    reCaptchaSuccess?: boolean;
    geetestCaptchaSuccess?: boolean;
    captcha_response?: string | GeetestCaptchaResponse;
}

const SignIn: React.FC<SignInProps> = ({
    email,
    emailError,
    emailPlaceholder,
    password,
    passwordError,
    passwordPlaceholder,
    isLoading,
    onSignUp,
    labelSignIn,
    labelSignUp,
    emailLabel,
    passwordLabel,
    emailFocused,
    passwordFocused,
    onForgotPassword,
    forgotPasswordLabel,
    refreshError,
    onSignIn,
    isFormValid,
    handleChangeFocusField,
    changePassword,
    changeEmail,
    captchaType,
    geetestCaptchaSuccess,
    reCaptchaSuccess,
    renderCaptcha,
    phoneNumber,
    phoneNumberError,
    phoneNumberPlaceholder,
    phoneNumberLabel,
    changePhoneNumber,
}) => {
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const history = useHistory();
    const { formatMessage } = useIntl();
    const [selectTab, setSelectTab] = React.useState('email');
    const [showPassword, setShowPassword] = React.useState(false);

    const isValidForm = React.useCallback(() => {
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid && password;
    }, [email, password]);

    const handleChangeEmail = React.useCallback(
        (value: string) => {
            changeEmail(value);
        },
        [changeEmail]
    );

    const handleChangePassword = React.useCallback(
        (value: string) => {
            changePassword(value);
        },
        [changePassword]
    );

    const handleFieldFocus = React.useCallback(
        (field: string) => {
            handleChangeFocusField(field);
        },
        [handleChangeFocusField]
    );

    const isButtonDisabled = React.useMemo(
        () => !!(captchaLogin() && captchaType !== 'none' && !(reCaptchaSuccess || geetestCaptchaSuccess)),
        [reCaptchaSuccess, geetestCaptchaSuccess]
    );

    const handleSubmitForm = React.useCallback(() => {
        refreshError();
        onSignIn();
    }, [onSignIn, refreshError]);

    const handleValidateForm = React.useCallback(() => {
        isFormValid();
    }, [isFormValid]);

    const handleClick = React.useCallback(
        (e?: MouseEvent) => {
            if (e) {
                e.preventDefault();
            }
            if (!isValidForm()) {
                handleValidateForm();
            } else {
                handleSubmitForm();
            }
        },
        [handleSubmitForm, handleValidateForm, isValidForm]
    );

    const handleEnterPress = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();

                handleClick();
            }
        },
        [handleClick]
    );

    const renderForgotButton = React.useMemo(
        () => <div onClick={() => onForgotPassword(email)}>{forgotPasswordLabel || 'Forgot your password?'}</div>,
        [forgotPasswordLabel, onForgotPassword, email]
    );

    const renderRegister = React.useMemo(
        () => (
            <span>
                {formatMessage({ id: 'page.header.signIN.noAccountYet' })}
                <span className="text-primary fw-bold ml-2" onClick={() => history.push('/signup')}>
                    {formatMessage({ id: 'page.body.landing.header.button3' })}
                </span>
            </span>
        ),
        [formatMessage, history]
    );

    return (
        <section className="py-5 mt-5 login-content">
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
                                <div className="text-center">
                                    <h2 className="text-dark mb-4">Login</h2>
                                </div>
                                <form className="login-form">
                                    <div className="custom-input">
                                        <CustomInput
                                            classNameInput="form-control shadow-none"
                                            type="email"
                                            label={emailLabel || ''}
                                            placeholder={emailPlaceholder}
                                            defaultLabel="Email"
                                            handleChangeInput={handleChangeEmail}
                                            inputValue={email}
                                            handleFocusInput={() => handleFieldFocus('email')}
                                            classNameLabel="form-label"
                                            autoFocus={!isMobileDevice}
                                        />
                                        {emailError && <div className={'invalid-feedback'}>{emailError}</div>}
                                    </div>

                                    <div className="custom-input">
                                        <CustomInput
                                            type={showPassword ? 'text' : 'password'}
                                            label={passwordLabel || ''}
                                            placeholder={passwordPlaceholder}
                                            defaultLabel="Password"
                                            handleChangeInput={handleChangePassword}
                                            inputValue={password}
                                            handleFocusInput={() => handleFieldFocus('password')}
                                            classNameLabel="form-label"
                                            autoFocus={false}
                                        />
                                    </div>
                                    {passwordError && <div className={'invalid-feedback'}>{passwordError}</div>}
                                    <div className="mt-2 mb-2">{captchaLogin() && renderCaptcha}</div>

                                    <div className="form-group">
                                        <div className="text-right small">
                                            <a href="forget-password.html" className="text-primary">
                                                Forgot Password?
                                            </a>
                                        </div>
                                    </div>
                                    <div>
                                        <Button
                                            block={true}
                                            type="button"
                                            disabled={
                                                isLoading || !email.match(EMAIL_REGEX) || !password || isButtonDisabled
                                            }
                                            onClick={handleClick as any}
                                            size="lg"
                                            className="btn-login"
                                            variant="primary">
                                            {isLoading ? 'Loading...' : labelSignIn ? labelSignIn : 'Login'}
                                        </Button>
                                    </div>
                                </form>

                                <div className="mt-4">{renderRegister}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const SignInComponent = React.memo(SignIn);
