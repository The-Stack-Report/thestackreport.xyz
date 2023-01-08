import React, { useState, useEffect } from 'react';

function useChartNotes(props) {
    const [notes, setNotes] = useState([]);
    console.log("use chart notes hook")

    var chartId = props.chartId
    useEffect(() => {
        setNotes(props.notes);
    }, [props.notes]);
    
    return { notes };
}

export default useChartNotes