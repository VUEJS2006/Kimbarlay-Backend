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

## Local packages and tour locals

Run this SQL once to add the relationship to the existing `local_packages`
table. Existing packages keep a `NULL` `local_id`; create requests must provide
a valid `local_id`. Deleting a tour local sets its packages' `local_id` to
`NULL` rather than deleting the packages.

```sql
ALTER TABLE local_packages
    ADD COLUMN local_id INT NULL,
    ADD CONSTRAINT fk_local_packages_tourlocals
        FOREIGN KEY (local_id) REFERENCES tourlocals(id)
        ON DELETE SET NULL;
```

Local package list responses include `local_id`, plus the related tour local's
`name` and `image`.

## Domestic packages and tour domestics

Run this SQL once to add the relationship to the existing `domestic_packages`
table. Existing packages keep a `NULL` `domestic_id`; create requests must
provide a valid `domestic_id`. Deleting a tour domestic sets its packages'
`domestic_id` to `NULL` rather than deleting the packages.

```sql
ALTER TABLE domestic_packages
    ADD COLUMN domestic_id INT NULL,
    ADD CONSTRAINT fk_domestic_packages_tourdomestics
        FOREIGN KEY (domestic_id) REFERENCES tourdomestics(id)
        ON DELETE SET NULL;
```

Domestic package list responses include `domestic_id`, plus the related tour
domestic's `name` and `image`.

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

fetch("domain/api/admin/airport/update", {
  method: "PUT",
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

fetch("domain/api/admin/airline/update", {
  method: "PUT",
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

## 6. SQL code of creating `flights` in database

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
    adult_price DECIMAL(10, 2) DEFAULT NULL,
    child_price DECIMAL(10, 2) DEFAULT NULL,
    infant_price DECIMAL(10, 2) DEFAULT NULL,
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
    "total": 4,
    "data": [
        {
            "id": 5,
            "route_id": 1,
            "airline_id": 3,
            "departure_time": "08:30:00",
            "arrival_time": "10:55:00",
            "price": "11.00",
            "adult_price": "12.00",
            "child_price": "1202.00",
            "infant_price": "303.00",
            "duration": "1h 25m",
            "created_at": "2026-09-26T00:10:45.000Z",
            "updated_at": "2026-09-26T00:14:13.000Z"
        },
        {
            "id": 3,
            "route_id": 2,
            "airline_id": 4,
            "departure_time": "00:30:00",
            "arrival_time": "11:55:00",
            "price": "23.00",
            "adult_price": null,
            "child_price": null,
            "infant_price": null,
            "duration": "1h 25m",
            "created_at": "2026-09-15T13:58:40.000Z",
            "updated_at": "2026-09-17T12:41:29.000Z"
        },
        {
            "id": 2,
            "route_id": 1,
            "airline_id": 5,
            "departure_time": "00:30:00",
            "arrival_time": "11:55:00",
            "price": "23.00",
            "adult_price": null,
            "child_price": null,
            "infant_price": null,
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
            "adult_price": null,
            "child_price": null,
            "infant_price": null,
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
  "airline_id": 3,
  "departure_time": "08:30:00",
  "arrival_time": "10:55:00",
  "price": 150.00,
  "adult_price": 150.00,
  "child_price": 120.00,
  "infant_price": 30.00,
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
        "id": 5,
        "route_id": 1,
        "airline_id": 3,
        "departure_time": "08:30:00",
        "arrival_time": "10:55:00",
        "price": "150.00",
        "adult_price": "150.00",
        "child_price": "120.00",
        "infant_price": "30.00",
        "duration": "2h 25m",
        "created_at": "2026-09-26T00:10:45.000Z",
        "updated_at": "2026-09-26T00:10:45.000Z"
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

### POST /api/admin/flight/update

- use this route for udpating each `flight`


#### Payload 

```json
{
  "id": 5,
  "route_id": 1,
  "airline_id": 3,
  "departure_time": "08:30:00",
  "arrival_time": "10:55:00",
  "price": 1501.00,
  "adult_price": 1502.00,
  "child_price": 1202.00,
  "infant_price": 303.00,
  "duration": "1h 25m"
}
```

#### Success Response

- `departure_time` and `arrival_time` must be in `08:30:00` format

```json
{
    "success": true,
    "message": "Flight updated successfully",
    "data": {
        "id": 5,
        "route_id": 1,
        "airline_id": 3,
        "departure_time": "08:30:00",
        "arrival_time": "10:55:00",
        "price": "1501.00",
        "adult_price": "1502.00",
        "child_price": "1202.00",
        "infant_price": "303.00",
        "duration": "1h 25m",
        "created_at": "2026-09-26T00:10:45.000Z",
        "updated_at": "2026-09-26T00:13:10.000Z"
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
z
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

### GET /api/flights/search 

- This route is for searching flights from somewhere to somewhere.

```text
/api/flights/search?from=yangon&to=Manda&date=2026-11-15&class=Economy&passengers=2
```

##### Success response 

```json
{
    "success": true,
    "data": {
        "from": "yangon",
        "to": "Manda",
        "class": "Economy",
        "date": "2026-11-15",
        "passengers": "2",
        "flights": [
            {
                "from_airport_id": 3,
                "from_airport_name": "Yangon International AirPort",
                "from_airport_code": "YGN",
                "from_airport_city": "Yangon",
                "from_airport_country": "Myanmar",
                "to_airport_id": 4,
                "to_airport_name": "Mandalay Internal AirPort",
                "to_airport_code": "MDY",
                "to_airport_city": "Mandalay",
                "to_airport_country": "Myanamar",
                "route_id": 1,
                "stops": 0,
                "route_type": "international",
                "flight_id": 2,
                "departure_time": "00:30:00",
                "arrival_time": "11:55:00",
                "price": "23.00",
                "adult_price": null,
                "child_price": null,
                "infant_price": null,
                "flight_duration": "1h 25m",
                "airline_id": 5,
                "airline_name": "Taung Gyi Airline2",
                "airline_code": "TG2",
                "airline_logo": "http://localhost:5000/images/airline/dfaf7e51-c8af-4af2-b6c9-73e8a8fb2f28.webp",
                "airline_brand_color": null,
                "airline_status": "active"
            },
            {
                "from_airport_id": 3,
                "from_airport_name": "Yangon International AirPort",
                "from_airport_code": "YGN",
                "from_airport_city": "Yangon",
                "from_airport_country": "Myanmar",
                "to_airport_id": 4,
                "to_airport_name": "Mandalay Internal AirPort",
                "to_airport_code": "MDY",
                "to_airport_city": "Mandalay",
                "to_airport_country": "Myanamar",
                "route_id": 1,
                "stops": 0,
                "route_type": "international",
                "flight_id": 5,
                "departure_time": "08:30:00",
                "arrival_time": "10:55:00",
                "price": "11.00",
                "adult_price": "12.00",
                "child_price": "1202.00",
                "infant_price": "303.00",
                "flight_duration": "1h 25m",
                "airline_id": 3,
                "airline_name": "Taung Gyi Airline",
                "airline_code": "TG",
                "airline_logo": "http://localhost:5000/images/airline/71b831f0-fae2-431c-803d-0cece8d50bec.webp",
                "airline_brand_color": null,
                "airline_status": "active"
            }
        ]
    }
}
```

#### Error Response

- If you didn't add the `from` data in the route

```json
{
    "success": false,
    "message": "There must be a least one letter for the departure airport name."
}
```

## 7. SQL code of creating `banners` in database

- This sql is just only to know what fields are exit in tables
- `Not require` to use for frontend 

```sql
CREATE TABLE IF NOT EXISTS banners (
    id INT PRIMARY KEY DEFAULT 1,
    title VARCHAR(255) NOT NULL,
    subtitle1 VARCHAR(255),
    subtitle2 VARCHAR(255),
    image_url TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 7.1 airfair

### GET /api/promo/banner

- Call this route, to get the banner like when the app start
- No payload

#### Success Response

```json
{
    "success": true,
    "data": {
        "id": 1,
        "title": "Test Title Name",
        "subtitle1": "subtitle1 Name",
        "subtitle2": "subtitle2 Name",
        "image_url": "http://localhost:5000/images/banner/a15077f6-e289-4cbd-b568-d49df465dd70.webp",
        "updated_at": "2026-09-19T11:40:52.000Z"
    }
}
```

### PUT /api/promo/banner

#### Request Body

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

- One of `image` or `image_url` must exit. 

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | The main title of the banner |
| `subtitle1` | string | No | The first subtitle of the banner |
| `subtitle1` | string | No | The second subtitle of the banner |
| `image` | file | Yes | Image file to upload |
| `image_url` | string | Yes | The image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("title", "Test Title Name");
formData.append("subtitle1", "subtitle1 Name");
formData.append("subtitle1", "subtitle2 Name");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://cdn.kimberley.com/new-banner.jpg");


fetch("domain/api/promo/banner", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "success": true,
    "message": "Banner is successfully updated.",
    "data": {
        "id": 1,
        "title": "Test Title Name",
        "subtitle1": "subtitle1 Name",
        "subtitle2": "subtitle2 Name",
        "image_url": "http://localhost:5000/images/banner/71350e77-61b7-435f-b862-7a76e090494a.webp",
        "updated_at": "2026-09-19T11:50:49.000Z"
    }
}
```

#### Error Response

```json
{
    "success": false,
    "message": "title and image must exit."
}
```

## 7.2 Oversea Banner

### GET /api/oversea/banner

- Call this route, to get the banner like when the app start
- No payload

#### Success Response

```json
{
    "success": true,
    "data": {
        "title": "Hotel.",
        "subtitle": null,
        "image_url": "http://localhost:5000/images/oversea_banner/ddb58d16-c775-4c3e-8729-4127e34e2299.webp",
        "updated_at": "2026-10-15T11:11:41.000Z"
    }
}
```

### PUT /api/oversea/banner

#### Request Body

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

- One of `image` or `image_url` must exit. 

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | The main title of the banner |
| `subtitle` | string | No | The first subtitle of the banner |
| `image` | file | Yes | Image file to upload |
| `image_url` | string | Yes | The image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("title", "Hotel.");
formData.append("subtitle", "subtitle"); // optional

formData.append("image", imageFile);
//or
formData.append("image_url", "https://cdn.kimberley.com/new-banner.jpg");


fetch("domain/api/oversea/banner", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "success": true,
    "message": "Oversea hotel banner is successfully updated.",
    "data": {
        "title": "Hotel.",
        "subtitle": null,
        "image_url": "http://localhost:5000/images/oversea_banner/ddb58d16-c775-4c3e-8729-4127e34e2299.webp",
        "updated_at": "2026-10-15T11:11:41.000Z"
    }
}
```

#### Error Response

```json
{
    "success": false,
    "message": "title and image must exit."
}
```


## 8. SQL code of creating `express_report_categories` in database

- This sql is just only to know what fields are exit in tables
- `Not require` to use for frontend 

```sql
CREATE TABLE express_report_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    color VARCHAR(20) DEFAULT '#22BCB0',
    icon_url TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### GET /api/promo/categories

- No payload required

#### Success Response

```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "title": "Updated Title for category",
            "color": "#22BCB0",
            "icon_url": null,
            "created_at": "2026-09-20T01:30:34.000Z",
            "updated_at": "2026-09-20T01:51:14.000Z"
        },
        {
            "id": 3,
            "title": "Updated Title for category",
            "color": "#22BCB0",
            "icon_url": "http://localhost:5000/images/airfair_category/58bc7c2e-c676-454f-8c56-0261d301e138.webp",
            "created_at": "2026-09-20T02:45:07.000Z",
            "updated_at": "2026-09-20T02:45:07.000Z"
        }
    ]
}
```

### POST /api/promo/category/create

#### Request Body

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | Yes | The main title of the category |
| `color` | string | No | The color code of the banner |
| `icon` | file | No | Image file to upload |
| `icon_url` | string | No | The image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("title", "Food Ranking");
formData.append("color", "#22BCB0");

formData.append("icon", imageFile);
//or
formData.append("icon_url", "https://cdn.kimberley.com/new-banner.jpg");


fetch("domain/api/promo/category/create", {
  method: "POST",
  body: formData
});
```

#### Success Response

```json
{
    "success": true,
    "message": "New Category is successfully created.",
    "data": {
        "id": 2,
        "title": "Food Ranking",
        "color": "#22BCB0",
        "icon_url": "http://localhost:5000/images/airfair_category/4c07e96a-b04d-406c-90f8-cd85a8ab1720.webp",
        "created_at": "2026-09-20T01:31:38.000Z",
        "updated_at": "2026-09-20T01:31:38.000Z"
    }
}
```

### Error Response

```json
{
    "success": false,
    "message": "Cannot destructure property 'title' of 'req.body' as it is undefined."
}
```

```json
{
    "success": false,
    "message": "Title is required"
}
```

### PUT /api/promo/category/update

#### Request Body

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | Yes | id of category generated by backend |
| `title` | string | Yes | The main title of the category |
| `color` | string | No | The color code of the banner |
| `icon` | file | No | Image file to upload |
| `icon_url` | string | No | The image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("id", 2);
formData.append("title", "Food Ranking");
formData.append("color", "#22BCB0");

formData.append("icon", imageFile);
//or
formData.append("icon_url", "https://cdn.kimberley.com/new-banner.jpg");


fetch("domain/api/promo/category/update", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "success": true,
    "message": "Category is successfully updated.",
    "data": {
        "id": 2,
        "title": "Updated Title for category",
        "color": "#22BCB0",
        "icon_url": null,
        "created_at": "2026-09-20T01:31:38.000Z",
        "updated_at": "2026-09-20T02:03:51.000Z"
    }
}
```

#### Error Response

```json
{
    "success": false,
    "message": "Id and Title are required"
}
```

```json
{
    "success": false,
    "message": "Cannot destructure property 'id' of 'req.body' as it is undefined."
}
```

### DELETE /api/promo/category/delete/:id

- `:id` is the `id of the category` to delete
- It will also delete the items related to that category

```text
/api/promo/category/delete/2
/api/promo/category/delete/3
.
.
```

#### Success Response

```json
{
    "success": true,
    "message": "Category is successfully deleted."
}
```

## 9. SQL code of creating `express_report_items` in database

```sql
CREATE TABLE express_report_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    image_url TEXT NULL,
    `from` VARCHAR(255) NOT NULL,
    `to` VARCHAR(255) NOT NULL,
    price VARCHAR(100) NULL,
    `date` VARCHAR(100) NULL,
    discount VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES express_report_categories(id) ON DELETE CASCADE
);
```

### GET /api/promo/category/items

- No payload requried

#### Success response

```json
{
    "success": true,
    "data": [
        {
            "id": 2,
            "category_id": 3,
            "image_url": "http://localhost:5000/images/airfair_category_items/ec46f4ca-aaea-4019-901b-0dd86feefb05.webp",
            "from": "Yangon",
            "to": "Ngapali Beach",
            "price": "¥ 450",
            "date": "Friday, December 5, 2025",
            "discount": "0.8 discount",
            "created_at": "2026-09-20T04:08:45.000Z",
            "updated_at": "2026-09-20T04:08:45.000Z"
        },
        {
            "id": 3,
            "category_id": 3,
            "image_url": "http://localhost:5000/images/airfair_category_items/5a28d6d5-fcaf-403f-a1fd-3631cd1f40a9.webp",
            "from": "Yangon 2",
            "to": "Ngapali Beach 2",
            "price": "¥ 1150",
            "date": "Friday, December 9, 2025",
            "discount": "1.8 discount",
            "created_at": "2026-09-20T04:10:44.000Z",
            "updated_at": "2026-09-20T04:24:02.000Z"
        }
    ]
}
```

### POST /api/promo/category/item/create

#### Request Body

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `category_id` | number | Yes | Id of the category related to the item to be created |
| `from` | string | Yes | from data of the item |
| `to` | string | Yes | to data of the item |
| `price` | string | No | price of the item |
| `date` | string | No | date of the item |
| `discount` | string | No | discount of the item |
| `image` | file | No | Image file to upload |
| `image_url` | string | No | The image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("category_id", 3);
formData.append("from", "Mandalay");
formData.append("to", "Ngapali Beach");
formData.append("price", "¥ 350");
formData.append("date", "Friday, December 5, 2025");
formData.append("discount", "0.8 discount");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://cdn.kimberley.com/new-banner.jpg");


fetch("domain/api/promo/category/item/create", {
  method: "POST",
  body: formData
});
```

#### Success Response

```json
{
    "success": true,
    "message": "Item created successfully",
    "data": {
        "id": 3,
        "category_id": 3,
        "image_url": "http://localhost:5000/images/airfair_category_items/4e971733-bf95-45ab-a434-0758d5fe7e34.webp",
        "from": "Yangon",
        "to": "Ngapali Beach",
        "price": "¥ 450",
        "date": "Friday, December 5, 2025",
        "discount": "0.8 discount",
        "created_at": "2026-09-20T04:10:44.000Z",
        "updated_at": "2026-09-20T04:10:44.000Z"
    }
}
```

### Error Response

```json
{
    "success": false,
    "message": "Cannot destructure property 'category_id' of 'req.body' as it is undefined."
}
```

```json
{
    "success": false,
    "error": "category_id, from, and to are required"
}
```

```json
{
    "success": false,
    "message": "Category related to category_id does not exit in database"
}
```

### PUT /api/promo/category/item/update

#### Request Body

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | Yes | id of item generated by backend |
| `from` | string | Yes | from data of the item |
| `to` | string | Yes | to data of the item |
| `price` | string | No | price of the item |
| `date` | string | No | date of the item |
| `discount` | string | No | discount of the item |
| `image` | file | No | Image file to upload |
| `image_url` | string | No | The image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("id", 1);
formData.append("from", "Yangon");
formData.append("to", "Ngapali Beach");
formData.append("price", "¥ 450");
formData.append("date", "Friday, December 6, 2025");
formData.append("discount", "0.7 discount");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://cdn.kimberley.com/new-banner.jpg");


fetch("domain/api/promo/category/item/update", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "success": true,
    "message": "Item updated successfully",
    "data": {
        "id": 3,
        "category_id": 3,
        "image_url": "http://localhost:5000/images/airfair_category_items/5a28d6d5-fcaf-403f-a1fd-3631cd1f40a9.webp",
        "from": "Yangon 2",
        "to": "Ngapali Beach 2",
        "price": "¥ 1150",
        "date": "Friday, December 9, 2025",
        "discount": "1.8 discount",
        "created_at": "2026-09-20T04:10:44.000Z",
        "updated_at": "2026-09-20T04:24:02.000Z"
    }
}
```

#### Error Response 

```json
{
    "success": false,
    "error": "id, from, and to are required"
}
```

```json
{
    "success": false,
    "message": "The item that you wnat to update does not exit in database"
}
```


### DELETE /api/promo/category/item/delete/:id

- `:id` is the `id of the category` to delete

```text
/api/promo/category/item/delete/2
/api/promo/category/item/delete/3
.
.
```

#### Success Response

```json
{
    "success": true,
    "message": "The item is successfully deleted."
}
```

####  Error Response

```json
{
    "success": false,
    "message": "The item that you wnat to delete does not exit in database"
}
```

```json
{
    "success" : false,
    "message" : "Id must exit"
}
```

## 10. SQL code of creating `trust_cards` in database

```sql
CREATE TABLE trust_cards (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    color VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


## 10.1 For Trust Cards

### GET /api/trust_cards

- No payload required

#### Success Response

```json
{
    "success": true,
    "message": "All trust cards are here",
    "data": [
        {
            "id": "card_1",
            "title": "Best price guarantee",
            "description": "Find a lower price elsewhere...",
            "color": "#20C997",
            "updated_at": "2026-10-03T03:07:47.000Z"
        },
        {
            "id": "card_2",
            "title": "Wide selection of airlines",
            "description": "Choose from 100+ domestic...",
            "color": "#F99B35",
            "updated_at": "2026-10-03T03:07:47.000Z"
        },
        {
            "id": "card_3",
            "title": "24/7 travel support",
            "description": "Our airline experts are available...",
            "color": "#20C997",
            "updated_at": "2026-10-03T03:07:47.000Z"
        }
    ]
}
```

### PUT /api/trust_cards/update/all

- Id must be only `card_1`, `card_2` or `card_3`.
- Order by Id like `card_1` is always the first one.


#### Payload

```json
[
   {
    "id": "card_2",
    "title": "Best price guarantee",
    "description": "Find a lower price elsewhere...",
    "color": "#20C997"
  },
  {
    "id": "card_1",
    "title": "Wide selection of airlines",
    "description": "Choose from 100+ domestic...",
    "color": "#F99B35"
  },
  {
    "id": "card_3",
    "title": "24/7 travel support",
    "description": "Our airline experts are available...",
    "color": "#20C997"
  }
]
```

#### Success Response

```json
{
    "success": true,
    "message": "All trust cards updated successfully",
    "data": [
        {
            "id": "card_1",
            "title": "Wide selection of airlines",
            "description": "Choose from 100+ domestic...",
            "color": "#F99B35",
            "updated_at": "2026-10-03T03:00:04.000Z"
        },
        {
            "id": "card_2",
            "title": "Best price guarantee",
            "description": "Find a lower price elsewhere...",
            "color": "#20C997",
            "updated_at": "2026-10-03T03:00:04.000Z"
        },
        {
            "id": "card_3",
            "title": "24/7 travel support",
            "description": "Our airline experts are available...",
            "color": "#20C997",
            "updated_at": "2026-10-03T03:00:04.000Z"
        }
    ]
}
```

#### Error Response

- Status : `400`

```json
{
    "success": false,
    "message": "Request body must be an array containing exactly 3 trust items."
}
```

```json
{
    "success": false,
    "message": "Invalid Card ID: 'card1'. ID must be one of 'card_1', 'card_2', or 'card_3'."
}
```

```json
{
    "success": false,
    "message": "Title, description, and color are required for card 'card_1'."
}
```

```json
{
    "success": false,
    "message": "You must provide all 3 cards: 'card_1', 'card_2', and 'card_3'."
}
```

## 10.2 For Refund Cards

### GET /api/refund_cards

- No payload required

#### Success Response

```json
{
    "success": true,
    "message": "All refund cards are here",
    "data": [
        {
            "id": "refund_card_1",
            "title": "needHelp",
            "description": "needHelpText",
            "color": "#20C997",
            "updated_at": "2026-10-04T23:22:36.000Z"
        },
        {
            "id": "refund_card_2",
            "title": "processingTime",
            "description": "processingTimeText",
            "color": "#FFF8EE",
            "updated_at": "2026-10-04T23:22:36.000Z"
        },
        {
            "id": "refund_card_3",
            "title": "secureService",
            "description": "secureServiceText",
            "color": "#20C997",
            "updated_at": "2026-10-04T23:22:36.000Z"
        }
    ]
}
```

### PUT /api/refund_cards/update/all

- Id must be only `refund_card_1`, `refund_card_2` or `refund_card_3`.
- Order by Id like `refund_card_1` is always the first one.


#### Payload

```json
[
  {
    "id": "refund_card_1",
    "title": "needHelp",
    "description": "needHelpText",
    "color": "#20C997"
  },
  {
    "id": "refund_card_2",
    "title": "processingTime",
    "description": "processingTimeText",
    "color": "#FFF8EE"
  },
  {
    "id": "refund_card_3",
    "title": "secureService",
    "description": "secureServiceText",
    "color": "#20C997"
  }
]
```

#### Success Response

```json
{
    "success": true,
    "message": "All refund cards updated successfully",
    "data": [
        {
            "id": "refund_card_1",
            "title": "needHelp",
            "description": "needHelpText",
            "color": "#20C997",
            "updated_at": "2026-10-04T23:22:36.000Z"
        },
        {
            "id": "refund_card_2",
            "title": "processingTime",
            "description": "processingTimeText",
            "color": "#FFF8EE",
            "updated_at": "2026-10-04T23:22:36.000Z"
        },
        {
            "id": "refund_card_3",
            "title": "secureService",
            "description": "secureServiceText",
            "color": "#20C997",
            "updated_at": "2026-10-04T23:22:36.000Z"
        }
    ]
}
```

#### Error Response

- Status : `400`

```json
{
    "success": false,
    "message": "Request body must be an array containing exactly 3 refund items."
}
```

```json
{
    "success": false,
    "message": "Invalid Card ID: 'refund_ca_2'. ID must be one of 'refund_card_1', 'refund_card_2', or 'refund_card_3'."
}
```

```json
{
    "success": false,
    "message": "Title, description, and color are required for card 'refund_card_2'."
}
```

```json
{
    "success": false,
    "message": "You must provide all 3 cards: 'refund_card_1', 'refund_card_2', or 'refund_card_3'."
}
```


## 10.3 For Hotel Cards

### GET /api/hotel_cards

- No payload required

#### Success Response

```json
{
    "success": true,
    "message": "All hotels cards are here",
    "data": [
        {
            "id": "hotel_card_1",
            "title": "One-stop corporate travel services",
            "description": "Massive travel products, full-process services, intelligent control, help enterprises cost savings of up to 30%!",
            "color": "#479B9B",
            "updated_at": "2026-10-15T11:45:09.000Z"
        },
        {
            "id": "hotel_card_2",
            "title": "Public settlement",
            "description": "15 minutes of fast opening of the company account, 30+20 days of long accounting period, self-service reconciliation, unified invoicing, distribution!",
            "color": "#F38B3C",
            "updated_at": "2026-10-15T11:45:09.000Z"
        },
        {
            "id": "hotel_card_3",
            "title": "Tailor-made business programs",
            "description": "Powerful product technology & service solutions to support the scale of more than 500 large enterprises customized",
            "color": "#479B9B",
            "updated_at": "2026-10-15T11:45:09.000Z"
        }
    ]
}
```

### PUT /api/hotel_cards/update/all

- Id must be only `hotel_card_1`, `hotel_card_2` or `hotel_card_3`
- Order by Id like `hotel_card_1` is always the first one.


#### Payload

```json
[
  {
    "id": "hotel_card_1",
    "title": "One-stop corporate travel services",
    "description": "Massive travel products, full-process services, intelligent control, help enterprises cost savings of up to 30%!",
    "color": "#479B9B"
  },
  {
    "id": "hotel_card_2",
    "title": "Public settlement",
    "description": "15 minutes of fast opening of the company account, 30+20 days of long accounting period, self-service reconciliation, unified invoicing, distribution!",
    "color": "#F38B3C"
  },
  {
    "id": "hotel_card_3",
    "title": "Tailor-made business programs",
    "description": "Powerful product technology & service solutions to support the scale of more than 500 large enterprises customized",
    "color": "#479B9B"
  }
]
```

#### Success Response

```json
{
    "success": true,
    "message": "All hotels cards updated successfully",
    "data": [
        {
            "id": "hotel_card_1",
            "title": "One-stop corporate travel services",
            "description": "Massive travel products, full-process services, intelligent control, help enterprises cost savings of up to 30%!",
            "color": "#479B9B",
            "updated_at": "2026-10-15T11:45:09.000Z"
        },
        {
            "id": "hotel_card_2",
            "title": "Public settlement",
            "description": "15 minutes of fast opening of the company account, 30+20 days of long accounting period, self-service reconciliation, unified invoicing, distribution!",
            "color": "#F38B3C",
            "updated_at": "2026-10-15T11:45:09.000Z"
        },
        {
            "id": "hotel_card_3",
            "title": "Tailor-made business programs",
            "description": "Powerful product technology & service solutions to support the scale of more than 500 large enterprises customized",
            "color": "#479B9B",
            "updated_at": "2026-10-15T11:45:09.000Z"
        }
    ]
}
```

#### Error Response

- Status : `400`

```json
{
    "success": false,
    "message": "Request body must be an array containing exactly 3 hotel items."
}
```

```json
{
    "success": false,
    "message": "Invalid Card ID: 'hotel_caddrd_3'. ID must be one of 'hotel_card_1', 'hotel_card_2' , or 'hotel_card_3'."
}
```

```json
{
    "success": false,
    "message": "Title, description, and color are required for card 'hotel_card_3'."
}
```

```json
{
    "success": false,
    "message": "You must provide all 3 cards: 'hotel_card_1', 'hotel_card_2', or 'hotel_card_3'."
}
```

## 10.4 For travel security Cards

### GET /api/travel_security_cards

- No payload required

#### Success Response

```json
{
    "success": true,
    "message": "All travel security cards are here",
    "data": [
        {
            "id": "travel_security_card_1",
            "title": "hotel_reassured",
            "description": "hotels_worldwide",
            "color": "#D2F4F2",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_2",
            "title": "airline_safe",
            "description": "global_routes",
            "color": "#FFEEDB",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_3",
            "title": "train_reliable",
            "description": "refunds",
            "color": "#FFDCDC",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_4",
            "title": "tourism_safe",
            "description": "emergency",
            "color": "#D2F4F2",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_5",
            "title": "finance_safe",
            "description": "compliance",
            "color": "#FFEEDB",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_6",
            "title": "gourmet",
            "description": "best_prices",
            "color": "#D2F4F2",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_7",
            "title": "member_benefits",
            "description": "more_savings",
            "color": "#FFDCDC",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_8",
            "title": "live_travel",
            "description": "broadcasts",
            "color": "#FFEEDB",
            "updated_at": "2026-10-15T11:49:45.000Z"
        }
    ]
}
```

### PUT /api/travel_security_cards/update/all

- Id must be only between `travel_security_card_1` to `travel_security_card_8`
- Order by Id like `travel_security_card_1` is always the first one.


#### Payload

```json
[
  {
    "id": "travel_security_card_1",
    "title": "hotel_reassured",
    "description": "hotels_worldwide",
    "color": "#D2F4F2"
  },
  {
    "id": "travel_security_card_2",
    "title": "airline_safe",
    "description": "global_routes",
    "color": "#FFEEDB"
  },
  {
    "id": "travel_security_card_3",
    "title": "train_reliable",
    "description": "refunds",
    "color": "#FFDCDC"
  },
  {
    "id": "travel_security_card_4",
    "title": "tourism_safe",
    "description": "emergency",
    "color": "#D2F4F2"
  },
  {
    "id": "travel_security_card_5",
    "title": "finance_safe",
    "description": "compliance",
    "color": "#FFEEDB"
  },
  {
    "id": "travel_security_card_6",
    "title": "gourmet",
    "description": "best_prices",
    "color": "#D2F4F2"
  },
  {
    "id": "travel_security_card_7",
    "title": "member_benefits",
    "description": "more_savings",
    "color": "#FFDCDC"
  },
  {
    "id": "travel_security_card_8",
    "title": "live_travel",
    "description": "broadcasts",
    "color": "#FFEEDB"
  }
]
```

#### Success Response

```json
{
    "success": true,
    "message": "All travel security cards updated successfully",
    "data": [
        {
            "id": "travel_security_card_1",
            "title": "hotel_reassured",
            "description": "hotels_worldwide",
            "color": "#D2F4F2",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_2",
            "title": "airline_safe",
            "description": "global_routes",
            "color": "#FFEEDB",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_3",
            "title": "train_reliable",
            "description": "refunds",
            "color": "#FFDCDC",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_4",
            "title": "tourism_safe",
            "description": "emergency",
            "color": "#D2F4F2",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_5",
            "title": "finance_safe",
            "description": "compliance",
            "color": "#FFEEDB",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_6",
            "title": "gourmet",
            "description": "best_prices",
            "color": "#D2F4F2",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_7",
            "title": "member_benefits",
            "description": "more_savings",
            "color": "#FFDCDC",
            "updated_at": "2026-10-15T11:49:45.000Z"
        },
        {
            "id": "travel_security_card_8",
            "title": "live_travel",
            "description": "broadcasts",
            "color": "#FFEEDB",
            "updated_at": "2026-10-15T11:49:45.000Z"
        }
    ]
}
```

#### Error Response

- Status : `400`

```json
{
    "success": false,
    "message": "Request body must be an array containing exactly 8 travel security items."
}
```

```json
{
    "success": false,
    "message": "Invalid Card ID: 'travel_card_1'. ID must be one of travel_security_card_1 , travel_security_card_2 , travel_security_card_3 , travel_security_card_4 , travel_security_card_5 , travel_security_card_6 , travel_security_card_7 , travel_security_card_8."
}
```

```json
{
    "success": false,
    "message": "Title, description, and color are required for card 'travel_security_card_1'."
}
```

```json
{
    "success": false,
    "message": "You must provide all 8 cards: travel_security_card_1 , travel_security_card_2 , travel_security_card_3 , travel_security_card_4 , travel_security_card_5 , travel_security_card_6 , travel_security_card_7 , travel_security_card_8."
}
```



## 10.5 For Action Buttons

### GET /api/action_buttons

- No payload required

#### Success Response

```json
{
    "success": true,
    "message": "All travel security cards are here",
    "data": [
        {
            "id": "action_button_1",
            "label": "hotel_joining",
            "updated_at": "2026-10-15T08:35:48.000Z"
        },
        {
            "id": "action_button_2",
            "label": "agent_joining",
            "updated_at": "2026-10-15T08:35:48.000Z"
        },
        {
            "id": "action_button_3",
            "label": "e-booking",
            "updated_at": "2026-10-15T08:35:48.000Z"
        }
    ]
}
```

### PUT /api/action_buttons/update/all

- Id must be only `action_button_1`, `action_button_2` or `action_button_3`
- Order by Id like `action_button_1` is always the first one.


#### Payload

```json
[
  {
    "id": "action_button_1",
    "label": "hotel_joining"
  },
  {
    "id": "action_button_2",
    "label": "agent_joining"
  },
  {
    "id": "action_button_3",
    "label": "e-booking"
  }
]
```

#### Success Response

```json
{
    "success": true,
    "message": "All travel security cards updated successfully",
    "data": [
        {
            "id": "action_button_1",
            "label": "hotel_joining",
            "updated_at": "2026-10-15T08:35:48.000Z"
        },
        {
            "id": "action_button_2",
            "label": "agent_joining",
            "updated_at": "2026-10-15T08:35:48.000Z"
        },
        {
            "id": "action_button_3",
            "label": "e-booking",
            "updated_at": "2026-10-15T08:35:48.000Z"
        }
    ]
}
```

#### Error Response

- Status : `400`

```json
{
    "success": false,
    "message": "Request body must be an array containing exactly 3 action button items."
}
```

```json
{
    "success": false,
    "message": "Invalid Card ID: 'action_button1'. ID must be one of action_button_1 , action_button_2 , action_button_3."
}
```

```json
{
    "success": false,
    "message": "Label is required for card 'action_button_1'."
}
```

```json
{
    "success": false,
    "message": "You must provide all 3 action buttons : action_button_1 , action_button_2 , action_button_3."
}
```



## 10.6 For Oversea Footers

### GET /api/oversea_footers

- No payload required

#### Success Response

```json
{
    "success": true,
    "message": "All oversea footers are here",
    "data": [
        {
            "id": "oversea_footer_1",
            "title": "Top Countries/Regions",
            "description": "Thailand... Korea H... Japan H... Hotels in... America... Vietnam... Australia... France h... Maldives... Italy hotels",
            "updated_at": "2026-10-15T11:37:49.000Z"
        },
        {
            "id": "oversea_footer_2",
            "title": "Hot cities",
            "description": "Dubai H... Singapor... Phuket... Bali Hotels... Las Veg... Boracay... Kuala Lu... Seoul H... Chiang... Paris hot... London... New Yor...",
            "updated_at": "2026-10-15T11:37:49.000Z"
        },
        {
            "id": "oversea_footer_3",
            "title": "Category: Popular brands",
            "description": "Hilton H... Sheraton... Super 8... InterCon... Marriott... Kempinski... Ramada... The Wes... Hyatt Re... Sofitel H... Waldorf...",
            "updated_at": "2026-10-15T11:37:49.000Z"
        }
    ]
}
```

### PUT /api/oversea_footers/update/all

- Id must be only `oversea_footer_1`, `oversea_footer_2` or `oversea_footer_3`
- Order by Id like `oversea_footer_1` is always the first one.


#### Payload

```json
[
  {
    "id": "oversea_footer_1",
    "title": "Top Countries/Regions",
    "description": "Thailand... Korea H... Japan H... Hotels in... America... Vietnam... Australia... France h... Maldives... Italy hotels"
  },
  {
    "id": "oversea_footer_2",
    "title": "Hot cities",
    "description": "Dubai H... Singapor... Phuket... Bali Hotels... Las Veg... Boracay... Kuala Lu... Seoul H... Chiang... Paris hot... London... New Yor..."
  },
  {
    "id": "oversea_footer_3",
    "title": "Category: Popular brands",
    "description": "Hilton H... Sheraton... Super 8... InterCon... Marriott... Kempinski... Ramada... The Wes... Hyatt Re... Sofitel H... Waldorf..."
  }
]
```

#### Success Response

```json
{
    "success": true,
    "message": "All oversea footers updated successfully",
    "data": [
        {
            "id": "oversea_footer_1",
            "title": "Top Countries/Regions",
            "description": "Thailand... Korea H... Japan H... Hotels in... America... Vietnam... Australia... France h... Maldives... Italy hotels",
            "updated_at": "2026-10-15T11:37:27.000Z"
        },
        {
            "id": "oversea_footer_2",
            "title": "Hot cities",
            "description": "Dubai H... Singapor... Phuket... Bali Hotels... Las Veg... Boracay... Kuala Lu... Seoul H... Chiang... Paris hot... London... New Yor...",
            "updated_at": "2026-10-15T11:37:27.000Z"
        },
        {
            "id": "oversea_footer_3",
            "title": "Category: Popular brands",
            "description": "Hilton H... Sheraton... Super 8... InterCon... Marriott... Kempinski... Ramada... The Wes... Hyatt Re... Sofitel H... Waldorf...",
            "updated_at": "2026-10-15T11:37:27.000Z"
        }
    ]
}
```

#### Error Response

- Status : `400`

```json
{
    "success": false,
    "message": "Request body must be an array containing exactly 3 oversea footer items."
}
```

```json
{
    "success": false,
    "message": "Invalid Card ID: 'oversea_fooer_2'. ID must be one of oversea_footer_1 , oversea_footer_2 , oversea_footer_3."
}
```

```json
{
    "success": false,
    "message": "Title, and description are required for 'oversea_footer_2'."
}
```

```json
{
    "success": false,
    "message": "You must provide all 3 oversea footers : oversea_footer_1 , oversea_footer_2 , oversea_footer_3."
}
```




## 10.7 For Oversea Headers

### GET /api/oversea_footers

- No payload required

#### Success Response

```json
{
    "success": true,
    "message": "All oversea headers are here",
    "data": [
        {
            "id": "oversea_header_1",
            "title": "Stay guarantee",
            "description": "Guaranteed compensation for those without a home",
            "updated_at": "2026-10-15T12:19:19.000Z"
        },
        {
            "id": "oversea_header_2",
            "title": "Professional customer service",
            "description": "Customer service is available 24/7",
            "updated_at": "2026-10-15T12:19:19.000Z"
        },
        {
            "id": "oversea_header_3",
            "title": "Emergency support",
            "description": "Emergency Assistance",
            "updated_at": "2026-10-15T12:19:19.000Z"
        }
    ]
}
```

### PUT /api/oversea_headers/update/all

- Id must be only `oversea_header_1`, `oversea_header_2` or `oversea_header_3`
- Order by Id like `oversea_header_1` is always the first one.


#### Payload

```json
[
  {
    "id": "oversea_header_1",
    "title": "Stay guarantee",
    "description": "Guaranteed compensation for those without a home"
  },
  {
    "id": "oversea_header_2",
    "title": "Professional customer service",
    "description": "Customer service is available 24/7"
  },
  {
    "id": "oversea_header_3",
    "title": "Emergency support",
    "description": "Emergency Assistance"
  }
]
```

#### Success Response

```json
{
    "success": true,
    "message": "All oversea headers updated successfully",
    "data": [
        {
            "id": "oversea_header_1",
            "title": "Stay guarantee",
            "description": "Guaranteed compensation for those without a home",
            "updated_at": "2026-10-15T12:19:19.000Z"
        },
        {
            "id": "oversea_header_2",
            "title": "Professional customer service",
            "description": "Customer service is available 24/7",
            "updated_at": "2026-10-15T12:19:19.000Z"
        },
        {
            "id": "oversea_header_3",
            "title": "Emergency support",
            "description": "Emergency Assistance",
            "updated_at": "2026-10-15T12:19:19.000Z"
        }
    ]
}
```

#### Error Response

- Status : `400`

```json
{
    "success": false,
    "message": "Request body must be an array containing exactly 3 oversea header items."
}
```

```json
{
    "success": false,
    "message": "Invalid Card ID: 'oversea_header_2sss'. ID must be one of oversea_header_1 , oversea_header_2 , oversea_header_3."
}
```

```json
{
    "success": false,
    "message": "Invalid Card ID: 'undefined'. ID must be one of oversea_header_1 , oversea_header_2 , oversea_header_3."
}
```

```json
{
    "success": false,
    "message": "You must provide all 3 oversea headers : oversea_footer_1 , oversea_footer_2 , oversea_footer_3."
}
```






## 11. SQL code of creating `bookings` in database

```sql
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pnr_code VARCHAR(10) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    flight_id INT NOT NULL,
    departure_date VARCHAR(50) NOT NULL,
    cabin_class ENUM('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST') NOT NULL DEFAULT 'ECONOMY',

    adult_count INT NOT NULL DEFAULT 1,
    child_count INT NOT NULL DEFAULT 0,
    infant_count INT NOT NULL DEFAULT 0,
    
    contact_full_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    special_requests TEXT,
    
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(id) ON DELETE CASCADE
);
```

### GET /api/bookings

- No payload required

#### Success Response

```json
{
    "status": true,
    "message": "Bookings are here.",
    "body": [
        {
            "id": 2,
            "pnr_code": "HK892345",
            "user_id": 1,
            "flight_id": 5,
            "departure_date": "2026-11-20",
            "cabin_class": "ECONOMY",
            "adult_count": 3,
            "child_count": 2,
            "infant_count": 2,
            "contact_full_name": "Aung Aung 2",
            "contact_email": "aung@gmail.com 2",
            "contact_phone": "+959123456789 2",
            "special_requests": "Window seat preferred 2",
            "total_amount": "4502.00",
            "status": "PENDING",
            "created_at": "2026-10-04T06:02:38.000Z",
            "updated_at": "2026-10-04T06:02:38.000Z"
        },
        {
            "id": 1,
            "pnr_code": "BK892341",
            "user_id": 1,
            "flight_id": 5,
            "departure_date": "2026-11-25",
            "cabin_class": "BUSINESS",
            "adult_count": 2,
            "child_count": 0,
            "infant_count": 0,
            "contact_full_name": "Aung Aung",
            "contact_email": "aung.updated@gmail.com",
            "contact_phone": "+959987654321",
            "special_requests": "Vegetarian meal required",
            "total_amount": "600.00",
            "status": "CONFIRMED",
            "created_at": "2026-10-04T05:59:57.000Z",
            "updated_at": "2026-10-04T06:10:33.000Z"
        }
    ]
}
```

### POST /api/bookings

- only `authenticated` user can use this route


#### Payload

```json
{
  "pnr_code": "BK892341",
  "user_id": 1,
  "flight_id": 5,
  "departure_date": "2026-11-20",
  "cabin_class": "ECONOMY",
  "adult_count": 2,
  "child_count": 1,
  "infant_count": 0,
  "contact_full_name": "Aung Aung",
  "contact_email": "aung@gmail.com",
  "contact_phone": "+959123456789",
  "special_requests": "Window seat preferred",
  "total_amount": 450.00
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Booking created successfully",
    "body": {
        "id": 1,
        "pnr_code": "BK892341",
        "user_id": 1,
        "flight_id": 5,
        "departure_date": "2026-11-20",
        "cabin_class": "ECONOMY",
        "adult_count": 2,
        "child_count": 1,
        "infant_count": 0,
        "contact_full_name": "Aung Aung",
        "contact_email": "aung@gmail.com",
        "contact_phone": "+959123456789",
        "special_requests": "Window seat preferred",
        "total_amount": "450.00",
        "status": "PENDING",
        "created_at": "2026-10-04T05:59:57.000Z",
        "updated_at": "2026-10-04T05:59:57.000Z"
    }
}
```

#### Error Responses

```json
{
    "status": false,
    "message": "Invalid user_id [15] : user does not exit in database."
}
```
```json
{
    "status": false,
    "message": "Invalid flight_id [52] : flight does not exit in database."
}
```
```json
{
    "status": false,
    "message": "pnr_code, user_id, flight_id, departure_date, cabin_class, contact_full_name, contact_email, contact_phone, contact_phone and total_amount are required"
}
```


### PUT /api/bookings

- only `authenticated` user can use this route

#### Payload

```json
{
  "id": 1,
  "departure_date": "2026-11-25",
  "cabin_class": "BUSINESS",
  "adult_count": 2,
  "child_count": 0,
  "infant_count": 0,
  "contact_full_name": "Aung Aung",
  "contact_email": "aung.updated@gmail.com",
  "contact_phone": "+959987654321",
  "special_requests": "Vegetarian meal required",
  "total_amount": 600.00
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Booking updated successfully",
    "body": {
        "id": 1,
        "pnr_code": "BK892341",
        "user_id": 1,
        "flight_id": 5,
        "departure_date": "2026-11-25",
        "cabin_class": "BUSINESS",
        "adult_count": 2,
        "child_count": 0,
        "infant_count": 0,
        "contact_full_name": "Aung Aung",
        "contact_email": "aung.updated@gmail.com",
        "contact_phone": "+959987654321",
        "special_requests": "Vegetarian meal required",
        "total_amount": "600.00",
        "status": "PENDING",
        "created_at": "2026-10-04T05:59:57.000Z",
        "updated_at": "2026-10-04T06:06:28.000Z"
    }
}
```

#### Error Responses

```json
{
    "status": false,
    "message": "Booking not found"
}
```
```json
{
    "status": false,
    "message": "departure_date, cabin_class, contact_full_name, contact_email, contact_phone, contact_phone and total_amount are required"
}
```

### PATCH /api/bookings/status

- When only want to change `status` like from pending to confirmed
- only `authenticated` and `admin` can use this route


#### Payload

```json
{
  "id": 1,
  "status": "confirmed"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Booking status updated successfully",
    "id": 1,
    "changedStatus": "CONFIRMED"
}
```

#### Error Responses

```json
{
    "status": false,
    "message": "id is required"
}
```
```json
{
    "status": false,
    "message": "Invalid status. Allowed values: PENDING, CONFIRMED, CANCELLED, EXPIRED"
}
```

### DELETE /api/bookings/:id

- `:id` is the id of the booking you want to delete
- only `authenticated` user can use this route

#### Example route

```text
/api/bookings/3
```

#### Success Response

```json
{
    "status": true,
    "message": "Booking deleted successfully"
}
```

#### Error Response

```json
{
    "message": "Booking not found"
}
```

## 12. SQL code of creating `faqs` in database

```sql
CREATE TABLE faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


### GET /api/faqs

- No payloads requried

#### Success Response

```json
{
    "status": true,
    "message": "FAQs fetched successfully.",
    "body": [
        {
            "id": 2,
            "question": "2222What is the status of my refund request, and when will it be credited?2222",
            "answer": "2222It typically takes 7 to 20 business days. Under federal regulations, airlines must issue refunds within 7 business days if you paid by credit card, and within 20 business days if you paid by cash or check.",
            "is_active": true,
            "created_at": "2026-10-04T08:04:12.000Z",
            "updated_at": "2026-10-04T08:04:12.000Z"
        },
        {
            "id": 1,
            "question": "Can I get a full refund for my non-refundable ticket because of a severe schedule change?",
            "answer": "Yes, if an airline makes a significant schedule change or delay, you are entitled to a full refund to your original payment method.",
            "is_active": true,
            "created_at": "2026-10-04T08:02:19.000Z",
            "updated_at": "2026-10-04T08:10:19.000Z"
        }
    ]
}
```

### POST /api/faqs

- `is_active` can be `undefined`, its default value is `true`
- only `authenticated` and `admin` can use this route

#### Payload

```json
{
  "question": "What is the status of my refund request, and when will it be credited?",
  "answer": "It typically takes 7 to 20 business days. Under federal regulations, airlines must issue refunds within 7 business days if you paid by credit card, and within 20 business days if you paid by cash or check.",
  "is_active": true
}
```

#### Success Response

```json
{
    "status": true,
    "message": "FAQ created successfully",
    "body": {
        "id": 1,
        "question": "What is the status of my refund request, and when will it be credited?",
        "answer": "It typically takes 7 to 20 business days. Under federal regulations, airlines must issue refunds within 7 business days if you paid by credit card, and within 20 business days if you paid by cash or check.",
        "is_active": true,
        "created_at": "2026-10-04T08:02:19.000Z",
        "updated_at": "2026-10-04T08:02:19.000Z"
    }
}
```

#### Error Responses

```json
{
    "status": false,
    "message": "question and answer are required"
}
```


### PUT /api/faqs

- `is_active` can be `undefined`, its default value is `true`
- only `authenticated` and `admin` can use this route


#### Payload

```json
{
  "id": 1,
  "question": "Can I get a full refund for my non-refundable ticket because of a severe schedule change?",
  "answer": "Yes, if an airline makes a significant schedule change or delay, you are entitled to a full refund to your original payment method.",
  "is_active": true
}
```

#### Success Response

```json
{
    "status": true,
    "message": "FAQ updated successfully",
    "body": {
        "id": 1,
        "question": "Can I get a full refund for my non-refundable ticket because of a severe schedule change?",
        "answer": "Yes, if an airline makes a significant schedule change or delay, you are entitled to a full refund to your original payment method.",
        "is_active": true,
        "created_at": "2026-10-04T08:02:19.000Z",
        "updated_at": "2026-10-04T08:10:19.000Z"
    }
}
```

#### Error Responses

```json
{
    "status": false,
    "message": "id, question, and answer are required"
}
```
```json
{
    "status": false,
    "message": "FAQ not found"
}
```


### DELETE /api/faqs/:id

- `:id` is the id of the faqs you want to delete
- only `authenticated` and `admin` can use this route


#### Example route

```text
/api/faqs/3
```

#### Success Response

```json
{
    "status": true,
    "message": "FAQ deleted successfully"
}
```

#### Error Response

```json
{
    "status": false,
    "message": "FAQ not found"
}
```


## 13. SQL code of creating `reschedule_requests` in database

```sql
CREATE TABLE reschedule_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    
    new_travel_date VARCHAR(50) NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### GET /api/reschedules

- if you want to get `all reschedules`, no payload required
- example
```text
/api/reschedules
```

- if you want to get `reschedules related to user_id`, you must add `?user_id=1` at the end of the route
- example
```text
/api/reschedules?user_id=1
```

#### Success Response

```json
{
    "status": true,
    "message": "Reschedule Requests are here",
    "data": [
        {
            "id": 4,
            "booking_id": 2,
            "user_id": 1,
            "new_travel_date": "05 Sep 2026",
            "preferred_time": "Morning",
            "status": "PENDING",
            "created_at": "2026-10-05T05:30:36.000Z",
            "updated_at": "2026-10-05T05:30:36.000Z"
        },
        {
            "id": 3,
            "booking_id": 2,
            "user_id": 1,
            "new_travel_date": "05 Sep 2026",
            "preferred_time": "Morning",
            "status": "PENDING",
            "created_at": "2026-10-05T05:29:45.000Z",
            "updated_at": "2026-10-05T05:29:45.000Z"
        },
        {
            "id": 2,
            "booking_id": 2,
            "user_id": 1,
            "new_travel_date": "05 Sep 2026",
            "preferred_time": "Morning",
            "status": "PENDING",
            "created_at": "2026-10-05T05:29:00.000Z",
            "updated_at": "2026-10-05T05:29:00.000Z"
        }
    ]
}
```

### POST /api/reschedule/request

- only `authenticated` user can use this route

#### Payload 

```json
{
  "booking_id": 2,
  "user_id": 1,
  "new_travel_date": "05 Sep 2026",
  "preferred_time": "Morning"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Reschedule request submitted successfully",
    "data": {
        "id": 4,
        "booking_id": 2,
        "user_id": 1,
        "new_travel_date": "05 Sep 2026",
        "preferred_time": "Morning",
        "status": "PENDING",
        "created_at": "2026-10-05T05:30:36.000Z",
        "updated_at": "2026-10-05T05:30:36.000Z"
    }
}
```

#### Error Response

```json
{
    "status": false,
    "message": "User not found in database"
}
```
```json
{
    "status": false,
    "message": "booking_id, user_id, new_travel_date and preferred_time must exit"
}
```
```json
{
    "status": false,
    "message": "booking not found in database"
}
```

### PUT /api/reschedule/update/:id

- `:id` is the id of the reschedule to update
- only `authenticated` user can use this route

#### Payload 

```text
/api/reschedule/update/1
```
```json
{
  "new_travel_date": "12 Sep 2026",
  "preferred_time": "Evening"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Reschedule request updated successfully",
    "data": {
        "id": 1,
        "booking_id": 2,
        "user_id": 1,
        "new_travel_date": "12 Sep 2026",
        "preferred_time": "Evening",
        "status": "PENDING",
        "created_at": "2026-10-05T05:08:42.000Z",
        "updated_at": "2026-10-05T05:12:16.000Z"
    }
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Reschedule request not found"
}
```
```json
{
    "status": false,
    "message": "id, new_travel_date and preferred_time must exit"
}
```

### PATCH /api/reschedule/change/status/:id

- `:id` is the id of the reschedule to update
- only `authenticated` and `admin` can use this route


#### Payload 

```text
/api/reschedule/change/status/1
```
```json
{
  "status": "APPROVED"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Reschedule request status changed to APPROVED",
    "data": {
        "id": 1,
        "booking_id": 2,
        "user_id": 1,
        "new_travel_date": "12 Sep 2026",
        "preferred_time": "Evening",
        "status": "APPROVED",
        "created_at": "2026-10-05T05:08:42.000Z",
        "updated_at": "2026-10-05T05:16:15.000Z"
    }
}
```

#### Error Response

```json
{
    "status": false,
    "message": "id and status are required"
}
```
```json
{
    "status": false,
    "message": "Invalid status. Status must be one of: PENDING, APPROVED, REJECTED and must be capital letters"
}
```

### DELETE /api/reschedule/:id

- `:id` is the id of reschedule to delete
- only `authenticated` user can use this route

```text
/api/reschedule/1
```

#### Success Response

```json
{
    "status": false,
    "message": "Reschedule request deleted successfully"
}
```

#### Error response

```json
{
    "status": true,
    "message": "Request not found"
}
```

## 14 SQL code of creating `refund_requests` in database

```sql
CREATE TABLE refund_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    
    reason TEXT NULL,
    
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### GET /api/reschedules

- if you want to get `all refunds`, no payload required
- example
```text
/api/refunds
```

- if you want to get `refunds related to user_id`, you must add `?user_id=1` at the end of the route
- example
```text
/api/refunds?user_id=1
```

#### Success Response

```json
{
    "status": true,
    "message": "Refund requests retrieved successfully",
    "data": [
        {
            "id": 2,
            "booking_id": 2,
            "user_id": 1,
            "reason": "Medical emergency",
            "status": "PENDING",
            "created_at": "2026-10-05T09:38:31.000Z",
            "updated_at": "2026-10-05T09:38:31.000Z"
        },
        {
            "id": 1,
            "booking_id": 1,
            "user_id": 1,
            "reason": "Medical emergency 222",
            "status": "REJECTED",
            "created_at": "2026-10-05T09:34:49.000Z",
            "updated_at": "2026-10-05T10:37:47.000Z"
        }
    ]
}
```

### POST /api/refund/request

- only `authenticated` user can use this route

#### Payload 

```json
{
  "booking_id": 1,
  "user_id": 1,
  "reason": "Medical emergency"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Refund request submitted successfully",
    "data": {
        "id": 1,
        "booking_id": 1,
        "user_id": 1,
        "reason": "Medical emergency",
        "status": "PENDING",
        "created_at": "2026-10-05T09:34:49.000Z",
        "updated_at": "2026-10-05T09:34:49.000Z"
    }
}
```

#### Error Response

```json
{
    "status": false,
    "message": "booking not found in database"
}
```
```json
{
    "status": false,
    "message": "User not found in database"
}
```
```json
{
    "status": false,
    "message": "A refund request has already been submitted for this booking."
}
```
```json
{
    "status": false,
    "message": "booking_id and user_id are required"
}
```
```json
{
    "status" : false,
    "message" : "pending or confirmed booking of your booking_id does not exit in database"
}
```

### PUT /api/refund/update/:id

- `:id` is the id of the refund to update
- Only `authenticated` user can use this route

#### Payload 

```text
/api/refund/update/1
```
```json
{
  "reason": "Medical emergency 333" 
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Refund request updated successfully",
    "data": {
        "id": 1,
        "booking_id": 1,
        "user_id": 1,
        "reason": "Medical emergency 333",
        "status": "REJECTED",
        "created_at": "2026-10-05T09:34:49.000Z",
        "updated_at": "2026-10-05T10:58:35.000Z"
    }
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Refund request not found"
}
```

### PATCH /api/refund/change/status/:id

- `:id` is the id of the refund to update
- only `authenticated` and `admin` can use this route


#### Payload 

```text
/api/refund/change/status/1
```
```json
{
  "status": "APPROVED" 
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Refund request status changed to APPROVED",
    "data": {
        "id": 1,
        "booking_id": 1,
        "user_id": 1,
        "reason": "Medical emergency 333",
        "status": "APPROVED",
        "created_at": "2026-10-05T09:34:49.000Z",
        "updated_at": "2026-10-05T11:04:06.000Z"
    }
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Refund request not found"
}
```
```json
{
    "status": false,
    "message": "Invalid status. Status must be one of: PENDING, APPROVED, REJECTED"
}
```

### DELETE /api/refund/:id

- `:id` is the id of refund to delete
- only `authenticated` user can use this route

```text
/api/refund/1
```

#### Success Response

```json
{
    "status": true,
    "message": "Refund request deleted successfully"
}
```

#### Error response

```json
{
    "status": false,
    "message": "Refund request not found"
}
```




### GET /api/airfare/getall

- This route is for getting all data from airports, airlines , routes, flights, banner, categories, cateogry_items, trust_cards, refund_cards, bookings, reschedule_requests , refund_requests and faqs at one place
- No payload required

##### Success response 

```json
{
    "success": true,
    "data": {
        "airports": [
            {
                "id": 4,
                "code": "MDY",
                "type": "international",
                "name": "Mandalay Internal AirPort",
                "city": "Mandalay",
                "country": "Myanamar",
                "note": null,
                "image_url": "http://localhost:5000/images/airport/69f4a0c8-be6a-415a-acdf-8b1a8baa07c0.webp",
                "created_at": "2026-09-14T12:25:34.000Z",
                "updated_at": "2026-09-17T12:38:32.000Z"
            },
            {
                "id": 3,
                "code": "YGN",
                "type": "international",
                "name": "Yangon International AirPort",
                "city": "Yangon",
                "country": "Myanmar",
                "note": null,
                "image_url": "http://localhost:5000/images/airport/b12dd186-8d2a-4a14-ba9c-f52b041ed4b5.webp",
                "created_at": "2026-09-14T12:17:40.000Z",
                "updated_at": "2026-09-17T12:15:53.000Z"
            }
        ],
        "airlines": [
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
        ],
        "routes": [
            {
                "id": 2,
                "from_airport_id": 3,
                "to_airport_id": 5,
                "duration": "1h 30m",
                "stops": 0,
                "route_type": "international",
                "is_popular": 1,
                "created_at": "2026-09-15T12:35:35.000Z",
                "updated_at": "2026-09-17T12:39:45.000Z"
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
        ],
        "flights": [
            {
                "id": 5,
                "route_id": 1,
                "airline_id": 3,
                "departure_time": "08:30:00",
                "arrival_time": "10:55:00",
                "price": "11.00",
                "adult_price": "12.00",
                "child_price": "1202.00",
                "infant_price": "303.00",
                "duration": "1h 25m",
                "created_at": "2026-09-26T00:10:45.000Z",
                "updated_at": "2026-09-26T00:14:13.000Z"
            },
            {
                "id": 1,
                "route_id": 1,
                "airline_id": 5,
                "departure_time": "08:30:00",
                "arrival_time": "10:55:00",
                "price": "150.00",
                "adult_price": null,
                "child_price": null,
                "infant_price": null,
                "duration": "2h 25m",
                "created_at": "2026-09-15T13:43:37.000Z",
                "updated_at": "2026-09-15T13:43:37.000Z"
            }
        ],
        "bookings": [
            {
                "id": 2,
                "pnr_code": "HK892345",
                "user_id": 1,
                "flight_id": 5,
                "departure_date": "2026-11-20",
                "cabin_class": "ECONOMY",
                "adult_count": 3,
                "child_count": 2,
                "infant_count": 2,
                "contact_full_name": "Aung Aung 2",
                "contact_email": "aung@gmail.com 2",
                "contact_phone": "+959123456789 2",
                "special_requests": "Window seat preferred 2",
                "total_amount": "4502.00",
                "status": "PENDING",
                "created_at": "2026-10-04T06:02:38.000Z",
                "updated_at": "2026-10-04T06:02:38.000Z"
            },
            {
                "id": 1,
                "pnr_code": "BK892341",
                "user_id": 1,
                "flight_id": 5,
                "departure_date": "2026-11-25",
                "cabin_class": "BUSINESS",
                "adult_count": 2,
                "child_count": 0,
                "infant_count": 0,
                "contact_full_name": "Aung Aung",
                "contact_email": "aung.updated@gmail.com",
                "contact_phone": "+959987654321",
                "special_requests": "Vegetarian meal required",
                "total_amount": "600.00",
                "status": "CONFIRMED",
                "created_at": "2026-10-04T05:59:57.000Z",
                "updated_at": "2026-10-04T06:10:33.000Z"
            }
        ],
        "reschedule_requests": [
            {
                "id": 3,
                "booking_id": 2,
                "user_id": 1,
                "new_travel_date": "05 Sep 2026",
                "preferred_time": "Morning",
                "status": "PENDING",
                "created_at": "2026-10-05T05:29:45.000Z",
                "updated_at": "2026-10-05T05:29:45.000Z"
            },
            {
                "id": 2,
                "booking_id": 2,
                "user_id": 1,
                "new_travel_date": "05 Sep 2026",
                "preferred_time": "Morning",
                "status": "PENDING",
                "created_at": "2026-10-05T05:29:00.000Z",
                "updated_at": "2026-10-05T05:29:00.000Z"
            }
        ],
        "refund_requests": [
            {
                "id": 2,
                "booking_id": 2,
                "user_id": 1,
                "reason": "Medical emergency",
                "status": "PENDING",
                "created_at": "2026-10-05T09:38:31.000Z",
                "updated_at": "2026-10-05T09:38:31.000Z"
            },
            {
                "id": 1,
                "booking_id": 1,
                "user_id": 1,
                "reason": "Medical emergency 222",
                "status": "REJECTED",
                "created_at": "2026-10-05T09:34:49.000Z",
                "updated_at": "2026-10-05T10:37:47.000Z"
            }
        ],
        "banner": {
            "id": 1,
            "title": "Test Title Name",
            "subtitle1": "subtitle1 Name",
            "subtitle2": "subtitle2 Name",
            "image_url": "http://localhost:5000/http://localhost:5000/images/banner/f52df254-5f66-4ee1-9437-8ad91bd2f7cc.webp",
            "updated_at": "2026-09-19T12:08:56.000Z"
        },
        "categories": [
            {
                "id": 1,
                "title": "Updated Title for category",
                "color": "#22BCB0",
                "icon_url": null,
                "created_at": "2026-09-20T01:30:34.000Z",
                "updated_at": "2026-09-20T01:51:14.000Z"
            },
            {
                "id": 3,
                "title": "Updated Title for category",
                "color": "#22BCB0",
                "icon_url": "http://localhost:5000/images/airfair_category/58bc7c2e-c676-454f-8c56-0261d301e138.webp",
                "created_at": "2026-09-20T02:45:07.000Z",
                "updated_at": "2026-09-20T02:45:07.000Z"
            }
        ],
        "cateogry_items": [
            {
                "id": 2,
                "category_id": 3,
                "image_url": "http://localhost:5000/images/airfair_category_items/ec46f4ca-aaea-4019-901b-0dd86feefb05.webp",
                "from": "Yangon",
                "to": "Ngapali Beach",
                "price": "¥ 450",
                "date": "Friday, December 5, 2025",
                "discount": "0.8 discount",
                "created_at": "2026-09-20T04:08:45.000Z",
                "updated_at": "2026-09-20T04:08:45.000Z"
            },
            {
                "id": 3,
                "category_id": 3,
                "image_url": "http://localhost:5000/images/airfair_category_items/5a28d6d5-fcaf-403f-a1fd-3631cd1f40a9.webp",
                "from": "Yangon 2",
                "to": "Ngapali Beach 2",
                "price": "¥ 1150",
                "date": "Friday, December 9, 2025",
                "discount": "1.8 discount",
                "created_at": "2026-09-20T04:10:44.000Z",
                "updated_at": "2026-09-20T04:24:02.000Z"
            }
        ],
         "trustCards": [
            {
                "id": "card_1",
                "title": "Best price guarantee",
                "description": "Find a lower price elsewhere...",
                "color": "#20C997",
                "updated_at": "2026-10-03T03:07:47.000Z"
            },
            {
                "id": "card_2",
                "title": "Wide selection of airlines",
                "description": "Choose from 100+ domestic...",
                "color": "#F99B35",
                "updated_at": "2026-10-03T03:07:47.000Z"
            },
            {
                "id": "card_3",
                "title": "24/7 travel support",
                "description": "Our airline experts are available...",
                "color": "#20C997",
                "updated_at": "2026-10-03T03:07:47.000Z"
            }
        ],
         "refundCards": [
            {
                "id": "refund_card_1",
                "title": "needHelp",
                "description": "needHelpText",
                "color": "#20C997",
                "updated_at": "2026-10-04T23:22:36.000Z"
            },
            {
                "id": "refund_card_2",
                "title": "processingTime",
                "description": "processingTimeText",
                "color": "#FFF8EE",
                "updated_at": "2026-10-04T23:22:36.000Z"
            },
            {
                "id": "refund_card_3",
                "title": "secureService",
                "description": "secureServiceText",
                "color": "#20C997",
                "updated_at": "2026-10-04T23:22:36.000Z"
            }
        ],
        "faqs": [
            {
                "id": 2,
                "question": "2222What is the status of my refund request, and when will it be credited?2222",
                "answer": "2222It typically takes 7 to 20 business days. Under federal regulations, airlines must issue refunds within 7 business days if you paid by credit card, and within 20 business days if you paid by cash or check.",
                "is_active": true,
                "created_at": "2026-10-04T08:04:12.000Z",
                "updated_at": "2026-10-04T08:04:12.000Z"
            },
            {
                "id": 1,
                "question": "Can I get a full refund for my non-refundable ticket because of a severe schedule change?",
                "answer": "Yes, if an airline makes a significant schedule change or delay, you are entitled to a full refund to your original payment method.",
                "is_active": true,
                "created_at": "2026-10-04T08:02:19.000Z",
                "updated_at": "2026-10-04T08:22:26.000Z"
            }
        ]
    }
}
```

---
---

# Travel

## 1. SQL code of creating `special_offers_and_deals` in database

```sql
CREATE TABLE special_offers_and_deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    meta VARCHAR(255),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### GET /api/special_offer_and_deal/all

- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "title": "Early Bird Discount 2",
            "description": "Book 60 days in advance and get 15% off selected tours 2",
            "meta": "Valid until: Dec 31, 2025 2",
            "CreatedAt": "2026-10-30T08:59:17.000Z",
            "updatedAt": "2026-10-30T09:10:32.000Z"
        },
        {
            "id": 2,
            "title": "Early Bird Discount 3",
            "description": "Book 60 days in advance and get 15% off selected tours 3",
            "meta": "Valid until: Dec 31, 2025 3",
            "CreatedAt": "2026-10-30T09:12:49.000Z",
            "updatedAt": "2026-10-30T09:12:49.000Z"
        }
    ]
}
```

### POST /api/special_offer_and_deal

- `Only admin` can use this route.

#### Payload

- `title` must exit

```json
{
    "title" : "Early Bird Discount",
    "description" : "Book 60 days in advance and get 15% off selected tours",
    "meta" : "Valid until: Dec 31, 2025"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 1,
        "title": "Early Bird Discount",
        "description": "Book 60 days in advance and get 15% off selected tours",
        "meta": "Valid until: Dec 31, 2025",
        "CreatedAt": "2026-10-30T08:59:17.000Z",
        "updatedAt": "2026-10-30T08:59:17.000Z"
    }
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Title is required"
}
```


### PUT /api/special_offer_and_deal

- `Only admin` can use this route.

#### Payload

-  `id` and `title` must exit

```json
{
    "id" : 1,
    "title" : "Early Bird Discount 2",
    "description" : "Book 60 days in advance and get 15% off selected tours 2",
    "meta" : "Valid until: Dec 31, 2025 2"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully updated.",
    "data": {
        "id": 1,
        "title": "Early Bird Discount 2",
        "description": "Book 60 days in advance and get 15% off selected tours 2",
        "meta": "Valid until: Dec 31, 2025 2",
        "CreatedAt": "2026-10-30T08:59:17.000Z",
        "updatedAt": "2026-10-30T09:10:32.000Z"
    }
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```

```json
{
    "status": false,
    "message": "Id and title are required"
}
```

### DELETE /api/special_offer_and_deal/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/special_offer_and_deal/1

/api/special_offer_and_deal/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
```


#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---

## 2. SQL code of creating `travel_group_on_banners` in database

```sql
CREATE TABLE travel_group_on_banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_title VARCHAR(255) NOT NULL,
    items TEXT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


### GET /api/travel_group_on_banners/all

- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "group_title": "Popular Cities 2",
            "items": "Harbin, Lijiang, Sanya, Beijing, Shanghai 2",
            "CreatedAt": "2026-10-30T10:04:46.000Z",
            "updatedAt": "2026-10-30T10:13:00.000Z"
        },
        {
            "id": 2,
            "group_title": "Islands & Spots",
            "items": "Bali, Phuket, Iceland, Hong Kong, Taiwan",
            "CreatedAt": "2026-10-30T10:07:54.000Z",
            "updatedAt": "2026-10-30T10:07:54.000Z"
        }
    ]
}
```


### POST /api/travel_group_on_banners

- `Only admin` can use this route.

#### Payload

- `groupTitle` must exit

```json
{
    "groupTitle" : "Islands & Spots",
    "items" : "Bali, Phuket, Iceland, Hong Kong, Taiwan"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 2,
        "group_title": "Islands & Spots",
        "items": "Bali, Phuket, Iceland, Hong Kong, Taiwan",
        "CreatedAt": "2026-10-30T10:07:54.000Z",
        "updatedAt": "2026-10-30T10:07:54.000Z"
    }
}
```

#### Error response

```json
{
    "status": false,
    "message": "Group title is required"
}
```

### PUT /api/travel_group_on_banners

- `Only admin` can use this route.

#### Payload

-  `id` and `groupTitle` must exit

```json
{
    "id" : 1,
    "groupTitle" : "Popular Cities 2",
    "items" : "Harbin, Lijiang, Sanya, Beijing, Shanghai 2"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully updated.",
    "data": {
        "id": 1,
        "group_title": "Popular Cities 2",
        "items": "Harbin, Lijiang, Sanya, Beijing, Shanghai 2",
        "CreatedAt": "2026-10-30T10:04:46.000Z",
        "updatedAt": "2026-10-30T10:13:00.000Z"
    }
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```

```json
{
    "status": false,
    "message": "Id and group title are required"
}
```


### DELETE /api/travel_group_on_banners/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/travel_group_on_banners/1

/api/travel_group_on_banners/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---

## 3. SQL code of creating `travel_banner_images` in database

```sql
CREATE TABLE travel_banner_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    travel_banner_image_url TEXT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### GET /api/travel_banner_images/all

- No payload required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "travel_banner_image_url": "http://localhost:5000/images/travel_banner/99f0e42c-6f7b-478d-84df-20201642697a.webp",
            "CreatedAt": "2026-10-30T10:46:56.000Z",
            "updatedAt": "2026-10-30T10:46:56.000Z"
        },
        {
            "id": 2,
            "travel_banner_image_url": "http://localhost:5000/images/travel_banner/873f4b3a-7447-4b5e-8d28-6887d8ad11c3.webp",
            "CreatedAt": "2026-10-30T10:48:18.000Z",
            "updatedAt": "2026-10-30T10:48:18.000Z"
        },
        {
            "id": 3,
            "travel_banner_image_url": "https://i.pinimg.com/736x/78/8c/8f/788c8f18e5853a01a1776f00f709b6cb.jpg",
            "CreatedAt": "2026-10-30T10:53:33.000Z",
            "updatedAt": "2026-10-30T10:53:33.000Z"
        }
    ]
}
```

### POST /api/travel_banner_images

- `Only admin` can use this route.

#### Request Body

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("image", imageFile);
//or
formData.append("image_url", "https://i.pinimg.com/736x/78/8c/8f/788c8f18e5853a01a1776f00f709b6cb.jpg");


fetch("domain/api/travel_banner_image", {
  method: "POST",
  body: formData
});
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 2,
        "travel_banner_image_url": "http://localhost:5000/images/travel_banner/873f4b3a-7447-4b5e-8d28-6887d8ad11c3.webp",
        "CreatedAt": "2026-10-30T10:48:18.000Z",
        "updatedAt": "2026-10-30T10:48:18.000Z"
    }
}
```

### Error response

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```


### PUT /api/travel_banner_images

- `Only admin` can use this route.

#### Request Body

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | YES | id to delete |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("id", 2);

formData.append("image", imageFile);
//or
formData.append("image_url", "https://i.pinimg.com/736x/78/8c/8f/788c8f18e5853a01a1776f00f709b6cb.jpg");


fetch("domain/api/travel_banner_image", {
  method: "PUT",
  body: formData
});
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully updated.",
    "data": {
        "id": 2,
        "travel_banner_image_url": "https://i.pinimg.com/736x/78/8c/8f/788c8f18e5853a01a1776f00f709b6cb.jpg",
        "CreatedAt": "2026-10-30T10:48:18.000Z",
        "updatedAt": "2026-10-30T11:37:31.000Z"
    }
}
```

### Error response

```json
{
    "status": false,
    "message": "Id and one of Image file or image_url are required"
}
```

```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```


### DELETE /api/travel_banner_images/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/travel_banner_images/1

/api/travel_banner_images/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---

## 4. SQL code of creating `testimonials` in database

```sql
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    avatar_image_url VARCHAR(500),
    rating DECIMAL(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
    review_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


### GET /api/travel_testimonials/all

- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "customer_name": "Li Ming",
            "destination": "Traveled to Zhangjiajie",
            "avatar_image_url": "https://randomuser.me/api/portraits/men/54.jpg",
            "rating": "4.8",
            "review_text": "Zhangjiajie was breathtaking!",
            "created_at": "2026-10-30T22:34:09.000Z",
            "updated_at": "2026-10-30T22:34:09.000Z"
        },
        {
            "id": 2,
            "customer_name": "Li Ming 3",
            "destination": "Traveled to Zhangjiajie 3",
            "avatar_image_url": "https://randomuser.me/api/portraits/men/54.jpg 3",
            "rating": "4.4",
            "review_text": "Zhangjiajie was breathtaking! 3",
            "created_at": "2026-10-30T22:55:45.000Z",
            "updated_at": "2026-10-30T23:19:28.000Z"
        }
    ]
}
```

### POST /api/travel_testimonials

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `customerName` | string | YES | customer name |
| `destination` | string | YES | destination |
| `rating` | decimal | YES | rating |
| `reviewText` | string | YES | reviewText |
| `image` | file | YES | Image file to upload |
| `avatarImageUrl` | string | YES | The image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("customerName", "Li Ming");
formData.append("destination",  "Traveled to Zhangjiajie");
formData.append("rating", 4.8);
formData.append("reviewText", "Zhangjiajie was breathtaking!");

formData.append("image", imageFile);
//or
formData.append("avatarImageUrl", "https://i.pinimg.com/736x/78/8c/8f/788c8f18e5853a01a1776f00f709b6cb.jpg");


fetch("domain/api/travel_testimonials", {
  method: "POST",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 3,
        "customer_name": "Li Ming",
        "destination": "Traveled to Zhangjiajie",
        "avatar_image_url": "http://localhost:5000/images/travel_testimonial/7601c250-aaae-45a3-95ff-03dfc8f6fba8.webp",
        "rating": "4.8",
        "review_text": "Zhangjiajie was breathtaking!",
        "created_at": "2026-10-31T02:30:49.000Z",
        "updated_at": "2026-10-31T02:30:49.000Z"
    }
}
```

#### Error response

```json
{
    "status": false,
    "message": "Customer name, destination, avatar image url, rating and review text are required"
}
```


### PUT /api/travel_testimonials

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | YES | id of the row to update |
| `customerName` | string | YES | customer name |
| `destination` | string | YES | destination |
| `rating` | decimal | YES | rating |
| `reviewText` | string | YES | reviewText |
| `image` | file | YES | Image file to upload |
| `avatarImageUrl` | string | YES | The image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("id", 3);
formData.append("customerName", "Li Ming 2");
formData.append("destination",  "Traveled to Zhangjiajie 2");
formData.append("rating", 4.4);
formData.append("reviewText", "Zhangjiajie was breathtaking! 1");

formData.append("image", imageFile);
//or
formData.append("avatarImageUrl", "https://i.pinimg.com/736x/78/8c/8f/788c8f18e5853a01a1776f00f709b6cb.jpg");


fetch("domain/api/travel_testimonials", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully updated.",
    "data": {
        "id": 3,
        "customer_name": "Li Ming 2",
        "destination": "Traveled to Zhangjiajie 2",
        "avatar_image_url": "https://i.pinimg.com/736x/78/8c/8f/788c8f18e5853a01a1776f00f709b6cb.jpg",
        "rating": "4.4",
        "review_text": "Zhangjiajie was breathtaking! 1",
        "created_at": "2026-10-31T02:30:49.000Z",
        "updated_at": "2026-10-31T02:34:51.000Z"
    }
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```

```json
{
    "status": false,
    "message": "Id, customer name, destination, avatar image url, rating and review text are required"
}
```


### DELETE /api/travel_testimonials/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/travel_testimonials/1

/api/travel_testimonials/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---

## 5. SQL code of creating `tourism_tour_package` in database

```sql
CREATE TABLE tourism_tour_package (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_name VARCHAR(255) NOT NULL,
    category ENUM('Domestic', 'Local', 'Overseas') NOT NULL DEFAULT 'Domestic',
    price DECIMAL(10,2) NOT NULL,
    old_price DECIMAL(10,2) NULL,
    rating DECIMAL(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
    discount_tag VARCHAR(50) NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


### GET /api/tourism_tour_packages/all

- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "package_name": "Yangon-Mandalay 2-Day Tour",
            "category": "Domestic",
            "price": "3999.00",
            "old_price": "4699.00",
            "rating": "4.5",
            "discount_tag": "15% OFF",
            "description": "Experience the vibrant culture of Yangon City.",
            "image_url": "http://localhost:5000/images/tourism_tour_package/622d5e90-b2d9-45a5-b12b-b037fe6269e2.webp",
            "created_at": "2026-10-31T03:40:22.000Z",
            "updated_at": "2026-10-31T03:40:22.000Z"
        },
        {
            "id": 2,
            "package_name": "Yangon-Mandalay 2-Day Tour 2",
            "category": "Domestic",
            "price": "3992.00",
            "old_price": "4692.00",
            "rating": "4.2",
            "discount_tag": "12% OFF",
            "description": "Experience the vibrant culture of Yangon City. 2",
            "image_url": "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop",
            "created_at": "2026-10-31T03:40:36.000Z",
            "updated_at": "2026-10-31T03:42:28.000Z"
        }
    ]
}
```

### POST /api/tourism_tour_packages

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `package_name` | string | YES | package_name |
| `category` | Enum | YES | must be one of ('Domestic', 'Local', 'Overseas') |
| `price` | decimal | YES | current price |
| `old_price` | decimal | No | old price |
| `rating` | decimal | YES | rating |
| `discount_tag` | string | YES | discount_tag |
| `description` | string | YES | description |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The image_url |

#### Example

```js
const formData = new FormData();

formData.append("package_name", "Yangon-Mandalay 2-Day Tour");
formData.append("category",  "Domestic");
formData.append("price", 3999);
formData.append("old_price", 4699);
formData.append("rating", 4.5);
formData.append("discount_tag", "15% OFF");
formData.append("description", "Experience the vibrant culture of Yangon City.");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop");


fetch("domain/api/tourism_tour_packages", {
  method: "POST",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 1,
        "package_name": "Yangon-Mandalay 2-Day Tour",
        "category": "Domestic",
        "price": "3999.00",
        "old_price": "4699.00",
        "rating": "4.5",
        "discount_tag": "15% OFF",
        "description": "Experience the vibrant culture of Yangon City.",
        "image_url": "http://localhost:5000/images/tourism_tour_package/622d5e90-b2d9-45a5-b12b-b037fe6269e2.webp",
        "created_at": "2026-10-31T03:40:22.000Z",
        "updated_at": "2026-10-31T03:40:22.000Z"
    }
}
```

#### Error response

```json
{
    "status": false,
    "message": "Package_name , category , price , rating and description are required"
}
```

```json
{
    "status": false,
    "message": "Category must exactly be one of Domestic, Local, Overseas"
}
```


### PUT /api/tourism_tour_packages

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | YES | id of row to update |
| `package_name` | string | YES | package_name |
| `price` | decimal | YES | current price |
| `old_price` | decimal | No | old price |
| `rating` | decimal | YES | rating |
| `discount_tag` | string | YES | discount_tag |
| `description` | string | YES | description |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The image_url |

#### Example

```js
const formData = new FormData();

formData.append("id", 2);
formData.append("package_name", "Yangon-Mandalay 2-Day Tour 2");
formData.append("price", 3992);
formData.append("old_price", 4692);
formData.append("rating", 4.2);
formData.append("discount_tag", "2% OFF");
formData.append("description", "Experience the vibrant culture of Yangon City. 2");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop");


fetch("domain/api/tourism_tour_packages", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully updated.",
    "data": {
        "id": 2,
        "package_name": "Yangon-Mandalay 2-Day Tour 2",
        "category": "Domestic",
        "price": "3992.00",
        "old_price": "4692.00",
        "rating": "4.2",
        "discount_tag": "12% OFF",
        "description": "Experience the vibrant culture of Yangon City. 2",
        "image_url": "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop",
        "created_at": "2026-10-31T03:40:36.000Z",
        "updated_at": "2026-10-31T03:42:28.000Z"
    }
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```

```json
{
    "status": false,
    "message": "Id , package_name , price , rating and description are required"
}
```


### DELETE /api/travel_testimonials/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/travel_testimonials/1

/api/travel_testimonials/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---

## 6. SQL code of creating `tourism_tour_booking` in database

```sql
CREATE TABLE tourism_tour_booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NULL,
    email_address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tour_package
        FOREIGN KEY (package_id) 
        REFERENCES tourism_tour_package(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);
```

### GET /api/tourism_tour_booking/all

- Only `admin` can get all bookings
- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "package_id": 1,
            "user_id": 2,
            "full_name": "John Doe",
            "email_address": "john.doe@example.com",
            "phone_number": "+959123456789",
            "address": "123 Main Street, Yankin Township, Yangon",
            "booking_status": "Cancelled",
            "created_at": "2026-11-01T11:26:05.000Z",
            "updated_at": "2026-11-01T11:39:18.000Z"
        },
        {
            "id": 2,
            "package_id": 1,
            "user_id": 3,
            "full_name": "John Doe",
            "email_address": "john.doe@example.com",
            "phone_number": "+959123456789",
            "address": "123 Main Street, Yankin Township, Yangon",
            "booking_status": "Cancelled",
            "created_at": "2026-11-01T11:26:05.000Z",
            "updated_at": "2026-11-01T11:39:18.000Z"
        }
    ]
}
```


### GET /api/tourism_tour_booking/user

- `Authenticated user` can get their bookings
- No payment required

#### Response

```json
{
    "status": true,
    "message": "User-related bookings are here",
    "data": [
        {
            "id": 1,
            "package_id": 1,
            "user_id": 2,
            "full_name": "John Doe",
            "email_address": "john.doe@example.com",
            "phone_number": "+959123456789",
            "address": "123 Main Street, Yankin Township, Yangon",
            "booking_status": "Cancelled",
            "created_at": "2026-11-01T11:26:05.000Z",
            "updated_at": "2026-11-01T11:39:18.000Z"
        },
        {
            "id": 2,
            "package_id": 2,
            "user_id": 2,
            "full_name": "John Doe",
            "email_address": "john.doe@example.com",
            "phone_number": "+959123456789",
            "address": "123 Main Street, Yankin Township, Yangon",
            "booking_status": "Pending",
            "created_at": "2026-11-01T11:59:54.000Z",
            "updated_at": "2026-11-01T11:59:54.000Z"
        }
    ]
}
```

### POST /api/tourism_tour_booking

- `Only authenticated user` can use this route.

#### Payload

```json
{
  "packageId": 1,
  "fullName": "John Doe",
  "emailAddress": "john.doe@example.com",
  "phoneNumber": "+959123456789",
  "address": "123 Main Street, Yankin Township, Yangon"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 1,
        "package_id": 1,
        "user_id": 2,
        "full_name": "John Doe",
        "email_address": "john.doe@example.com",
        "phone_number": "+959123456789",
        "address": "123 Main Street, Yankin Township, Yangon",
        "booking_status": "Pending",
        "created_at": "2026-11-01T11:26:05.000Z",
        "updated_at": "2026-11-01T11:26:05.000Z"
    }
}
```

#### Error response

```json
{
    "status": false,
    "message": "Package does not exit in database!"
}
```
```json
{
    "status": false,
    "message": "PackageId, fullName, emailAddress, phoneNumber and address are required"
}
```

### PATCH /api/travel_group_on_banners

- Both `user` and `admin` can use this route.

#### Payload

-  `id` and `bookingStatus` must exit
- `bookingStatus` must be one of `'Pending', 'Confirmed', 'Cancelled'`

```json
{
    "id" : 1,
    "bookingStatus" : "Cancelled"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully Cancelled"
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```

```json
{
    "status": false,
    "message": "Id and bookingStatus are required"
}
```


### DELETE /api/travel_group_on_banners/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/travel_group_on_banners/1

/api/travel_group_on_banners/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
``` 

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---

## 7. SQL code of creating `travel_banners_unity` in database

```sql
CREATE TABLE travel_banners_unity (
    id VARCHAR(50) PRIMARY KEY,
    background_image_url VARCHAR(500) NULL,
    tag VARCHAR(100) NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 7.1 For local tours banner

### GET /api/local_tours_bunner

- No payment required

#### Response

```json
{
    "status": true,
    "message": "local_tours_bunner is here.",
    "data": {
        "background_image_url": "http://localhost:5000/images/local_tours_bunner/b5d37442-633b-4c04-88dd-a4ba139453c6.webp",
        "title": "Discover Hidden Gems Around Shanghai",
        "subtitle": "Explore the most beautiful scenery around Shanghai, experience different travels",
        "created_at": "2026-11-02T10:48:03.000Z",
        "updated_at": "2026-11-02T11:25:51.000Z"
    }
}
```

### PUT /api/local_tours_bunner

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | YES | title |
| `subtitle` | string | YES | subtitle |
| `image` | file | YES | Image file to upload |
| `background_image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("title", "Discover Hidden Gems Around Shanghai");
formData.append("subtitle",  "Explore the most beautiful scenery around Shanghai, experience different travels");

formData.append("image", imageFile);
//or
formData.append("background_image_url", "https://images.unsplash.com/photo-1503386435952-d7918b99e4e3?w=1350&q=80");


fetch("domain/api/local_tours_bunner", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully edited.",
    "data": {
        "background_image_url": "http://localhost:5000/images/local_tours_bunner/b5d37442-633b-4c04-88dd-a4ba139453c6.webp",
        "title": "Discover Hidden Gems Around Shanghai",
        "subtitle": "Explore the most beautiful scenery around Shanghai, experience different travels",
        "created_at": "2026-11-02T10:48:03.000Z",
        "updated_at": "2026-11-02T11:25:51.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Title and subtitle are required"
}
```


## 7.2 For private customize travel banner

### GET /api/private_customize_travel_banner

- No payment required

#### Response

```json
{
    "status": true,
    "message": "private_customize_travel_banner is here.",
    "data": {
        "background_image_url": "http://localhost:5000/images/private_customize_travel_banner/4fb2ae8b-05a9-4050-9fa1-5f1de5678c4b.webp",
        "title": "Customize Your Dream Trip",
        "subtitle": "Tell us where you want to go and our experts will design the perfect itinerary just for you.",
        "created_at": "2026-11-02T11:19:55.000Z",
        "updated_at": "2026-11-02T11:21:16.000Z",
        "badge": "Premium Travel Service"
    }
}
```

### PUT /api/private_customize_travel_banner

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `badge` | string | NO | title |
| `title` | string | YES | title |
| `subtitle` | string | YES | subtitle |
| `image` | file | YES | Image file to upload |
| `background_image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("badge", "Premium Travel Service");
formData.append("title", "Customize Your Dream Trip");
formData.append("subtitle",  "Tell us where you want to go and our experts will design the perfect itinerary just for you.");

formData.append("image", imageFile);
//or
formData.append("background_image_url", "https://images.unsplash.com/photo-1503386435952-d7918b99e4e3?w=1350&q=80");


fetch("domain/api/private_customize_travel_banner", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully edited.",
    "data": {
        "background_image_url": "http://localhost:5000/images/private_customize_travel_banner/4fb2ae8b-05a9-4050-9fa1-5f1de5678c4b.webp",
        "title": "Customize Your Dream Trip",
        "subtitle": "Tell us where you want to go and our experts will design the perfect itinerary just for you.",
        "created_at": "2026-11-02T11:19:55.000Z",
        "updated_at": "2026-11-02T11:21:16.000Z",
        "badge": "Premium Travel Service"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Title and subtitle are required"
}
```

## 7.3 For insurance banner

### GET /api/insurance_banner

- No payment required

#### Response

```json
{
    "status": true,
    "message": "insurance_banner is here.",
    "data": {
        "background_image_url": "http://localhost:5000/images/insurance_banner/05ca1608-8fec-4811-8f09-6ef1651390a6.webp",
        "title": "Global Travel Insurance",
        "subtitle": "Comprehensive protection for your journeys worldwide. Travel with peace of mind knowing you're covered.",
        "created_at": "2026-11-02T11:29:55.000Z",
        "updated_at": "2026-11-02T11:29:55.000Z",
        "tag": "Kimberley Insurance Agents"
    }
}
```

### PUT /api/insurance_banner

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `tag` | string | NO | title |
| `title` | string | YES | title |
| `subtitle` | string | YES | subtitle |
| `image` | file | YES | Image file to upload |
| `background_image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("tag", "Kimberley Insurance Agents");
formData.append("title", "Global Travel Insurance");
formData.append("subtitle",  "Comprehensive protection for your journeys worldwide. Travel with peace of mind knowing you're covered.");

formData.append("image", imageFile);
//or
formData.append("background_image_url", "https://images.unsplash.com/photo-1503386435952-d7918b99e4e3?w=1350&q=80");


fetch("domain/api/insurance_banner", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully edited.",
    "data": {
        "background_image_url": "http://localhost:5000/images/insurance_banner/48d6a0d3-eb93-4085-a9c0-816636a92ed6.webp",
        "title": "Global Travel Insurance",
        "subtitle": "Comprehensive protection for your journeys worldwide. Travel with peace of mind knowing you're covered.",
        "created_at": "2026-11-02T11:29:55.000Z",
        "updated_at": "2026-11-02T11:31:03.000Z",
        "tag": "Kimberley Insurance Agents"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Title and subtitle are required"
}
```

---

## 8. SQL code of creating `travel_styles` in database

```sql
CREATE TABLE travel_styles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(50) NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


### GET /api/travel_style/all

- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "title": "Day Trips",
            "icon": "fa-calendar-day",
            "image_url": "http://localhost:5000/images/travel_styles/9ce40184-cf72-4d39-a423-47c6f4b0b819.webp",
            "created_at": "2026-11-03T01:03:08.000Z",
            "updated_at": "2026-11-03T01:03:08.000Z"
        },
        {
            "id": 2,
            "title": "Day Trips 2",
            "icon": "fa-calendar-day 2",
            "image_url": "http://localhost:5000/images/travel_styles/430375ee-cc77-4f96-a8e6-4195c880b2c2.webp",
            "created_at": "2026-11-03T01:09:44.000Z",
            "updated_at": "2026-11-03T01:17:31.000Z"
        }
    ]
}
```


### POST /api/travel_style

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | YES | title |
| `icon` | string | NO | icon |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("title", "Day Trips");
formData.append("tag", "fa-calendar-day");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=500&q=60");


fetch("domain/api/travel_style", {
  method: "POST",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 1,
        "title": "Day Trips",
        "icon": "fa-calendar-day",
        "image_url": "http://localhost:5000/images/travel_styles/9ce40184-cf72-4d39-a423-47c6f4b0b819.webp",
        "created_at": "2026-11-03T01:03:08.000Z",
        "updated_at": "2026-11-03T01:03:08.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```
```json
{
    "status": false,
    "message": "Title is required"
}
```

### PUT /api/travel_style

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | YES | id of the row to update |
| `title` | string | YES | title |
| `icon` | string | NO | icon |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("id", 2);
formData.append("title", "Day Trips 2");
formData.append("tag", "fa-calendar-day 2");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=500&q=60");


fetch("domain/api/travel_style", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully updated.",
    "data": {
        "id": 2,
        "title": "Day Trips 2",
        "icon": "fa-calendar-day 2",
        "image_url": "http://localhost:5000/images/travel_styles/430375ee-cc77-4f96-a8e6-4195c880b2c2.webp",
        "created_at": "2026-11-03T01:09:44.000Z",
        "updated_at": "2026-11-03T01:17:31.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```
```json
{
    "status": false,
    "message": "Id and title are required"
}
```
```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```


### DELETE /api/travel_style/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/travel_style/1

/api/travel_style/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
``` 

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---

## 9. SQL code of creating `travel_local_popular_destinations` in database

```sql
CREATE TABLE travel_local_popular_destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


### GET /api/travel_style/all

- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "title": "Hangzhou",
            "description": "West Lake scenery, paradise on earth",
            "image_url": "http://localhost:5000/images/local_popular_destinations/2393ecf5-3e28-41b4-83c4-556d945bf09d.webp",
            "created_at": "2026-11-03T02:33:45.000Z",
            "updated_at": "2026-11-03T02:33:45.000Z"
        },
        {
            "id": 2,
            "title": "Hangzhou 2",
            "description": "West Lake scenery, paradise on earth 2",
            "image_url": "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=500&q=60",
            "created_at": "2026-11-03T02:34:11.000Z",
            "updated_at": "2026-11-03T02:39:50.000Z"
        }
    ]
}
```


### POST /api/local_popular_destination

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | YES | title |
| `description` | string | NO | description |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("title", "Hangzhou");
formData.append("description", "West Lake scenery, paradise on earth");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=500&q=60");


fetch("domain/api/local_popular_destination", {
  method: "POST",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 2,
        "title": "Hangzhou",
        "description": "West Lake scenery, paradise on earth",
        "image_url": "http://localhost:5000/images/local_popular_destinations/1647bab2-6e93-4345-bc0b-0e7e651cacc5.webp",
        "created_at": "2026-11-03T02:34:11.000Z",
        "updated_at": "2026-11-03T02:34:11.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```
```json
{
    "status": false,
    "message": "Title is required"
}
```

### PUT /api/local_popular_destination

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | YES | id of the row to update |
| `title` | string | YES | title |
| `description` | string | NO | description |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("id", 2);
formData.append("title", "Hangzhou 2");
formData.append("description", "West Lake scenery, paradise on earth 2");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=500&q=60");


fetch("domain/api/local_popular_destination", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully updated.",
    "data": {
        "id": 2,
        "title": "Hangzhou 2",
        "description": "West Lake scenery, paradise on earth 2",
        "image_url": "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=500&q=60",
        "created_at": "2026-11-03T02:34:11.000Z",
        "updated_at": "2026-11-03T02:39:50.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```
```json
{
    "status": false,
    "message": "Id and title are required"
}
```
```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```


### DELETE /api/local_popular_destination/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/local_popular_destination/1

/api/local_popular_destination/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
``` 

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---


## 9. SQL code of creating `travel_local_explore_attractions` in database

```sql
CREATE TABLE travel_local_explore_attractions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
    image_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


### GET /api/local_explore_attractions/all

- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "title": "The Bund",
            "description": "City walk | Night view",
            "price": "0.00",
            "rating": "4.6",
            "image_url": "http://localhost:5000/images/local_explore_attractions/4b97a4cc-0589-407b-bb02-c70a49b276cd.webp",
            "created_at": "2026-11-03T05:49:29.000Z",
            "updated_at": "2026-11-03T05:49:29.000Z"
        },
        {
            "id": 2,
            "title": "The Bund 2",
            "description": "City walk | Night view 2",
            "price": "366.00",
            "rating": "5.0",
            "image_url": "http://localhost:5000/images/local_explore_attractions/596bbf2c-0ce8-43b8-9325-488e1fb185af.webp",
            "created_at": "2026-11-03T05:50:30.000Z",
            "updated_at": "2026-11-03T05:51:17.000Z"
        }
    ]
}
```


### POST /api/local_explore_attractions

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | YES | title |
| `description` | string | NO | description |
| `price` | decimal | No | current price  |
| `rating` | decimal | YES | rating ( 1 to 5 ) |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("title", "The Bund");
formData.append("description", "City walk | Night view");
formData.append("price", 0);
formData.append("rating", 4.6);

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=500&q=60");


fetch("domain/api/local_explore_attractions", {
  method: "POST",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 1,
        "title": "The Bund",
        "description": "City walk | Night view",
        "price": "0.00",
        "rating": "4.6",
        "image_url": "http://localhost:5000/images/local_explore_attractions/4b97a4cc-0589-407b-bb02-c70a49b276cd.webp",
        "created_at": "2026-11-03T05:49:29.000Z",
        "updated_at": "2026-11-03T05:49:29.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```
```json
{
    "status": false,
    "message": "Title and rating is required"
}
```
```json
{
    "status": false,
    "message": "Rating must be between 1 and 5!"
}
```

### PUT /api/local_explore_attractions

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | YES | id of the row to update |
| `title` | string | YES | title |
| `description` | string | NO | description |
| `price` | decimal | No | current price  |
| `rating` | decimal | YES | rating ( 1 to 5 ) |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("id", 2);
formData.append("title", "The Bund 2");
formData.append("description", "City walk | Night view 2");
formData.append("price", 366);
formData.append("rating", 5);

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=500&q=60");


fetch("domain/api/local_popular_destination", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully updated.",
    "data": {
        "id": 2,
        "title": "The Bund 2",
        "description": "City walk | Night view 2",
        "price": "366.00",
        "rating": "5.0",
        "image_url": "http://localhost:5000/images/local_explore_attractions/596bbf2c-0ce8-43b8-9325-488e1fb185af.webp",
        "created_at": "2026-11-03T05:50:30.000Z",
        "updated_at": "2026-11-03T05:51:17.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```
```json
{
    "status": false,
    "message": "Id, title and rating are required"
}
```
```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```
```json
{
    "status": false,
    "message": "Rating must be between 1 and 5!"
}
```


### DELETE /api/local_explore_attractions/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/local_explore_attractions/1

/api/local_explore_attractions/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
``` 

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---

## 10. SQL code of creating `travel_local_explore_attractions_bookings` in database

```sql
CREATE TABLE travel_local_explore_attractions_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attraction_id INT NOT NULL,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_local_explore_attractions
        FOREIGN KEY (attraction_id) 
        REFERENCES travel_local_explore_attractions(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_attraction_booking_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);
```


### GET /api/local_explore_attractions_booking/all

- Only `admin` can get all bookings
- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "attraction_id": 1,
            "user_id": 2,
            "full_name": "John Doe",
            "email_address": "john.doe@example.com",
            "phone_number": "+959123456789",
            "address": "123 Main Street, Yankin Township, Yangon",
            "booking_status": "Confirmed",
            "created_at": "2026-11-03T06:14:49.000Z",
            "updated_at": "2026-11-03T06:16:41.000Z"
        },
        {
            "id": 2,
            "attraction_id": 1,
            "user_id": 2,
            "full_name": "John Doe 2",
            "email_address": "john.doe@example.com 2",
            "phone_number": "+959123456789 2",
            "address": "123 Main Street, Yankin Township, Yangon 2",
            "booking_status": "Pending",
            "created_at": "2026-11-03T06:16:07.000Z",
            "updated_at": "2026-11-03T06:16:07.000Z"
        },
        {
            "id": 3,
            "attraction_id": 1,
            "user_id": 1,
            "full_name": "John Doe 2",
            "email_address": "john.doe@example.com 2",
            "phone_number": "+959123456789 2",
            "address": "123 Main Street, Yankin Township, Yangon 2",
            "booking_status": "Pending",
            "created_at": "2026-11-03T06:16:07.000Z",
            "updated_at": "2026-11-03T06:16:07.000Z"
        }
    ]
}
```


### GET /api/local_explore_attractions_booking/user

- `Authenticated user` can get their bookings
- No payment required

#### Response

```json
{
    "status": true,
    "message": "User-related bookings are here",
    "data": [
        {
            "id": 1,
            "attraction_id": 1,
            "user_id": 2,
            "full_name": "John Doe",
            "email_address": "john.doe@example.com",
            "phone_number": "+959123456789",
            "address": "123 Main Street, Yankin Township, Yangon",
            "booking_status": "Confirmed",
            "created_at": "2026-11-03T06:14:49.000Z",
            "updated_at": "2026-11-03T06:16:41.000Z"
        },
        {
            "id": 2,
            "attraction_id": 1,
            "user_id": 2,
            "full_name": "John Doe 2",
            "email_address": "john.doe@example.com 2",
            "phone_number": "+959123456789 2",
            "address": "123 Main Street, Yankin Township, Yangon 2",
            "booking_status": "Pending",
            "created_at": "2026-11-03T06:16:07.000Z",
            "updated_at": "2026-11-03T06:16:07.000Z"
        }
    ]
}
```

### POST /api/local_explore_attractions_booking

- `Only authenticated user` can use this route.

#### Payload

```json
{
  "attractionId": 1,
  "fullName": "John Doe",
  "emailAddress": "john.doe@example.com",
  "phoneNumber": "+959123456789",
  "address": "123 Main Street, Yankin Township, Yangon"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 1,
        "attraction_id": 1,
        "user_id": 2,
        "full_name": "John Doe",
        "email_address": "john.doe@example.com",
        "phone_number": "+959123456789",
        "address": "123 Main Street, Yankin Township, Yangon",
        "booking_status": "Pending",
        "created_at": "2026-11-03T06:14:49.000Z",
        "updated_at": "2026-11-03T06:14:49.000Z"
    }
}
```

#### Error response

```json
{
    "status": false,
    "message": "Attraction does not exit in database!"
}
```
```json
{
    "status": false,
    "message": "AttractionId, fullName, emailAddress, phoneNumber and address are required"
}
```

### PATCH /api/local_explore_attractions_booking

- Both `user` and `admin` can use this route.

#### Payload

-  `id` and `bookingStatus` must exit
- `bookingStatus` must be one of `'Pending', 'Confirmed', 'Cancelled'`

```json
{
    "id" : 1,
    "bookingStatus" : "Confirmed"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully Confirmed"
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```

```json
{
    "status": false,
    "message": "Id and bookingStatus are required"
}
```


### DELETE /api/local_explore_attractions_booking/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/local_explore_attractions_booking/1

/api/local_explore_attractions_booking/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
``` 

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---


## 11. SQL code of creating `travel_local_group_tours` in database

```sql
CREATE TABLE travel_local_group_tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    badge  VARCHAR(100) NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 1.0 AND rating <= 5.0),
    image_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


### GET /api/travel_local_group_tours/all

- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "title": "Zhejiang Putuoshan 2D1N Group Tour",
            "badge": "Hot Selling",
            "description": "",
            "price": "398.00",
            "rating": "4.7",
            "image_url": "http://localhost:5000/images/travel_local_group_tours/61c25d61-1b48-405c-b2b3-e82040067863.webp",
            "created_at": "2026-11-03T07:04:58.000Z",
            "updated_at": "2026-11-03T07:04:58.000Z"
        },
        {
            "id": 2,
            "title": "Zhejiang Putuoshan 2D1N Group Tour 2",
            "badge": "Hot Selling 2",
            "description": "bla bla bla 2",
            "price": "3982.00",
            "rating": "4.2",
            "image_url": "http://localhost:5000/images/travel_local_group_tours/1f1a4ac2-117d-4c73-bf77-268cf7abd948.webp",
            "created_at": "2026-11-03T07:05:34.000Z",
            "updated_at": "2026-11-03T07:08:55.000Z"
        }
    ]
}
```


### POST /api/travel_local_group_tours

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | YES | title |
| `badge` | string | NO | badge |
| `description` | string | NO | description |
| `price` | decimal | No | current price  |
| `rating` | decimal | YES | rating ( 1 to 5 ) |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("title", "Zhejiang Putuoshan 2D1N Group Tour");
formData.append("badge", "Hot Selling");
formData.append("description", "");
formData.append("price", 398);
formData.append("rating", 4.7);

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1598974353350-4586bb9c5e5f?w=500&q=80");


fetch("domain/api/travel_local_group_tours", {
  method: "POST",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 1,
        "title": "Zhejiang Putuoshan 2D1N Group Tour",
        "badge": "Hot Selling",
        "description": "",
        "price": "398.00",
        "rating": "4.7",
        "image_url": "http://localhost:5000/images/travel_local_group_tours/61c25d61-1b48-405c-b2b3-e82040067863.webp",
        "created_at": "2026-11-03T07:04:58.000Z",
        "updated_at": "2026-11-03T07:04:58.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```
```json
{
    "status": false,
    "message": "Title and rating is required"
}
```
```json
{
    "status": false,
    "message": "Rating must be between 1 and 5!"
}
```

### PUT /api/travel_local_group_tours

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | YES | id of the row to update |
| `title` | string | YES | title |
| `badge` | string | NO | badge |
| `description` | string | NO | description |
| `price` | decimal | No | current price  |
| `rating` | decimal | YES | rating ( 1 to 5 ) |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("id", 2);
formData.append("title", "Zhejiang Putuoshan 2D1N Group Tour 2");
formData.append("badge", "Hot Selling 2");
formData.append("description", "bla bla bla 2");
formData.append("price", 3982);
formData.append("rating", 4.2);

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=500&q=60");


fetch("domain/api/travel_local_group_tours", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully updated.",
    "data": {
        "id": 2,
        "title": "Zhejiang Putuoshan 2D1N Group Tour 2",
        "badge": "Hot Selling 2",
        "description": "bla bla bla 2",
        "price": "3982.00",
        "rating": "4.2",
        "image_url": "http://localhost:5000/images/travel_local_group_tours/1f1a4ac2-117d-4c73-bf77-268cf7abd948.webp",
        "created_at": "2026-11-03T07:05:34.000Z",
        "updated_at": "2026-11-03T07:08:55.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```
```json
{
    "status": false,
    "message": "Id, title and rating are required"
}
```
```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```
```json
{
    "status": false,
    "message": "Rating must be between 1 and 5!"
}
```


### DELETE /api/travel_local_group_tours/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/local_explore_attractions/1

/api/local_explore_attractions/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
``` 

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---

## 12. SQL code of creating `travel_local_group_tours_bookings` in database

```sql
CREATE TABLE travel_local_group_tours_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    local_group_tour_id INT NOT NULL,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_travel_local_group_tours
        FOREIGN KEY (local_group_tour_id) 
        REFERENCES travel_local_group_tours(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_local_group_tour_booking_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);
```


### GET /api/travel_local_group_tours_bookings/all

- Only `admin` can get all bookings
- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "local_group_tour_id": 4,
            "user_id": 2,
            "full_name": "John Doe",
            "email_address": "john.doe@example.com",
            "phone_number": "+959123456789",
            "address": "123 Main Street, Yankin Township, Yangon",
            "booking_status": "Pending",
            "created_at": "2026-11-03T07:31:53.000Z",
            "updated_at": "2026-11-03T07:31:53.000Z"
        },
        {
            "id": 2,
            "local_group_tour_id": 4,
            "user_id": 1,
            "full_name": "John Doe",
            "email_address": "john.doe@example.com",
            "phone_number": "+959123456789",
            "address": "123 Main Street, Yankin Township, Yangon",
            "booking_status": "Confirmed",
            "created_at": "2026-11-03T07:32:12.000Z",
            "updated_at": "2026-11-03T07:35:26.000Z"
        }
    ]
}
```


### GET /api/travel_local_group_tours_bookings/user

- `Authenticated user` can get their bookings
- No payment required

#### Response

```json
{
    "status": true,
    "message": "User-related bookings are here",
    "data": [
        {
            "id": 1,
            "local_group_tour_id": 4,
            "user_id": 2,
            "full_name": "John Doe",
            "email_address": "john.doe@example.com",
            "phone_number": "+959123456789",
            "address": "123 Main Street, Yankin Township, Yangon",
            "booking_status": "Pending",
            "created_at": "2026-11-03T07:31:53.000Z",
            "updated_at": "2026-11-03T07:31:53.000Z"
        }
    ]
}
```

### POST /api/travel_local_group_tours_bookings

- `Only authenticated user` can use this route.

#### Payload

```json
{
  "localGroupTourId": 4,
  "fullName": "John Doe",
  "emailAddress": "john.doe@example.com",
  "phoneNumber": "+959123456789",
  "address": "123 Main Street, Yankin Township, Yangon"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 1,
        "local_group_tour_id": 4,
        "user_id": 2,
        "full_name": "John Doe",
        "email_address": "john.doe@example.com",
        "phone_number": "+959123456789",
        "address": "123 Main Street, Yankin Township, Yangon",
        "booking_status": "Pending",
        "created_at": "2026-11-03T07:31:53.000Z",
        "updated_at": "2026-11-03T07:31:53.000Z"
    }
}
```

#### Error response

```json
{
    "status": false,
    "message": "Local Group Tour does not exit in database!"
}
```
```json
{
    "status": false,
    "message": "localGroupTourId, fullName, emailAddress, phoneNumber and address are required"
}
```

### PATCH /api/travel_local_group_tours_bookings

- Both `user` and `admin` can use this route.

#### Payload

-  `id` and `bookingStatus` must exit
- `bookingStatus` must be one of `'Pending', 'Confirmed', 'Cancelled'`

```json
{
    "id" : 1,
    "bookingStatus" : "Confirmed"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully Confirmed"
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```

```json
{
    "status": false,
    "message": "Id and bookingStatus are required"
}
```


### DELETE /api/travel_local_group_tours_bookings/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/local_explore_attractions_booking/1

/api/local_explore_attractions_booking/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
``` 

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---


## 13. SQL code of creating `private_seasonal_hot_destinations` in database

```sql
CREATE TABLE private_seasonal_hot_destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration  VARCHAR(100) NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


### GET /api/private_seasonal_hot_destinations/all

- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "title": "Guangzhou Taste Tour",
            "duration": "4 Days",
            "price": "4999.00",
            "description": "Food & Culture",
            "image_url": "http://localhost:5000/images/private_seasonal_hot_destinations/ec07d963-a9fe-4163-adbe-41a10888b37f.webp",
            "created_at": "2026-11-03T08:47:29.000Z",
            "updated_at": "2026-11-03T08:47:29.000Z"
        },
        {
            "id": 2,
            "title": "Guangzhou Taste Tour 2",
            "duration": "2 Days",
            "price": "49992.00",
            "description": "Food & Culture 2",
            "image_url": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=500&q=80",
            "created_at": "2026-11-03T08:47:40.000Z",
            "updated_at": "2026-11-03T08:50:51.000Z"
        }
    ]
}
```


### POST /api/private_seasonal_hot_destinations

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | YES | title |
| `duration` | string | NO | badge |
| `price` | decimal | No | current price  |
| `description` | string | NO | description |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("title", "Guangzhou Taste Tour");
formData.append("duration", "4 Days");
formData.append("price", 4999);
formData.append("description", "Food & Culture");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=500&q=80");


fetch("domain/api/private_seasonal_hot_destinations", {
  method: "POST",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 1,
        "title": "Guangzhou Taste Tour",
        "duration": "4 Days",
        "price": "4999.00",
        "description": "Food & Culture",
        "image_url": "http://localhost:5000/images/private_seasonal_hot_destinations/ec07d963-a9fe-4163-adbe-41a10888b37f.webp",
        "created_at": "2026-11-03T08:47:29.000Z",
        "updated_at": "2026-11-03T08:47:29.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```
```json
{
    "status": false,
    "message": "Title is required"
}
```

### PUT /api/private_seasonal_hot_destinations

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | YES | id of the row to update |
| `title` | string | YES | title |
| `duration` | string | NO | badge |
| `price` | decimal | No | current price  |
| `description` | string | NO | description |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("id", 2);
formData.append("title", "Guangzhou Taste Tour 2");
formData.append("duration", "2 Days");
formData.append("price", 49992);
formData.append("description", "Food & Culture 2");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=500&q=80");


fetch("domain/api/private_seasonal_hot_destinations", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully updated.",
    "data": {
        "id": 2,
        "title": "Guangzhou Taste Tour 2",
        "duration": "2 Days",
        "price": "49992.00",
        "description": "Food & Culture 2",
        "image_url": "http://localhost:5000/images/private_seasonal_hot_destinations/bb305e5d-908e-46b2-8db3-a5fc730cf61f.webp",
        "created_at": "2026-11-03T08:47:40.000Z",
        "updated_at": "2026-11-03T08:49:49.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```
```json
{
    "status": false,
    "message": "Id, title and rating are required"
}
```
```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```
```json
{
    "status": false,
    "message": "Rating must be between 1 and 5!"
}
```


### DELETE /api/private_seasonal_hot_destinations/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/local_explore_attractions/1

/api/local_explore_attractions/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
``` 

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---


## 14. SQL code of creating `private_seasonal_hot_destinations_bookings` in database

```sql
CREATE TABLE private_seasonal_hot_destinations_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seasonal_hot_destination_id INT NOT NULL,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    special_requests TEXT NULL,
    booking_status ENUM('Pending', 'Confirmed', 'Cancelled') NOT NULL DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_seasonal_hot_destination
        FOREIGN KEY (seasonal_hot_destination_id) 
        REFERENCES private_seasonal_hot_destinations(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    CONSTRAINT fk_seasonal_hot_destination_booking_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);
```


### GET /api/private_seasonal_hot_destinations_bookings/all

- Only `admin` can get all bookings
- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "seasonal_hot_destination_id": 2,
            "user_id": 2,
            "full_name": "John Doe",
            "email_address": "john.doe@example.com",
            "phone_number": "+959123456789",
            "special_requests": "Vagetarial foods and fruit juice, please",
            "booking_status": "Cancelled",
            "created_at": "2026-11-03T09:24:01.000Z",
            "updated_at": "2026-11-03T09:25:22.000Z"
        },
        {
            "id": 2,
            "seasonal_hot_destination_id": 2,
            "user_id": 1,
            "full_name": "John Doe",
            "email_address": "john.doe@example.com",
            "phone_number": "+959123456789",
            "special_requests": "Vagetarial foods and fruit juice, please",
            "booking_status": "Pending",
            "created_at": "2026-11-03T09:24:27.000Z",
            "updated_at": "2026-11-03T09:24:42.000Z"
        }
    ]
}
```


### GET /api/private_seasonal_hot_destinations_bookings/user

- `Authenticated user` can get their bookings
- No payment required

#### Response

```json
{
    "status": true,
    "message": "User-related bookings are here",
    "data": [
        {
            "id": 1,
            "seasonal_hot_destination_id": 2,
            "user_id": 2,
            "full_name": "John Doe",
            "email_address": "john.doe@example.com",
            "phone_number": "+959123456789",
            "special_requests": "Vagetarial foods and fruit juice, please",
            "booking_status": "Cancelled",
            "created_at": "2026-11-03T09:24:01.000Z",
            "updated_at": "2026-11-03T09:25:22.000Z"
        }
    ]
}
```

### POST /api/private_seasonal_hot_destinations_bookings

- `Only authenticated user` can use this route.

#### Payload

```json
{
  "seasonalHotDestinationId": 2,
  "fullName": "John Doe",
  "emailAddress": "john.doe@example.com",
  "phoneNumber": "+959123456789",
  "specialRequests": "Vagetarial foods and fruit juice, please"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 1,
        "seasonal_hot_destination_id": 2,
        "user_id": 2,
        "full_name": "John Doe",
        "email_address": "john.doe@example.com",
        "phone_number": "+959123456789",
        "special_requests": "Vagetarial foods and fruit juice, please",
        "booking_status": "Pending",
        "created_at": "2026-11-03T09:24:01.000Z",
        "updated_at": "2026-11-03T09:24:01.000Z"
    }
}
```

#### Error response

```json
{
    "status": false,
    "message": "Local Group Tour does not exit in database!"
}
```
```json
{
    "status": false,
    "message": "localGroupTourId, fullName, emailAddress, phoneNumber and address are required"
}
```

### PATCH /api/private_seasonal_hot_destinations_bookings

- Both `user` and `admin` can use this route.

#### Payload

-  `id` and `bookingStatus` must exit
- `bookingStatus` must be one of `'Pending', 'Confirmed', 'Cancelled'`

```json
{
    "id" : 1,
    "bookingStatus" : "Cancelled"
}
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully Cancelled"
}
```

#### Error Response

```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```

```json
{
    "status": false,
    "message": "Id and bookingStatus are required"
}
```


### DELETE /api/private_seasonal_hot_destinations_bookings/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/local_explore_attractions_booking/1

/api/local_explore_attractions_booking/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
``` 

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

---



## 15. SQL code of creating `travel_designers` in database

```sql
CREATE TABLE travel_designers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty  VARCHAR(100) NULL,
    description TEXT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```


### GET /api/travel_designers/all

- No payment required

#### Response

```json
{
    "status": true,
    "message": "All items are here",
    "data": [
        {
            "id": 1,
            "name": "Yang Jie",
            "specialty": "Sichuan Expert",
            "description": "Specializing in unique cultural and culinary experiences across Sichuan.",
            "image_url": "http://localhost:5000/images/travel_designers/f01065c3-73a8-47d3-aacd-de5778604524.webp",
            "created_at": "2026-11-03T09:52:49.000Z",
            "updated_at": "2026-11-03T09:52:49.000Z"
        },
        {
            "id": 2,
            "name": "Yang Jie 2",
            "specialty": "Sichuan Expert 2",
            "description": "Specializing in unique cultural and culinary experiences across Sichuan. 2",
            "image_url": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=500&q=80",
            "created_at": "2026-11-03T09:53:27.000Z",
            "updated_at": "2026-11-03T09:55:33.000Z"
        }
    ]
}
```


### POST /api/travel_designers

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | YES | name |
| `specialty` | string | NO | specialty |
| `description` | string | NO | description |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("name", "Yang Jie");
formData.append("specialty", "Sichuan Expert");
formData.append("description", "Specializing in unique cultural and culinary experiences across Sichuan.");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://randomuser.me/api/portraits/women/32.jpg");


fetch("domain/api/travel_designers", {
  method: "POST",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully created",
    "data": {
        "id": 1,
        "name": "Yang Jie",
        "specialty": "Sichuan Expert",
        "description": "Specializing in unique cultural and culinary experiences across Sichuan.",
        "image_url": "http://localhost:5000/images/travel_designers/f01065c3-73a8-47d3-aacd-de5778604524.webp",
        "created_at": "2026-11-03T09:52:49.000Z",
        "updated_at": "2026-11-03T09:52:49.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```
```json
{
    "status": false,
    "message": "name is required"
}
```

### PUT /api/travel_designers

- `Only admin` can use this route.

#### Payload

- This endpoint accepts data using `multipart/form-data`.
- The following fields should be included in the request body as `FormData`:

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | number | YES | id of the row to update |
| `name` | string | YES | name |
| `specialty` | string | NO | specialty |
| `description` | string | NO | description |
| `image` | file | YES | Image file to upload |
| `image_url` | string | YES | The background_image_url of the banner |

#### Example

```js
const formData = new FormData();

formData.append("id", 2);
formData.append("name", "Yang Jie 2");
formData.append("specialty", "Sichuan Expert 2");
formData.append("description", "Specializing in unique cultural and culinary experiences across Sichuan. 2");

formData.append("image", imageFile);
//or
formData.append("image_url", "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=500&q=60");


fetch("domain/api/travel_designers", {
  method: "PUT",
  body: formData
});
```

#### Success Response

```json
{
    "status": true,
    "message": "Successfully updated.",
    "data": {
        "id": 2,
        "name": "Yang Jie 2",
        "specialty": "Sichuan Expert 2",
        "description": "Specializing in unique cultural and culinary experiences across Sichuan. 2",
        "image_url": "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=500&q=80",
        "created_at": "2026-11-03T09:53:27.000Z",
        "updated_at": "2026-11-03T09:55:33.000Z"
    }
}
```

##### Error Response 

```json
{
    "status": false,
    "message": "Image file or image_url is required"
}
```
```json
{
    "status": false,
    "message": "Id, title and rating are required"
}
```
```json
{
    "status": false,
    "message": "Wrong  or invalid Id!"
}
```
```json
{
    "status": false,
    "message": "Rating must be between 1 and 5!"
}
```


### DELETE /api/travel_designers/:id

- `:id` is the id of item to delete
- `Only admin` can use this route.

#### Example 

```text
/api/local_explore_attractions/1

/api/local_explore_attractions/2
```

#### Success response

```json
{
    "status": true,
    "message": "Successfully deleted."
}
``` 

#### Error Response

```json
{
    "status": false,
    "message": "Wrong or invalid id!"
}
```

