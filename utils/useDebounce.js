import { useState, useEffect } from "react"

function useDebounce(value, delay) {
    const [deboundedValue, setDebouncedValue] = useState(value)

    useEffect(
        () => {
            const handler = setTimeout(() => {
                setDebouncedValue(value)
            }, delay)

            return () => {
                clearTimeout(handler)
            }
        },
        [value, delay]
    )

    return deboundedValue
}

export default useDebounce