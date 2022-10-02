import dayjs from "dayjs"
import _ from "lodash"

// Backend function to store lob into the db
export async function storeLog(db, {
    domain = "domain-not-set",
    action = "",
    value = "",
    session_id = "",
    category = "",
    ts = new Date()
}) {

    var _ts = ts

    if(_.isString(_ts)) {
        _ts = dayjs(_ts).toDate()
    }
    if (! _ts instanceof Date) {
        console.log("ts not correct date.")
        console.log(_ts)
        console.log("setting current date")
        _ts = new Date()
    }
    var insertResult = await db.collection("frontend_interaction_log").insertOne({
        domain: domain,
        action: action,
        value: value,
        session_id: session_id,
        category: category,
        ts: _ts
    })
    
    return insertResult
}

// Fontend function to send log to api route
export async function logEvent({
    domain = "domain-not-set",
    action = "",
    value = "",
    sessionId = "no-id-set",
    category = "",
    ts = new Date()
}) {
    var _domain = domain
    if (_domain === "domain-not-set") {
        var windowLocation = _.get(window, "location.href", 'no-window-location')
        _domain = windowLocation

    }

    var url = `/api/log_event`

    var data = {
        domain: _domain,
        action: action,
        value: value,
        session_id: sessionId,
        category: category,
        ts: ts
    }
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return response
}