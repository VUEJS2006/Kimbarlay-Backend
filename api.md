# This file is just for instruction of using api

## 1. SQL code of creating transform table in database

- This code is just for creating `transform` table in database
 
```text
CREATE TABLE IF NOT EXISTS translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  translation_key VARCHAR(100) NOT NULL UNIQUE,
  en TEXT DEFAULT NULL,
  zh TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### GET /api/translations/all

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


## 2. SQL code of creating Promotion Hotels in database

- This code is just for creating `promotion_hotels` table in database
 
```text
CREATE TABLE IF NOT EXISTS promotion_hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    township_id INT NOT NULL,
    hotel_id INT NOT NULL,
    priority TINYINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (township_id) REFERENCES townships(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES domestic_hotels(id) ON DELETE CASCADE,
    
    CONSTRAINT chk_priority_1_to_3 CHECK (priority IN (1, 2, 3)),
    
    UNIQUE KEY unique_township_priority (township_id, priority)
);
```

### POST /api/admin/promotion/hotels/create

- Use this route for set promotion domestic hotels for each township

#### Payload

```json
{
    "township_id" : 2,
    "promotions" : [
        { "priority": 1, "hotel_id": 3 },
        { "priority": 2, "hotel_id": 1 },
        { "priority": 3, "hotel_id": 2 }
    ]
}
```

#### Success Response 

```json
{
    "success": true,
    "message": "Successfully updated promotion hotels for Bagan.",
    "data": {
        "township_id": 1,
        "township_name": "Bagan",
        "temperature": "28°C - 28°C",
        "promotions": [
            {
                "id": 1,
                "hotel_id": 3,
                "priority": 1,
                "created_at": "2026-09-07T12:35:27.000Z"
            },
            {
                "id": 2,
                "hotel_id": 1,
                "priority": 2,
                "created_at": "2026-09-07T12:35:27.000Z"
            },
            {
                "id": 3,
                "hotel_id": 2,
                "priority": 3,
                "created_at": "2026-09-07T12:35:27.000Z"
            }
        ]
    }
}
```

#### Error Response

- If the township_id does not exit and promotions do not have three items

```json
{
    "success": false,
    "message": "You must provide exactly 3 hotels for Priority 1, 2 and 3. And township_id must exit."
}
```

- If the township_id does not exit in database

```json
{
    "success": false,
    "message": "Your township does not exit in database"
}
```

- If the promotion_hotels are already exit in database

```json
{
    "success": false,
    "message": "Promotion hotels already exist for this township. Please use the update route to modify."
}
```

- If One or more selected hotels are invalid or do not belong to this township

```json
{
    "success": false,
    "message": "One or more selected hotels are invalid or do not belong to this township."
}

