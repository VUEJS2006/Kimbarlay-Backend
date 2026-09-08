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
### GET /api/promotion/hotels/each/:township_id

- `:township_id` is replaced by id of the township which is related to the Promotion_hotels you want to get.

```text
example of for township_id 1

/api/promotion/hotels/each/1
```

#### Success Response

- If promotion hotels exit for that township_id

```json
{
    "success": true,
    "data": {
        "township_id": 1,
        "township_name": "Bagan",
        "temperature": "34°C - 34°C",
        "promotions": [
            {
                "id": 4,
                "township_id": 1,
                "hotel_id": 3,
                "priority": 1,
                "hotel_name": "Bagan Lodge",
                "price": "95.00",
                "rating": "4.5"
            },
            {
                "id": 5,
                "township_id": 1,
                "hotel_id": 1,
                "priority": 2,
                "hotel_name": "Aureum Palace Hotel",
                "price": "120.00",
                "rating": "4.8"
            },
            {
                "id": 6,
                "township_id": 1,
                "hotel_id": 2,
                "priority": 3,
                "hotel_name": "Heritage Bagan Hotel",
                "price": "85.00",
                "rating": "4.6"
            }
        ]
    }
}
```

- If no promotion hotels exit
- Status : 200

```json
{
    "township_id": 2,
    "message": "No promotion hotels found for this township.",
    "promotions": []
}
```

#### Error Response 

```json
{
    "success": false,
    "message": "Township does not exist in the database."
}
```

```json
{
    "success": false,
    "message": "Township ID is required."
}
```

### GET /api/promotion/hotels/all

- This route will get all the promotion_hotels

```json
{
    "success": true,
    "data": [
        {
            "township_id": 1,
            "township_name": "Bagan",
            "temperature": "34°C - 34°C",
            "promotions": [
                {
                    "id": 4,
                    "township_id": 1,
                    "hotel_id": 3,
                    "priority": 1,
                    "hotel_name": "Bagan Lodge",
                    "price": "95.00",
                    "rating": "4.5"
                },
                {
                    "id": 5,
                    "township_id": 1,
                    "hotel_id": 1,
                    "priority": 2,
                    "hotel_name": "Aureum Palace Hotel",
                    "price": "120.00",
                    "rating": "4.8"
                },
                {
                    "id": 6,
                    "township_id": 1,
                    "hotel_id": 2,
                    "priority": 3,
                    "hotel_name": "Heritage Bagan Hotel",
                    "price": "85.00",
                    "rating": "4.6"
                }
            ]
        },
        {
            "township_id": 2,
            "township_name": "MDY",
            "temperature": "34°C - 34°C",
            "promotions": [
                {
                    "id": 7,
                    "township_id": 2,
                    "hotel_id": 4,
                    "priority": 1,
                    "hotel_name": "Aureum Palace Hotel",
                    "price": "120.00",
                    "rating": "4.8"
                },
                {
                    "id": 8,
                    "township_id": 2,
                    "hotel_id": 5,
                    "priority": 2,
                    "hotel_name": "Heritage Bagan Hotel",
                    "price": "85.00",
                    "rating": "4.6"
                },
                {
                    "id": 9,
                    "township_id": 2,
                    "hotel_id": 6,
                    "priority": 3,
                    "hotel_name": "Bagan Lodge",
                    "price": "95.00",
                    "rating": "4.5"
                }
            ]
        }
    ]
}
```

- If there is no township

```json
{
    "success": true,
    "data": []
}
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

- If the township_id does not exit and promotions do not have three items and priorities are not 1 , 2 , 3

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


### PUT /api/admin/promotion/hotels/create

- Use this route for change promotion domestic hotels for each township

#### Payload

```json
{
    "township_id" : 1,
    "promotions" : [
        { "priority": 1, "hotel_id": 2 },
        { "priority": 2, "hotel_id": 3 },
        { "priority": 3, "hotel_id": 1 }
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
        "temperature": "34°C - 34°C",
        "promotions": [
            {
                "id": 1,
                "hotel_id": 2,
                "priority": 1
            },
            {
                "id": 2,
                "hotel_id": 3,
                "priority": 2
            },
            {
                "id": 3,
                "hotel_id": 1,
                "priority": 3
            }
        ]
    }
}
```

#### Error Response

- If the township_id does not exit and promotions do not have three items and priorities are not 1 , 2 , 3

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

- If One or more selected hotels are invalid or do not belong to this township

```json
{
    "success": false,
    "message": "One or more selected hotels are invalid or do not belong to this township."
}

- If the township does not have 3 existing promotion hotels to update

```json
{
    "success": false,
    "message": "This township does not have 3 existing promotion hotels to update. Please create them first."
}
```

### DELETE /api/admin/promotion/hotels/delete/:township_id

- `:township_id` is replaced by id of the township which is related to the Promotion_hotels you want to delete.

```text
example of for township_id 5

/api/admin/promotion/hotels/delete/5
```

#### Success Response

```json
{
    "success": true,
    "message": "Successfully deleted all promotion hotels for Bagan.",
    "deleted_count": 3
}
```

#### Error Response 

```json
{
    "success": false,
    "message": "Township does not exist in the database."
}
```

```json
{
    "success": false,
    "message": "Township ID is required."
}
```

