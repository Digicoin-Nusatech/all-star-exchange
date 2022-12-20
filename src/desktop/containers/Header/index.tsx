import * as React from 'react';
import { History } from 'history';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../';
import '../../../styles/colors.pcss';
import Select from 'react-select';
import {
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    setMobileWalletUi,
    toggleMarketSelector,
    selectUserLoggedIn,
    changeColorTheme,
    logoutFetch,
} from '../../../modules';
import { Logo } from '../../../assets/images/Logo';
import ProfileAvatar from '../../../assets/png/avatar.png';
import { IndonesianFlag, AmericanFlag, ChinaFlag, KoreaFlag } from '../../../assets/images/Flags';
import { Api, Dashboard, Logout, Referral, Security, Setting, Wallet } from '../../../assets/images/ProfileDropdown';
import { BnbIcon, BtcIcon, DogeIcon, TronIcon } from '../../../assets/images/CoinIcon';
interface ReduxProps {
    currentMarket: Market | undefined;
    colorTheme: string;
    isLoggedIn: boolean;
}

interface OwnProps {
    history: History;
}

interface DispatchProps {
    setMobileWalletUi: typeof setMobileWalletUi;
    logout: typeof logoutFetch;
}

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}

export interface HeaderState {
    showLanguage: boolean;
    showProfileDropdown: boolean;
}

const authHeader = [
    '/signin',
    '/signup',
    '/email-verification',
    '/forgot_password',
    '/password_reset',
    '/trading',
    '/security',
    '/two-fa-activation',
];
const tradingHeader = ['/trading'];

type Props = ReduxProps & DispatchProps & IntlProps & LocationProps & OwnProps;

class Head extends React.Component<Props, HeaderState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showLanguage: false,
            showProfileDropdown: false,
        };
    }

    public render() {
        const thisAuthHeader = authHeader.some((r) => location.pathname.includes(r)) && location.pathname !== '/';
        const thisTradingHeader = tradingHeader.some((r) => location.pathname.includes(r));

        const { showLanguage, showProfileDropdown } = this.state;
        const { isLoggedIn } = this.props;

        const logoutButton = async () => {
            await this.props.logout();
            this.props.history.push('/trading');
        };

        const SelectMarketTrade = {
            control: (provided, state) => ({
                ...provided,
                border: 'none',
                background: 'var(--main-background-color)',
                borderRadius: '4px',
                boxShadow: state.isFocused ? null : null,
                padding: '6px',
                marginBottom: '0',
                cursor: 'pointer',
                '&:hover': {
                    borderColor: 'rgba(35, 38, 47)',
                },
            }),
            placeholder: (provided) => ({
                ...provided,
                color: 'rgba(181, 179, 188)',
            }),
            option: (provided, state) => ({
                ...provided,
                margin: '0',
                background: state.isSelected ? 'rgb(14, 17, 20)' : 'rgb(11, 14, 17)',
                '&:hover': {
                    background: state.isFocused ? 'rgb(14, 17, 20)' : 'rgb(11, 14, 17)',
                },
            }),
            indicatorSeparator: () => {},
        };

        const ProfileDropdown = [
            {
                name: 'Dashboard',
                desc: 'Dashboard summary profile',
                icon: <Dashboard />,
                url: '/profile',
            },
            {
                name: 'Wallet',
                desc: 'deposit and withdraw wallet',
                icon: <Wallet />,
                url: '/wallets',
            },
            {
                name: 'Security',
                desc: 'secure your account',
                icon: <Security />,
                url: '/profile/security',
            },
            {
                name: 'Refferal',
                desc: 'invite friend to reach bonus',
                icon: <Referral />,
                url: '/profile/referral',
            },
            {
                name: 'API Management',
                desc: 'api Management for your account',
                icon: <Api />,
                url: '/profile/api-key',
            },
        ];

        const LanguageDropdown = [
            {
                flag: <IndonesianFlag className="mr-2" />,
                name: 'Indonesia',
            },
            {
                flag: <AmericanFlag className="mr-2" />,
                name: 'American',
            },
            {
                flag: <KoreaFlag className="mr-2" />,
                name: 'Korean',
            },
            {
                flag: <ChinaFlag className="mr-2" />,
                name: 'China',
            },
        ];

        const currencies = [
            { id: 'bnb', icon: <BnbIcon className="mr-12 small-coin-icon" />, name: 'BNB/IDR' },
            { id: 'btc', icon: <BtcIcon className="mr-12 small-coin-icon" />, name: 'BTC/IDR' },
            { id: 'doge', icon: <DogeIcon className="mr-12 small-coin-icon" />, name: 'DOGE/IDR' },
            { id: 'tron', icon: <TronIcon className="mr-12 small-coin-icon" />, name: 'TRON/IDR' },
        ];

        const optionAssets = currencies.map((item) => {
            const customLabel = (
                <div className="d-flex align-items-center">
                    {item.icon}
                    <div>
                        <p className="m-0 font-bold white-text text-ms">{item.name}</p>
                    </div>
                </div>
            );
            return {
                label: customLabel,
                value: item.id,
            };
        });

        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg bg-white py-2 px-24">
                    <Link to="/" className="navbar-brand">
                        <Logo />
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarNavDropdown"
                        aria-controls="navbarNavDropdown"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse justify-content-between" id="navbarNavDropdown">
                        <div>
                            {!thisAuthHeader ? (
                                <ul className="navbar-nav main-navbar">
                                    <li
                                        className={`nav-item ${
                                            (location.pathname == '/profile' || location.pathname == '/') && 'active'
                                        }`}>
                                        <Link
                                            to={isLoggedIn ? '/profile' : '/'}
                                            className="nav-link px-3 text-sm font-bold">
                                            Home
                                        </Link>
                                    </li>
                                    <li className={`nav-item ${location.pathname == '/markets' && 'active'}`}>
                                        <Link to={'/markets'} className="nav-link px-3 text-sm font-bold">
                                            Market
                                        </Link>
                                    </li>
                                    <li className={`nav-item ${location.pathname == '/faq' && 'active'}`}>
                                        <Link to={'/faq'} className="nav-link px-3 text-sm font-bold">
                                            Support
                                        </Link>
                                    </li>
                                    <li className={`nav-item ${location.pathname == '/announcement' && 'active'}`}>
                                        <Link to={'/announcement'} className="nav-link px-3 text-sm font-bold">
                                            Announcement
                                        </Link>
                                    </li>
                                </ul>
                            ) : thisTradingHeader ? (
                                <ul className="navbar-nav main-navbar align-items-center">
                                    <li className="nav-item dropdown market-dropdown ">
                                        <Select
                                            value={optionAssets.filter(function (option) {
                                                return option.value === 'bnb';
                                            })}
                                            styles={SelectMarketTrade}
                                            options={optionAssets}
                                        />
                                    </li>
                                    <li className="nav-item nav-large-display">
                                        <div className="nav-link px-12">
                                            <p className="mb-0 text-xs mb-1 font-bold grey-text-accent">24h Change</p>
                                            <p className=" font-bold mb-0 contrast-text text-sm">$252.245</p>
                                        </div>
                                    </li>
                                    <li className="nav-item nav-large-display">
                                        <div className="nav-link px-12">
                                            <p className="mb-0 text-xs mb-1 font-bold grey-text-accent">Price</p>
                                            <p className=" font-bold mb-0 white-text text-sm">11.5 + 4.29%</p>
                                        </div>
                                    </li>
                                    <li className="nav-item nav-large-display">
                                        <div className="nav-link px-12">
                                            <p className="mb-0 text-xs mb-1 font-bold grey-text-accent">24h high</p>
                                            <p className=" font-bold mb-0 white-text text-sm">2935.0</p>
                                        </div>
                                    </li>
                                    <li className="nav-item nav-large-display">
                                        <div className="nav-link px-12">
                                            <p className="mb-0 text-xs mb-1 font-bold grey-text-accent">24h Low</p>
                                            <p className=" font-bold mb-0 white-text text-sm">2873.45</p>
                                        </div>
                                    </li>
                                    <li className="nav-item nav-large-display">
                                        <div className="nav-link px-12">
                                            <p className="mb-0 text-xs mb-1 font-bold grey-text-accent">24h Volume</p>
                                            <p className=" font-bold mb-0 white-text text-sm">2873.45</p>
                                        </div>
                                    </li>
                                </ul>
                            ) : (
                                ''
                            )}
                        </div>

                        {/* right navbar */}
                        <ul className="navbar-nav align-items-center">
                            <li className="nav-item dropdown px-3">
                                <a
                                    className="nav-link dropdown-toggle grey-text-accent text-sm"
                                    href="#"
                                    id="navbarDropdownMenuLink"
                                    role="button"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    onClick={() => this.setState({ showLanguage: !showLanguage })}>
                                    EN/USD
                                </a>
                                {showLanguage ? (
                                    <div
                                        className="dropdown-menu p-3 radius-sm"
                                        aria-labelledby="navbarDropdownMenuLink">
                                        <div className="d-flex">
                                            <div className="language">
                                                <p className="text-xs font-bold mb-3 grey-text-accent">Language</p>
                                                {LanguageDropdown.map((item, key) => (
                                                    <div
                                                        key={`language-${key}`}
                                                        onClick={() => this.setState({ showLanguage: false })}
                                                        className="dropdown-item bg-white text-sm active cursor-pointer">
                                                        {item.flag} {item.name}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="line"></div>
                                            <div
                                                className="currency"
                                                onClick={() => this.setState({ showLanguage: false })}>
                                                <p className="text-xs font-bold mb-3 grey-text-accent">Currency</p>
                                                <div className="dropdown-item bg-white text-sm active cursor-pointer">
                                                    <div className="dots" />
                                                    USD
                                                </div>
                                                <div className="dropdown-item grey-text-accent text-sm cursor-pointer">
                                                    <div className="dots" />
                                                    IDR
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </li>

                            {isLoggedIn ? (
                                // Profile Dropdown
                                <li className="nav-item dropdown avatar px-3">
                                    <div
                                        className="nav-link cursor-pointer dropdown-toggle grey-text-accent text-sm"
                                        onClick={() => this.setState({ showProfileDropdown: !showProfileDropdown })}>
                                        <img src={ProfileAvatar} className="avatar-image" alt="" />
                                    </div>
                                    {showProfileDropdown ? (
                                        <div
                                            className="dropdown-menu dark-bg-accent p-3 radius-sm"
                                            aria-labelledby="navbarDropdownMenuLink">
                                            {ProfileDropdown.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="dropdown-wallets-item"
                                                    onClick={() => this.setState({ showProfileDropdown: false })}>
                                                    <Link to={item.url} className="d-flex">
                                                        {item.icon}
                                                        <div className="pl-3">
                                                            <p className="mb-0 text-sm font-bold white-text">
                                                                {item.name}
                                                            </p>
                                                            <span className="text-xs grey-text-accent font-normal">
                                                                {item.desc}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}
                                            <div
                                                className="dropdown-wallets-item cursor-pointer"
                                                onClick={() => this.setState({ showProfileDropdown: false })}>
                                                <div className="d-flex" onClick={logoutButton}>
                                                    <Logout />
                                                    <div className="pl-3">
                                                        <p className="mb-0 text-sm font-bold white-text">Logout</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </li>
                            ) : (
                                // Sign In and Sign Up

                                <React.Fragment>
                                    <li className="nav-item dropdown avatar px-3">
                                        <Link to={'/signin'} className="text-primary text-sm font-bold mr-3">
                                            Login
                                        </Link>
                                    </li>
                                    <li className="nav-item dropdown avatar px-3">
                                        <Link to={'/signup'} className="btn btn-primary">
                                            Register
                                        </Link>
                                    </li>
                                </React.Fragment>
                            )}

                            {!thisAuthHeader ? (
                                <React.Fragment>
                                    <li className="nav-item dropdown avatar px-3">
                                        <Link to={'/signin'} className="text-primary text-sm font-bold mr-3">
                                            Login
                                        </Link>
                                    </li>
                                    <li className="nav-item dropdown avatar px-3">
                                        <Link to={'/signup'} className="btn btn-primary">
                                            Register
                                        </Link>
                                    </li>
                                </React.Fragment>
                            ) : null}
                        </ul>
                    </div>
                </nav>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    colorTheme: selectCurrentColorTheme(state),
    isLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    setMobileWalletUi: (payload) => dispatch(setMobileWalletUi(payload)),
    toggleMarketSelector: () => dispatch(toggleMarketSelector()),
    logout: () => dispatch(logoutFetch()),
});

export const Header = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(Head) as React.ComponentClass;
