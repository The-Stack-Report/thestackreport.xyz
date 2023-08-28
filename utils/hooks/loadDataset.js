import React, { useEffect, useState } from "react"
import _ from "lodash"
import Dataset from "models/Dataset"

// State possibilities
// [dataset,            datafile]
// [dataset error,      data unidentified] # without metadata, data can not be located
// [dataset successful, data error]
// [dataset successful, data successful]

function loadDataset(params, parser = (f) => f) {
    const [dataset, setDataset] = useState(false)
    const [attemptedDatasetLoad, setAttemptedDatasetLoad] = useState(false)
    const [errorDatasetLoad, setErrorDatasetLoad] = useState(false)

    const [data, setData] = useState(false)
    const [attemptedDataLoad, setAttemptedDataLoad] = useState(false)
    const [errorDataLoad, setErrorDataLoad] = useState(false)
    
    var identifier = params
    var shouldLoad = true
    if(_.isObject(params)) {
        identifier = params.identifier
        shouldLoad = _.get(params, "shouldLoad", true)
    }

    useEffect(() => {
        if(attemptedDatasetLoad === false && shouldLoad === true) {
            setAttemptedDatasetLoad(true)
            fetch(`/api/dataset?identifier=${identifier}`)
                .then(resp => {
                    return resp.json()
                })
                .then(data => {
                    var _dataset = new Dataset(data)
                    setDataset(_dataset)
                })
                .catch(err => {
                    console.log(err)
                    setErrorDatasetLoad(true)
                })
        }
        
    }, [identifier, dataset, attemptedDatasetLoad])

    useEffect(() => {
        if(attemptedDataLoad === false && _.has(dataset, "url") && shouldLoad === true) {
            setAttemptedDataLoad(true)
            fetch(dataset.url)
                .then(resp => resp.text())
                .then(rawText => {
                    var parsedData = parser(rawText)
                    setData(parsedData)
                })
                .catch(err => {
                    console.log("error loading datafile")
                    console.log(err)
                })
        }
    }, [attemptedDataLoad, dataset])

    var loading = true
    var loadingError = false

    if(_.isObject(dataset)) {
        loading = false
    }
    

    return {
        loading: loading,
        loadingError: loadingError,
        dataset: dataset,
        data: data,
        resetDataLoad: () => {
            setDataset(false)
            setAttemptedDatasetLoad(false)
            setErrorDatasetLoad(false)
            setData(false)
            setAttemptedDataLoad(false)
            setErrorDataLoad(false)
        }
    }
}

export default loadDataset