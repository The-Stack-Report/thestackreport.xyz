import { dataset as dataset_schema } from "schemas/dataset.schema.js"
import _ from "lodash"

class Dataset {
    constructor(params) {
        var schema_props = dataset_schema.properties
        // Schema props to keyPair array
        var schema_props_keys = Object.keys(schema_props)
        schema_props_keys.forEach((key) => {
            this[key] = _.get(params, key, false)
        })
        this.schema = dataset_schema
        this.schema_keys = schema_props_keys
        if(_.keys(params).length === 1 && _.has(params, "identifier")) {
            this.from_identifier(params.identifier)
        }
    }

    from_identifier(identifier) {
        console.log("Constructing dataset from identifier", identifier)
        this.identifier = identifier
    }

    to_list() {
        return this.schema_keys.map(key => {
            return {
                key: key,
                value: this[key]
            }
        }).filter(p => p.value !== false)
    }

    to_table(direction="horizontal") {
        if(direction == "horizontal") {
            var cols = this.schema_keys.map(key => {
                return {
                    key: key,
                    title: key,
                    type: "text"
                }
            })
            var data = {}
            this.schema_keys.forEach(key => {
                data[key] = this[key]
            })
            return {
                columns: cols,
                data: [data]
            }
        }

        if (direction == "vertical") {
            var cols = [
                {
                    key: "property",
                    title: "property",
                    type: "text"
                },
                {
                    key: "value",
                    title: "value",
                    type: "text"
                }
            ]

            var data = this.schema_keys.map(key => {
                return {
                    property: key,
                    value: this[key]
                }
            })

            return {
                columns: cols,
                data: data
            }
        }
        
        
    }
}

export default Dataset