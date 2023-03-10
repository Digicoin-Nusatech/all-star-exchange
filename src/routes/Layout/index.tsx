import classnames from 'classnames';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Route, RouterProps, Switch } from 'react-router';
import { Redirect, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { minutesUntilAutoLogout, sessionCheckInterval, showLanding, wizardStep } from '../../api';
import { ExpiredSessionModal } from '../../components';
import { WalletsFetch } from '../../containers';
import { applyCustomizationSettings, toggleColorTheme } from '../../helpers';
import {
    logoutFetch,
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectMobileDeviceState,
    selectPlatformAccessStatus,
    selectUserFetching,
    selectUserInfo,
    selectUserLoggedIn,
    toggleChartRebuild,
    User,
    userFetch,
    walletsReset,
    AbilitiesInterface,
    selectAbilities,
} from '../../modules';

import { SignInMobileScreen, SignUpMobileScreen } from '../../mobile/screens';

import {
    LandingScreen,
    SignInScreen,
    SignUpScreen,
    WalletsScreen,
    WalletDeposit,
    WalletWitdrawal,
    EmailVerificationScreen,
    ForgotPasswordScreen,
    PasswordResetScreen,
    ProfileScreen,
    ReferralScreen,
    ApiKeyScreen,
    ProfileTwoFactorAuthScreen,
    Lost2FAScreen,
    TwoFaActivationScreen,
    KycScreen,
    MarketListScreen,
    HistoryTransactionScreen,
    Security,
    MarketDetailScreen,
    MarketOpen,
    TradingFutureScreen,
    TradingScreen,
    HistoryTrade,
    AnnouncementScreen,
    FAQScreen,
    ChangeEmail,
    ProfileSetting,
} from '../../desktop/screens';

interface ReduxProps {
    colorTheme: string;
    currentMarket?: Market;
    user: User;
    isLoggedIn: boolean;
    isMobileDevice: boolean;
    userLoading?: boolean;
    platformAccessStatus: string;
    abilities: AbilitiesInterface;
}

interface DispatchProps {
    logout: typeof logoutFetch;
    userFetch: typeof userFetch;
    walletsReset: typeof walletsReset;
}

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}

interface LayoutState {
    isShownExpSessionModal: boolean;
}

interface OwnProps {
    toggleChartRebuild: typeof toggleChartRebuild;
}

export type LayoutProps = ReduxProps & DispatchProps & LocationProps & IntlProps & OwnProps;

const renderLoader = () => (
    <div className="pg-loader-container">
        <Spinner animation="border" variant="primary" />
    </div>
);

const STORE_KEY = 'lastAction';

//tslint:disable-next-line no-any
const PrivateRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }
    const renderCustomerComponent = (props) => <CustomComponent {...props} />;

    if (isLogged) {
        return <Route {...rest} render={renderCustomerComponent} />;
    }

    return (
        <Route {...rest}>
            <Redirect to={'/signin'} />
        </Route>
    );
};

//tslint:disable-next-line no-any
const PublicRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }

    if (isLogged) {
        return (
            <Route {...rest}>
                <Redirect to={'/wallets'} />
            </Route>
        );
    }

    const renderCustomerComponent = (props) => <CustomComponent {...props} />;

    return <Route {...rest} render={renderCustomerComponent} />;
};

class LayoutComponent extends React.Component<LayoutProps, LayoutState> {
    public static eventsListen = ['click', 'keydown', 'scroll', 'resize', 'mousemove', 'TabSelect', 'TabHide'];

    public timer;
    public walletsFetchInterval;

    constructor(props: LayoutProps) {
        super(props);
        this.initListener();

        this.state = {
            isShownExpSessionModal: false,
        };
    }

    public componentDidMount() {
        if (
            !(
                this.props.location.pathname.includes('/magic-link') ||
                this.props.location.pathname.includes('/maintenance') ||
                this.props.location.pathname.includes('/restriction')
            )
        ) {
            switch (this.props.platformAccessStatus) {
                case 'restricted':
                    this.props.history.replace('/restriction');
                    break;
                case 'maintenance':
                    this.props.history.replace('/maintenance');
                    break;
                default:
                    const token = localStorage.getItem('csrfToken');

                    if (token) {
                        this.props.userFetch();
                        this.initInterval();
                        this.check();
                    }
            }
        }

        applyCustomizationSettings(null, this.props.toggleChartRebuild);
    }

    public componentWillReceiveProps(nextProps: LayoutProps) {
        if (
            !(
                nextProps.location.pathname.includes('/magic-link') ||
                nextProps.location.pathname.includes('/restriction') ||
                nextProps.location.pathname.includes('/maintenance')
            ) ||
            this.props.platformAccessStatus !== nextProps.platformAccessStatus
        ) {
            switch (nextProps.platformAccessStatus) {
                case 'restricted':
                    this.props.history.replace('/restriction');
                    break;
                case 'maintenance':
                    this.props.history.replace('/maintenance');
                    break;
                default:
                    break;
            }
        }

        if (!this.props.user.email && nextProps.user.email) {
            this.props.userFetch();
        }

        if (!this.props.isLoggedIn && nextProps.isLoggedIn && !this.props.user.email) {
            this.initInterval();
            this.check();
        }
    }

    public componentDidUpdate(prevProps: LayoutProps) {
        const { isLoggedIn, userLoading } = this.props;

        if (!isLoggedIn && prevProps.isLoggedIn && !userLoading) {
            this.props.walletsReset();

            if (!this.props.location.pathname.includes('/trading')) {
                this.props.history.push('/trading/');
            }
        }

        if (
            this.props.location.pathname === '/wallets/deposit' ||
            this.props.location.pathname === '/wallets/withdraw'
        ) {
            this.props.history.push('/wallets');
        }
    }

    public componentWillUnmount() {
        for (const type of LayoutComponent.eventsListen) {
            document.body.removeEventListener(type, this.reset);
        }
        clearInterval(this.timer);
        clearInterval(this.walletsFetchInterval);
    }

    public translate = (key: string) => this.props.intl.formatMessage({ id: key });

    public render() {
        const { colorTheme, isLoggedIn, isMobileDevice, userLoading, location, platformAccessStatus } = this.props;
        const { isShownExpSessionModal } = this.state;

        const desktopCls = classnames('container-fluid p-0 pg-layout', {
            'trading-layout': location.pathname.includes('/trading'),
        });
        const mobileCls = classnames(' pg-layout pg-layout--mobile', {
            'pg-layout--mobile-setup': location.pathname.includes('/setup'),
        });
        toggleColorTheme(colorTheme);

        if (!platformAccessStatus.length) {
            return renderLoader();
        }

        if (isMobileDevice) {
            return (
                <div className={mobileCls}>
                    <Switch>
                        <PublicRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/signin"
                            component={SignInMobileScreen}
                        />

                        <PublicRoute
                            loading={userLoading}
                            isLogged={isLoggedIn}
                            path="/signup"
                            component={SignUpMobileScreen}
                        />

                        <Route path="**">
                            <Redirect to="/trading/" />
                        </Route>
                    </Switch>
                    {isLoggedIn && <WalletsFetch />}
                    {isShownExpSessionModal && this.handleRenderExpiredSessionModal()}
                </div>
            );
        }

        return (
            <div className={desktopCls}>
                <Switch>
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signin" component={SignInScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signup" component={SignUpScreen} />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/wallets/:currency/deposit"
                        component={WalletDeposit}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/wallets/:currency/withdraw"
                        component={WalletWitdrawal}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/wallets"
                        component={WalletsScreen}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/email-verification"
                        component={EmailVerificationScreen}
                    />
                    <PublicRoute loading={userLoading} path="/trading" component={TradingScreen} />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/forgot_password"
                        component={ForgotPasswordScreen}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/accounts/password_reset"
                        component={PasswordResetScreen}
                    />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/lost-two-fa"
                        component={Lost2FAScreen}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/profile/referral"
                        component={ReferralScreen}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/profile/api-key"
                        component={ApiKeyScreen}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/two-fa-activation"
                        component={TwoFaActivationScreen}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/profile/kyc"
                        component={KycScreen}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/profile/security"
                        component={Security}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/profile/setting"
                        component={ProfileSetting}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/profile"
                        component={ProfileScreen}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/security/2fa"
                        component={ProfileTwoFactorAuthScreen}
                    />
                    <PublicRoute
                        loading={userLoading}
                        path="/markets/:currency/detail"
                        component={MarketDetailScreen}
                    />
                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/markets-open"
                        component={MarketOpen}
                    />
                    <PublicRoute loading={userLoading} path="/markets" component={MarketListScreen} />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/history-transaction"
                        component={HistoryTransactionScreen}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/trade-history"
                        component={HistoryTrade}
                    />

                    <PrivateRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/trading-future"
                        component={TradingFutureScreen}
                    />
                    <PublicRoute loading={userLoading} path="/announcement" component={AnnouncementScreen} />
                    <PublicRoute loading={userLoading} path="/faq" component={FAQScreen} />
                    <PublicRoute
                        loading={userLoading}
                        isLogged={isLoggedIn}
                        path="/change-email"
                        component={ChangeEmail}
                    />
                    <Route exact={true} path="/" component={LandingScreen} />
                    <Route path="**">
                        <Redirect to="/trading/" />
                    </Route>
                </Switch>
                {isLoggedIn && <WalletsFetch />}
                {isShownExpSessionModal && this.handleRenderExpiredSessionModal()}
            </div>
        );
    }

    private getLastAction = () => {
        if (localStorage.getItem(STORE_KEY) !== null) {
            return parseInt(localStorage.getItem(STORE_KEY) || '0', 10);
        }

        return 0;
    };

    private setLastAction = (lastAction: number) => {
        localStorage.setItem(STORE_KEY, lastAction.toString());
    };

    private initListener = () => {
        this.reset();
        for (const type of LayoutComponent.eventsListen) {
            document.body.addEventListener(type, this.reset);
        }
    };

    private reset = () => {
        this.setLastAction(Date.now());
    };

    private initInterval = () => {
        this.timer = setInterval(() => {
            this.check();
        }, parseFloat(sessionCheckInterval()));
    };

    private check = () => {
        const { user } = this.props;
        const now = Date.now();
        const timeleft = this.getLastAction() + parseFloat(minutesUntilAutoLogout()) * 60 * 1000;
        const diff = timeleft - now;
        const isTimeout = diff < 0;

        if (isTimeout && user.email) {
            if (user.state === 'active') {
                this.handleChangeExpSessionModalState();
            }

            this.props.logout();
            clearInterval(this.timer);
        }
    };

    private handleSubmitExpSessionModal = () => {
        const { history } = this.props;
        this.handleChangeExpSessionModalState();
        history.push('/signin');
    };

    private handleRenderExpiredSessionModal = () => (
        <ExpiredSessionModal
            title={this.translate('page.modal.expired.title')}
            buttonLabel={this.translate('page.modal.expired.submit')}
            handleChangeExpSessionModalState={this.handleChangeExpSessionModalState}
            handleSubmitExpSessionModal={this.handleSubmitExpSessionModal}
        />
    );

    private handleChangeExpSessionModalState = () => {
        this.setState({
            isShownExpSessionModal: !this.state.isShownExpSessionModal,
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = (state) => ({
    colorTheme: selectCurrentColorTheme(state),
    currentMarket: selectCurrentMarket(state),
    user: selectUserInfo(state),
    isLoggedIn: selectUserLoggedIn(state),
    isMobileDevice: selectMobileDeviceState(state),
    userLoading: selectUserFetching(state),
    platformAccessStatus: selectPlatformAccessStatus(state),
    abilities: selectAbilities(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (dispatch) => ({
    logout: () => dispatch(logoutFetch()),
    toggleChartRebuild: () => dispatch(toggleChartRebuild()),
    userFetch: () => dispatch(userFetch()),
    walletsReset: () => dispatch(walletsReset()),
});

export const Layout = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(LayoutComponent) as any;
