# This file is just for instruction of using api

## SQL code of creating transform table in database

- This code is just for creating transform table in database
 
```text
CREATE TABLE IF NOT EXISTS translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  translation_key VARCHAR(100) NOT NULL UNIQUE,
  en TEXT DEFAULT NULL,
  zh TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### GET /api/admin/translations

- Use this route for getting all translations when the page is started or refreshed

#### Response 

```json
{
    "success": true,
    "data": {
        "header_name": {
            "en": "Kimberley Header",
            "zh": "Kimberley Chinese Meaning"
        },
        "create_hotel_button": {
            "en": "Create Hotel",
            "zh": "Chinese lang for Create Hotel"
        },
        "log_out_button": {
            "en": "Log Out",
            "zh": "Chinese lang for Log Out"
        }
    },
    "message": "Get all Translations successfully!"
}
```

### POST /api/admin/translations/change

- Use this route for update each language or create if does not exit in database

#### Payload

```json
{
    "translation_key" : "create_hotel_button" , 
    "en" : "Create Hotel" ,
    "zh" : "Chinese lang for Create Hotel"
}
```

#### Success Response 

```json
{
    "success": true,
    "data": {
        "create_hotel_button": {
            "en": "Create Hotel",
            "zh": "Chinese lang for Create Hotel"
        }
    },
    "message": "Tanslation Chaning is successfully done."
}
```

#### Error Response

- If one of the following is broken.
- `translation_key` must not be underfined or empty string "".
- One of `en` and `zh` can be empty string "". But not both at the same payload!
- `en` and `zh` cannot be underfined.

```json
{
    "success": false,
    "message": "Tanslation_key must not empty and both en and zh should not be underfined !"
}
```