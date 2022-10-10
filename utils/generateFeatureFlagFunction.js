
function generateFeatureFlagFunction(flag) {
    return async function featureFlagToggle(req, res, next) {
        if(flag) {
            return next()
        } else {
            res.status(400).json({message: "Not found."})
        }
    }
}


export default generateFeatureFlagFunction