import { useRef, useEffect } from 'react';

// export const useClickOutside = (isOpen: boolean , onClose: () => void) {
//     const ref = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const handleCLickOutside = (e: MouseEvent) => {
//             if(ref.current && !ref.current.contains(e.target as Node)) {
//                 onClose()
//             }
//         }

//         if (isOpen) {
//             document.addEventListener('click', handleCLickOutside);
//           } else {
//             document.removeEventListener('click', handleCLickOutside);
//           }
//       return () => {
//         document.removeEventListener('click', handleCLickOutside)
//       };
//     }

//     )

// }
