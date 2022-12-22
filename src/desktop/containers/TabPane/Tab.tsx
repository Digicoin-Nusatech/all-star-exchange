import React, { FC, ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

interface TabTitleProps {
    title: string;
    index: number;
    setSelectedTab: (index: number) => void;
    isActive?: boolean;
}

interface TabPaneProps {
    title: string;
    children: ReactElement | ReactElement[];
}

interface TabProps {
    children: ReactElement<TabTitleProps>[];
    preSelectedTabIndex?: number;
}

export function TabPane({ children }: TabPaneProps) {
    return <div>{children}</div>;
}

export function TabTitle(props: TabTitleProps) {
    const { title, index, setSelectedTab, isActive } = props;

    const handleClick = React.useCallback(() => {
        setSelectedTab(index);
    }, [setSelectedTab, index]);

    return (
        <>
            <div className={`nav-tab ${isActive ? 'active' : ''} `} onClick={handleClick}>
                {title}
            </div>
        </>
    );
}

export default function Tab(props: TabProps): JSX.Element {
    const { children, preSelectedTabIndex } = props;

    const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(preSelectedTabIndex || 0);

    return (
        <div className="tab tab-pane">
            <div className="bg-white shadow-sm">
                <div className="container">
                    <div className="row d-flex align-items-center">
                        <div className="col-10">
                            <div className="menu-settings">
                                {children.map((item, index) => (
                                    <TabTitle
                                        key={item.props.title}
                                        title={item.props.title}
                                        index={index}
                                        isActive={index === selectedTabIndex}
                                        setSelectedTab={setSelectedTabIndex}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="col-2">
                            <Link to={`/history-transaction`}>History Transaction</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-0">{children[selectedTabIndex]}</div>
        </div>
    );
}
