import * as React from 'react';
import { Alert } from 'react-bootstrap';
import FadeIn from 'react-fade-in';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { IntlProps } from '../../';
import { alertDelete, alertDeleteByIndex, AlertState, RootState, selectAlertState } from '../../modules';

interface ReduxProps {
    alerts: AlertState;
}

interface DispatchProps {
    alertDelete: typeof alertDelete;
    alertDeleteByIndex: typeof alertDeleteByIndex;
}

type Props = ReduxProps & DispatchProps & IntlProps;

class AlertComponent extends React.Component<Props> {
    public deleteAlertByIndex = (key: number) => {
        this.props.alertDeleteByIndex(key);
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };

    public render() {
        return (
            <div className="alert-component">
                {this.props.alerts.alerts.map((w) =>
                    w.message.map((msg, index) => (
                        <div className="alert-wrapper">
                            <FadeIn key={index}>
                                <div onClick={() => this.deleteAlertByIndex(index)}>
                                    <Alert variant={w.type === 'error' ? 'danger' : w.type}>
                                        {this.translate(msg)}
                                    </Alert>
                                </div>
                            </FadeIn>
                        </div>
                    ))
                )}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    alerts: selectAlertState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => ({
    alertDelete: () => dispatch(alertDelete()),
    alertDeleteByIndex: (payload) => dispatch(alertDeleteByIndex(payload)),
});

export const Alerts = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(AlertComponent)
) as React.FunctionComponent;
