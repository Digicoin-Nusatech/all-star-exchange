// import { useRef, useEffect } from 'react';

// export const useClickOutside = (ref: React.RefObject<HTMLElement> , handler: () => void) {

//     useEffect(() => {
//         const listener = (event:MouseEvent) => {
//             if(!ref.current || ref.current.contains(event.target as Node)) {
//                 return
//             }
//             handler();
//         }
//         document.addEventListener('click', listener);

//         return () => {
//             document.addEventListener('click', listener)
//         }
//     })

// }
