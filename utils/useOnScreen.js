import { useState, useEffect } from "react"

export default function useOnScreen(ref, IntersectionObserver) {
    const [isIntersecting, setIntersecting] = useState(false)
    var observer = false
    if(IntersectionObserver) {
        const observer = new IntersectionObserver(
            ([entry]) => setIntersecting(entry.isIntersecting)
        )
        console.log(observer)
    }
    
  
    useEffect(() => {
        if(observer) {
            observer.observe(ref.current)
            // Remove the observer as soon as the component is unmounted
            return () => { observer.disconnect() }
        }
    }, [])
  
    return isIntersecting
}