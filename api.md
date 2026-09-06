# This file is just for instruction of using api

### SQL code of creating transform table in database

```text
CREATE TABLE IF NOT EXISTS translations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  translation_key VARCHAR(100) NOT NULL UNIQUE,
  en TEXT DEFAULT NULL,
  zh TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

