# API Testing Guide

This guide will help you test all CRUD operations and third-party API integrations.

## Testing Tools

You can use any of these tools:
- **curl** (command line)
- **Postman** (GUI)
- **Thunder Client** (VS Code extension)
- **Browser** (for GET requests)

## Base URL

Local: `http://localhost:8000/api`
Production: `https://your-backend-url.com/api`

---

## 1. Health Check

**Endpoint**: `GET /api/health/`

```bash
curl http://localhost:8000/api/health/
```

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-09T10:30:00Z",
  "database": "connected",
  "total_posts": 5
}
```

---

## 2. CREATE - Add New Post

**Endpoint**: `POST /api/posts/`

```bash
curl -X POST http://localhost:8000/api/posts/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Social Post",
    "content": "This is a test post created via API. Testing CRUD operations!",
    "platform": "twitter",
    "status": "published",
    "likes": 100,
    "shares": 50,
    "comments": 25,
    "impressions": 1000
  }'
```

**Expected Response**:
```json
{
  "id": 1,
  "title": "My First Social Post",
  "content": "This is a test post created via API. Testing CRUD operations!",
  "platform": "twitter",
  "status": "published",
  "likes": 100,
  "shares": 50,
  "comments": 25,
  "impressions": 1000,
  "engagement_rate": 17.5,
  "scheduled_time": null,
  "created_at": "2026-01-09T10:30:00Z",
  "updated_at": "2026-01-09T10:30:00Z"
}
```

---

## 3. READ - Get All Posts

**Endpoint**: `GET /api/posts/`

```bash
curl http://localhost:8000/api/posts/
```

**With Filters**:
```bash
# Filter by platform
curl http://localhost:8000/api/posts/?platform=twitter

# Filter by status
curl http://localhost:8000/api/posts/?status=published
```

**Expected Response**:
```json
[
  {
    "id": 1,
    "title": "My First Social Post",
    "content": "This is a test post...",
    "platform": "twitter",
    "status": "published",
    "likes": 100,
    "shares": 50,
    "comments": 25,
    "impressions": 1000,
    "engagement_rate": 17.5,
    "created_at": "2026-01-09T10:30:00Z",
    "updated_at": "2026-01-09T10:30:00Z"
  }
]
```

---

## 4. READ - Get Single Post

**Endpoint**: `GET /api/posts/{id}/`

```bash
curl http://localhost:8000/api/posts/1/
```

**Expected Response**: Same as create response

---

## 5. UPDATE - Full Update (PUT)

**Endpoint**: `PUT /api/posts/{id}/`

```bash
curl -X PUT http://localhost:8000/api/posts/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Post Title",
    "content": "This post has been updated with new content!",
    "platform": "twitter",
    "status": "published",
    "likes": 150,
    "shares": 75,
    "comments": 30,
    "impressions": 1500
  }'
```

---

## 6. UPDATE - Partial Update (PATCH)

**Endpoint**: `PATCH /api/posts/{id}/`

```bash
# Update only likes
curl -X PATCH http://localhost:8000/api/posts/1/ \
  -H "Content-Type: application/json" \
  -d '{"likes": 200}'

# Update status and likes
curl -X PATCH http://localhost:8000/api/posts/1/ \
  -H "Content-Type: application/json" \
  -d '{
    "status": "scheduled",
    "likes": 250,
    "scheduled_time": "2026-01-10T15:00:00Z"
  }'
```

---

## 7. DELETE - Remove Post

**Endpoint**: `DELETE /api/posts/{id}/`

```bash
curl -X DELETE http://localhost:8000/api/posts/1/
```

**Expected Response**:
```json
{
  "message": "Post deleted successfully"
}
```

---

## 8. Dashboard Statistics

**Endpoint**: `GET /api/posts/dashboard_stats/`

```bash
curl http://localhost:8000/api/posts/dashboard_stats/
```

**Expected Response**:
```json
{
  "total_posts": 10,
  "total_likes": 1500,
  "total_shares": 750,
  "total_comments": 300,
  "total_impressions": 15000,
  "avg_engagement_rate": 17.5,
  "posts_by_platform": {
    "twitter": 5,
    "instagram": 3,
    "facebook": 2,
    "linkedin": 0
  },
  "posts_by_status": {
    "draft": 2,
    "published": 7,
    "scheduled": 1
  },
  "recent_posts": [...]
}
```

---

## 9. Third-Party API - Social Trends

**Endpoint**: `GET /api/social-trends/`

```bash
curl http://localhost:8000/api/social-trends/
```

**Expected Response**:
```json
{
  "success": true,
  "trends": [
    {
      "id": 1,
      "title": "sunt aut facere repellat provident occaecati except",
      "content": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas",
      "engagement": 100,
      "source": "external_api"
    }
  ],
  "message": "Successfully fetched trending topics",
  "timestamp": "2026-01-09T10:30:00Z"
}
```

---

## 10. Third-Party API - Weather Data

**Endpoint**: `GET /api/weather/`

```bash
# Default location (New York)
curl http://localhost:8000/api/weather/

# Custom location
curl "http://localhost:8000/api/weather/?lat=51.5074&lon=-0.1278"
```

**Expected Response**:
```json
{
  "success": true,
  "weather": {
    "temperature": 15.5,
    "windspeed": 12.3,
    "time": "2026-01-09T10:00:00",
    "weathercode": 2
  },
  "location": {
    "latitude": "40.7128",
    "longitude": "-74.0060"
  },
  "message": "Weather data fetched successfully",
  "timestamp": "2026-01-09T10:30:00Z"
}
```

---

## Testing Workflow

### Complete CRUD Test Sequence

```bash
# 1. Create a post
curl -X POST http://localhost:8000/api/posts/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test content","platform":"twitter","status":"draft","likes":0,"shares":0,"comments":0,"impressions":0}'

# 2. Get all posts (note the ID from response)
curl http://localhost:8000/api/posts/

# 3. Update the post (use ID from step 1)
curl -X PATCH http://localhost:8000/api/posts/1/ \
  -H "Content-Type: application/json" \
  -d '{"likes": 100, "status": "published"}'

# 4. Get dashboard stats (see updated data)
curl http://localhost:8000/api/posts/dashboard_stats/

# 5. Delete the post
curl -X DELETE http://localhost:8000/api/posts/1/

# 6. Verify deletion
curl http://localhost:8000/api/posts/
```

---

## Common HTTP Status Codes

- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid data
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server error

---

## Postman Collection

Import this JSON to Postman for quick testing:

```json
{
  "info": {
    "name": "Social Media Dashboard API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Post",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Test Post\",\n  \"content\": \"Test content\",\n  \"platform\": \"twitter\",\n  \"status\": \"published\",\n  \"likes\": 100,\n  \"shares\": 50,\n  \"comments\": 25,\n  \"impressions\": 1000\n}"
        },
        "url": {"raw": "{{base_url}}/posts/"}
      }
    },
    {
      "name": "Get All Posts",
      "request": {
        "method": "GET",
        "url": {"raw": "{{base_url}}/posts/"}
      }
    },
    {
      "name": "Update Post",
      "request": {
        "method": "PATCH",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"likes\": 200}"
        },
        "url": {"raw": "{{base_url}}/posts/1/"}
      }
    },
    {
      "name": "Delete Post",
      "request": {
        "method": "DELETE",
        "url": {"raw": "{{base_url}}/posts/1/"}
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000/api"
    }
  ]
}
```

---

## Visual Testing Checklist

When recording your demo video, show:

- ✅ Creating a post through UI and API
- ✅ Viewing all posts in a list
- ✅ Editing a post and seeing changes reflect
- ✅ Deleting a post with confirmation
- ✅ Dashboard updating after CRUD operations
- ✅ Charts showing real-time data
- ✅ External API data (trends & weather) displaying
- ✅ Filtering and search functionality
- ✅ Responsive design on different screen sizes

---

Good luck with your demo! 🚀
