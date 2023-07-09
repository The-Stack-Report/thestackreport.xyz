import { dataset as dataset_schema } from "schemas/dataset.schema.js"
import { connectToDatabase } from 'utils/mongo_db'
import _ from "lodash"
import * as d3 from "d3"

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

    async load_file() {

        var fileUrl = this.url

        if (!_.isString(fileUrl)) {
            return false
        }

        var fileType = _.toLower(fileUrl.split('.').pop())
        console.log(fileType)

        var data = false
        // CSV loader
        if (fileType == "csv") {
            const response = await fetch(fileUrl)
            const text = await response.text()
            // Parse CSV text
            data = d3.csvParse(text)
        }
        

        // JSON loader

        return data
    }
}

export default Dataset