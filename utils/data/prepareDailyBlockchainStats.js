import _ from "lodash"
import dayjs from "dayjs"

var numberColumns = [
'unique_wallet_senders',
'unique_targets_by_wallets',
'gasByWallets',
'bakerFeeByWallets',
'storageUsedByWallets',
'unique_senders',
'unique_targets',
'gasUsed',
'bakerFee',
'storageUsed',
'daily_called_smart_contract_KT',
'daily_called_delegator_contract_KT',
'daily_called_asset_KT',
]

var dateColumns = [
    "date"
]

function prepareDailyBlockchainStats(dataRaw) {
    return dataRaw.map((p, i, a) => {
        dateColumns.forEach(c => {
            p[c] = dayjs(p[c])
        })
        numberColumns.forEach(c => {
            p[c] = _.toNumber(p[c])
        })
        return p
    })
}

export default prepareDailyBlockchainStats