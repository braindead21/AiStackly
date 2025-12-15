# Google Analytics 4 (GA4) Setup Guide

## ✅ Implementation Status: COMPLETE

GA4 has been fully integrated into AI Stackly with automatic tracking of all required events.

---

## 🚀 Quick Setup

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (bottom left gear icon)
3. Click **Create Property**
4. Enter property details:
   - **Property name**: AI Stackly
   - **Reporting time zone**: Your timezone
   - **Currency**: Your currency
5. Click **Next** and complete business information
6. Click **Create**
7. Choose **Web** platform
8. Set up data stream:
   - **Website URL**: Your production URL (e.g., `https://aistackly.com`)
   - **Stream name**: AI Stackly Production
9. Click **Create Stream**
10. **Copy your Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Add Measurement ID to Environment

1. Create `.env.local` file in project root (if it doesn't exist):
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your GA4 Measurement ID:
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
   Replace `G-XXXXXXXXXX` with your actual Measurement ID from Step 1.

### Step 3: Restart Development Server

```bash
npm run dev
```

### Step 4: Verify Real-Time Tracking

1. Open your site in a browser
2. Go to [Google Analytics](https://analytics.google.com/)
3. Navigate to: **Reports** → **Realtime**
4. You should see your visit appear within 30 seconds
5. Test events by:
   - Clicking on tool cards (fires `tool_click`)
   - Using search (fires `search_tool`)
   - Navigating pages (fires `page_view`)

---

## 📊 Tracked Events

### Automatic Events

| Event Name | Trigger | Data Captured |
|------------|---------|---------------|
| `page_view` | Every route change | Page path, search params |
| `tool_click` | User clicks on tool card | Tool ID, tool name |
| `search_tool` | User searches for tools | Search query |
| `external_link_click` | User clicks external links | Link URL, link text |

### Implementation Details

#### 1. Page View Tracking
- **Component**: `PageViewTracker.tsx`
- **Location**: Integrated in `layout.tsx`
- **Behavior**: Automatically tracks all route changes
- **Data**: Full URL including query parameters

#### 2. Tool Click Tracking
- **Component**: `ToolCard.tsx`
- **Trigger**: onClick event
- **Data**: 
  - `tool_id`: Tool link/identifier
  - `tool_name`: Display name of tool
  - `event_category`: "engagement"

#### 3. Search Tool Tracking
- **Component**: `SearchInput.tsx`
- **Trigger**: Search button click or Enter key
- **Data**:
  - `search_term`: User's search query
  - `event_category`: "search"

#### 4. External Link Tracking
- **Component**: `Footer.tsx`
- **Trigger**: onClick for external links
- **Data**:
  - `link_url`: Destination URL
  - `link_text`: Link anchor text
  - `event_category`: "outbound"

---

## 🔧 Technical Architecture

### Components Created

1. **`components/GoogleAnalytics.tsx`**
   - Client-side component
   - Loads Google Analytics scripts
   - Initializes gtag with Measurement ID
   - Only renders when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set

2. **`components/PageViewTracker.tsx`**
   - Client-side component
   - Monitors route changes with Next.js router
   - Sends page_view events on navigation

3. **`lib/analytics.ts`**
   - Utility functions for event tracking
   - Type-safe event tracking methods
   - Null-safe (checks if gtag exists)

### Files Modified

1. **`app/layout.tsx`**
   - Added `<GoogleAnalytics />` component
   - Added `<PageViewTracker />` component

2. **`components/ToolCard.tsx`**
   - Converted to client component
   - Added click tracking

3. **`components/SearchInput.tsx`**
   - Added search event tracking
   - Added Enter key support

4. **`components/layout/Footer.tsx`**
   - Converted to client component
   - Added external link tracking

---

## 📈 Viewing Analytics

### Real-Time Reports
- **Path**: Reports → Realtime
- **Shows**: Live users, events, pages
- **Use**: Verify tracking is working

### Events Report
- **Path**: Reports → Engagement → Events
- **Shows**: All custom events
- **Events to monitor**:
  - `tool_click`
  - `search_tool`
  - `external_link_click`
  - `page_view`

### Custom Reports

Create custom explorations:
1. Go to **Explore** (left sidebar)
2. Click **Blank** template
3. Add dimensions: Event name, Tool name, Page path
4. Add metrics: Event count, Users, Sessions
5. Save and name your exploration

---

## 🎯 Recommended GA4 Setup

### 1. Enable Enhanced Measurement (Auto-enabled)
- Scroll tracking
- Outbound clicks
- File downloads
- Video engagement

### 2. Create Custom Dimensions

Navigate to: **Admin** → **Custom Definitions** → **Create Custom Dimension**

| Dimension Name | Event Parameter | Scope |
|----------------|-----------------|-------|
| Tool Name | `tool_name` | Event |
| Search Term | `search_term` | Event |
| Tool ID | `tool_id` | Event |

### 3. Create Conversion Events

Navigate to: **Admin** → **Events** → Mark as conversion:
- `tool_click` (Primary conversion)
- `search_tool` (Secondary conversion)

### 4. Set Up Audiences

Navigate to: **Admin** → **Audiences** → **New Audience**

Suggested audiences:
- **Power Users**: Users with 5+ tool_click events in 7 days
- **Searchers**: Users who triggered search_tool event
- **Engaged Users**: Session duration > 1 minute

---

## 🔍 Testing Checklist

- [ ] Measurement ID added to `.env.local`
- [ ] Development server restarted
- [ ] Real-time view shows your visit
- [ ] Click a tool card → see `tool_click` event
- [ ] Use search → see `search_tool` event
- [ ] Navigate pages → see `page_view` events
- [ ] Check browser console for errors
- [ ] Verify gtag loaded (DevTools → Network → filter "gtag")

---

## 🐛 Troubleshooting

### Events Not Appearing

**Problem**: No events in GA4 real-time view

**Solutions**:
1. Check `.env.local` has correct `NEXT_PUBLIC_GA_MEASUREMENT_ID`
2. Restart dev server: `npm run dev`
3. Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Check browser console for errors
5. Verify ad blockers are disabled
6. Check Network tab for gtag requests

### Wrong Measurement ID

**Problem**: Events going to wrong property

**Solution**:
1. Double-check Measurement ID in `.env.local`
2. Ensure it starts with `G-` (not `UA-` for Universal Analytics)
3. Restart server after changing

### Events Not Tracked Locally

**Problem**: Want to test without polluting production data

**Solution**:
1. Create separate GA4 property for development
2. Use different Measurement ID in `.env.local`
3. Or use GA4 DebugView:
   - Install [GA Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
   - Enable debug mode
   - View events in **Admin** → **DebugView**

---

## 🚀 Deployment to Production

### Vercel / Netlify

Add environment variable:
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Other Platforms

Ensure the environment variable is set in your deployment platform's dashboard.

---

## 📝 Custom Event Tracking

To add more custom events:

```typescript
import { trackEvent } from "@/lib/analytics";

// Example: Track button click
trackEvent("button_click", {
  button_name: "Download PDF",
  page_location: window.location.pathname,
});

// Example: Track form submission
trackEvent("form_submit", {
  form_name: "Contact Form",
  form_id: "contact-form",
});
```

---

## 🎉 Summary

✅ GA4 is fully integrated and tracking:
- ✅ Page views (automatic on route changes)
- ✅ Tool clicks (ToolCard component)
- ✅ Search queries (SearchInput component)  
- ✅ External links (Footer component)

**Next Steps**:
1. Create your GA4 property
2. Add Measurement ID to `.env.local`
3. Restart dev server
4. Verify real-time tracking
5. Deploy to production with environment variable

**Production Deployment**: Don't forget to add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to your hosting platform's environment variables!
