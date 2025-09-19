# Blog Platform

A full-stack blog platform with authentication, CRUD, image upload, likes, and user profiles.

## Deployment

- **Frontend:** Deploy to Netlify
- **Backend:** Deploy to Render
- **Database:** MongoDB Atlas

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend.onrender.com
```
Add `.env` to `.gitignore`.

### Backend (.env)
```
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-jwt-secret
```
Add `.env` to `.gitignore`.

## Setup

1. Clone the repo
2. Add environment variables as above
3. Update API URLs in frontend to use `REACT_APP_API_URL`
4. Deploy frontend to Netlify, backend to Render
5. Set environment variables in Render and Netlify dashboards

## Notes
- Do not commit `.env` files or secrets
- Update CORS in backend to allow Netlify domain
- Clean up unused files and debug code before pushing

## Features
- User authentication
- Create, edit, delete posts
- Image upload
- Like/unlike posts
- View and edit user profile

---
For more help, see Netlify, Render, and MongoDB Atlas docs.
