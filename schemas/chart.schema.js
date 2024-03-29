export const chart = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://resources.thestackreport.xyz/schemas/chart.schema.json",
    "title": "Chart",
    "description": "A chart",
    "type": "object",
    "properties": {
        "chartId": {
            "description": "The chart ID",
            "type": "string"
        },
        "type": {
            "description": "The chart type",
            "type": "string"
        },
        "title": {
            "description": "The chart title",
            "type": "string"
        },
        "description": {
            "description": "The chart description",
            "type": "string"
        },
        "dataset": {
            "description": "The chart dataset",
            "$ref": "https://resources.thestackreport.xyz/schemas/dataset.schema.json"
        }
    }
}
