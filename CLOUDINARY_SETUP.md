# Cloudinary Setup Guide for LegalEase Onboarding

## 1. Cloudinary Dashboard Setup

### Create Upload Preset
1. Go to your Cloudinary Console: https://console.cloudinary.com/
2. Navigate to **Settings** → **Upload** → **Upload Presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `legalease_documents`
   - **Signing Mode**: `Unsigned` (for frontend uploads)
   - **Folder**: `legalease/documents`
   - **Allowed formats**: `pdf,jpg,jpeg,png,doc,docx`
   - **Max file size**: `10000000` (10MB)
   - **Auto backup**: `true`
   - **Overwrite**: `false`
5. Save the preset

### Configuration Details
- **Cloud Name**: `ddy6k5t37`
- **API Key**: `495198385214822`
- **Upload Preset**: `legalease_documents`

## 2. Frontend Configuration

The Cloudinary utility is already configured in `frontend/lib/cloudinary.ts` with the correct settings.

### Environment Variables (Optional)
If you want to use environment variables, create `.env.local` in the frontend folder:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ddy6k5t37
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=legalease_documents
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 3. Backend Configuration

The backend is configured to accept Cloudinary URLs instead of direct file uploads.

### Updated Endpoints:
- `POST /api/v1/onboarding/start` - Step 1: Basic Info
- `PUT /api/v1/onboarding/{business_id}/business-details` - Step 2: Business Details
- `POST /api/v1/onboarding/{business_id}/documents` - Step 3: Documents (Cloudinary URLs)
- `POST /api/v1/onboarding/{business_id}/complete` - Step 4: Complete

## 4. Testing the Complete Flow

### Start Backend
```bash
cd backend
python main.py
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Test Onboarding Flow
1. Navigate to http://localhost:3000/onboarding
2. **Step 1**: Fill in business basic information
3. **Step 2**: Fill in business details and contact info
4. **Step 3**: Upload documents using Cloudinary
   - Documents will be uploaded to Cloudinary automatically
   - URLs will be sent to backend
5. **Step 4**: Review and complete onboarding

## 5. Document Upload Process

### How it Works:
1. User selects file in frontend
2. Frontend validates file (type, size)
3. File uploads directly to Cloudinary via their API
4. Cloudinary returns secure URL
5. Frontend sends URL to backend
6. Backend stores Cloudinary URL in database

### Supported File Types:
- PDF documents
- Images: JPG, JPEG, PNG
- Word documents: DOC, DOCX
- Maximum size: 10MB per file

## 6. Troubleshooting

### Common Issues:

1. **Upload Preset Not Found**
   - Ensure `legalease_documents` preset exists in Cloudinary
   - Check that it's set to "Unsigned" mode

2. **CORS Errors**
   - Cloudinary allows uploads from any domain by default
   - Check browser console for specific errors

3. **File Upload Fails**
   - Check file size (max 10MB)
   - Verify file type is supported
   - Check browser network tab for API errors

4. **Backend Connection Issues**
   - Ensure backend is running on port 8000
   - Check MongoDB connection
   - Verify API endpoints are working

### Logging:
- Backend logs are available in console and logs/app.log
- Frontend errors appear in browser console
- Cloudinary upload progress is tracked in UI

## 7. Production Considerations

### Security:
- Use signed uploads in production
- Implement file type validation on backend
- Add rate limiting for uploads
- Consider adding file scanning for malware

### Performance:
- Enable auto-optimization in Cloudinary
- Use Cloudinary's CDN for fast delivery
- Implement image resizing for thumbnails
- Consider lazy loading for document previews

## 8. API Testing

You can test the backend endpoints directly:

```bash
# Step 1: Start onboarding
curl -X POST "http://localhost:8000/api/v1/onboarding/start" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Company",
    "legalEntityType": "Private Limited Company",
    "industry": "Technology & Software",
    "incorporationDate": "2023-01-01"
  }'

# Step 3: Upload documents (using Cloudinary URLs)
curl -X POST "http://localhost:8000/api/v1/onboarding/{business_id}/documents" \
  -H "Content-Type: application/json" \
  -d '{
    "incorporation": "https://res.cloudinary.com/ddy6k5t37/image/upload/v1234/legalease/documents/incorporation/file.pdf",
    "panCard": "https://res.cloudinary.com/ddy6k5t37/image/upload/v1234/legalease/documents/panCard/file.pdf"
  }'
```

## 9. Next Steps

After successful setup:
1. Test the complete onboarding flow
2. Check that data is stored correctly in MongoDB
3. Verify document URLs are accessible
4. Test error handling scenarios
5. Add additional validation as needed

The system is now ready for complete onboarding with Cloudinary file uploads! 