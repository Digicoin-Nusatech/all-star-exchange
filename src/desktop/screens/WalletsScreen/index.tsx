import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { EstimatedValue, WalletsOverview } from '../../containers';
import { useDocumentTitle, useWalletsFetch } from 'src/hooks';
import { selectCurrencies, selectWallets } from 'src/modules';
import { Link } from 'react-router-dom';
import Tab from '../../containers/TabPane/Tab';
import { TabPane } from '../../containers/TabPane/Tab';

export const WalletsScreen: FC = (): ReactElement => {
    const wallets = useSelector(selectWallets) || [];
    const currencies = useSelector(selectCurrencies);

    useDocumentTitle('Wallets');
    useWalletsFetch();

    return (
        <React.Fragment>
            <section className=" wallet-page">
                <div className="pt-5">
                    <Tab>
                        <TabPane title="Overview">
                            <div className="container py-4 wallet-screen content-wrapper dark-bg-main">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h2 className="text-lg white-text">Asset Overview</h2>
                                    <div className="form-inline ">
                                        <Link to={`/trade-history`}>
                                            <button
                                                type="button"
                                                className="btn btn-primary radius-sm text-sm white-text font-bold">
                                                Trade History
                                            </button>
                                        </Link>
                                        <div className="ml-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary text-sm white-text font-bold">
                                                Transfer
                                            </button>
                                        </div>
                                        <div className="ml-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary text-sm white-text font-bold">
                                                Transfer
                                            </button>
                                        </div>
                                        {/*
                                        <Link className="ml-3" to={`/history-transaction`}>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary text-sm white-text font-bold">
                                                
                                            </button>
                                        </Link> */}
                                    </div>
                                </div>
                                <EstimatedValue wallets={wallets} />
                                <WalletsOverview />
                            </div>
                        </TabPane>
                        <TabPane title="Market Order">
                            <div className="container py-4 wallet-screen content-wrapper dark-bg-main">
                                <div className="d-flex justify-content-between align-items-center mb-24">
                                    <h2 className="text-lg white-text">Markets Order</h2>
                                </div>
                                <h4>Soon</h4>
                            </div>
                        </TabPane>
                        <TabPane title="Trade History">
                            <div className="container py-4 wallet-screen content-wrapper dark-bg-main">
                                <div className="d-flex justify-content-between align-items-center mb-24">
                                    <h2 className="text-lg white-text">Trade History</h2>
                                </div>
                                <h4>Soon</h4>
                            </div>
                        </TabPane>
                        <TabPane title="Deposit">
                            <div className="container py-4 wallet-screen content-wrapper dark-bg-main">
                                <div className="d-flex justify-content-between align-items-center mb-24">
                                    <h2 className="text-lg white-text">Deposit</h2>
                                </div>
                                <h4>Soon</h4>
                            </div>
                        </TabPane>
                        <TabPane title="Withdraw">
                            <div className="container py-4 wallet-screen content-wrapper dark-bg-main">
                                <div className="d-flex justify-content-between align-items-center mb-24">
                                    <h2 className="text-lg white-text">Withdraw</h2>
                                </div>
                                <h4>Soon</h4>
                            </div>
                        </TabPane>
                        <TabPane title="Internal Transfer">
                            <div className="container py-4 wallet-screen content-wrapper dark-bg-main">
                                <div className="d-flex justify-content-between align-items-center mb-24">
                                    <h2 className="text-lg white-text">Internal Transfer</h2>
                                </div>
                                <h4>Soon</h4>
                            </div>
                        </TabPane>
                    </Tab>
                </div>
            </section>
        </React.Fragment>
    );
};
