# Debug Guide for Imagify

## Recent Bug Fixes (Latest Update)

### 1. Image Quality Options Fix
- **Issue**: Image quality options weren't working properly
- **Fix**: Enhanced backend processing with proper format validation and quality settings
- **Test**: Generate an image, try different formats (PNG, JPG, WebP) and resolutions (720p, 1080p, 4K)

### 2. Edited Image Download Fix
- **Issue**: Downloaded images didn't include edits made in the image editor
- **Fix**: Updated download logic to prioritize edited images over original images
- **Test**: Edit an image, then download - the downloaded file should include your edits

### 3. Image Editor Enhancements
- **Issue**: Limited text formatting options and scale functionality
- **Fix**: Added bold/italic text, emoji support, improved scale range (0.1x to 5x), quick scale buttons
- **Test**: Open image editor, try adding text with bold/italic, add emojis, test scale slider and quick buttons

## How to Test the Fixes

### Test 1: Image Quality Options
1. Generate a new image
2. Select different formats (PNG, JPG, WebP) from dropdown
3. Select different resolutions (Original, 720p, 1080p, 4K)
4. Click Download
5. Verify the downloaded file has the correct format and size

### Test 2: Edited Image Download
1. Generate a new image
2. Click "Edit Image"
3. Add some text, rotate, or scale the image
4. Click "Save Changes"
5. Click "Download"
6. Verify the downloaded file includes your edits

### Test 3: Image Editor Features
1. Open image editor
2. Test text formatting:
   - Add text and click Bold/Italic buttons
   - Add emojis from the emoji grid
   - Change text color and size
3. Test transformations:
   - Use rotation buttons (left/right)
   - Use scale slider (0.1x to 5x)
   - Use quick scale buttons (0.5x, 1x, 2x)
4. Test "Reset All" button

## Common Issues and Solutions

### Issue: Image Editor Not Showing Image
**Solution**: Check browser console for CORS errors. Make sure images are loaded with `crossOrigin="anonymous"`

### Issue: Download Not Working
**Solution**: 
1. Check if user is authenticated
2. Verify backend is running
3. Check browser console for errors
4. Ensure image history exists

### Issue: Text Not Appearing on Image
**Solution**:
1. Make sure text is entered in the input field
2. Click on the image to position the text
3. Check if text color contrasts with background

### Issue: Scale Not Working
**Solution**:
1. Use the slider (0.1x to 5x)
2. Try quick scale buttons
3. Check if image is properly loaded

## Backend Debugging

### Check Image Processing
```bash
# Check if sharp is installed
npm list sharp

# Test sharp functionality
node -e "const sharp = require('sharp'); console.log('Sharp version:', sharp.versions.sharp)"
```

### Check API Endpoints
```bash
# Test download endpoint
curl -X POST http://localhost:4000/api/image/download-image \
  -H "Content-Type: application/json" \
  -H "token: YOUR_TOKEN" \
  -d '{"historyId":"HISTORY_ID","format":"png","resolution":"original"}'
```

### Check MongoDB Connection
```bash
# Test database connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('YOUR_MONGODB_URI')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
"
```

## Frontend Debugging

### Check Console for Errors
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for any red error messages
4. Check Network tab for failed API calls

### Test Image Loading
```javascript
// In browser console
const img = new Image();
img.crossOrigin = 'anonymous';
img.onload = () => console.log('Image loaded successfully');
img.onerror = (e) => console.error('Image load error:', e);
img.src = 'YOUR_IMAGE_URL';
```

### Test Canvas Operations
```javascript
// In browser console
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
console.log('Canvas size:', canvas.width, 'x', canvas.height);
console.log('Context available:', !!ctx);
```

## Performance Tips

1. **Image Size**: Large images may cause performance issues. Consider resizing before editing
2. **Browser Memory**: Close and reopen browser if experiencing slowdowns
3. **Network**: Ensure stable internet connection for API calls

## Environment Variables Check

Make sure these are set in your `.env` file:
```
MONGODB_URI=your_mongodb_connection_string
CLIPDROP_API=your_clipdrop_api_key
JWT_SECRET=your_jwt_secret
```

## Logs to Monitor

### Backend Logs
- Image generation requests
- Download requests
- Database operations
- Sharp processing errors

### Frontend Logs
- API call responses
- Canvas drawing operations
- Image load events
- User interactions

## Quick Fixes

### If Images Don't Load
1. Check CORS settings
2. Verify image URLs
3. Clear browser cache

### If Editor Doesn't Work
1. Refresh the page
2. Check JavaScript console
3. Verify all dependencies are loaded

### If Download Fails
1. Check authentication
2. Verify backend is running
3. Check file permissions
4. Ensure sufficient disk space 