export const dataset = {
    "#schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://resources.thestackreport.xyz/schemas/dataset.schema.json",
    "title": "Dataset",
    "description": "File which contains some values. Follows Dublin core metadata standard.",
    "type": "object",
    "properties": {
        "identifier": {
            "description": "The unique identifier for a dataset",
            "type": "string"
        },
        "title": {
            "description": "The name of the dataset",
            "type": "string"
        },
        "description": {
            "description": "A description of the dataset",
            "type": "string"
        },
        "subject": {
            "description": "The subject of the dataset",
            "type": "string"
        },
        "coverage": {
            "description": "The coverage of the dataset",
            "type": "string"
        },
        "source": {
            "description": "The source of the dataset",
            "type": "string"
        },
        "creator": {
            "description": "The creator of the dataset",
            "type": "string"
        },
        "publisher": {
            "description": "The publisher of the dataset",
            "type": "string"
        },
        "date": {
            "description": "The date the dataset was created",
            "type": "string",
            "format": "date"
        },
        "format": {
            "description": "The format of the dataset",
            "type": "string"
        },
        "type": {
            "description": "The type of the dataset",
            "type": "string"
        },
        "contributor": {
            "description": "The contributor of the dataset",
            "type": "string"
        },
        "language": {
            "description": "The language of the dataset",
            "type": "string"
        },
        "relation": {
            "description": "The relation of the dataset",
            "type": "string"
        },
        "rights": {
            "description": "The rights of the dataset",
            "type": "string"
        },
        "license": {
            "description": "The license of the dataset",
            "type": "string"
        },
        "url": {
            "description": "The url of the dataset",
            "type": "string"
        }
    },
    "required": [
        "identifier",
        "title",
        "description",
        "subject",
        "coverage",
        "source",
        "creator",
        "publisher",
        "date",
        "format",
        "type",
        "url"
    ]
}
