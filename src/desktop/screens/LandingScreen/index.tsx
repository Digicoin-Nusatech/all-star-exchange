import { LandingBlock } from '@openware/react-components';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { IntlProps } from '../../../';
import { MarketsTable } from '../../containers';
import { toggleColorTheme } from '../../../helpers';
import { RootState, selectCurrentColorTheme, selectUserLoggedIn } from '../../../modules';

import HeroSection from '../../../assets/img/hero-section.png';
import HeroSection2 from '../../../assets/img/hero-section2.png';

import btcIcon from '../../../assets/img/btc.png';
import ethIcon from '../../../assets/img/eth.png';
import bnbIcon from '../../../assets/img/bnb.png';
import usdtIcon from '../../../assets/img/usdt.png';
import xrpIcon from '../../../assets/img/xrp.png';
import dogeIcon from '../../../assets/img/doge.png';

import grafik1 from '../../../assets/img/grafik1.png';
import grafik2 from '../../../assets/img/grafik2.png';
import grafik3 from '../../../assets/img/grafik3.png';
import grafik4 from '../../../assets/img/grafik4.png';
import grafik5 from '../../../assets/img/grafik5.png';

import bannerImg from '../../../assets/img/banner.png';
import phoneImg from '../../../assets/img/phone.png';

import pattern1 from '../../../assets/img/Pattern1.png';
import pattern2 from '../../../assets/img/Pattern2.png';
import pattern3 from '../../../assets/img/Pattern3.png';
import pattern4 from '../../../assets/img/Pattern4.png';
import pattern5 from '../../../assets/img/Pattern5.png';
import pattern6 from '../../../assets/img/Pattern6.png';

import arrowBull from '../../../assets/img/icon/arrow-bull.png';
import arrowRight from '../../../assets/img/icon/arrow-right.png';

import b1Image from '../../../assets/img/b1.png';
import b2Image from '../../../assets/img/b2.png';
import b3Image from '../../../assets/img/b3.png';

import cloudIcon from '../../../assets/img/icon/cloud-data.png';
import userIcon from '../../../assets/img/icon/user.png';
import awardIcon from '../../../assets/img/icon/award.png';
import tradeIcon from '../../../assets/img/icon/trade.png';
import androidIcon from '../../../assets/img/icon/android.png';
import appstoreIcon from '../../../assets/img/icon/appstore.png';
import playstoreIcon from '../../../assets/img/icon/gp-store.png';
import windowsIcon from '../../../assets/img/icon/windows.png';
import macIcon from '../../../assets/img/icon/mac.png';

interface ReduxProps {
    isLoggedIn: boolean;
    colorTheme: string;
}

type Props = ReduxProps & RouteProps & IntlProps;

interface CardTrendingProps {
    icon: string;
    code: string;
    name: string;
    chart: string;
}

interface BannerProps {
    imgUrl: string;
}

const CardTrendingCoin = ({ icon, code, name, chart }: CardTrendingProps) => {
    return (
        <div className="col-xl-3 col-md-6 mt-4">
            <a href="#">
                <div className="card border-0 shadow-sm p-4 radius-18">
                    <div className="row align-items-center">
                        <div className="col-8">
                            <div className="d-flex align-items-center">
                                <img src={icon} alt="#" />
                                <h5 className="mb-0 ml-2">{code}</h5>
                                <div className="bg-light p-1 small ml-2 rounded">{name}</div>
                            </div>
                        </div>
                        <div className="col-4 text-right">
                            <img src={arrowBull} alt="#" />
                        </div>
                    </div>
                    <hr />
                    <div className="row align-items-center">
                        <div className="col-7">
                            <h5 className="fw-bold">$56,623.54</h5>
                            <span className="text-success">1.41%</span>
                        </div>
                        <div className="col-5 text-right">
                            <img src={chart} alt="#" className="w-100" />
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
};

const CardBanner = ({ imgUrl }: BannerProps) => {
    return (
        <div className="col-lg-4 mt-4">
            <a href="#">
                <img src={imgUrl} alt="#" className="w-100" />
            </a>
        </div>
    );
};

class Landing extends React.Component<Props> {
    public componentDidMount() {
        if (this.props.colorTheme === 'light') {
            toggleColorTheme('dark');
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (next.colorTheme === 'light') {
            toggleColorTheme('dark');
        }
    }

    public componentWillUnmount() {
        if (this.props.colorTheme === 'light') {
            toggleColorTheme(this.props.colorTheme);
        }
    }

    public render() {
        return (
            <>
                {/* ======== Hero Section ======= */}
                <section className="py-5 bg-1">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 text-center text-lg-left">
                                <div className="text-warning fw-bold mb-4">Join the our crypto exchange</div>
                                <h1 className="fw-bold mb-4">Popular way to buy and sell crypto.</h1>
                                <p>
                                    Besnik crypto is the community-run technology powering the cryptocurrency, ether and
                                    thousands of decentralized applications.
                                </p>
                                <div>
                                    <a href="#" className="btn btn-primary mr-3">
                                        Trade Now
                                    </a>
                                    <a href="#" className="btn btn-outline-primary">
                                        Download App
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-6 mt-4 mt-lg-0">
                                <img src={HeroSection} alt="#" className="w-100" />
                            </div>
                        </div>
                    </div>
                </section>
                {/* ===== End Hero Section ======= */}

                {/* ====== Coin Trending Section ===== */}
                <section className="py-5">
                    <div className="container fluid">
                        <div className="row">
                            <CardTrendingCoin icon={btcIcon} code="BTC" name="Bitcoin" chart={grafik1} />
                            <CardTrendingCoin icon={ethIcon} code="ETH" name="Ethereum" chart={grafik2} />
                            <CardTrendingCoin icon={bnbIcon} code="BNB" name="Binance" chart={grafik3} />
                            <CardTrendingCoin icon={usdtIcon} code="USDT" name="Tether" chart={grafik4} />
                        </div>
                    </div>
                </section>
                {/* ===== End Coin Trending Section ===== */}

                {/* ==== Banner Section */}
                <section className="py-5">
                    <div className="container">
                        <div className="row">
                            <CardBanner imgUrl={bannerImg} />
                            <CardBanner imgUrl={bannerImg} />
                            <CardBanner imgUrl={bannerImg} />
                        </div>
                    </div>
                </section>
                {/* ==== End Banner Section */}

                {/* ===== Popular Section */}
                <section className="py-5">
                    <img src={pattern1} alt="#" className="pattern-1" />
                    <img src={pattern2} alt="#" className="pattern-2" />
                    <img src={pattern3} alt="#" className="pattern-3" />
                    <img src={pattern4} alt="#" className="pattern-4" />
                    <div className="container">
                        <div className="text-center fw-bold">
                            <h1 className="fw-bold mb-4">Popular Crypto Coins</h1>
                            <h5 className="fw-bold">Most popular coins to trade</h5>
                        </div>
                        <div className="row my-4 fw-bold no-gutters">
                            <div className="col-8">
                                <a href="#" className="text-dark h6 mb-0 mr-3">
                                    Hot List
                                </a>
                                <a href="#" className="text-dark h6 mb-0 mr-3">
                                    New Coins
                                </a>
                                <a href="#" className="text-dark h6 mb-0 mr-3">
                                    Top Gainers
                                </a>
                            </div>
                            <div className="col-4 text-right">
                                <a href="#" className="text-dark h6 mb-0">
                                    View More Coin <img src={arrowRight} alt="#" />
                                </a>
                            </div>
                        </div>
                        <div className="row text-dark fw-bold">
                            <div className="col-lg-4 col-6">Coins</div>
                            <div className="col-lg-2 col-6 text-right text-lg-left">Last Price</div>
                            <div className="col-lg-2 d-none d-lg-block">24h Change</div>
                            <div className="col-lg-2 d-none d-lg-block">Markets</div>
                        </div>
                        <div className="row align-items-center mt-4">
                            <div className="col-lg-4 col-6">
                                <div className="d-flex align-items-center">
                                    <img src={btcIcon} alt="#" width="40" />
                                    <h5 className="mb-0 ml-2">BTC</h5>
                                    <div className="bg-light p-1 small ml-2 rounded">Bitcoin</div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-6 text-right text-lg-left">$ 20,741.8</div>
                            <div className="col-lg-2 d-none d-lg-block">
                                <span className="badge badge-success">+2.00%</span>
                            </div>
                            <div className="col-lg-2 d-none d-lg-block">
                                <img src={grafik5} className="w-100" alt="#" />
                            </div>
                            <div className="col-lg-2 d-none d-lg-block text-right">
                                <a href="#" className="text-primary mr-3">
                                    Detail
                                </a>
                                <a href="#" className="text-primary">
                                    Trade
                                </a>
                            </div>
                        </div>
                        <div className="row align-items-center mt-4">
                            <div className="col-lg-4 col-6">
                                <div className="d-flex align-items-center">
                                    <img src={bnbIcon} alt="#" width="40" />
                                    <h5 className="mb-0 ml-2">BNB</h5>
                                    <div className="bg-light p-1 small ml-2 rounded">Binance</div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-6 text-right text-lg-left">$ 20,741.8</div>
                            <div className="col-lg-2 d-none d-lg-block">
                                <span className="badge badge-success">+2.00%</span>
                            </div>
                            <div className="col-lg-2 d-none d-lg-block">
                                <img src={grafik5} className="w-100" alt="#" />
                            </div>
                            <div className="col-lg-2 d-none d-lg-block text-right">
                                <a href="#" className="text-primary mr-3">
                                    Detail
                                </a>
                                <a href="#" className="text-primary">
                                    Trade
                                </a>
                            </div>
                        </div>
                        <div className="row align-items-center mt-4">
                            <div className="col-lg-4 col-6">
                                <div className="d-flex align-items-center">
                                    <img src={xrpIcon} alt="#" width="40" />
                                    <h5 className="mb-0 ml-2">XRP</h5>
                                    <div className="bg-light p-1 small ml-2 rounded">Ripple</div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-6 text-right text-lg-left">$ 20,741.8</div>
                            <div className="col-lg-2 d-none d-lg-block">
                                <span className="badge badge-success">+2.00%</span>
                            </div>
                            <div className="col-lg-2 d-none d-lg-block">
                                <img src={grafik5} className="w-100" alt="#" />
                            </div>
                            <div className="col-lg-2 d-none d-lg-block text-right">
                                <a href="#" className="text-primary mr-3">
                                    Detail
                                </a>
                                <a href="#" className="text-primary">
                                    Trade
                                </a>
                            </div>
                        </div>

                        <div className="row align-items-center mt-4">
                            <div className="col-lg-4 col-6">
                                <div className="d-flex align-items-center">
                                    <img src={ethIcon} alt="#" width="40" />
                                    <h5 className="mb-0 ml-2">ETH</h5>
                                    <div className="bg-light p-1 small ml-2 rounded">Etherium</div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-6 text-right text-lg-left">$ 20,741.8</div>
                            <div className="col-lg-2 d-none d-lg-block">
                                <span className="badge badge-success">+2.00%</span>
                            </div>
                            <div className="col-lg-2 d-none d-lg-block">
                                <img src={grafik5} className="w-100" alt="#" />
                            </div>
                            <div className="col-lg-2 d-none d-lg-block text-right">
                                <a href="#" className="text-primary mr-3">
                                    Detail
                                </a>
                                <a href="#" className="text-primary">
                                    Trade
                                </a>
                            </div>
                        </div>

                        <div className="row align-items-center mt-4">
                            <div className="col-lg-4 col-6">
                                <div className="d-flex align-items-center">
                                    <img src={dogeIcon} alt="#" width="40" />
                                    <h5 className="mb-0 ml-2">Doge</h5>
                                    <div className="bg-light p-1 small ml-2 rounded">Doge Coins</div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-6 text-right text-lg-left">$ 20,741.8</div>
                            <div className="col-lg-2 d-none d-lg-block">
                                <span className="badge badge-success">+2.00%</span>
                            </div>
                            <div className="col-lg-2 d-none d-lg-block">
                                <img src={grafik5} className="w-100" alt="#" />
                            </div>
                            <div className="col-lg-2 d-none d-lg-block text-right">
                                <a href="#" className="text-primary mr-3">
                                    Detail
                                </a>
                                <a href="#" className="text-primary">
                                    Trade
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                {/* ===== End Popular Section */}

                {/* Service Section */}
                <section className="py-5 bg-3">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-4">
                                <h1 className="mb-3">We make crypto easy.</h1>
                                <p>
                                    Specific cryptocurrencies work and get a bit of crypto to try out for yourself. Here
                                    are a few reasons why you should choose besnik crypto
                                </p>
                                <a href="#" className="btn btn-light mt-4">
                                    Learn more
                                </a>
                            </div>
                            <div className="col-lg-8">
                                <div className="row mt-5">
                                    <div className="col-md-6 mb-4">
                                        <div className="d-flex align-items-start">
                                            <img src={cloudIcon} alt="#" />
                                            <div className="ml-3">
                                                <h5>Secure storage</h5>
                                                <p>
                                                    We store the vast majority of the digital assets in secure offline
                                                    storage.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <div className="d-flex align-items-start">
                                            <img src={userIcon} alt="#" />
                                            <div className="ml-3">
                                                <h5>Protected by insurance</h5>
                                                <p>
                                                    Cryptocurrency stored on our servers is covered by our insurance
                                                    policy.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <div className="d-flex align-items-start">
                                            <img src={awardIcon} alt="#" />
                                            <div className="ml-3">
                                                <h5>Industry best practices</h5>
                                                <p>
                                                    Besnik crypto supports a variety of the most popular digital crypto
                                                    currencies.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <div className="d-flex align-items-start">
                                            <img src={tradeIcon} alt="#" />
                                            <div className="ml-3">
                                                <h5>Trade Assets</h5>
                                                <p>
                                                    Discover new and innovative crypto assets with over 200 spot trading
                                                    pairs and 25 margin.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Service Section */}

                {/* Wallet Section */}
                <section className="py-5 bg-4">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="text-warning fw-bold mb-4">YOUR GATEWAY TO THE GLOBAL ECONOMY</div>
                                <h1 className="fw-bold mb-4">The Easiest and Most Powerful Crypto Wallet</h1>
                                <p>
                                    Bitcoin uses peer-to-peer technology to operate with no central authority or banks;
                                    managing transactions and the issuing of bitcoins is carried out collectively by the
                                    network.
                                </p>
                                <div>
                                    <a href="#" className="btn btn-primary">
                                        Get it Now
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-6 mt-4 mt-lg-0">
                                <img src={phoneImg} alt="#" className="w-100" />
                            </div>
                        </div>
                    </div>
                </section>
                {/*  End Wallet Section */}

                {/* Service Wallet Section */}
                <section className="py-5 bg-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-6 text-center">
                                <div className="text-warning fw-bold mb-4">GATEWAY TO THE GLOBAL ECONOMY</div>
                                <h1 className="fw-bold mb-4">Cryptocurrency in Every Wallet™</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 mt-4">
                                <img src={b1Image} alt="#" className="w-100 mb-4" />
                                <h5 className="mb-3">Futures Trading Week</h5>
                                <p>BCQ crypto supports a variety of the most popular digital crypto currencies.</p>
                                <a href="#" className="text-warning underline">
                                    Read more
                                </a>
                            </div>
                            <div className="col-lg-4 mt-4">
                                <img src={b2Image} alt="#" className="w-100 mb-4" />
                                <h5 className="mb-3">Token Quartet Giveaway</h5>
                                <p>BCQ crypto supports a variety of the most popular digital crypto currencies.</p>
                                <a href="#" className="text-warning underline">
                                    Read more
                                </a>
                            </div>
                            <div className="col-lg-4 mt-4">
                                <img src={b3Image} alt="#" className="w-100 mb-4" />
                                <h5 className="mb-3">Industry best practices</h5>
                                <p>BCQ crypto supports a variety of the most popular digital crypto currencies.</p>
                                <a href="#" className="text-warning underline">
                                    Read more
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Service Wallet Section */}

                {/* Service Trade Section */}
                <section className="py-5">
                    <img src={pattern5} alt="#" className="pattern-5" />
                    <img src={pattern6} alt="#" className="pattern-6" />
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-4 mb-lg-0">
                                <img src={HeroSection2} alt="#" className="w-100" />
                            </div>
                            <div className="col-lg-6">
                                <h1 className="fw-bold mb-4">Trade Anytime, Anywhere</h1>
                                <p>Compatible with multiple devices, start trading with safety and convenience.</p>
                                <div>
                                    <a href="#" className="btn btn-primary">
                                        Get it Now
                                    </a>
                                </div>
                                <div className="row">
                                    <div className="col-4 text-center mt-4">
                                        <img src={androidIcon} alt="#" />
                                        <h6 className="mb-0 text-primary">Android APK</h6>
                                    </div>
                                    <div className="col-4 text-center mt-4">
                                        <img src={appstoreIcon} alt="#" />
                                        <h6 className="mb-0 text-primary">App Store</h6>
                                    </div>
                                    <div className="col-4 text-center mt-4">
                                        <img src={playstoreIcon} alt="#" />
                                        <h6 className="mb-0 text-primary">Google Play</h6>
                                    </div>
                                    <div className="col-4 text-center mt-4">
                                        <img src={windowsIcon} alt="#" />
                                        <h6 className="mb-0 text-primary">Windows</h6>
                                    </div>
                                    <div className="col-4 text-center mt-4">
                                        <img src={macIcon} alt="#" />
                                        <h6 className="mb-0 text-primary">Mac Os</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Service Trade Section */}
            </>
        );
    }

    private handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    private translate = (key: string) => this.props.intl.formatMessage({ id: key });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isLoggedIn: selectUserLoggedIn(state),
    colorTheme: selectCurrentColorTheme(state),
});

export const LandingScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, null)
)(Landing) as React.ComponentClass;
