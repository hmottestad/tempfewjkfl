class Example{

static example = [
    {
        "@id": "http://example.org/agent/difi",
        "@type": [
            "http://xmlns.com/foaf/0.1/Agent"
        ],
        "http://xmlns.com/foaf/0.1/name": [
            {
                "@value": "DIFI"
            }
        ]
    },
    {
        "@id": "http://example.org/catalog/1",
        "@type": [
            "http://www.w3.org/ns/dcat#Catalog"
        ],
        "http://purl.org/dc/terms/description": [
            {
                "@value": "Example catalog"
            }
        ],
        "http://purl.org/dc/terms/publisher": [
            {
                "@id": "http://example.org/agent/difi"
            }
        ],
        "http://purl.org/dc/terms/title": [
            {
                "@id": "Title for Example Catalog"
            }
        ],
        "http://www.w3.org/ns/dcat#dataset": [
            {
                "@id": "http://example.org/dataset/1"
            }
        ]
    },
    {
        "@id": "http://example.org/concept/open-data",
        "@type": [
            "http://www.w3.org/2004/02/skos/core#Concept"
        ],
        "http://www.w3.org/2004/02/skos/core#prefLabel": [
            {
                "@value": "Open data"
            }
        ]
    },
    {
        "@id": "http://example.org/dataset/1",
        "@type": [
            "http://www.w3.org/ns/dcat#Dataset"
        ],
        "http://purl.org/dc/terms/description": [
            {
                "@value": "Lots of open data"
            }
        ],
        "http://purl.org/dc/terms/identifier": [
            {
                "@value": "dcat-ap-no-example-dataset-1"
            }
        ],
        "http://purl.org/dc/terms/publisher": [
            {
                "@id": "http://example.org/agent/difi"
            }
        ],
        "http://purl.org/dc/terms/title": [
            {
                "@value": "Example Open Data"
            }
        ],
        "http://www.w3.org/ns/dcat#theme": [
            {
                "@id": "http://example.org/concept/open-data"
            }
        ]
    }
]

}

export default Example;