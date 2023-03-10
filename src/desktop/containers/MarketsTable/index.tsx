import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Decimal } from '../../../components';
import { TickerTable } from '../../components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useMarketsFetch, useMarketsTickersFetch } from '../../../hooks';
import {
    Market,
    selectMarkets,
    selectMarketTickers,
    setCurrentMarket,
    selectUserInfo,
    selectCurrencies,
} from '../../../modules';
import { ArrowDownLarge } from '../../../assets/images/ArrowDownIcon';
import AnouncementIcon from '../../../assets/png/landing-announcement.png';
import SliderBgImage from '../../../assets/png/bg-slider-item.png';
import MoneroIcon from '../../../assets/png/Monero.png';

const defaultTicker = {
    amount: '0.0',
    last: '0.0',
    high: '0.0',
    open: '0.0',
    low: '0.0',
    price_change_percent: '+0.00%',
    volume: '0.0',
};

const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
};

const cardBanner = [
    { date: '12-12-2022', title: 'Title card banner', desc: 'description banner card' },
    { date: '12-12-2022', title: 'Title card banner', desc: 'description banner card' },
    { date: '12-12-2022', title: 'Title card banner', desc: 'description banner card' },
    { date: '12-12-2022', title: 'Title card banner', desc: 'description banner card' },
    { date: '12-12-2022', title: 'Title card banner', desc: 'description banner card' },
];

const MarketsTableComponent = (props) => {
    useMarketsFetch();
    useMarketsTickersFetch();
    const history = useHistory();
    const dispatch = useDispatch();
    const markets = useSelector(selectMarkets);
    const marketTickers = useSelector(selectMarketTickers);
    const currencies = useSelector(selectCurrencies);
    const userData = useSelector(selectUserInfo);
    const [currentBidUnit, setCurrentBidUnit] = React.useState('');

    const handleRedirectToTrading = (id: string) => {
        const currentMarket: Market | undefined = markets.find((item) => item.id === id);

        if (currentMarket) {
            props.handleChangeCurrentMarket && props.handleChangeCurrentMarket(currentMarket);
            dispatch(setCurrentMarket(currentMarket));
            history.push(`/trading/${currentMarket.id}`);
        }
    };

    const formatFilteredMarkets = (list: string[], market: Market) => {
        if (market.state && market.state === 'hidden' && userData.role !== 'admin' && userData.role !== 'superadmin') {
            return list;
        }

        if (!list.includes(market.quote_unit)) {
            list.push(market.quote_unit);
        }

        return list;
    };

    let currentBidUnitsList: string[] = [''];

    if (markets.length > 0) {
        currentBidUnitsList = markets.reduce(formatFilteredMarkets, currentBidUnitsList);
    }

    let currentBidUnitMarkets = props.markets || markets;

    if (currentBidUnit) {
        currentBidUnitMarkets = currentBidUnitMarkets.length
            ? currentBidUnitMarkets.filter((market) => market.quote_unit === currentBidUnit)
            : [];
    }

    const formattedMarkets = currentBidUnitMarkets.length
        ? currentBidUnitMarkets
              .map((market) => ({
                  ...market,
                  last: Decimal.format(
                      Number((marketTickers[market.id] || defaultTicker).last),
                      market.amount_precision
                  ),
                  open: Decimal.format(
                      Number((marketTickers[market.id] || defaultTicker).open),
                      market.price_precision
                  ),
                  price_change_percent: String((marketTickers[market.id] || defaultTicker).price_change_percent),
                  high: Decimal.format(
                      Number((marketTickers[market.id] || defaultTicker).high),
                      market.amount_precision
                  ),
                  low: Decimal.format(Number((marketTickers[market.id] || defaultTicker).low), market.amount_precision),
                  volume: Decimal.format(
                      Number((marketTickers[market.id] || defaultTicker).volume),
                      market.amount_precision
                  ),
                  currency: currencies.find((cur) => cur.id == market.base_unit),
              }))
              .map((market) => ({
                  ...market,
                  change: Decimal.format(
                      (+market.last - +market.open).toFixed(market.price_precision),
                      market.price_precision
                  ),
              }))
        : [];

    const popularMarket = [...formattedMarkets].sort((a, b) => b.price - a.price);
    const topPopular = popularMarket.slice(0, 10);

    const filteredMarkets = topPopular
        .map((market) => {
            if (
                market.state &&
                market.state === 'hidden' &&
                userData.role !== 'admin' &&
                userData.role !== 'superadmin'
            ) {
                return [null, null, null, null];
            }
            return market;
        })
        .filter((item) => item[0] !== null);

    const sortMarket = [...formattedMarkets].sort((a, b) => b.volume - a.volume);
    const highestMarket = sortMarket.slice(0, 4);
    console.log(sortMarket);

    return (
        <React.Fragment>
            <section className="popular-crypto position-relative pb-5">
                <img src={MoneroIcon} className="image-coin popular monero" alt="" />
                <div className="dark-bg-main full-width">
                    <div className="container">
                        <div className="d-flex flex-wrap justify-content-center">
                            {highestMarket &&
                                highestMarket.map((item, index) => (
                                    <div key={index} className="market-item py-24 mx-4">
                                        <p className="mb-0 text-lg white-text font-bold mb-8">
                                            {item.name}
                                            <span className="contrast-text font-bold text-ms ml-2">
                                                {item.price_change_percent}
                                            </span>
                                        </p>
                                        <p className="mb-0 text-lg white-text font-bold">
                                            <Decimal fixed={2} thousSep="." floatSep=",">
                                                {item.last}
                                            </Decimal>
                                        </p>
                                        <p className="mb-0 text-xs grey-text-accent">
                                            <span>Volume: </span> {item.volume}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
                <div className="container index-2 mt-5">
                    <div className="mb-12">
                        <Slider {...settings}>
                            {cardBanner &&
                                cardBanner.map((item, key) => (
                                    <div key={key} className="p-2">
                                        <div className="dark-bg-main p-3 radius-md">
                                            <div
                                                className="slider-item"
                                                style={{
                                                    backgroundImage: `url(${SliderBgImage})`,
                                                }}>
                                                <div className="content">
                                                    <div className="d-flex justify-content-end">
                                                        <img src={AnouncementIcon} className="icon-slider" alt="" />
                                                    </div>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div className="mr-2">
                                                            <p className="text-ms grey-text-accent mb-8">{item.date}</p>
                                                            <p className="text-sm font-bold white-text mb-1">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-xs grey-text-accent">{item.desc}</p>
                                                        </div>
                                                        <a href="">
                                                            <ArrowDownLarge className={'mx-1'} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </Slider>
                    </div>
                    <h2 className="text-main-title white-text text-center font-extrabold ">Popular Crypto Coins</h2>
                    <p className=" mb-24 text-md font-normal grey-text-accent text-center">
                        Most popular coins to trade
                    </p>
                    <div className="market-list">
                        <TickerTable
                            currentBidUnit={currentBidUnit}
                            currentBidUnitsList={currentBidUnitsList}
                            markets={filteredMarkets}
                            redirectToTrading={handleRedirectToTrading}
                            setCurrentBidUnit={setCurrentBidUnit}
                        />
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export const MarketsTable = React.memo(MarketsTableComponent);
