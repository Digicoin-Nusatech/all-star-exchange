import React, { FC, ReactElement, useCallback, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Decimal, formatWithSeparators, Table } from 'src/components';
import { useMarketsFetch, useMarketsTickersFetch, useWalletsFetch } from 'src/hooks';
import {
    selectAbilities,
    selectCurrencies,
    selectMarkets,
    selectMarketTickers,
    selectWallets,
    Wallet,
    User,
    selectUserInfo,
} from 'src/modules';
import { estimateUnitValue } from 'src/helpers/estimateValue';
import { VALUATION_PRIMARY_CURRENCY } from 'src/constants';
import { WalletsHeader, Modal } from '../../components';
import { useHistory } from 'react-router';
import { CircleCloseDangerLargeIcon } from '../../../assets/images/CircleCloseIcon';

interface Props {
    isP2PEnabled?: boolean;
}

interface ExtendedWallet extends Wallet {
    spotBalance?: string;
    spotLocked?: string;
    p2pBalance?: string;
    p2pLocked?: string;
}

const WalletsOverview: FC<Props> = (props: Props): ReactElement => {
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredWallets, setFilteredWallets] = React.useState<ExtendedWallet[]>([]);
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);
    const [showModalLocked, setShowModalLocked] = React.useState<boolean>(false);

    const { formatMessage } = useIntl();
    const { isP2PEnabled } = props;
    const history = useHistory();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [
        formatMessage,
    ]);
    const wallets = useSelector(selectWallets);
    const abilities = useSelector(selectAbilities);
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const user: User = useSelector(selectUserInfo);

    useWalletsFetch();
    useMarketsTickersFetch();
    useMarketsFetch();

    useEffect(() => {
        if (wallets.length && currencies.length) {
            const extendedWallets: ExtendedWallet[] = currencies.map((cur) => {
                if (cur.status === 'hidden' && user.role !== 'admin' && user.role !== 'superadmin') {
                    return null;
                }
                const spotWallet = wallets.find((i) => i.currency === cur.id);
                return {
                    ...spotWallet,
                    spotBalance: spotWallet ? spotWallet.balance : '0',
                    spotLocked: spotWallet ? spotWallet.locked : '0',
                };
            });

            const extendedWalletsFilter = extendedWallets.filter((item) => item && item.currency);
            setFilteredWallets(extendedWalletsFilter);
        }
    }, [wallets, currencies, isP2PEnabled]);

    const headerTitles = useCallback(
        () => [
            'Assets',
            translate('page.body.wallets.overview.header.total'),
            'Estimated Value',
            'Spot Balance',
            'Locked Balance',
            '',
        ],
        [isP2PEnabled]
    );

    const handleClickDeposit = useCallback(
        (currency) => {
            history.push(`/wallets/${currency}/deposit`);
        },
        [history]
    );

    const handleClickWithdraw = useCallback(
        (currency) => {
            history.push(`/wallets/${currency}/withdraw`);
        },
        [history]
    );

    const retrieveData = React.useCallback(() => {
        const list = nonZeroSelected
            ? filteredWallets.filter((i) => i.balance && Number(i.balance) > 0)
            : filteredWallets;
        const filteredList = list.filter(
            (i) =>
                !filterValue ||
                i.name?.toLocaleLowerCase().includes(filterValue.toLowerCase()) ||
                i.currency?.toLocaleLowerCase().includes(filterValue.toLowerCase())
        );

        return !filteredList.length
            ? [[]]
            : filteredList.map((item, index) => {
                  const { currency, iconUrl, name, fixed, spotBalance, spotLocked } = item;
                  const totalBalance = Number(spotBalance) + Number(spotLocked);
                  const estimatedValue =
                      Number(totalBalance) && currency
                          ? estimateUnitValue(
                                currency.toUpperCase(),
                                VALUATION_PRIMARY_CURRENCY,
                                +totalBalance,
                                currencies,
                                markets,
                                tickers
                            )
                          : Decimal.format(0, fixed);

                  return [
                      <div key={index} className="d-flex">
                          <img
                              alt={currency?.toUpperCase()}
                              src={iconUrl}
                              style={{ height: '24px', marginRight: '16px' }}
                          />
                          <p className="text-sm white-text">{currency.toUpperCase()}</p>
                          <p className="ml-1 text-sm grey-text-accent">{name}</p>
                      </div>,
                      <Decimal key={index} fixed={fixed} thousSep=",">
                          {totalBalance ? totalBalance.toString() : '0'}
                      </Decimal>,
                      formatWithSeparators(estimatedValue, ','),
                      <Decimal key={index} fixed={fixed} thousSep=",">
                          {spotBalance}
                      </Decimal>,
                      <Decimal key={index} fixed={fixed} thousSep=",">
                          {spotLocked}
                      </Decimal>,
                      <div key={index} className="ml-auto">
                          <button
                              onClick={() => handleClickDeposit(currency)}
                              className="btn btn-outline-primary border-none blue-text">
                              {translate('page.body.wallets.overview.action.deposit')}
                          </button>
                          <button
                              onClick={() => handleClickWithdraw(currency)}
                              //   onClick={() => setShowModalLocked(!showModalLocked)}
                              className="btn btn-primary border-none danger-text ml-3">
                              {translate('page.body.wallets.overview.action.withdraw')}
                          </button>
                      </div>,
                  ];
              });
    }, [filteredWallets, nonZeroSelected, abilities, currencies, markets, tickers]);

    const renderHeaderModalLocked = () => {
        return (
            <React.Fragment>
                <div className="text-center">
                    <CircleCloseDangerLargeIcon />
                </div>
            </React.Fragment>
        );
    };

    const renderContentModalLocked = () => {
        return (
            <React.Fragment>
                <h1 className="white-text text-lg mb-24">Withdraw Locked</h1>
                <p className="grey-text text-ms font-extrabold mb-24">To withdraw you have to enable 2FA</p>
                <div className="d-flex">
                    <button
                        className="btn btn-danger sm px-5 mr-3"
                        onClick={() => setShowModalLocked(!showModalLocked)}>
                        Enable 2FA
                    </button>
                </div>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <WalletsHeader
                wallets={wallets}
                nonZeroSelected={nonZeroSelected}
                setFilterValue={setFilterValue}
                setFilteredWallets={setFilteredWallets}
                handleClickCheckBox={setNonZeroSelected}
            />
            <p className="text-sm grey-text-accent mb-8">Asset balance</p>
            <Table header={headerTitles()} data={retrieveData()} />

            {showModalLocked && (
                <Modal show={showModalLocked} header={renderHeaderModalLocked()} content={renderContentModalLocked()} />
            )}
        </React.Fragment>
    );
};

export { WalletsOverview };
