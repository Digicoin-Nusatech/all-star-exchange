import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { EstimatedValue, WalletsOverview } from '../../containers';
import { useDocumentTitle, useWalletsFetch } from 'src/hooks';
import { selectCurrencies, selectWallets } from 'src/modules';
import { Link } from 'react-router-dom';

export const WalletsScreen: FC = (): ReactElement => {
    const wallets = useSelector(selectWallets) || [];
    const currencies = useSelector(selectCurrencies);

    useDocumentTitle('Wallets');
    useWalletsFetch();

    return (
        <React.Fragment>
            <div className="container py-5 wallet-screen content-wrapper dark-bg-main">
                <div className="d-flex justify-content-between align-items-center mb-24">
                    <h1 className="text-lg white-text">Asset Overview</h1>

                    <div className="form-inline ">
                        <Link to={`/trade-history`}>
                            <button type="button" className="btn btn-primary radius-sm text-sm white-text font-bold">
                                Deposit
                            </button>
                        </Link>
                        <Link className="ml-3" to={`/history-transaction`}>
                            <button type="button" className="btn btn-outline-primary text-sm white-text font-bold">
                                Withdraw
                            </button>
                        </Link>
                        <Link className="ml-3" to={`/history-transaction`}>
                            <button type="button" className="btn btn-outline-primary text-sm white-text font-bold">
                                Transfer
                            </button>
                        </Link>
                    </div>
                </div>
                <EstimatedValue wallets={wallets} />
                <WalletsOverview />
            </div>
        </React.Fragment>
    );
};
