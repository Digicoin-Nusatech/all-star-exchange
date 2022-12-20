import * as React from 'react';

interface ArrowUpRightProps {
    className?: string;
}

export const ArrowUpRight: React.FC<ArrowUpRightProps> = (props: ArrowUpRightProps) => {
    return (
        <svg
            className={props.className}
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect opacity="0.05" x="7" y="7" width="34" height="34" rx="17" fill="white" />
            <path
                d="M21.5459 16.0839L30.7383 16.7911M30.7383 16.7911L31.4454 25.9834M30.7383 16.7911L17.2616 30.2677"
                stroke="#019A97"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    );
};
