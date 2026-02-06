# Vercel Deployment Guide for FlowPRD Frontend

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**
   Add these in Vercel dashboard → Settings → Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

---

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Frontend Directory**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow Prompts**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N` (first time)
   - Project name: `flowprd-frontend`
   - Directory: `./`
   - Override settings: `N`

5. **Set Environment Variables**
   ```bash
   vercel env add VITE_API_URL
   ```
   Enter: `https://your-backend-url.com`
   Select: Production, Preview, Development

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## 🔧 Configuration Files

### vercel.json ✅
Already created with:
- Vite framework detection
- Build optimization
- Security headers
- Asset caching
- Environment variable support

### .env.example ✅
Template for environment variables

### .env.local ✅
Local development environment (not committed to git)

---

## 🌍 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.flowprd.com` |

### Add to Vercel

1. Go to your project dashboard
2. Settings → Environment Variables
3. Add each variable for:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

---

## 📦 Build Configuration

### Automatic Deployments

Vercel automatically deploys when you:
- **Push to main branch** → Production deployment
- **Open Pull Request** → Preview deployment
- **Push to any branch** → Preview deployment

### Custom Domains

1. Go to project Settings → Domains
2. Add your custom domain: `app.flowprd.com`
3. Configure DNS records as shown
4. SSL certificate auto-generated

---

## 🔗 Connecting to Backend

### Update API Calls

The frontend is configured to use `import.meta.env.VITE_API_URL` for all API calls.

**Example usage in code:**
```typescript
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text })
});
```

### CORS Configuration

Ensure your backend allows requests from your Vercel domain:

**Python Flask example:**
```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    'http://localhost:3000',
    'https://your-project.vercel.app',
    'https://app.flowprd.com'
])
```

---

## 🎯 Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Configure environment variables
- [ ] Deploy project
- [ ] Test production build
- [ ] Configure custom domain (optional)
- [ ] Set up backend CORS
- [ ] Update API URL in environment variables
- [ ] Enable automatic deployments

---

## 🐛 Troubleshooting

### Build Fails

**Check build logs:**
1. Go to Deployments tab
2. Click failed deployment
3. Check build logs for errors

**Common issues:**
- Missing dependencies → Check package.json
- TypeScript errors → Run `npm run build` locally
- Environment variables → Verify in Settings

### App Not Loading

**Check:**
1. Browser console for errors
2. Network tab for failed API calls
3. Environment variables are set correctly
4. CORS is configured on backend

### 404 on Refresh

Vercel should handle SPA routing automatically with Vite. If issues occur, the `vercel.json` already includes proper routing configuration.

---

## 📊 Performance Optimization

### Already Configured

✅ **Static Asset Caching** - 1 year cache for /assets/*
✅ **Security Headers** - XSS, Clickjacking protection
✅ **Gzip/Brotli Compression** - Automatic by Vercel
✅ **CDN Distribution** - Global edge network
✅ **Automatic HTTPS** - SSL certificates

### Further Optimizations

**Enable Analytics:**
1. Go to project Settings → Analytics
2. Enable Web Analytics
3. Monitor Core Web Vitals

**Enable Speed Insights:**
1. Settings → Speed Insights
2. Enable Real Experience Score

---

## 🔄 Continuous Deployment

### GitHub Integration

Once connected, every push triggers:
- **main branch** → https://flowprd-frontend.vercel.app
- **feature branches** → https://flowprd-frontend-git-feature.vercel.app
- **Pull requests** → Preview URL in PR comments

### Automatic Previews

Each PR gets:
- Unique preview URL
- Automatic deployment
- Comment with preview link
- Lighthouse scores

---

## 📱 Vercel Features to Explore

- **Edge Functions** - Serverless functions at the edge
- **Web Analytics** - Privacy-friendly analytics
- **Speed Insights** - Real user performance metrics
- **Log Drains** - Export logs to external services
- **Preview Deployments** - Test before merging
- **Rollbacks** - Instant rollback to previous deployments

---

## 🔐 Security Best Practices

✅ Environment variables encrypted at rest
✅ HTTPS enforced automatically
✅ Security headers configured
✅ No sensitive data in code
✅ API keys in environment variables only

---

## 💰 Pricing

**Free Tier includes:**
- Unlimited deployments
- Automatic HTTPS
- 100GB bandwidth/month
- Serverless Functions
- Web Analytics

**Perfect for MVP and development!**

Upgrade to Pro if needed:
- Custom domains (unlimited)
- Team collaboration
- Priority support
- Advanced analytics

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite on Vercel Guide](https://vercel.com/docs/frameworks/vite)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Custom Domains](https://vercel.com/docs/custom-domains)

---

## 🎉 Quick Deploy Commands

```bash
# One-time setup
npm i -g vercel
vercel login

# Deploy to preview
cd frontend
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

---

**Your frontend is ready for Vercel! 🚀**

Just run `vercel` in the frontend directory or connect via GitHub.
