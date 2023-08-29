import { useState, useEffect } from "react"

function useDebounce(value, delay) {
    const [deboundedValue, setDebouncedValue] = useState(value)

    useEffect(
        () => {
            if(delay === 0) {
                setDebouncedValue(value)
            } else {
                const handler = setTimeout(() => {
                    setDebouncedValue(value)
                }, delay)
                return () => {
                    clearTimeout(handler)
                }
            }
        },
        [value, delay]
    )
    if (delay === 0) {
        return value
    }
    return deboundedValue
}

export default useDebounce