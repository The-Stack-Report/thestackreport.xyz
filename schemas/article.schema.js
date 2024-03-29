export const article = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://resources.thestackreport.xyz/schemas/article.schema.json",
    "title": "Article",
    "description": "Written document for online publication",
    "type": "object",
    "properties": {
        "articleId": {
            "description": "Unique identifier for the article",
            "type": "string",
            "format": "uuid"
        },
        "title": {
            "description": "Title of the article",
            "type": "string"
        },
        "author": {
            "description": "Author of the article",
            "type": "string"
        },
        "content": {
            "description": "Content of the article",
            "type": "string"
        },
        "charts": {
            "description": "Charts associated with the article",
            "type": "array",
            "items": {
                "$ref": "https://resources.thestackreport.xyz/schemas/chart.schema.json"
            },
            "uniqueItems": true,
            "minItems": 1
        },
        "tags": {
            "description": "Tags associated with the article",
            "type": "array",
            "items": {
                "type": "string"
            },
            "uniqueItems": true,
            "minItems": 1
        },
        "published": {
            "description": "Date and time the article was published",
            "type": "string",
            "format": "date-time"
        }
    },
    "required": ["articleId", "title", "author", "content", "published"]
}
