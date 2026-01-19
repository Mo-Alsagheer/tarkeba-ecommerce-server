# Product Image Upload

## Overview
Products now support multiple image uploads (up to 10 images per product) via Cloudinary or local storage.

## Setup
Same as categories - see [CATEGORY_IMAGE_UPLOAD.md](CATEGORY_IMAGE_UPLOAD.md) for Cloudinary configuration.

## Usage

### Creating a Product with Images

**Endpoint:** `POST /api/products`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
```javascript
const formData = new FormData();
formData.append('name', 'Nike Air Max');
formData.append('slug', 'nike-air-max');
formData.append('description', 'Comfortable running shoes');

// Variants as JSON string
formData.append('variants', JSON.stringify([
  { size: 'S', price: 89.99, stock: 20 },
  { size: 'M', price: 99.99, stock: 50 },
  { size: 'L', price: 109.99, stock: 30 }
]));

// Categories as JSON string (array of ObjectIds)
formData.append('categories', JSON.stringify(['507f1f77bcf86cd799439011']));

// Multiple images (up to 10)
formData.append('images', file1);
formData.append('images', file2);
formData.append('images', file3);

// Boolean and number fields as strings
formData.append('isActive', 'true');
formData.append('isFeatured', 'false');
formData.append('weight', '0.5');

// Tags as JSON string
formData.append('tags', JSON.stringify(['shoes', 'sports', 'running']));
```

### Updating Product Images

**Endpoint:** `PATCH /api/products/:id`

**Note:** When updating with new images, old images are automatically deleted from Cloudinary.

```javascript
const formData = new FormData();
formData.append('name', 'Updated Product Name');
formData.append('images', newFile1); // Replace all existing images
formData.append('images', newFile2);
formData.append('isActive', 'true');
```

## Frontend Examples

### React/Next.js Example

```jsx
import { useState } from 'react';

function CreateProduct() {
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', 'Nike Air Max');
    formData.append('slug', 'nike-air-max');
    formData.append('description', 'Comfortable running shoes');
    
    // Add variants
    formData.append('variants', JSON.stringify([
      { size: 'M', price: 99.99, stock: 50 }
    ]));
    
    // Add categories
    formData.append('categories', JSON.stringify(['507f1f77bcf86cd799439011']));
    
    // Add multiple images
    files.forEach(file => {
      formData.append('images', file);
    });
    
    formData.append('isActive', 'true');
    
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    console.log('Product created:', data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />
      <button type="submit">Create Product</button>
    </form>
  );
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Nike Air Max" \
  -F "slug=nike-air-max" \
  -F "description=Comfortable running shoes" \
  -F 'variants=[{"size":"M","price":99.99,"stock":50}]' \
  -F 'categories=["507f1f77bcf86cd799439011"]' \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "images=@/path/to/image3.jpg" \
  -F "isActive=true" \
  -F "isFeatured=false" \
  -F 'tags=["shoes","sports"]'
```

## File Constraints

- **Max Files:** 10 images per product
- **Max File Size:** 10MB per image
- **Allowed Types:** JPEG, JPG, PNG, WebP
- **Upload Folder:** Images stored in `products` folder on Cloudinary

## Important Notes

### Data Type Conversions

When using `multipart/form-data`, send data as:

1. **Simple fields:** Strings directly
   ```javascript
   formData.append('name', 'Product Name');
   formData.append('slug', 'product-slug');
   ```

2. **Boolean fields:** String "true" or "false"
   ```javascript
   formData.append('isActive', 'true');
   formData.append('isFeatured', 'false');
   ```

3. **Number fields:** String numbers
   ```javascript
   formData.append('weight', '0.5');
   ```

4. **Arrays/Objects:** JSON strings
   ```javascript
   formData.append('variants', JSON.stringify([...]));
   formData.append('categories', JSON.stringify([...]));
   formData.append('tags', JSON.stringify([...]));
   ```

5. **Files:** Binary data
   ```javascript
   formData.append('images', file1);
   formData.append('images', file2);
   ```

### Response Example

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Nike Air Max",
  "slug": "nike-air-max",
  "description": "Comfortable running shoes",
  "variants": [
    {
      "size": "M",
      "price": 99.99,
      "stock": 50
    }
  ],
  "categories": ["507f1f77bcf86cd799439012"],
  "images": [
    "https://res.cloudinary.com/your-cloud/image/upload/v123456/products/image1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v123456/products/image2.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v123456/products/image3.jpg"
  ],
  "isActive": true,
  "isFeatured": false,
  "averageRating": 0,
  "reviewCount": 0,
  "createdAt": "2026-01-18T00:00:00.000Z",
  "updatedAt": "2026-01-18T00:00:00.000Z"
}
```

## Error Handling

### Common Errors

1. **File too large:**
   ```json
   {
     "statusCode": 400,
     "message": "File size exceeds maximum allowed size of 10485760 bytes"
   }
   ```

2. **Invalid file type:**
   ```json
   {
     "statusCode": 400,
     "message": "File type image/svg+xml is not allowed"
   }
   ```

3. **Validation error (invalid JSON in variants):**
   ```json
   {
     "statusCode": 400,
     "message": "Validation failed"
   }
   ```

## Tips

1. **Multiple Images:** Use the same field name `images` multiple times for multiple files
2. **Image Order:** Images are stored in the order they're appended to FormData
3. **Update Strategy:** When updating, new images replace ALL old images
4. **Partial Updates:** To keep existing images, don't send the `images` field
