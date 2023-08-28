import { dataset as dataset_schema } from "schemas/dataset.schema.js"
import { connectToDatabase } from 'utils/mongo_db'
import _ from "lodash"
import * as d3 from "d3"

var cachedDatasetFiles = {}

class Dataset {
    constructor(params) {
        var schema_props = dataset_schema.properties
        // Schema props to keyPair array
        var schema_props_keys = Object.keys(schema_props)
        schema_props_keys.forEach((key) => {
            this[key] = false
        })
    }

    async from_identifier(identifier) {
        const { db } = await connectToDatabase()
        const collection = db.collection('datasets');
        const data = await collection.findOne({ identifier: identifier });
        if (data) {
            var schema_props = dataset_schema.properties
            // Schema props to keyPair array
            var schema_props_keys = Object.keys(schema_props)
            schema_props_keys.forEach((key) => {
                this[key] = data[key]
            })
        }
    }

    to_json() {
        var schema_props = dataset_schema.properties
        // Schema props to keyPair array
        var schema_props_keys = Object.keys(schema_props)
        var json = {}
        schema_props_keys.forEach((key) => {
            json[key] = this[key]
        })
        return JSON.parse(JSON.stringify(json))
    }

    async load_file(prep_function=false, overrideCache=true) {

        

        var fileUrl = this.url

        if (overrideCache) {
            _.set(cachedDatasetFiles, fileUrl, false)
        }

        if (!_.isString(fileUrl)) {
            return false
        }

        var fileType = _.toLower(fileUrl.split('.').pop())

        var data = false

        var cachedFileData = _.get(cachedDatasetFiles, fileUrl, false)
        if(cachedFileData !== false) {
            var cachedTimestamp = _.get(cachedFileData, "timestamp", 0)
            var now = new Date().getTime()
            var timeDiff = now - cachedTimestamp
            if(timeDiff < 1000 * 60 * 60 * 24) {
                console.log(`Loading cached file data with time diff from previous fetch: ${timeDiff} - `, fileUrl)
                data = _.get(cachedFileData, "data", false)
            }
        } else {
            // CSV loader
            if (fileType == "csv") {
                const response = await fetch(fileUrl)
                const text = await response.text()
                // Parse CSV text
                data = d3.csvParse(text)
            }
            

            // JSON loader

            if(fileType == "json") {
                const response = await fetch(fileUrl)
                data = await response.json()
            }


            if(_.isFunction(prep_function)) {
                data = prep_function(data)
            }
            console.log("Storing cached file data: ", fileUrl)
            _.set(cachedDatasetFiles, fileUrl, {
                timestamp: new Date().getTime(),
                data: data
            })
        }

        return data
    }
}

export default Dataset