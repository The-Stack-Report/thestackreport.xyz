import React, { useMemo } from "react"
import dayjs from "dayjs"
import _ from "lodash"

function usePreparedData({ data, xValTransform }) {
    const _data = useMemo(() => {
        return data.map(p => {
            return {
                ...p,
                date: xValTransform(dayjs(_.get(p, "date", false)))
            }
        })
    }, [data, xValTransform])
    return _data
}

export default usePreparedData