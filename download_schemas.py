import requests

print("Download schemas script")

schemas = [
    "article",
    "chart",
    "dataset"
]


for schema in schemas:
    print("Downloading schema: " + schema)
    url = f"https://raw.githubusercontent.com/The-Stack-Report/tsr-resource-descriptions/main/resources/{schema}.schema.json"
    
    # Load url to dict
    response = requests.get(url)
    text = response.text

    # Add to js file
    schema_js_file = f"export const {schema} = {text}\n"
    with open(f"./schemas/{schema}.schema.js", "w") as f:
        f.write(schema_js_file)
        f.close()

    # Write to file
    with open(f"./schemas/{schema}.schema.json", "w") as f:
        f.write(text)
        f.close()

    print("Downloaded schema: " + schema)
