## 📝 API Documentation

This document outlines the available REST API endpoints for the `math` and `quotebook` services.

---

### **Math Service Endpoints**

This service provides basic mathematical calculations.

#### **GET /math/circle/:r**
* **Description:** Calculates the area and circumference of a circle.
* **Parameters:**
    * `r` (Path Parameter): The **radius** of the circle. Must be a number.
* **Response:** `application/json`
    ```json
    {
      "area": 3.14159...,
      "circumference": 6.28318...
    }
    ```

#### **GET /math/rectangle/:width/:height**
* **Description:** Calculates the area and perimeter of a rectangle.
* **Parameters:**
    * `width` (Path Parameter): The **width** of the rectangle. Must be a number.
    * `height` (Path Parameter): The **height** of the rectangle. Must be a number.
* **Response:** `application/json`
    ```json
    {
      "area": 8,
      "perimeter": 12
    }
    ```

#### **GET /math/power/:base/:exponent**
* **Description:** Calculates the result of a base raised to an exponent, with an option to return the square root of the base.
* **Parameters:**
    * `base` (Path Parameter): The base number.
    * `exponent` (Path Parameter): The exponent number.
    * `root` (Query Parameter, Optional): Set to `true` to include the square root of the base.
* **Response:** `application/json`
    ```json
    // Example: /math/power/4/2?root=true
    {
      "result": 16,
      "root": 2 
    }
    ```

---

### **Quotebook Service Endpoints**

This service manages a collection of categorized quotes.

#### **1.1 GET /quotebook/categories**
* **Description:** Retrieves a list of all available quote categories.
* **Response:** `text/plain`
    ```text
    A possible category is successQuotes
    A possible category is perseveranceQuotes
    A possible category is happinessQuotes
    ...
    ```

#### **1.2 GET /quotebook/quote/:category**
* **Description:** Retrieves a single random quote from the specified category.
* **Parameters:**
    * `category` (Path Parameter): The name of the quote category (e.g., `happinessQuotes`).
* **Response:** `application/json`
    ```json
    {
      "quote": "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      "author": "Winston S. Churchill"
    }
    ```
* **Error Response (400):** If the category is invalid.
    ```json
    {
      "error": "no category listed for [category]"
    }
    ```

#### **1.3 POST /quotebook/quote/new**
* **Description:** Adds a new quote to the specified category.
* **Body (Required):** `application/json` or `application/x-www-form-urlencoded`
    * `category`: The category to add the quote to.
    * `quote`: The text of the new quote.
    * `author`: The author of the new quote.
* **Successful Response (200):** `text/plain`
    ```text
    Success!
    ```
* **Error Response (400):** If any required parameter is missing or the category is invalid.
    ```json
    {
      "error": "invalid or insufficient user input"
    }
    ```