import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { useDocumentTitle, useWalletsFetch } from 'src/hooks';
import { selectCurrencies } from 'src/modules';
import { Link } from 'react-router-dom';
import { MarketListHeader, MarketListTable } from '../../containers';
import './MarketListScreen.pcss';

export const MarketListScreen: FC = (): ReactElement => {
    const currencies = useSelector(selectCurrencies);

    useDocumentTitle('Market List');
    useWalletsFetch();

    return (
        <React.Fragment>
            <div className="pg-market-list-screen dark-bg-main container fluid">
                <div className="dark-bg-main pg-market-list-screen__header">
                    <MarketListHeader />
                </div>

                <div className="dark-bg-accent pg-market-list-screen__table">
                    <MarketListTable />
                </div>
            </div>
        </React.Fragment>
    );
};
