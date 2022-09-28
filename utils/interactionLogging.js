
export async function storeLog(db, {
    domain = "domain-not-set",
    action = "",
    value = "",
    ts = new Date()
}) {
    var insertResult = await db.collection("frontend_interaction_log").insertOne({
        domain: domain,
        action: action,
        value: value,
        ts: ts
    })
    
    return insertResult
}