import classnames from 'classnames';
import React, { FC, ReactElement, useCallback } from 'react';

export interface CodeVerificationProps {
    placeholder: string;
    type: string;
    codeLength: number;
    code: string;
    inputMode?: 'text' | 'none' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
    onChange: (value: string) => void;
    onSubmit?: (e: any) => void; // tslint:disable-line
    showPaste2FA?: boolean;
    isMobile?: boolean;
    className?: string;
}

const CodeVerification: FC<CodeVerificationProps> = (props: CodeVerificationProps): ReactElement => {
    const { code, codeLength, inputMode, isMobile, onSubmit, placeholder, showPaste2FA, type, className } = props;

    const onCodeChange = (e) => {
        if (e.target.value.length <= codeLength && (e.target.value.match(/^[0-9\b]+$/) || e.target.value === '')) {
            props.onChange(e.target.value);
        }
    };

    const paste2FA = async () => {
        const text = await navigator.clipboard?.readText();
        let inputList = '';

        for (const char of text) {
            inputList += char.toString();
            if (inputList.length <= codeLength && (!inputList || inputList.match(/^[0-9\b]+$/))) {
                props.onChange(inputList);
            }
        }
    };

    return (
        <div className="custom-input mb-8">
            <input
                className={className}
                autoFocus={true}
                type={type}
                value={code}
                inputMode={inputMode}
                onChange={onCodeChange}
                onKeyPress={onSubmit}
                placeholder={placeholder}
            />
            {/* {showPaste2FA && (
                <div className="cursor-pointer grey-text text-sm mt-1" onClick={() => paste2FA()}>
                    Paste 2FA
                </div>
            )} */}
        </div>
    );
};

export { CodeVerification };
