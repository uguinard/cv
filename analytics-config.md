# Google Analytics Configuration

## Setup Instructions

1. **Replace GA_MEASUREMENT_ID** in `index.html` with your actual Google Analytics Measurement ID
   - Find your Measurement ID in Google Analytics 4
   - Replace `GA_MEASUREMENT_ID` with your actual ID (format: G-XXXXXXXXXX)

2. **Verify Analytics Setup**
   - Open browser developer tools
   - Check Network tab for gtag requests
   - Verify events are being sent to Google Analytics

## Performance Monitoring

The site now includes Core Web Vitals monitoring:
- **LCP (Largest Contentful Paint)**: Measures loading performance
- **FID (First Input Delay)**: Measures interactivity
- **CLS (Cumulative Layout Shift)**: Measures visual stability

## Custom Events

The site tracks:
- Language changes
- Theme toggles
- Print actions
- Navigation clicks

## Testing

1. Test with Google Analytics Debugger extension
2. Use Google PageSpeed Insights for performance metrics
3. Check Core Web Vitals in Google Search Console
