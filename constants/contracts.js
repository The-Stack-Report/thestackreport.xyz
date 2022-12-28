require('dotenv').config()

var tokenContractAddress = process.env.BETA_ACCESS_TOKEN_CONTRACT
// if (_.startsWith(tokenContractAddress, "KT")) {
//     tokenContractAddress = tokenContractAddress
// } else {
//     tokenContractAddress = "***"
// }
// console.log(tokenContractAddress)
export const BETA_ACCESS_TOKEN_CONTRACT = tokenContractAddress
