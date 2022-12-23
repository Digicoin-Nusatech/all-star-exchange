import { History } from 'history';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { IntlProps } from '../../../';
import { isUsernameEnabled } from '../../../api';
import { entropyPasswordFetch, RootState, selectCurrentPasswordEntropy, selectUserInfo, User } from '../../../modules';
import {
    changePasswordFetch,
    selectChangePasswordSuccess,
    toggle2faFetch,
    changePasswordReset,
} from '../../../modules/user/profile';
import Avatar from '../../../assets/png/avatar.png';
import { ArrowDownIcon } from '../../../assets/images/ArrowDownIcon';

interface ReduxProps {
    user: User;
    passwordChangeSuccess?: boolean;
    currentPasswordEntropy: number;
}

interface RouterProps {
    history: History;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface DispatchProps {
    changePassword: typeof changePasswordFetch;
    clearPasswordChangeError: () => void;
    toggle2fa: typeof toggle2faFetch;
    fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
    changePasswordReset: typeof changePasswordReset;
}

interface ProfileProps {
    showModal: boolean;
}

interface State {
    showChangeModal: boolean;
    showModal: boolean;
    code2FA: string;
    code2FAFocus: boolean;
}

type Props = ReduxProps & DispatchProps & RouterProps & ProfileProps & IntlProps & OnChangeEvent;

class ProfileAuthDetailsComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showChangeModal: false,
            showModal: false,
            code2FA: '',
            code2FAFocus: false,
        };
    }

    public componentWillReceiveProps(next: Props) {
        if (next.passwordChangeSuccess) {
            this.setState({ showChangeModal: false });
            this.props.changePasswordReset();
        }
    }

    public render() {
        const { user } = this.props;

        return (
            <React.Fragment>
                <div className="profile-detail-info py-2">
                    <div className="d-flex align-items-center">
                        <img src={Avatar} className="mr-4" alt="profile avatar detail" />
                        <div className="details">
                            <div className="d-flex align-items-center mb-1">
                                <h6 className="white-text font-bold text-ms mb-0 mr-3">
                                    {isUsernameEnabled() ? <h2>{user.username}</h2> : null}
                                </h6>
                                {user.labels[0].value == 'verified' ? (
                                    <div className="badge badge-success test-xs font-normal white-text">
                                        {user.labels[0].value}
                                    </div>
                                ) : (
                                    <div className="badge badge-warning test-xs font-normal white-text">
                                        {user.labels[0].value}
                                    </div>
                                )}
                            </div>
                            <div className="d-flex">
                                <div className="form-inline">
                                    <span className="text-xs font-normal ">User ID : </span>
                                    <p className="text-xs ml-2 text-dark font-bold mb-0"> {user.uid}</p>
                                </div>
                                <div className="ml-3 form-inline">
                                    <span className="text-xs font-normal ">Last Login : </span>
                                    <p className="text-xs ml-2 text-dark font-bold mb-0">{user.updated_at} </p>
                                </div>
                                <div className="ml-3 form-inline">
                                    <span className="text-xs font-normal ">Email : </span>
                                    <p className="text-xs ml-2 text-dark font-bold mb-0">{user.email}</p>
                                </div>
                            </div>
                            <div className="security-level mt-4">
                                <h6 className="font-bold">Security Level</h6>
                                <div className="mt-1 bar-container">
                                    <div
                                        className={`bar-level ${
                                            user.level == 1
                                                ? 'level-danger'
                                                : user.level == 2
                                                ? 'level-warning'
                                                : user.level == 3
                                                ? 'level-success'
                                                : 'default'
                                        }`}></div>
                                    <div
                                        className={`bar-level ${
                                            user.level == 1
                                                ? 'default'
                                                : user.level == 2
                                                ? 'level-warning'
                                                : user.level == 3
                                                ? 'level-success'
                                                : 'default'
                                        }`}></div>
                                    <div className={`bar-level ${user.level == 3 ? 'level-success' : 'default'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    passwordChangeSuccess: selectChangePasswordSuccess(state),
    currentPasswordEntropy: selectCurrentPasswordEntropy(state),
});

const mapDispatchToProps = (dispatch) => ({
    changePassword: ({ old_password, new_password, confirm_password }) =>
        dispatch(changePasswordFetch({ old_password, new_password, confirm_password })),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    fetchCurrentPasswordEntropy: (payload) => dispatch(entropyPasswordFetch(payload)),
    changePasswordReset: () => dispatch(changePasswordReset()),
});

const ProfileAuthDetailsConnected = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(ProfileAuthDetailsComponent)
);
// tslint:disable-next-line:no-any
const ProfileAuthDetails = withRouter(ProfileAuthDetailsConnected as any);

export { ProfileAuthDetails };
