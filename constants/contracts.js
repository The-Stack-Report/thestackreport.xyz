require('dotenv').config()

var tokenContractAddress = process.env.INTERPRETATION_LAYER_CONTRACT
// if (_.startsWith(tokenContractAddress, "KT")) {
//     tokenContractAddress = tokenContractAddress
// } else {
//     tokenContractAddress = "***"
// }
// console.log(tokenContractAddress)
export const INTERPRETATION_LAYER_CONTRACT = tokenContractAddress
