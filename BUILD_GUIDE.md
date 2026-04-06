# Build Guide - Finance Dashboard

## Overview
This document provides instructions for building and deploying the Finance Dashboard application.

## Build Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot module replacement (HMR).
- Server runs on `http://localhost:3000`
- Auto-opens in browser
- Live reload on file changes

### Production Build
```bash
npm run build
```
Creates optimized production bundle in the `dist/` directory.
- TypeScript compilation via `tsc`
- Minification with Terser
- Code splitting for vendor libraries
- CSS extraction and optimization
- Asset optimization (images, fonts)

### Preview Build
```bash
npm run preview
```
Serves the production build locally for testing.
- Shows exactly what will be deployed
- Useful for pre-deployment testing

## Build Output Structure

The production build generates the following directory structure:

```
dist/
├── index.html          # Main HTML entry point
├── js/
│   ├── react-vendor.[hash].js      # React & React DOM
│   ├── chart-vendor.[hash].js       # Recharts library
│   ├── icons-vendor.[hash].js       # Lucide React icons
│   └── index.[hash].js              # Application code
├── css/
│   └── index.[hash].css             # All styles bundled
└── images/
    └── [async images]              # Static images
```

## Build Configuration

### vite.config.ts
Key settings for production builds:

- **Output Directory**: `dist/`
- **Minification**: Terser (removes console.log and debugger statements in production)
- **Code Splitting**: Automatic vendor chunking
  - React dependencies
  - Chart library (Recharts)
  - Icon library (Lucide React)
- **Asset Handling**: 
  - Images in `dist/images/`
  - Fonts in `dist/fonts/`
  - CSS in `dist/css/`
  - JS in `dist/js/`

### TypeScript Configuration
- Target: ES2020
- Strict mode enabled
- JSX: React 17 new transform

### Environment Variables

#### .env (Default)
```
VITE_APP_NAME=Finance Dashboard
VITE_APP_VERSION=1.0.0
```

#### .env.development
```
VITE_APP_NAME=Finance Dashboard
VITE_APP_VERSION=1.0.0
VITE_API_URL=http://localhost:3001
```

#### .env.production
```
VITE_APP_NAME=Finance Dashboard
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.example.com
```

## Performance Optimizations

The build includes the following optimizations:

1. **Code Minification**: Terser minifies JavaScript code
2. **Tree Shaking**: Removes unused code from vendor libraries
3. **Lazy Loading**: Dynamic imports for code splitting
4. **CSS Code Splitting**: Separate CSS files for each chunk
5. **Asset Optimization**: Images and fonts are versioned with content hashes
6. **Console Removal**: Console.log and debugger statements removed in production

## Build Statistics

Current optimized bundle sizes (gzipped):
- Main application: ~7.34 KB
- Chart library: ~143.28 KB
- Icons library: ~3.92 KB
- Styles: ~11.53 KB
- **Total: ~165.07 KB** (gzipped)

## Deployment

### Steps to Deploy

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Test the production build**:
   ```bash
   npm run preview
   ```

3. **Deploy the `dist/` directory** to your hosting provider:
   - GitHub Pages
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

### Server Configuration

Ensure your server is configured to:
- Serve `index.html` for all non-file routes (SPA routing)
- Set proper cache headers for versioned assets
- Enable gzip compression
- Consider setting Cache-Control headers:
  - Versioned assets (with hash): 1 year cache
  - index.html: No cache or short cache (max-age=0)

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/dist;
    index index.html index.htm;

    # Cache versioned assets (with hash in filename)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|eot|ttf|otf)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html
    location = /index.html {
        expires -1;
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # Route all other requests to index.html for SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;
}
```

## Troubleshooting

### Build Fails with TypeScript Errors
- Check `tsconfig.json` for strict mode settings
- Ensure all imports are used or marked with `@ts-ignore`
- Run `npm run lint` to check for linting issues

### Large Bundle Size
- Run `npm run build` and check the output for large chunks
- Consider lazy loading routes if using React Router
- Check for duplicate dependencies in node_modules

### Development Server Not Starting
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000 is already in use
- Verify all environment variables are set

## Scripts in package.json

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Recharts Documentation](https://recharts.org/)
