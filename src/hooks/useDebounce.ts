import { useRef, useState, useEffect } from "react";

// This is a cooldown hook that executes the callback immediately,
// then prevents additional executions for the specified delay period
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useCooldown = (callback: (...args: any[]) => void, delay: number) => {
    const [isCoolingDown, setIsCoolingDown] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...args: any[]) => {
        if (isCoolingDown) {
            return; // Don't execute during cooldown period
        }

        // Execute immediately
        callback(...args);

        // Set cooldown
        setIsCoolingDown(true);

        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Reset cooldown after delay
        timeoutRef.current = setTimeout(() => {
            setIsCoolingDown(false);
        }, delay);
    };
};

// Value-based debounce hook that returns a debounced value
export const useDebounce = <T>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
};
