import {useRef} from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};
