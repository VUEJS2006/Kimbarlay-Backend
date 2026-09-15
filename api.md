# This file is just for instruction of using api

## 1. Oversea Hotels table

Run this SQL once before using the oversea hotel routes. The `country_id`
column references the existing `countrys` table.

```sql
CREATE TABLE IF NOT EXISTS oversea_hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(3, 1) DEFAULT NULL,
    color VARCHAR(50) DEFAULT NULL,
    tags JSON DEFAULT NULL,
    description TEXT DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (country_id) REFERENCES countrys(id) ON DELETE CASCADE
);
```

### Oversea hotel routes

- `POST /api/admin/oversea/hotel/create`
- `GET /api/admin/oversea/hotel/list`
- `PUT /api/admin/oversea/hotel/update/:id`
- `DELETE /api/admin/oversea/hotel/delete/:id`
- `GET /api/mobile/oversea/hotel/list`

## API URL

- This is the domain of express server.
- Use this at the start of each route

```text
https://api.magwaysh1.website
```

## 1. SQL code of creating `transform table` in database

- This code is just for creating `transform` table in database
- This does not need for frontend user

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
  "translation_key": "create_hotel_button",
  "en": "Create Hotel",
  "zh": "Chinese lang for Create Hotel"
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

## 2. SQL code of creating `Promotion Hotels` in database

- This code is just for creating `promotion_hotels` table in database

```sql
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
  "township_id": 2,
  "promotions": [
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
```

### PUT /api/admin/promotion/hotels/create

- Use this route for change promotion domestic hotels for each township

#### Payload

```json
{
  "township_id": 1,
  "promotions": [
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
```

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

# Airfare

## 3. SQL code of creating `airport` in database

- This sql is just only to know what fields are exit in tables
- `Not require` to use for frontend 

```sql
CREATE TABLE airports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    type ENUM('domestic', 'international') NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) DEFAULT NULL,
    country VARCHAR(100) DEFAULT NULL,
    note TEXT DEFAULT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### GET /api/airports

#### Success Responds

```json
{
    "success": true,
    "total": 4,
    "data": [
        {
            "id": 5,
            "code": "CCC",
            "type": "international",
            "name": "sss",
            "city": null,
            "country": null,
            "note": null,
            "image_url": "http://localhost:5000/images/airport/35e353fe-ba31-45a1-a570-421888f9ce6e.webp",
            "created_at": "2026-09-14T12:27:50.000Z",
            "updated_at": "2026-09-14T12:27:50.000Z"
        },
        {
            "id": 4,
            "code": "CCC",
            "type": "international",
            "name": "sss",
            "city": null,
            "country": null,
            "note": null,
            "image_url": "http://localhost:5000/images/airport/69f4a0c8-be6a-415a-acdf-8b1a8baa07c0.webp",
            "created_at": "2026-09-14T12:25:34.000Z",
            "updated_at": "2026-09-14T12:25:34.000Z"
        },
        {
            "id": 3,
            "code": "CCC",
            "type": "international",
            "name": "sss",
            "city": null,
            "country": null,
            "note": null,
            "image_url": "http://localhost:5000/images/airport/b12dd186-8d2a-4a14-ba9c-f52b041ed4b5.webp",
            "created_at": "2026-09-14T12:17:40.000Z",
            "updated_at": "2026-09-14T12:17:40.000Z"
        }
    ]
}
```

### POST /api/admin/airport/create

#### Request Body

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `code` | string | Yes | IATA code of Airport |
| `type` | enum | Yes | 'domestic' , 'international' |
| `name` | string | Yes | Airport name |
| `city` | string | NO | City of Airport |
| `country` | string | NO | country of Airport |
| `note` | string | NO | Short note of Airport |
| `image` | file | No | Image file to upload |

#### Example

```js
const formData = new FormData();

formData.append("code", "RGN");
formData.append("type", "domestic");
formData.append("name", "domestic");
formData.append("image", imageFile);

fetch("domain/api/admin/airport/create", {
  method: "POST",
  body: formData
});
```

#### Success response

```json
{
    "success": true,
    "message": "Airport created successfully",
    "data": {
        "id": 6,
        "code": "CCC",
        "type": "international",
        "name": "sss",
        "city": null,
        "country": null,
        "note": null,
        "image_url": "https://api.magwaysh1.website/images/airport/24de4112-594e-4c35-b846-72b0acb6c13b.webp",
        "created_at": "2026-09-14T13:14:47.000Z",
        "updated_at": "2026-09-14T13:14:47.000Z"
    }
}
```

#### Error Response

```json
{
    "success": false,
    "message": "code and name must exit ,and type must be domestic or international!"
}
```

### PUT /api/admin/airport/update

#### Request Body

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | Yes | id of Airport generated by backend |
| `code` | string | Yes | IATA code of Airport |
| `type` | enum | Yes | 'domestic' , 'international' |
| `name` | string | Yes | Airport name |
| `city` | string | NO | City of Airport |
| `country` | string | NO | country of Airport |
| `note` | string | NO | Short note of Airport |
| `image` | file | No | Image file to upload |

#### Example

```js
const formData = new FormData();

formData.append("id", 2);
formData.append("code", "RGN");
formData.append("type", "domestic");
formData.append("name", "domestic");
formData.append("image", imageFile);

fetch("domain/api/admin/airport/create", {
  method: "POST",
  body: formData
});
```

#### Success response

```json
{
    "success": true,
    "message": "Airport updated successfully",
    "data": {
        "id": 2,
        "code": "CCC",
        "type": "international",
        "name": "sss",
        "city": null,
        "country": null,
        "note": null,
        "image_url": "https://api.magwaysh1.website/images/airport/4f9ca38c-7155-4bc6-9110-cc414293286b.webp",
        "created_at": "2026-09-14T12:01:30.000Z",
        "updated_at": "2026-09-14T13:21:20.000Z"
    }
}
```

#### Error Response

```json
{
    "success": false,
    "message": "id, code and name must exit ,and type must be domestic or international!"
}
```

- If it is `Wrong id`

```json
{
    "success": false,
    "message": "Airport not found."
}
```

### DELETE /api/admin/airport/delete/:id

- `:id` is the `id of the airport` to delete
- It will also delete `related Routes` and `Flights created under those Routes`.

```text
/api/admin/airport/delete/32
/api/admin/airport/delete/12
.
.
```

#### Success Response

```json
{
    "success": true,
    "message": "Airport , related routes and related flights are deleted successfully"
}
```

#### Error Response

```json
{
    "success": false,
    "message": "Airport not found."
}
```

```json
{
    "success": false,
    "message": "Airport ID is required."
}
```

## 4. SQL code of creating `airlines` in database

- This sql is just only to know what fields are exit in tables
- `Not require` to use for frontend 

```sql
CREATE TABLE airlines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,                 
    name VARCHAR(255) NOT NULL,              
    country VARCHAR(100) DEFAULT NULL,         
    type ENUM('domestic', 'international') NOT NULL DEFAULT 'domestic', 
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',   
    brand_color VARCHAR(10) DEFAULT NULL,    
    logo_url VARCHAR(255) DEFAULT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


### GET /api/airlines

#### Success Responds

```json
{
    "success": true,
    "total": 3,
    "data": [
        {
            "id": 5,
            "code": "TG2",
            "name": "Taung Gyi Airline2",
            "country": null,
            "type": "international",
            "status": "active",
            "brand_color": null,
            "logo_url": "http://localhost:5000/images/airline/dfaf7e51-c8af-4af2-b6c9-73e8a8fb2f28.webp",
            "created_at": "2026-09-14T15:29:28.000Z",
            "updated_at": "2026-09-14T15:29:28.000Z"
        },
        {
            "id": 4,
            "code": "TG1",
            "name": "Taung Gyi Airline1",
            "country": null,
            "type": "international",
            "status": "active",
            "brand_color": null,
            "logo_url": "http://localhost:5000/images/airline/90358ead-60a3-4f89-ba06-ba31ebb19285.webp",
            "created_at": "2026-09-14T15:29:17.000Z",
            "updated_at": "2026-09-14T15:30:16.000Z"
        },
        {
            "id": 3,
            "code": "TG",
            "name": "Taung Gyi Airline",
            "country": null,
            "type": "international",
            "status": "active",
            "brand_color": null,
            "logo_url": "http://localhost:5000/images/airline/71b831f0-fae2-431c-803d-0cece8d50bec.webp",
            "created_at": "2026-09-14T15:29:14.000Z",
            "updated_at": "2026-09-14T15:29:14.000Z"
        }
    ]
}
```

### POST /api/admin/airline/create

#### Request Body

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `code` | string | Yes | Airline code |
| `name` | string | Yes | Airline name |
| `type` | enum | Yes | `domestic`, `international` |
| `status` | enum | Yes | `active`, `inactive` |
| `country` | string | No | Country of the airline |
| `brand_color` | string | No | Brand color of the airline |
| `logo` | file | No | Airline logo to upload |

#### Example

```js
const formData = new FormData();

formData.append("code", "UB");
formData.append("name", "Myanmar National Airlines");
formData.append("country", "Myanmar");
formData.append("type", "domestic");
formData.append("status", "active");
formData.append("brand_color", "#E63946");
formData.append("logo", logoFile);

fetch("domain/api/admin/airline/create", {
  method: "POST",
  body: formData
});
```

#### Success response

```json
{
    "success": true,
    "message": "Airline created successfully",
    "data": {
        "id": 1,
        "code": "CCC",
        "name": "sss",
        "country": null,
        "type": "international",
        "status": "active",
        "brand_color": null,
        "logo_url": null,
        "created_at": "2026-09-14T14:40:39.000Z",
        "updated_at": "2026-09-14T14:40:39.000Z"
    }
}
```

#### Error Response

```json
{
    "success": false,
    "message": "code and name must exit. type must be 'domestic' or 'international' and status must be 'active', 'inactive'!"
}
```

### PUT /api/admin/airline/update


#### Request Body

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | Yes | id of Airport generated by backend |
| `code` | string | Yes | Airline code |
| `name` | string | Yes | Airline name |
| `type` | enum | Yes | `domestic`, `international` |
| `status` | enum | Yes | `active`, `inactive` |
| `country` | string | No | Country of the airline |
| `brand_color` | string | No | Brand color of the airline |
| `logo` | file | No | Airline logo to upload |

#### Example

```js
const formData = new FormData();

formData.append("id", 2);
formData.append("code", "UB");
formData.append("name", "Myanmar National Airlines");
formData.append("country", "Myanmar");
formData.append("type", "domestic");
formData.append("status", "active");
formData.append("brand_color", "#E63946");
formData.append("logo", logoFile);

fetch("domain/api/admin/airline/create", {
  method: "POST",
  body: formData
});
```

#### Success Response 

```json
{
    "success": true,
    "message": "Airline updated successfully",
    "data": {
        "id": 1,
        "code": "TG",
        "name": "Taung Gyi Airline",
        "country": null,
        "type": "international",
        "status": "active",
        "brand_color": null,
        "logo_url": "http://localhost:5000/images/airline/d01a599b-a853-4126-bc6e-1c1e7d0eb18a.webp",
        "created_at": "2026-09-14T14:40:39.000Z",
        "updated_at": "2026-09-14T15:09:32.000Z"
    }
}
```

#### Error Response

```json
{
    "success": false,
    "message": "id, code and name must exit. type must be 'domestic' or 'international' and status must be 'active', 'inactive'!"
}`
```

```json
{
    "success": false,
    "message": "Airline not found."
}
```

### DELETE /api/admin/airline/delete/:id

- `:id` is the `id of the airline` to delete
- It will also delete `related Flights`.

```text
/api/admin/airline/delete/32
/api/admin/airline/delete/12
.
.
```

#### Success Response

```json
{
    "success": true,
    "message": "Airline and related Flights are deleted successfully"
}
```

#### Error Response

```json
{
    "success": false,
    "message": "Airline not found."
}
```

```json
{
    "success": false,
    "message": "Airline ID is required."
}
```

## 5. SQL code of creating `routes` in database

- This sql is just only to know what fields are exit in tables
- `Not require` to use for frontend 

```sql
CREATE TABLE routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_airport_id INT NOT NULL,
    to_airport_id INT NOT NULL,
    duration VARCHAR(50) DEFAULT NULL,
    stops INT NOT NULL DEFAULT 0,
    route_type ENUM('domestic', 'international') NOT NULL DEFAULT 'domestic',
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (from_airport_id) REFERENCES airports(id) ON DELETE CASCADE,
    FOREIGN KEY (to_airport_id) REFERENCES airports(id) ON DELETE CASCADE
);
```

### GET /api/routes

- No payload

### Success Response 

```json
{
    "success": true,
    "total": 2,
    "data": [
        {
            "id": 2,
            "from_airport_id": 3,
            "to_airport_id": 4,
            "duration": "1h 30m",
            "stops": 0,
            "route_type": "international",
            "is_popular": 1,
            "created_at": "2026-09-15T12:35:35.000Z",
            "updated_at": "2026-09-15T12:35:35.000Z"
        },
        {
            "id": 1,
            "from_airport_id": 3,
            "to_airport_id": 4,
            "duration": "1h 30m",
            "stops": 0,
            "route_type": "international",
            "is_popular": 1,
            "created_at": "2026-09-15T12:35:06.000Z",
            "updated_at": "2026-09-15T12:35:06.000Z"
        }
    ]
}
```

### POST /api/admin/route/create

- use this route for creating each `route`


#### Payload

```json
{
  "from_airport_id": 3,
  "to_airport_id": 5,
  "duration": "2h 30m",
  "stops": 3,
  "route_type": "international",
  "is_popular": true
}
```

#### Success Response

```json
{
    "success": true,
    "message": "Route created successfully",
    "data": {
        "id": 3,
        "from_airport_id": 3,
        "to_airport_id": 5,
        "duration": "2h 30m",
        "stops": 3,
        "route_type": "international",
        "is_popular": 1,
        "created_at": "2026-09-15T12:47:56.000Z",
        "updated_at": "2026-09-15T12:47:56.000Z"
    }
}
```

#### Error Response

```json
{
    "success": false,
    "message": "'from_airport_id' and 'to_airport_id' must exit. 'route_type' must be 'domestic' or 'international'!"
}
```

```json
{
    "success": false,
    "message": "One or both selected airports do not exist in the database."
}
```

```json
{
    "success": false,
    "message": "Departure and destination airports cannot be the same."
}
```

### PUT /api/admin/route/update

#### Payload

```json
{
  "id" : 3,
  "from_airport_id": 3,
  "to_airport_id": 4,
  "duration": "2h 00m",
  "stops": 1,
  "route_type": "international",
  "is_popular": false
}
```

#### Success Response

```json
{
    "success": true,
    "message": "Route updated successfully",
    "data": {
        "id": 3,
        "from_airport_id": 3,
        "to_airport_id": 4,
        "duration": "2h 00m",
        "stops": 1,
        "route_type": "international",
        "is_popular": 0,
        "created_at": "2026-09-15T12:47:56.000Z",
        "updated_at": "2026-09-15T13:02:37.000Z"
    }
}
```

#### Error Response

```json
{
    "success": false,
    "message": "'id' , 'from_airport_id' and 'to_airport_id' must exit. 'route_type' must be 'domestic' or 'international'!"
}
```

```json
{
    "success": false,
    "message": "Route not found."
}
```

```json
{
    "success": false,
    "message": "One or both selected airports do not exist in the database."
}
```

```json
{
    "success": false,
    "message": "Departure and destination airports cannot be the same."
}
```

### DELETE /api/admin/route/delete/:id

- `:id` is the `id of the route` to delete
- It will also delete `related Flights`.

```text
/api/admin/route/delete/2
/api/admin/route/delete/3
.
.
```

#### Success Response

```json
{
    "success": true,
    "message": "Route and related flights are deleted successfully"
}
```

#### Error Response

```json
{
    "success": false,
    "message": "Route not found."
}
```

```json
{
    "success": false,
    "message": "Route ID is required."
}
```

## SQL code of creating `flights` in database

- This sql is just only to know what fields are exit in tables
- `Not require` to use for frontend 

```sql
CREATE TABLE flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    airline_id INT NOT NULL,
    departure_time TIME DEFAULT NULL, 
    arrival_time TIME DEFAULT NULL,   
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    duration VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
    FOREIGN KEY (airline_id) REFERENCES airlines(id) ON DELETE CASCADE
);
```

### GET /api/admin/flights

- This route is just for `admin` to get all flights only ( not user search ) 
- No payload

### Success Response 

```json
{
    "success": true,
    "total": 3,
    "data": [
        {
            "id": 3,
            "route_id": 1,
            "airline_id": 4,
            "departure_time": "00:30:00",
            "arrival_time": "11:55:00",
            "price": "23.00",
            "duration": "1h 25m",
            "created_at": "2026-09-15T13:58:40.000Z",
            "updated_at": "2026-09-15T13:58:40.000Z"
        },
        {
            "id": 2,
            "route_id": 1,
            "airline_id": 5,
            "departure_time": "00:30:00",
            "arrival_time": "11:55:00",
            "price": "23.00",
            "duration": "1h 25m",
            "created_at": "2026-09-15T13:53:37.000Z",
            "updated_at": "2026-09-15T13:53:37.000Z"
        },
        {
            "id": 1,
            "route_id": 1,
            "airline_id": 5,
            "departure_time": "08:30:00",
            "arrival_time": "10:55:00",
            "price": "150.00",
            "duration": "2h 25m",
            "created_at": "2026-09-15T13:43:37.000Z",
            "updated_at": "2026-09-15T13:43:37.000Z"
        }
    ]
}
```


### POST /api/admin/flight/create

- use this route for creating each `flight`

#### Payload 

```json
{
  "route_id": 1,
  "airline_id": 5,
  "departure_time": "08:30:00",
  "arrival_time": "10:55:00",
  "price": 150.00,
  "duration": "2h 25m"
}
```

#### Success Response

- `departure_time` and `arrival_time` must be in `08:30:00` format

```json
{
    "success": true,
    "message": "Flight created successfully",
    "data": {
        "id": 1,
        "route_id": 1,
        "airline_id": 5,
        "departure_time": "08:30:00",
        "arrival_time": "10:55:00",
        "price": "150.00",
        "duration": "2h 25m",
        "created_at": "2026-09-15T13:43:37.000Z",
        "updated_at": "2026-09-15T13:43:37.000Z"
    }
}
```

#### Error Response

```json
{
    "success": false,
    "message": "'route_id' and 'airline_id' must exit!"
}
```

```json
{
    "success": false,
    "message": "Route with ID 60 does not exist in database."
}
```

```json
{
    "success": false,
    "message": "Airline with ID 15 does not exist in database."
}
```

```json
{
    "success": false,
    "message": "Incorrect time value: '08:30:00a' for column 'departure_time' at row 1"
}
```

### POST /api/admin/flight/create

- use this route for creating each `flight`


#### Payload 

```json
{
  "id" : 1,
  "route_id": 1,
  "airline_id": 5,
  "departure_time": "00:30:00",
  "arrival_time": "11:55:00",
  "price": 23.00,
  "duration": "1h 25m"
}
```

#### Success Response

- `departure_time` and `arrival_time` must be in `08:30:00` format

```json
{
    "success": true,
    "message": "Flight created successfully",
    "data": {
        "id": 2,
        "route_id": 1,
        "airline_id": 5,
        "departure_time": "00:30:00",
        "arrival_time": "11:55:00",
        "price": "23.00",
        "duration": "1h 25m",
        "created_at": "2026-09-15T13:53:37.000Z",
        "updated_at": "2026-09-15T13:53:37.000Z"
    }
}
```

#### Error Response

```json
{
    "success": false,
    "message": "'id' , 'route_id' and 'airline_id' must exit!"
}
```

```json
{
    "success": false,
    "message": "Flight with ID 11 does not exist in database."
}
```

```json
{
    "success": false,
    "message": "Route with ID 60 does not exist in database."
}
```

```json
{
    "success": false,
    "message": "Airline with ID 15 does not exist in database."
}
```

```json
{
    "success": false,
    "message": "Incorrect time value: '08:30:00a' for column 'departure_time' at row 1"
}
```

### DELETE /api/admin/flight/delete/:id

- `:id` is the `id of the flight` to delete

```text
/api/admin/flight/delete/2
/api/admin/flight/delete/3
.
.
```

#### Success Response

```json
{
    "success": true,
    "message": "Flight is deleted successfully"
}
```

#### Error Response

```json
{
    "success": false,
    "message": "Flight ID is required."
}
```

```json
{
    "success": false,
    "message": "Flight with ID 43 does not exist in database."
}
```