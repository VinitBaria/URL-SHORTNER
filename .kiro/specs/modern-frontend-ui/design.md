# Design Document

## Overview

This design document outlines the architecture and implementation approach for building a modern, professional frontend for the URL shortener application. The solution will replace the basic EJS templates with a client-side Single Page Application (SPA) using vanilla JavaScript with modern ES6+ features, CSS3, and HTML5. The frontend will communicate with the existing Express backend via AJAX/Fetch API calls while providing a rich, interactive user experience.

### Technology Stack

- **Frontend Framework**: Vanilla JavaScript (ES6+) with modular architecture
- **Styling**: CSS3 with CSS Custom Properties (variables), Flexbox, and Grid
- **HTTP Client**: Fetch API for backend communication
- **Routing**: Custom lightweight client-side router
- **State Management**: Custom reactive state management pattern
- **Build Tools**: None required (pure vanilla implementation for simplicity)
- **Icons**: Font Awesome or SVG icons
- **Charts**: Chart.js for analytics visualization

### Design Principles

1. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with JS
2. **Mobile-First**: Design for mobile screens first, then scale up
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Performance**: Minimize bundle size, lazy load resources
5. **Maintainability**: Modular, well-documented code structure

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Application Layer                      │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │    │
│  │  │  Router  │  │  State   │  │  Components  │    │    │
│  │  │  Manager │  │  Manager │  │              │    │    │
│  │  └──────────┘  └──────────┘  └──────────────┘    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Service Layer                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │    │
│  │  │   API    │  │   Auth   │  │   Storage    │    │    │
│  │  │  Service │  │  Service │  │   Service    │    │    │
│  │  └──────────┘  └──────────┘  └──────────────┘    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Utility Layer                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │    │
│  │  │Validators│  │  Utils   │  │   DOM        │    │    │
│  │  │          │  │          │  │   Helpers    │    │    │
│  │  └──────────┘  └──────────┘  └──────────────┘    │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/Fetch API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Express Backend (Existing)                  │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  Routes  │  │Controllers│ │  Models  │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
public/
├── index.html                 # Main HTML entry point
├── css/
│   ├── main.css              # Main stylesheet
│   ├── variables.css         # CSS custom properties
│   ├── components.css        # Component-specific styles
│   ├── layouts.css           # Layout styles
│   └── responsive.css        # Media queries
├── js/
│   ├── app.js                # Application entry point
│   ├── router.js             # Client-side routing
│   ├── state.js              # State management
│   ├── components/
│   │   ├── Header.js         # Header component
│   │   ├── UrlForm.js        # URL shortening form
│   │   ├── UrlList.js        # URL list display
│   │   ├── UrlCard.js        # Individual URL card
│   │   ├── StatsModal.js     # Statistics modal
│   │   ├── LoginForm.js      # Login form
│   │   ├── SignupForm.js     # Signup form
│   │   ├── SearchBar.js      # Search component
│   │   ├── Toast.js          # Notification toast
│   │   └── LoadingSpinner.js # Loading indicator
│   ├── services/
│   │   ├── api.js            # API communication
│   │   ├── auth.js           # Authentication logic
│   │   └── storage.js        # LocalStorage wrapper
│   ├── utils/
│   │   ├── validators.js     # Input validation
│   │   ├── dom.js            # DOM manipulation helpers
│   │   ├── formatters.js     # Data formatting utilities
│   │   └── constants.js      # Application constants
│   └── views/
│       ├── LoginView.js      # Login page view
│       ├── SignupView.js     # Signup page view
│       ├── DashboardView.js  # Dashboard view
│       └── AdminView.js      # Admin dashboard view
└── assets/
    ├── icons/                # SVG icons
    └── images/               # Images and logos
```

## Components and Interfaces

### 1. Router Component

**Purpose**: Handle client-side navigation without page reloads

**Interface**:
```javascript
class Router {
  constructor(routes)
  navigate(path)
  back()
  addRoute(path, handler)
  init()
}
```

**Key Features**:
- History API integration
- Route parameter extraction
- Authentication guards
- 404 handling

### 2. State Manager

**Purpose**: Centralized reactive state management

**Interface**:
```javascript
class StateManager {
  constructor(initialState)
  getState()
  setState(updates)
  subscribe(listener)
  unsubscribe(listener)
}
```

**State Structure**:
```javascript
{
  user: {
    id: string,
    name: string,
    email: string,
    role: 'Admin' | 'Normal',
    isAuthenticated: boolean
  },
  urls: [
    {
      _id: string,
      shortId: string,
      orgurl: string,
      visitedhistory: Date[],
      createdAt: Date,
      createdby: string
    }
  ],
  ui: {
    isLoading: boolean,
    currentView: string,
    searchQuery: string,
    selectedUrl: object | null
  },
  notifications: []
}
```

### 3. API Service

**Purpose**: Centralized HTTP communication with backend

**Interface**:
```javascript
class ApiService {
  async login(email, password)
  async signup(name, email, password)
  async logout()
  async createShortUrl(orgurl)
  async getUrls()
  async getUrlStats(shortId)
  async getAllUrlsAdmin()
}
```

**Features**:
- Automatic cookie handling
- Error handling and retry logic
- Request/response interceptors
- Loading state management

### 4. Auth Service

**Purpose**: Handle authentication state and token management

**Interface**:
```javascript
class AuthService {
  isAuthenticated()
  getCurrentUser()
  login(credentials)
  logout()
  checkAuthStatus()
}
```

### 5. Component Base Class

**Purpose**: Reusable component pattern for UI elements

**Interface**:
```javascript
class Component {
  constructor(props)
  render()
  mount(container)
  unmount()
  setState(updates)
  on(event, handler)
}
```

### 6. View Components

#### LoginView
- Email and password inputs with validation
- Show/hide password toggle
- Link to signup page
- Error message display
- Loading state during authentication

#### SignupView
- Name, email, and password inputs
- Real-time validation feedback
- Password strength indicator
- Link to login page
- Success/error messaging

#### DashboardView
- Header with user info and logout
- URL shortening form
- URL list with search/filter
- Empty state for no URLs
- Pagination controls

#### AdminView
- Extended dashboard with all users' URLs
- User filter dropdown
- Aggregate statistics
- Enhanced URL cards with creator info

### 7. UI Components

#### UrlForm Component
```javascript
class UrlForm extends Component {
  validateUrl(url)
  handleSubmit(event)
  showSuccess(shortUrl)
  showError(message)
}
```

#### UrlCard Component
```javascript
class UrlCard extends Component {
  copyToClipboard(text)
  openStats()
  formatDate(date)
  truncateUrl(url, maxLength)
}
```

#### StatsModal Component
```javascript
class StatsModal extends Component {
  open(urlData)
  close()
  renderChart(visitHistory)
  formatStats(data)
}
```

#### Toast Component
```javascript
class Toast extends Component {
  show(message, type, duration)
  hide()
  queue(messages)
}
```

## Data Models

### Frontend Data Models

#### User Model
```javascript
{
  id: string,
  name: string,
  email: string,
  role: 'Admin' | 'Normal',
  isAuthenticated: boolean
}
```

#### URL Model
```javascript
{
  _id: string,
  shortId: string,
  orgurl: string,
  shortUrl: string,  // Computed: http://localhost:8001/{shortId}
  visitedhistory: Date[],
  totalClicks: number,  // Computed: visitedhistory.length
  createdAt: Date,
  createdby: string,
  creatorName?: string  // For admin view
}
```

#### Notification Model
```javascript
{
  id: string,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning',
  duration: number,
  timestamp: Date
}
```

## Error Handling

### Error Types and Handling Strategy

1. **Network Errors**
   - Display toast notification
   - Provide retry button
   - Cache failed requests for retry

2. **Validation Errors**
   - Inline field-level errors
   - Prevent form submission
   - Clear, actionable messages

3. **Authentication Errors**
   - Redirect to login
   - Clear auth state
   - Display session expired message

4. **Server Errors**
   - Parse error response
   - Display user-friendly message
   - Log to console for debugging

### Error Handler Utility
```javascript
class ErrorHandler {
  static handle(error, context) {
    if (error.type === 'NetworkError') {
      // Show offline message
    } else if (error.status === 401) {
      // Redirect to login
    } else if (error.status === 404) {
      // Show not found message
    } else {
      // Generic error handling
    }
  }
}
```

## Testing Strategy

### Unit Testing
- Test utility functions (validators, formatters)
- Test state management logic
- Test API service methods (with mocked fetch)
- Test component render methods

### Integration Testing
- Test router navigation flows
- Test authentication flow end-to-end
- Test URL creation and display flow
- Test search and filter functionality

### Manual Testing Checklist
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test with keyboard navigation only
- [ ] Test with screen reader (NVDA/JAWS)
- [ ] Test with slow network (throttling)
- [ ] Test with JavaScript disabled (graceful degradation)
- [ ] Test all form validations
- [ ] Test error scenarios
- [ ] Test responsive breakpoints

### Performance Testing
- Lighthouse audit (target: 90+ score)
- Page load time < 2s
- Time to interactive < 3s
- First contentful paint < 1s

## Styling Architecture

### CSS Organization

#### 1. Variables (variables.css)
```css
:root {
  /* Colors */
  --primary-color: #4f46e5;
  --secondary-color: #10b981;
  --error-color: #ef4444;
  --success-color: #22c55e;
  --warning-color: #f59e0b;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --border-color: #e5e7eb;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-base: 16px;
  --font-size-sm: 14px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Borders */
  --border-radius: 8px;
  --border-radius-sm: 4px;
  --border-radius-lg: 12px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}
```

#### 2. Component Styles Pattern
Each component has isolated, reusable styles:
```css
.component-name {
  /* Container styles */
}

.component-name__element {
  /* Element styles (BEM methodology) */
}

.component-name--modifier {
  /* Modifier styles */
}
```

#### 3. Responsive Breakpoints
```css
/* Mobile first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### Design System

#### Color Palette
- **Primary**: Indigo (#4f46e5) - Main actions, links
- **Success**: Green (#22c55e) - Success messages, confirmations
- **Error**: Red (#ef4444) - Errors, destructive actions
- **Warning**: Amber (#f59e0b) - Warnings, cautions
- **Neutral**: Gray scale - Text, borders, backgrounds

#### Typography Scale
- **Headings**: Bold, larger sizes (24px, 20px, 18px)
- **Body**: Regular weight, 16px base
- **Small**: 14px for secondary text
- **Labels**: 14px, medium weight

#### Spacing System
- Consistent 4px base unit
- Scale: 4, 8, 16, 24, 32, 48, 64px

## Backend Integration

### API Endpoints Used

#### Authentication
- `POST /user/signup` - Create new user
- `POST /user/login` - Authenticate user
- Cookie-based session management

#### URL Operations
- `GET /` - Get user's URLs (requires auth)
- `POST /` - Create short URL (requires auth)
- `GET /:shortId/stats` - Get URL statistics
- `GET /admin/urls` - Get all URLs (admin only)

### Request/Response Handling

#### Request Format
```javascript
// Example: Create short URL
fetch('/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',  // Include cookies
  body: JSON.stringify({ orgurl: 'https://example.com' })
})
```

#### Response Handling
```javascript
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  
  // Handle redirects from backend
  if (response.redirected) {
    router.navigate(response.url);
  }
  
  return response.json();
}
```

### Backend Modifications Needed

The existing backend serves EJS templates. We need to:

1. **Add API-only routes** that return JSON instead of rendering views
2. **CORS configuration** if frontend is served from different port
3. **Update redirect logic** to return JSON responses for AJAX requests
4. **Add API endpoint** for logout functionality

#### Proposed Backend Changes

```javascript
// Add JSON response middleware
app.use((req, res, next) => {
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
  };
  next();
});

// Modify routes to detect AJAX requests
function isAjaxRequest(req) {
  return req.headers['x-requested-with'] === 'XMLHttpRequest' ||
         req.headers['content-type'] === 'application/json';
}

// Example: Modified login controller
async function findUserByEmailAndPassword(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  
  if (!user) {
    if (isAjaxRequest(req)) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(404).send({ message: "User not found" });
  }
  
  const token = await Setuser(user._id);
  res.cookie("uid", token, { /* ... */ });
  
  if (isAjaxRequest(req)) {
    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.Role
      }
    });
  }
  
  // Existing EJS rendering for non-AJAX
  const allurl = await Item.find({ createdby: user._id });
  // ...
}
```

## Accessibility Features

### ARIA Implementation
- `role` attributes for custom components
- `aria-label` for icon buttons
- `aria-live` regions for dynamic content
- `aria-invalid` for form validation
- `aria-expanded` for collapsible sections

### Keyboard Navigation
- Tab order follows visual flow
- Enter/Space activate buttons
- Escape closes modals
- Arrow keys for list navigation
- Focus trap in modals

### Screen Reader Support
- Semantic HTML elements
- Descriptive alt text
- Form labels properly associated
- Status messages announced
- Loading states communicated

## Performance Optimizations

### Code Splitting
- Lazy load admin view (only for admin users)
- Lazy load Chart.js (only when viewing stats)
- Defer non-critical CSS

### Asset Optimization
- Minify CSS and JavaScript for production
- Use SVG icons (scalable, small file size)
- Compress images
- Enable gzip compression

### Runtime Optimizations
- Debounce search input (300ms)
- Virtual scrolling for large URL lists
- Memoize expensive computations
- Use event delegation for list items

### Caching Strategy
- Cache API responses in memory
- Use LocalStorage for user preferences
- Implement stale-while-revalidate pattern
- Cache static assets with service worker (optional enhancement)

## Security Considerations

### XSS Prevention
- Sanitize user input before rendering
- Use textContent instead of innerHTML where possible
- Escape HTML in user-generated content

### CSRF Protection
- Backend already uses cookie-based auth
- Include CSRF token in forms (if backend implements)

### Data Validation
- Client-side validation for UX
- Never trust client-side validation alone
- Backend validation is source of truth

### Secure Communication
- Use HTTPS in production
- Secure cookie flags (httpOnly, secure, sameSite)
- No sensitive data in localStorage

## Progressive Enhancement

### Core Functionality (No JS)
- Forms submit to backend (existing behavior)
- Server-side rendering with EJS (fallback)
- Basic styling with CSS

### Enhanced Functionality (With JS)
- Client-side routing
- Real-time validation
- Smooth animations
- Instant feedback
- No page reloads

### Feature Detection
```javascript
if ('fetch' in window) {
  // Use modern fetch API
} else {
  // Fallback to XMLHttpRequest
}

if ('IntersectionObserver' in window) {
  // Use for lazy loading
} else {
  // Load all content immediately
}
```

## Deployment Considerations

### Static File Serving
```javascript
// In Express app
app.use(express.static('public'));

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

### Environment Configuration
```javascript
const config = {
  API_BASE_URL: process.env.API_URL || 'http://localhost:8001',
  ENV: process.env.NODE_ENV || 'development'
};
```

### Build Process (Optional)
- Concatenate JavaScript files
- Minify CSS and JS
- Generate source maps
- Version assets for cache busting

## Future Enhancements

### Phase 2 Features
- Dark mode toggle
- Custom short URL aliases
- QR code generation for short URLs
- Bulk URL operations
- Export URLs to CSV
- URL expiration dates
- Password-protected URLs

### Technical Improvements
- Service Worker for offline support
- Push notifications for URL activity
- Real-time updates with WebSockets
- Progressive Web App (PWA) features
- Internationalization (i18n)

## Migration Strategy

### Phased Rollout

**Phase 1**: Setup and Core Structure
- Create directory structure
- Setup router and state management
- Implement API service layer

**Phase 2**: Authentication
- Build login/signup views
- Implement auth service
- Test authentication flow

**Phase 3**: Dashboard
- Build dashboard layout
- Implement URL form
- Implement URL list

**Phase 4**: Features
- Add search/filter
- Add statistics modal
- Add admin view

**Phase 5**: Polish
- Add animations
- Improve accessibility
- Performance optimization
- Cross-browser testing

### Backward Compatibility
- Keep existing EJS views as fallback
- Detect JavaScript support
- Graceful degradation for older browsers
