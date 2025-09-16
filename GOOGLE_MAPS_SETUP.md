# Google Maps API Setup for Location Autocomplete

## Required APIs to Enable

The location autocomplete component uses the traditional Google Places API and requires these APIs to be enabled in Google Cloud Console:

1. **Maps JavaScript API** - For loading the Google Maps library
2. **Places API** - For place predictions and autocomplete functionality
3. **Geocoding API** - For address formatting and geocoding

## Setup Steps

### 1. Enable APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Library**
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Places API** - The standard Places API (not the legacy one)
   - **Geocoding API**

### 2. Create API Key
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the API key

### 3. Set API Key Restrictions
For security, restrict your API key:

**Application restrictions:**
- **HTTP referrers (web sites)**
- Add these referrers:
  - `localhost:*/*` (for development)
  - `127.0.0.1:*/*` (alternative localhost)
  - `*.ourdreamday.se/*` (your production domain)

**API restrictions:**
- **Restrict key**
- Select these APIs:
  - Maps JavaScript API
  - Places API
  - Geocoding API

### 4. Set the Secret in SST
```bash
sst secret set GOOGLE_MAPS_API_KEY "your-api-key-here"
```

### 5. Deploy
```bash
sst deploy
```

## Important Notes

- **Use Places API**: The component uses the standard Places API with `AutocompleteService`.
- **Billing**: Google Maps APIs require billing to be enabled, even for free tier usage.
- **Quotas**: Monitor your usage in the Google Cloud Console to avoid unexpected charges.
- **Sweden-only results**: The component is configured to show only Swedish locations.

## Testing

After setup, the location autocomplete should work seamlessly. When you type in the location field, you should see:

- **Address suggestions** appear in a dropdown below the input
- **Swedish locations only** (restricted to Sweden)
- **Click to select** any suggestion
- **No password manager interference** (1Password, LastPass, etc. are disabled)

The component automatically handles:
- **API loading** - Loads Google Maps API dynamically
- **Error handling** - Falls back to regular input if API fails
- **Debounced requests** - Optimizes API calls while typing

## Troubleshooting

### Error: "Google Maps API key not found"

This error occurs when:
1. **API key not set**: The `GOOGLE_MAPS_API_KEY` secret is not configured in SST
2. **Environment variable missing**: The API key is not available in the frontend

**Solutions:**
1. **Set the secret**: Run `sst secret set GOOGLE_MAPS_API_KEY "your-api-key-here"`
2. **Deploy**: Run `sst deploy` to update the environment variables
3. **Check API key**: Ensure your API key is valid and has the correct permissions

### Error: "403 Forbidden" or "Requests from referer http://localhost:5173/ are blocked"

This error occurs when:
1. **API key restrictions**: Your API key doesn't allow requests from localhost
2. **Intermittent blocking**: Sometimes the API key restrictions aren't applied consistently

**Solutions:**
1. **Add localhost to referrers**: In Google Cloud Console → APIs & Services → Credentials → Edit your API key → Application restrictions → HTTP referrers → Add:
   ```
   localhost:*/*
   127.0.0.1:*/*
   *.ourdreamday.se/*
   ```
2. **Temporarily remove restrictions**: For development, you can temporarily remove all restrictions (not recommended for production)
3. **Component fallback**: The component will automatically fall back to a regular input if the API fails

### Fallback Behavior

If the Google Places API fails to load or encounters errors, the component will automatically fall back to a regular text input with the message "Using manual input". This ensures the form remains functional even if the API is unavailable.

## Component Features

The location autocomplete component includes:

- ✅ **Sweden-only results** - Restricted to Swedish locations
- ✅ **Debounced API calls** - Optimized performance while typing
- ✅ **Password manager prevention** - Disabled 1Password, LastPass, etc.
- ✅ **Custom dropdown styling** - Matches your app's design
- ✅ **Error handling** - Graceful fallback to manual input
- ✅ **TypeScript support** - Fully typed for better development experience
