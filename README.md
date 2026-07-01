# Abrindo Portas

## Deployments

### Netlify

#### Issues and Solutions

**Error Encountered:**
- **Outdated plugin**: `@netlify/plugin-nextjs@4.41.6` (should be removed - latest: 5.15.12)
- **Build failed** with exit code 2 due to Next.js plugin interference

**Root Cause**: Netlify was automatically using the Next.js plugin, but this site uses Eleventy, not Next.js, causing conflicts.

**Required Configuration in Netlify Dashboard**:

1. **Remove the Next.js plugin**:
   - Access: Netlify Dashboard → Site settings → Plugins
   - Remove: `@netlify/plugin-nextjs`

2. **Set CI/CD Configuration**:
   - **Build command**: `npm run build`
   - **Publish directory**: `_site`
   - **Base directory**: Leave empty/unset
   - **Functions directory**: Remove `/netlify/functions` (if not used)

3. **Manual Netlify.toml Configuration** (for future commits):

   ```toml
   [build]
   command = "npm run build"
   publish = "_site"
   
   [build.environment]
   NODE_VERSION = "20"
   
   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   
   [context]
   production = { ENVIRONMENT = "production" }
   ```

**Fixed package.json** (if needed):

```json
{
  "name": "abrindo-portas-portfolio",
  "version": "1.0.0",
  "description": "Portfólio profissional - Abrindo Portas Tecnologia",
  "scripts": {
    "start": "npx @11ty/eleventy --serve",
    "build": "npx @11ty/eleventy"
  },
  "devDependencies": {
    "@11ty/eleventy": "^3.1.6"
  }
}
```
