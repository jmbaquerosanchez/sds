# SKILL: JSON Server Mock API Development

## Description

This skill guides you through using json-server v0.17.4 as a mock REST API backend for rapid prototyping and development. JSON Server provides a full fake REST API with zero coding, automatically generating RESTful endpoints from a JSON file with support for filtering, pagination, sorting, relationships, and full-text search.

## When to Use This Skill

- Setting up mock API endpoints for frontend development
- Creating fake data for prototyping and testing
- Implementing CRUD operations without a real backend
- Testing API integrations before backend is ready
- Adding query parameters, filters, and pagination to API calls
- Working with relational data and nested resources
- Debugging API calls during development

## Core Concepts

### Basic Setup

JSON Server reads a `db.json` file and automatically creates REST endpoints for each top-level key:

```json
{
  "users": [...],
  "products": [...],
  "plans": [...]
}
```

This generates endpoints:

- `GET /users`, `GET /users/1`, `POST /users`, etc.
- `GET /products`, `GET /products/1`, `POST /products`, etc.
- `GET /plans`, `GET /plans/1`, `POST /plans`, etc.

### Key Features

- **Automatic REST endpoints** for all resources
- **Query parameters** for filtering, pagination, sorting
- **Relationships** between resources via `_embed` and `_expand`
- **Full-text search** across all fields
- **CORS enabled** by default for cross-origin requests
- **Auto-save** changes to `db.json` on POST/PUT/PATCH/DELETE
- **Custom routes** via `routes.json` file

## Project Configuration

### Current Setup (SDS App)

- **Base URL**: `http://localhost:3000`
- **Database file**: [db.json](../../../db.json) at project root
- **Routes file**: [routes.json](../../../routes.json) (if using custom routes)
- **Start command**: `json-server --watch db.json --port 3000`

### Available Resources

Based on [db.json](../../../db.json), the app has these resources:

- **`/login`** - Authentication endpoint (singular)
- **`/logout`** - Logout endpoint (singular)
- **`/plans`** - Pricing plans (plural)
- **`/products`** - Product catalog (plural)
- **`/users`** - User accounts (plural, if defined)

## REST API Operations

### Standard CRUD Operations

#### GET - Retrieve Resources

```bash
# Get all items
GET /products

# Get single item by ID
GET /products/1

# Response includes all fields from db.json
{
  "id": "1",
  "name": "Product Name",
  "price": 99.99,
  "category": "electronics"
}
```

#### POST - Create Resource

```bash
POST /products
Content-Type: application/json

{
  "name": "New Product",
  "price": 49.99,
  "category": "books"
}

# Response: created item with auto-generated ID
{
  "id": "2",
  "name": "New Product",
  "price": 49.99,
  "category": "books"
}
```

#### PUT - Replace Resource

```bash
PUT /products/2
Content-Type: application/json

{
  "name": "Updated Product",
  "price": 59.99,
  "category": "books"
}

# Replaces entire resource (omitted fields removed)
```

#### PATCH - Update Resource

```bash
PATCH /products/2
Content-Type: application/json

{
  "price": 39.99
}

# Updates only specified fields
```

#### DELETE - Remove Resource

```bash
DELETE /products/2

# Response: empty object {}
# Item removed from db.json
```

## Query Parameters

### Filtering

Filter by exact match:

```bash
# Single field
GET /products?category=electronics

# Multiple fields (AND logic)
GET /products?category=electronics&inStock=true

# Multiple values for same field (OR logic)
GET /products?id=1&id=2

# Deep property access with dot notation
GET /products?manufacturer.country=USA
```

### Pagination

```bash
# Page number (10 items per page default)
GET /products?_page=2

# Custom page size
GET /products?_page=2&_limit=20

# Response headers include:
# Link: <url>; rel="first", <url>; rel="prev", <url>; rel="next", <url>; rel="last"
```

### Slice (Range)

```bash
# Get items 20-29 (like Array.slice)
GET /products?_start=20&_end=30

# Get 10 items starting at position 20
GET /products?_start=20&_limit=10

# Response headers include:
# X-Total-Count: total number of items
```

### Sorting

```bash
# Sort by single field (ascending by default)
GET /products?_sort=price

# Sort descending
GET /products?_sort=price&_order=desc

# Sort by multiple fields
GET /products?_sort=category,price&_order=asc,desc
```

### Operators

```bash
# Greater than or equal
GET /products?price_gte=50

# Less than or equal
GET /products?price_lte=100

# Range query
GET /products?price_gte=50&price_lte=100

# Not equal
GET /products?category_ne=electronics

# Like (regex supported)
GET /products?name_like=laptop

# Regex pattern
GET /products?name_like=^Pro.*
```

### Full-Text Search

Search across all fields:

```bash
# Searches all string fields for "laptop"
GET /products?q=laptop
```

### Relationships

#### Embed Child Resources

```bash
# Include related comments for each post
GET /posts?_embed=comments

# Include comments for specific post
GET /posts/1?_embed=comments

# Response:
{
  "id": 1,
  "title": "Post title",
  "comments": [
    { "id": 1, "postId": 1, "body": "comment" }
  ]
}
```

#### Expand Parent Resource

```bash
# Include parent post for each comment
GET /comments?_expand=post

# Include parent for specific comment
GET /comments/1?_expand=post

# Response:
{
  "id": 1,
  "postId": 1,
  "body": "comment",
  "post": {
    "id": 1,
    "title": "Post title"
  }
}
```

**Note**: Relationships work by convention:

- Resource name + `Id` suffix (e.g., `postId` links to `posts`)
- Can customize suffix with `--foreignKeySuffix` option

## Practical Examples

### Service Layer Implementation

```typescript
// src/data/services/productsService.ts
const API_BASE = "http://localhost:3000";

export const productsService = {
  // Get all products with filters
  async getAll(filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) {
    const params = new URLSearchParams();

    if (filters?.category) {
      params.append("category", filters.category);
    }
    if (filters?.minPrice !== undefined) {
      params.append("price_gte", filters.minPrice.toString());
    }
    if (filters?.maxPrice !== undefined) {
      params.append("price_lte", filters.maxPrice.toString());
    }
    if (filters?.search) {
      params.append("q", filters.search);
    }

    const response = await fetch(`${API_BASE}/products?${params}`);
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  // Get paginated products
  async getPaginated(page: number, limit: number = 10) {
    const response = await fetch(
      `${API_BASE}/products?_page=${page}&_limit=${limit}`,
    );
    if (!response.ok) throw new Error(response.statusText);

    // Get total count from header
    const total = response.headers.get("X-Total-Count");
    const data = await response.json();

    return {
      data,
      total: total ? parseInt(total) : data.length,
      page,
      limit,
    };
  },

  // Get single product by ID
  async getById(id: string) {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  // Create new product
  async create(product: Omit<Product, "id">) {
    const response = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  // Update product
  async update(id: string, updates: Partial<Product>) {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },

  // Delete product
  async delete(id: string) {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  },
};
```

### Authentication Pattern

```typescript
// src/data/services/authService.ts
export const authService = {
  async login(credentials: { email: string; password: string }) {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  async logout() {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
    });

    if (!response.ok) throw new Error("Logout failed");
    return response.json();
  },
};
```

### React Hook with Pagination

```typescript
// src/data/hooks/useProducts.ts
import { useState, useEffect } from "react";
import { productsService } from "../services/productsService";

export function useProducts(page: number = 1) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await productsService.getPaginated(page, 10);
        setProducts(result.data);
        setTotal(result.total);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  return { products, loading, error, total };
}
```

## Advanced Features

### Custom Routes

Create a `routes.json` file to add custom URL patterns:

```json
{
  "/api/*": "/$1",
  "/:resource/:id/show": "/:resource/:id",
  "/products/:category": "/products?category=:category",
  "/articles?id=:id": "/products/:id"
}
```

Start with: `json-server --watch db.json --routes routes.json`

Now you can use:

```bash
GET /api/products        # → /products
GET /products/1/show     # → /products/1
GET /products/electronics # → /products?category=electronics
```

### Generating Dynamic Data

Use JavaScript instead of JSON to generate data programmatically:

```javascript
// db.js
module.exports = () => {
  const data = {
    products: [],
    users: [],
  };

  // Generate 1000 products
  for (let i = 1; i <= 1000; i++) {
    data.products.push({
      id: i.toString(),
      name: `Product ${i}`,
      price: Math.floor(Math.random() * 1000),
      category: ["electronics", "books", "clothing"][i % 3],
    });
  }

  return data;
};
```

Start with: `json-server db.js`

**Tip**: Use libraries like [Faker](https://www.npmjs.com/package/@faker-js/faker) for realistic data:

```javascript
const { faker } = require("@faker-js/faker");

module.exports = () => {
  const products = [];

  for (let i = 1; i <= 100; i++) {
    products.push({
      id: i.toString(),
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      description: faker.commerce.productDescription(),
      image: faker.image.url(),
      inStock: faker.datatype.boolean(),
    });
  }

  return { products };
};
```

### Middleware for Custom Logic

Add custom behavior before JSON Server processes requests:

```javascript
// server.js
const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Add timestamps to all POST requests
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  }

  if (req.method === "PATCH" || req.method === "PUT") {
    req.body.updatedAt = Date.now();
  }

  next();
});

// Add authentication check
server.use((req, res, next) => {
  if (req.path === "/login" || req.path === "/logout") {
    next(); // Public routes
  } else if (req.headers.authorization) {
    next(); // Authenticated
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running on http://localhost:3000");
});
```

Run with: `node server.js`

### Custom Response Format

Modify the response structure:

```javascript
// Wrap all responses in a "data" property
router.render = (req, res) => {
  res.jsonp({
    success: true,
    data: res.locals.data,
    timestamp: Date.now(),
  });
};
```

## Best Practices

### ✅ DO

- **Use consistent ID formats** - String IDs work better than numbers for complex apps
- **Structure `db.json` with clear resource names** - Plural for collections, singular for single resources
- **Add foreign key relationships** - Use `resourceId` pattern (e.g., `userId`, `productId`)
- **Include `_page` and `_limit`** for large datasets to prevent performance issues
- **Use `_sort` and `_order`** to return predictable results for testing
- **Add `.gitignore` entry** for auto-generated backup files (`db.json~`)
- **Use `--read-only` flag** for demos to prevent accidental data changes
- **Test filters and queries** in Postman/Insomnia before implementing in code
- **Document custom routes** in your API documentation
- **Use environment variables** for API base URL to switch between mock and real APIs

### ❌ DON'T

- **Don't commit sensitive data** to `db.json` (even for mocks)
- **Don't rely on JSON Server in production** - It's for development only
- **Don't skip `Content-Type` header** on POST/PATCH/PUT - requests will fail silently
- **Don't modify `id` values** - JSON Server ignores ID changes in PUT/PATCH
- **Don't use overly complex nested structures** - Keep it flat, use relationships instead
- **Don't forget to run json-server** before starting your app
- **Don't hardcode `localhost:3000`** everywhere - use a constant or env variable
- **Don't skip error handling** in services - JSON Server can return errors

## CLI Options Reference

```bash
json-server [options] <source>

Common Options:
  --port, -p         Set port (default: 3000)
  --host, -H         Set host (default: localhost)
  --watch, -w        Watch file for changes
  --routes, -r       Path to routes file
  --static, -s       Set static files directory
  --read-only, --ro  Allow only GET requests
  --no-cors, --nc    Disable CORS
  --delay, -d        Add delay to responses (ms)
  --id, -i           Set database id property (default: "id")
  --foreignKeySuffix Set foreign key suffix (default: "Id")
  --quiet, -q        Suppress log messages

Examples:
  json-server db.json
  json-server --watch db.json --port 3000
  json-server db.js
  json-server http://example.com/db.json
  json-server db.json --routes routes.json
  json-server db.json --delay 1000
  json-server db.json --read-only
```

## Troubleshooting

### Problem: Changes not persisting

**Cause**: Not using `--watch` flag or JSON syntax error in `db.json`  
**Solution**: Use `json-server --watch db.json` and validate JSON syntax

### Problem: CORS errors in browser

**Cause**: JSON Server CORS is disabled or misconfigured  
**Solution**: JSON Server enables CORS by default; ensure you didn't use `--no-cors`

### Problem: POST/PATCH requests don't work

**Cause**: Missing `Content-Type: application/json` header  
**Solution**: Always include header in fetch/axios requests

### Problem: Relationship queries return nothing

**Cause**: Foreign key naming doesn't match convention  
**Solution**: Use `resourceId` format (e.g., `userId` for `users`) or set custom suffix

### Problem: Pagination not working

**Cause**: Using `_page` without checking for `Link` header  
**Solution**: Read `Link` or `X-Total-Count` headers from response

### Problem: Filter returns too many results

**Cause**: Using `_like` which does partial matching  
**Solution**: Use exact match (e.g., `?category=electronics`) or adjust regex

### Problem: Port already in use

**Cause**: Another process using port 3000  
**Solution**: Use `--port 3001` or kill existing process

## Integration with SDS App

### Current Architecture

The SDS app uses json-server with the following structure:

```
Project Root
├── db.json                    # Mock database
├── routes.json                # Custom routes (optional)
└── src/
    └── data/
        ├── services/          # API service layer
        │   ├── authService.ts
        │   ├── pricingService.ts
        │   └── productsService.ts
        ├── providers/         # Context providers
        ├── hooks/             # Custom React hooks
        └── types/             # TypeScript types
```

### Recommended Workflow

1. **Define data structure** in `db.json` with realistic mock data
2. **Create TypeScript types** in `src/data/types/` matching JSON structure
3. **Build service layer** in `src/data/services/` with proper error handling
4. **Create provider** in `src/data/providers/` to manage state
5. **Export custom hook** in `src/data/hooks/` for components to use

### Example: Adding a New Resource

```bash
# 1. Add to db.json
{
  "categories": [
    { "id": "1", "name": "Electronics", "slug": "electronics" },
    { "id": "2", "name": "Books", "slug": "books" }
  ]
}

# 2. Define TypeScript type
// src/data/types/categories.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
}

# 3. Create service
// src/data/services/categoriesService.ts
export const categoriesService = {
  async getAll() {
    const response = await fetch('http://localhost:3000/categories');
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  }
};

# 4. Use in component
import { categoriesService } from 'data/services/categoriesService';

function CategoriesDropdown() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoriesService.getAll().then(setCategories);
  }, []);

  return (
    <Select>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </Select>
  );
}
```

## Summary Checklist

When working with json-server, ensure you:

- [ ] `db.json` is properly formatted and committed to repo
- [ ] json-server is running (`npm run json-server` or similar)
- [ ] Service layer uses correct base URL (`http://localhost:3000`)
- [ ] All POST/PATCH/PUT requests include `Content-Type: application/json`
- [ ] Error handling implemented in all service methods
- [ ] TypeScript types match `db.json` structure
- [ ] Pagination implemented for large datasets
- [ ] Foreign keys follow `resourceId` convention for relationships
- [ ] Custom routes documented if using `routes.json`
- [ ] Environment-specific URL configuration (dev vs. production API)

## Additional Resources

- [Official json-server v0.17.4 Documentation](https://github.com/typicode/json-server/tree/v0.17.4)
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - Live example of json-server
- [My JSON Server](https://my-json-server.typicode.com/) - Host your own fake API
- [Faker.js](https://fakerjs.dev/) - Generate realistic fake data
- [Postman Collections](https://www.postman.com/) - Test API endpoints before coding
