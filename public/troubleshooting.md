# Netlify Deployment Troubleshooting Guide

## 1. GitHub Repository Verification
- [x] Verify the repository contains all required files:
  - `index.html` with proper base href
  - `vite.config.ts` with correct build configuration
  - `netlify.toml` with proper redirects
  - All source files in `src/` directory
  - `package.json` with all dependencies
  - `.gitignore` excluding proper files

## 2. Netlify Configuration
- [ ] Check Site Settings > Build & Deploy > Build Settings:
  - Build command should be: `npm run build`
  - Publish directory should be: `dist`
  - Node.js version should be: 20.x
- [ ] Verify Deploy Settings:
  - Branch deploys are enabled for the correct branch
  - Auto publishing is enabled
  - Deploy previews are working

## 3. Environment Variables
- [ ] Required variables in Netlify (Site Settings > Build & Deploy > Environment):
  ```
  VITE_SUPABASE_URL=your_supabase_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```
- [ ] Production environment matches development

## 4. Asset Loading
- [ ] Check Network Tab in Browser Dev Tools:
  - All JavaScript files are loading (no 404s)
  - CSS files are being served correctly
  - Image URLs are valid and accessible
  - Font files are loading properly

## 5. Netlify Deploy Logs
Common errors to look for:
```
# Build Failed
Error: Cannot find module 'xyz'
- Solution: Check package.json and run npm install

# Missing Dependencies
Error: Module not found
- Solution: Add missing dependency to package.json

# Build Configuration
Error: No build command specified
- Solution: Verify build command in netlify.toml

# Environment Variables
Error: Missing environment variables
- Solution: Add required variables in Netlify dashboard
```

## 6. Browser Console Errors
Check for:
```javascript
// Missing Assets
GET https://your-site.netlify.app/assets/xyz.js 404
- Solution: Check vite.config.ts base path

// React Router Issues
Cannot GET /route
- Solution: Verify netlify.toml redirects

// Environment Variable Issues
process.env is undefined
- Solution: Check environment variable naming (VITE_*)
```

## Quick Fixes

1. Clear Netlify Cache:
   - Go to Site Settings > Build & Deploy > Clear build cache

2. Force HTTPS:
   - Enable "Force HTTPS" in Domain Management

3. Update Base URL:
   ```html
   <!-- Add to index.html -->
   <base href="/">
   ```

4. Fix Routing:
   ```toml
   # In netlify.toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

5. Update Vite Config:
   ```typescript
   // In vite.config.ts
   export default defineConfig({
     base: './',
     // ... other config
   });
   ```

## Still Having Issues?

1. Deploy with Debug Mode:
   - Set `DEBUG=*` in environment variables
   - Check detailed build logs

2. Test Locally:
   ```bash
   npm run build
   npx serve dist
   ```

3. Check Browser Support:
   - Verify browser compatibility
   - Test in multiple browsers

4. Network Issues:
   - Check CORS settings
   - Verify domain configuration