import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CurrencyInfo } from '../';
import { DepositCrypto } from '../DepositCrypto';
import { selectUserInfo } from '../../../modules/user/profile';
import { alertPush, Currency, selectCurrencies, walletsAddressFetch } from '../../../modules';
import './WalletDepositBody.pcss';
import { QRCode, Tooltip, Decimal, Table } from '../../../components';
import { CustomStylesSelect } from '../../components';
import { copy } from '../../../helpers';
import { Modal, OverlayTrigger } from 'react-bootstrap';
import Select from 'react-select';
import { Link, useParams, useHistory } from 'react-router-dom';
import { TipIcon } from 'src/assets/images/TipIcon';

const WalletDepositBody = (props) => {
    const [networks, setNetworks] = useState([]);
    const [addressDeposit, setAddressDeposit] = useState({});
    const [address, setAddress] = useState('');
    const [block, setBlock] = useState({});
    const [blockchainNetwork, setBlockchainNetwork] = useState(null);
    const [show, setShow] = useState(false);

    const { wallet } = props;
    const intl = useIntl();
    const { currency = '' } = useParams<{ currency?: string }>();
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(selectUserInfo);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const label = React.useMemo(
        () => intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.address' }),
        [intl]
    );

    const doCopy = (text) => {
        copy(text);
        dispatch(alertPush({ message: ['Link has been copied'], type: 'success' }));
    };

    const currencies: Currency[] = useSelector(selectCurrencies);
    const currencyItem: Currency | any = (currencies && currencies.find((item) => item.id === wallet.currency)) || {
        min_confirmations: 6,
        deposit_enabled: false,
    };

    const blockchain = (blockchainNetwork &&
        currencyItem &&
        currencyItem.networks.find((n) => n.protocol === blockchainNetwork)) || {
        blockchain_key: null,
    };

    // useEffect(() => {
    //     if (blockchain && blockchain.blockchain_key !== null) {
    //         setBlock(blockchain);
    //     }
    // }, [blockchain]);

    const blockchainKey = blockchain && blockchain.blockchain_key;

    const depositAddress =
        (wallet &&
            blockchainKey &&
            wallet.deposit_addresses.find((w) => w.blockchain_key.toLowerCase() === blockchainKey.toLowerCase())) ||
        null;

    const handleGenerateAddress = useEffect(() => {
        if (!depositAddress && blockchainKey) {
            dispatch(walletsAddressFetch({ currency: wallet.currency, blockchain_key: blockchainKey }));
        }
    }, [wallet, walletsAddressFetch, blockchainKey]);

    const buttonLabel = `${intl.formatMessage({
        id: 'page.body.wallets.tabs.deposit.ccy.button.generate',
    })} ${wallet.currency.toUpperCase()} ${intl.formatMessage({
        id: 'page.body.wallets.tabs.deposit.ccy.button.address',
    })}`;

    const error = intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.pending' });
    const text = intl.formatMessage(
        { id: 'page.body.wallets.tabs.deposit.ccy.message.submit' },
        { confirmations: currencyItem.min_confirmations }
    );
    const handleOnCopy = () => ({});

    const minDepositAmount = (blockchain && blockchain.min_deposit_amount) || '0';

    const optionCurrency = currencies.map((item) => {
        const customLabel = (
            <Link key={item.id} to={`/wallets/${item.id}/deposit`}>
                <div className="d-flex align-items-center">
                    <img src={item.icon_url} alt="icon" className="mr-12 small-coin-icon" />
                    <div>
                        <p className="m-0 text-sm grey-text-accent">{item.id.toUpperCase()}</p>
                        <p className="m-0 text-xs grey-text-accent">{item.name}</p>
                    </div>
                </div>
            </Link>
        );
        return {
            label: customLabel,
            value: item.id,
        };
    });

    const dataTable = [
        {
            date: '24 Oct 2022 - 14.44',
            transactionId: 'PX8RTQWVA....',
            amount: '0.5 BTC',
            type: 'Deposit',
            status: 'Pending',
            confirmation: '1/4',
        },
        {
            date: '24 Oct 2022 - 14.44',
            transactionId: 'PX8RTQWVA....',
            amount: '0.5 BTC',
            type: 'Deposit',
            status: 'Pending',
            confirmation: '1/4',
        },
    ];

    const getTableHeaders = () => {
        return ['Date', 'Transacsion ID', 'Amount', 'Type Transaction', 'Status', 'Confirmation'];
    };

    const getTableData = (data) => {
        return data.map((item) => [
            item.date,
            item.transactionId,
            item.amount,
            item.type,
            item.status,
            item.confirmation,
        ]);
    };

    useEffect(() => {
        if (depositAddress !== null) {
            setAddressDeposit(depositAddress);
            setAddress(depositAddress.address);
        }

        if (currencyItem && currencyItem.networks !== undefined) {
            setNetworks(currencyItem && currencyItem.networks);
        }

        if (!blockchainNetwork && currencyItem.networks && currencyItem.type !== 'fiat') {
            setBlockchainNetwork(
                currencyItem && currencyItem.networks && currencyItem.networks[0] && currencyItem.networks[0].protocol
            );
        }
    }, [depositAddress, currencyItem, blockchainNetwork]);

    const renderDeposit = useMemo(() => {
        return (
            <React.Fragment>
                {/* <CurrencyInfo wallet={wallet} /> */}
                <div className="wallet-deposit-body">
                    <div className="d-flex justify-content-between mb-24 content-container">
                        <div className="w-50">
                            <h1 className="white-text text-ms font-extrabold mb-16">Deposit Payment</h1>
                            <p className="font-sm grey-text-accent mb-24">
                                Please don't deposit any other digital assets except {currency.toUpperCase()} to the
                                address below. Otherwise, you may lose your assets permanently.
                            </p>
                            <div className="d-flex align-items-start select-container mb-24">
                                <p className="text-ms font-extrabold white-text">Coin Base</p>
                                <div className="w-75">
                                    <Select
                                        value={optionCurrency.filter(function (option) {
                                            return option.value === currency;
                                        })}
                                        styles={CustomStylesSelect}
                                        options={optionCurrency}
                                    />
                                    <p className="m-0 text-sm grey-text">Min Deposit : {minDepositAmount}</p>
                                </div>
                            </div>

                            <div className="d-flex mt-3 mb-24">
                                <div className="mr-64">
                                    <p className="mb-2 text-xs white-text">Expected Arrival</p>
                                    <p className="mb-2 text-sm white-text font-bold">Expected Arrival</p>
                                </div>
                                <div>
                                    <p className="mb-2 text-xs white-text">Minimum Deposit</p>
                                    <p className="mb-2 text-sm white-text font-bold">
                                        {minDepositAmount} {currency.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <ul className="pl-2">
                                <li className="white-text text-sm mb-8">
                                    Send only {currency.toUpperCase()} to this deposit address.
                                </li>
                                <li className="white-text text-sm mb-8">
                                    Ensure the network is BNB Smart Chain (BEP20).
                                </li>
                                <li className="white-text text-sm mb-8">Do not send NFTs to this address.</li>
                            </ul>

                            {/* {depositAddress && (
                                <DepositCrypto
                                    buttonLabel={buttonLabel}
                                    copiableTextFieldText={`${wallet.currency.toUpperCase()} ${label}`}
                                    copyButtonText={intl.formatMessage({
                                        id: 'page.body.wallets.tabs.deposit.ccy.message.button',
                                    })}
                                    error={error}
                                    handleGenerateAddress={() => handleGenerateAddress}
                                    handleOnCopy={handleOnCopy}
                                    text={text}
                                    wallet={wallet}
                                    network={blockchainKey}
                                    minDepositAmount={minDepositAmount}
                                />
                            )} */}
                        </div>

                        <div className="network-container w-50">
                            <h1 className="white-text text-ms font-extrabold mb-16">{address && 'Select Network :'}</h1>
                            {!addressDeposit ? (
                                <button
                                    onClick={() => handleGenerateAddress}
                                    className="w-100 btn-primary"
                                    type="button">
                                    Generate Address
                                </button>
                            ) : (
                                <div className="navbar position-relative navbar-expand-lg mb-24">
                                    <div className="collapse navbar-collapse">
                                        <ul className="navbar-nav">
                                            {networks.map((network) => (
                                                <li
                                                    className={`nav-item ${
                                                        blockchainNetwork === network.protocol ? 'active' : ''
                                                    }`}
                                                    key={network.blockchain_key}
                                                    onClick={() => setBlockchainNetwork(network.protocol)}>
                                                    <div className="nav-link">{network.protocol}</div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {address && (
                                <React.Fragment>
                                    <h3 className="white-text text-sm font-bold">Address</h3>
                                    <input
                                        id="address"
                                        className="text-ms blue-text font-extrabold mb-24 address"
                                        defaultValue={address}
                                    />
                                    <div className="d-flex">
                                        <button
                                            className="btn-primary mr-12"
                                            type="button"
                                            disabled={!address}
                                            onClick={() => doCopy('address')}>
                                            Copy Address
                                        </button>
                                        <button
                                            type="button"
                                            disabled={!address}
                                            className="btn-primary"
                                            onClick={handleShow}>
                                            Show Barcode
                                        </button>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    </div>

                    <div className="table-container">
                        <h1 className="mb-24 text-lg white-text">Recent Deposit</h1>
                        <Table header={getTableHeaders()} data={getTableData(dataTable)} />
                    </div>

                    <Modal show={show} onHide={handleClose} centered>
                        <Modal.Body>
                            <div className="text-center">
                                <QRCode dimensions={255} data={address} />
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="border-none d-flex flex-column justify-content-center align-items-center">
                            <input
                                id="address-modal"
                                className="text-ms blue-text text-center font-extrabold mb-24 address"
                                defaultValue={address}
                            />
                            <button className="btn-primary mr-12" type="button" onClick={() => doCopy('address-modal')}>
                                Copy Address
                            </button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </React.Fragment>
        );
    }, [
        currency,
        currencies,
        optionCurrency,
        CustomStylesSelect,
        minDepositAmount,
        depositAddress,
        addressDeposit,
        setAddressDeposit,
        networks,
        setNetworks,
        handleGenerateAddress,
        currencyItem,
        blockchainNetwork,
        blockchain,
        blockchainKey,
        setBlockchainNetwork,
        block,
        setBlock,
        doCopy,
        handleClose,
        handleShow,
        getTableData,
        getTableHeaders,
        walletsAddressFetch,
        wallet,
    ]);

    return renderDeposit;
};

// const WalletDepositBody = React.memo(WalletDepositBodyComponent);

export { WalletDepositBody };
