# Category Image Upload

## Overview
The categories module now supports image uploads via Cloudinary (or local storage). Images are uploaded when creating or updating a category.

## Setup

### 1. Install Dependencies
All required dependencies are already installed:
- `cloudinary` - For cloud storage
- `multer` - For handling multipart/form-data
- `@types/multer` - TypeScript definitions

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# Choose storage provider: 'cloudinary', 'local', or 's3'
STORAGE_PROVIDER=cloudinary

# Cloudinary Configuration (if using cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Local Storage Configuration (if using local)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes
```

### 3. Get Cloudinary Credentials

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up or log in
3. From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
4. Add these to your `.env` file

## Usage

### Creating a Category with Image

**Endpoint:** `POST /api/categories`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
```
name: "Electronics"
slug: "electronics"
description: "Electronic devices and accessories"
image: <file>  // Select an image file
isActive: "true"  // Must be string "true" or "false"
sortOrder: "0"    // Must be string number
tags: ["gadgets", "tech"]  // Can be JSON string or array
```

**Note:** When using multipart/form-data:
- Boolean values should be sent as strings: `"true"` or `"false"`
- Number values should be sent as strings: `"0"`, `"10"`, etc.
- Arrays/Objects can be sent as JSON strings or native arrays

### Updating a Category with Image

**Endpoint:** `PATCH /api/categories/:id`

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
```
name: "Updated Electronics"
image: <file>  // Select a new image file (optional)
```

## Frontend Example

### Using JavaScript Fetch API

```javascript
const formData = new FormData();
formData.append('name', 'Electronics');
formData.append('slug', 'electronics');
formData.append('description', 'Electronic devices');
formData.append('image', fileInput.files[0]); // File from input element
formData.append('isActive', 'true');  // String, not boolean
formData.append('sortOrder', '0');     // String, not number
formData.append('tags', JSON.stringify(['gadgets', 'tech'])); // JSON string for arrays

const response = await fetch('http://localhost:3000/api/categories', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log('Category created:', data);
```

### Using Axios

```javascript
import axios from 'axios';

const formData = new FormData();
formData.append('name', 'Electronics');
formData.append('slug', 'electronics');
formData.append('image', file);

const response = await axios.post('http://localhost:3000/api/categories', formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});
```

### Using cURL

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Electronics" \
  -F "slug=electronics" \
  -F "description=El \
  -F "sortOrder=0" \
  -F "tags=[\"gadgets\",\"tech\"]"ectronic devices" \
  -F "image=@/path/to/image.jpg" \
  -F "isActive=true"
```

## File Constraints

- **Max File Size:** 5MB (configurable via MAX_FILE_SIZE env variable)
- **Allowed Types:** JPEG, JPG, PNG, WebP, GIF
- **Upload Folder:** Images are stored in the `categories` folder on Cloudinary

## Response

### Success Response (201 Created)

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Electronics",
  "slug": "electronics",
  "description": "Electronic devices and accessories",
  "image": "https://res.cloudinary.com/your-cloud/image/upload/v123456/categories/image.jpg",
  "isActive": true,
  "sortOrder": 0,
  "productCount": 0,
  "createdAt": "2026-01-18T00:00:00.000Z",
  "updatedAt": "2026-01-18T00:00:00.000Z"
}
```

### Error Response (400 Bad Request)

```json
{
  "statusCode": 400,
  "message": "File type image/svg+xml is not allowed. Allowed types: image/jpeg, image/jpg, image/png, image/webp",
  "error": "Bad Request"
}
```

## Features

### Automatic Image Management
- **Upload:** Images are automatically uploaded to Cloudinary when creating/updating categories
- **Delete:** Old images are automatically deleted when updating with a new image
- **Validation:** File size and type are validated before upload

### Storage Providers
The system supports multiple storage providers:
1. **Cloudinary** (Recommended) - Cloud-based image management
2. **Local** - Store files on the server filesystem  
3. **S3** - AWS S3 (implementation coming soon)

## Troubleshooting

### Image Upload Fails
1. Check Cloudinary credentials in `.env`
2. Verify STORAGE_PROVIDER is set to 'cloudinary'
3. Check file size is under 5MB
4. Ensure file type is allowed (JPEG, PNG, etc.)

### Cannot Read Properties of Undefined
If you see "Cannot read properties of undefined (reading 'findById')":
- Ensure AuthModule is imported in CategoriesModule
- Restart the NestJS server after configuration changes

## Implementation Details

### File Upload Service
Location: `src/modules/common/file-upload/`

The FileUploadService handles:
- File validation (size, type)
- Upload to Cloudinary/Local/S3
- File deletion
- Error handling

### Category Service Updates
- `create(createCategoryDto, image?)` - Accepts optional image file
- `update(id, updateCategoryDto, image?)` - Accepts optional image file and deletes old image

### Category Controller Updates
- Uses `@UseInterceptors(FileInterceptor('image'))` for file handling
- Swagger documentation updated with `@ApiConsumes('multipart/form-data')`
- `@ApiBody()` describes the form structure for documentation
