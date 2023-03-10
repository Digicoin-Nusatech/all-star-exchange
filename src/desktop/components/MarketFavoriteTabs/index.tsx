import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrencies } from 'src/modules';
import { Link } from 'react-router-dom';
import { Tabs, Tab } from 'react-bootstrap';
import { Table } from 'src/components';
import { StarIconActive } from 'src/assets/images/StarIcon';
import './MarketFavoriteTabs.pcss';

export const MarketFavoriteTabs: FC = (): ReactElement => {
    const currencies = useSelector(selectCurrencies);

    const dataTable = [
        {
            name: 'TRX/USDT',
            price: '16,813.93 ... / Rp261,064 ...',
            change: '-0.82%',
            volume: '$19.358.255',
            cap: '$19.358.255',
        },
        {
            name: 'TRX/USDT',
            price: '16,813.93 ... / Rp261,064 ...',
            change: '+1.37%',
            volume: '$19.358.255',
            cap: '$19.358.255',
        },
        {
            name: 'TRX/USDT',
            price: '16,813.93 ... / Rp261,064 ...',
            change: '-0.82%',
            volume: '$19.358.255',
            cap: '$19.358.255',
        },
        {
            name: 'TRX/USDT',
            price: '16,813.93 ... / Rp261,064 ...',
            change: '+1.37%',
            volume: '$19.358.255',
            cap: '$19.358.255',
        },
    ];

    const getTableHeaders = () => {
        return ['Name', 'Price', '24 Change', '24 Volume', 'Market Cap', '', ''];
    };

    const getTableData = (data) => {
        return data.map((item) => [
            <div className="d-flex align-items-center text-sm">
                <span className="mr-8 ">
                    <StarIconActive />
                </span>
                <p className="m-0 mr-12 white-text font-bold">{item.name}</p>
            </div>,
            <p className="m-0 text-sm white-text">{item.price}</p>,
            <p className={`text-sm ${item.change.includes('-') ? 'danger-text' : 'green-text'}`}>{item.change}</p>,
            <p className="m-0 text-sm white-text">{item.volume}</p>,
            <p className="m-0 text-sm white-text">{item.cap}</p>,
            <p className="m-0 text-sm font-bold gradient-text cursor-pointer">Detail</p>,
            <p className="m-0 text-sm font-bold gradient-text cursor-pointer">Trade</p>,
        ]);
    };

    return (
        <React.Fragment>
            <div className="com-market-favorite-tabs">
                <Tabs defaultActiveKey="spot" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="spot" title="Spot">
                        <Table header={getTableHeaders()} data={getTableData(dataTable)} />
                    </Tab>
                    <Tab eventKey="future" title="Future">
                        <Table header={getTableHeaders()} data={getTableData(dataTable)} />
                    </Tab>
                </Tabs>
            </div>
        </React.Fragment>
    );
};
