import '@openware/cryptofont';
import classnames from 'classnames';
import * as React from 'react';
import { Button, InputGroup } from 'react-bootstrap';
import { CustomInput } from '../../desktop/components';
import { copy } from '../../helpers';
import { CopyButton } from '../../assets/images/CopyButton';

export interface CopyableTextFieldProps {
    /**
     * Text value that will be copied to the clipboard
     */
    value: string;
    /**
     * Additional class name for styling. By default element receives `cr-button` class
     * @default empty
     */
    className?: string;
    /**
     * String value that makes copy field be unique
     */
    fieldId: string;
    /**
     * @default 'Copy'
     *  Renders text of the label of copy button component
     */
    copyButtonText?: string;
    /**
     * @default 'false'
     * If true, Button will be disabled.
     */
    disabled?: boolean;
    label?: string;
    classNameInput?: string;
}

/**
 * Text field component with ability to copy inner text.
 */
class CopyableTextField extends React.Component<CopyableTextFieldProps> {
    public componentDidMount() {
        if (!this.props.fieldId) {
            throw new Error('CopyableTextField must contain `fieldId` prop');
        }
    }

    public render() {
        const { value, className, classNameInput, disabled, fieldId, copyButtonText, label } = this.props;
        const doCopy = () => copy(fieldId);
        const cx = classnames('input-copy-wrapper', className);

        return (
            <div className={cx}>
                <CustomInput
                    id={String(fieldId)}
                    readOnly={true}
                    inputValue={value}
                    handleClick={doCopy}
                    type="text"
                    isDisabled={disabled}
                    label={label || ''}
                    defaultLabel={label || ''}
                    placeholder={label || ''}
                    classNameInput={`` + classNameInput}
                />
                {/* <InputGroup.Append className="col-2">
                        <Button onClick={doCopy} disabled={disabled} size="sm" variant="white">
                            <CopyButton className="copy-icon" />
                        </Button>
                    </InputGroup.Append> */}

                <div onClick={doCopy} className="input-group-append border-0  mr-2">
                    <span className="input-group-text" id="basic-addon2">
                        <CopyButton className="copy-icon" />
                    </span>
                </div>
                {/* <div onClick={doCopy} className="input-group">
                    <input
                        type="text"
                        disabled={disabled}
                        className="form-control"
                        readOnly={true}
                        onClick={doCopy}
                        value={value}
                    />
                </div> */}
            </div>
        );
    }
}

export { CopyableTextField, copy };
