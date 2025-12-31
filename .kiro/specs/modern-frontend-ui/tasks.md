# Implementation Plan

- [ ] 1. Setup project structure and core utilities
  - Create public directory with subdirectories (css, js, assets)
  - Create index.html with proper meta tags, viewport settings, and semantic structure
  - Create variables.css with CSS custom properties for colors, typography, spacing, and transitions
  - Create constants.js with API endpoints, configuration values, and application constants
  - _Requirements: 8.1, 8.3, 9.1_

- [ ] 2. Implement utility functions and helpers
  - [ ] 2.1 Create validators.js with URL validation, email validation, and password strength checking functions
    - Write isValidUrl() function using regex pattern
    - Write isValidEmail() function with RFC-compliant regex
    - Write validatePassword() function checking length and complexity
    - _Requirements: 1.6, 3.1_
  
  - [ ] 2.2 Create formatters.js with date formatting, URL truncation, and number formatting utilities
    - Write formatDate() function for human-readable dates
    - Write truncateUrl() function with ellipsis handling
    - Write formatNumber() function for click counts
    - _Requirements: 4.8_
  
  - [ ] 2.3 Create dom.js with DOM manipulation helper functions
    - Write createElement() helper with attribute and event binding
    - Write clearElement() function to remove all children
    - Write addClass/removeClass/toggleClass helpers
    - _Requirements: 9.2_

- [ ] 3. Build state management system
  - [ ] 3.1 Create state.js with StateManager class implementing observer pattern
    - Write constructor accepting initialState object
    - Implement getState() method returning current state
    - Implement setState() method with shallow merge and notification
    - Implement subscribe() method for registering listeners
    - Implement unsubscribe() method for cleanup
    - _Requirements: 10.5_
  
  - [ ] 3.2 Define initial application state structure
    - Create initialState object with user, urls, ui, and notifications properties
    - Set default values for all state properties
    - Export state instance as singleton
    - _Requirements: 10.5_

- [ ] 4. Implement API service layer
  - [ ] 4.1 Create api.js with ApiService class for backend communication
    - Write constructor with base URL configuration
    - Implement request() method wrapping fetch with error handling
    - Implement get(), post(), put(), delete() convenience methods
    - Add credentials: 'include' for cookie handling
    - _Requirements: 3.2, 11.1_
  
  - [ ] 4.2 Implement authentication API methods
    - Write login(email, password) method calling POST /user/login
    - Write signup(name, email, password) method calling POST /user/signup
    - Write logout() method for clearing session
    - Add error parsing and transformation
    - _Requirements: 1.3, 1.4_
  
  - [ ] 4.3 Implement URL management API methods
    - Write createShortUrl(orgurl) method calling POST /
    - Write getUrls() method calling GET /
    - Write getUrlStats(shortId) method calling GET /:shortId/stats
    - Write getAllUrlsAdmin() method calling GET /admin/urls
    - _Requirements: 3.3, 4.1, 5.1, 7.2_

- [ ] 5. Create authentication service
  - [ ] 5.1 Create auth.js with AuthService class managing authentication state
    - Write isAuthenticated() method checking state
    - Write getCurrentUser() method returning user object
    - Write login(credentials) method updating state and calling API
    - Write logout() method clearing state and cookies
    - Write checkAuthStatus() method for initial load
    - _Requirements: 1.4, 10.4_

- [ ] 6. Build client-side router
  - [ ] 6.1 Create router.js with Router class using History API
    - Write constructor accepting routes configuration object
    - Implement navigate(path) method updating URL and rendering view
    - Implement back() method for browser back button
    - Implement addRoute(path, handler) for dynamic route registration
    - Add popstate event listener for browser navigation
    - _Requirements: 10.1, 10.2_
  
  - [ ] 6.2 Implement route guards and authentication checks
    - Write requireAuth() guard redirecting to login if not authenticated
    - Write requireAdmin() guard checking user role
    - Add guard execution before route handlers
    - _Requirements: 10.4, 7.6_
  
  - [ ] 6.3 Define application routes
    - Add route for /login pointing to LoginView
    - Add route for /signup pointing to SignupView
    - Add route for / (dashboard) pointing to DashboardView with auth guard
    - Add route for /admin pointing to AdminView with admin guard
    - Add 404 route for unmatched paths
    - _Requirements: 10.1_

- [ ] 7. Create base Component class
  - Create Component base class with lifecycle methods
  - Implement constructor(props) accepting component properties
  - Implement render() method returning HTML string or DOM element
  - Implement mount(container) method attaching to DOM
  - Implement unmount() method for cleanup
  - Implement setState(updates) method for component state
  - _Requirements: 9.2_

- [ ] 8. Build Toast notification component
  - [ ] 8.1 Create Toast.js component for user notifications
    - Extend Component base class
    - Implement show(message, type, duration) method
    - Implement hide() method with fade-out animation
    - Implement queue() method for multiple notifications
    - Add auto-dismiss timer functionality
    - _Requirements: 9.6, 11.2, 11.3_
  
  - [ ] 8.2 Create toast component styles
    - Style toast container with fixed positioning
    - Create type-specific styles (success, error, info, warning)
    - Add slide-in and fade-out animations
    - Implement responsive positioning for mobile
    - _Requirements: 9.6_

- [ ] 9. Build LoadingSpinner component
  - Create LoadingSpinner.js component
  - Implement render() method with spinner HTML
  - Create CSS animation for spinning effect
  - Add show() and hide() methods
  - _Requirements: 9.7_

- [ ] 10. Implement LoginForm component
  - [ ] 10.1 Create LoginForm.js with form structure and validation
    - Extend Component base class
    - Create render() method with email and password inputs
    - Add show/hide password toggle button
    - Implement real-time validation on input events
    - Add link to signup page
    - _Requirements: 1.1, 1.6, 1.7_
  
  - [ ] 10.2 Implement login form submission logic
    - Add submit event listener preventing default
    - Validate all fields before submission
    - Call AuthService.login() with credentials
    - Show loading spinner during request
    - Handle success by navigating to dashboard
    - Handle errors by displaying toast notification
    - _Requirements: 1.3, 1.4, 3.2_
  
  - [ ] 10.3 Create login form styles
    - Style form container with centered layout
    - Style input fields with focus states
    - Add validation error styling
    - Create responsive layout for mobile
    - _Requirements: 9.1, 9.2_

- [ ] 11. Implement SignupForm component
  - [ ] 11.1 Create SignupForm.js with registration form
    - Extend Component base class
    - Create render() method with name, email, and password inputs
    - Implement real-time validation for all fields
    - Add password strength indicator
    - Add link to login page
    - _Requirements: 1.2, 1.6_
  
  - [ ] 11.2 Implement signup form submission logic
    - Add submit event listener with validation
    - Call ApiService.signup() with form data
    - Show loading state during request
    - Navigate to login on success with success message
    - Display error toast on failure
    - _Requirements: 1.3, 1.4_
  
  - [ ] 11.3 Create signup form styles
    - Reuse login form styles with BEM modifiers
    - Style password strength indicator
    - Add responsive adjustments
    - _Requirements: 9.1_

- [ ] 12. Build LoginView and SignupView
  - [ ] 12.1 Create LoginView.js orchestrating login page
    - Extend Component base class
    - Implement render() method composing LoginForm and layout
    - Add redirect logic if already authenticated
    - Mount and unmount form component
    - _Requirements: 1.1, 1.8_
  
  - [ ] 12.2 Create SignupView.js orchestrating signup page
    - Extend Component base class
    - Implement render() method composing SignupForm and layout
    - Add redirect logic if already authenticated
    - Mount and unmount form component
    - _Requirements: 1.2, 1.8_
  
  - [ ] 12.3 Create authentication page layout styles
    - Create centered card layout for auth forms
    - Add background styling
    - Implement responsive design for mobile
    - Add subtle animations for page transitions
    - _Requirements: 2.7, 8.1, 9.1_

- [ ] 13. Implement Header component
  - [ ] 13.1 Create Header.js with navigation and user info
    - Extend Component base class
    - Implement render() method with logo, user name, and logout button
    - Add hamburger menu for mobile
    - Subscribe to state changes for user updates
    - _Requirements: 2.2, 2.5_
  
  - [ ] 13.2 Implement logout functionality
    - Add click handler to logout button
    - Call AuthService.logout()
    - Clear application state
    - Navigate to login page
    - Show success toast
    - _Requirements: 10.6_
  
  - [ ] 13.3 Create header component styles
    - Style header with fixed/sticky positioning
    - Create responsive hamburger menu
    - Add hover and active states for buttons
    - Implement mobile menu slide-in animation
    - _Requirements: 2.4, 2.5, 9.2_

- [ ] 14. Build UrlForm component
  - [ ] 14.1 Create UrlForm.js for URL shortening
    - Extend Component base class
    - Create render() method with URL input and submit button
    - Implement real-time URL validation with visual feedback
    - Disable submit button when invalid or loading
    - _Requirements: 3.1, 3.8_
  
  - [ ] 14.2 Implement URL submission logic
    - Add submit event listener with validation
    - Call ApiService.createShortUrl() with URL
    - Show loading spinner during request
    - Display success toast with copy button on success
    - Update state to add new URL to list
    - Clear form after successful submission
    - Handle and display errors
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  
  - [ ] 14.3 Create URL form styles
    - Style form with prominent positioning
    - Create large, accessible input field
    - Style submit button with loading state
    - Add validation feedback styling
    - _Requirements: 9.1, 9.2_

- [ ] 15. Implement UrlCard component
  - [ ] 15.1 Create UrlCard.js for displaying individual URLs
    - Extend Component base class
    - Implement render() method with URL details (original, short, date, clicks)
    - Add truncation for long URLs with hover tooltip
    - Add copy button for short URL
    - Add stats button to view analytics
    - Add hover effect highlighting
    - _Requirements: 4.1, 4.2, 4.3, 4.8_
  
  - [ ] 15.2 Implement UrlCard interaction handlers
    - Write copyToClipboard() method using Clipboard API
    - Show success toast after copying
    - Add click handler for stats button opening modal
    - Format dates using formatters utility
    - _Requirements: 3.4, 4.6_
  
  - [ ] 15.3 Create URL card styles
    - Style card with shadow and rounded corners
    - Add hover animation (lift effect)
    - Create responsive layout stacking on mobile
    - Style action buttons with icons
    - _Requirements: 9.2, 9.4, 9.5_

- [ ] 16. Build UrlList component
  - [ ] 16.1 Create UrlList.js for displaying URL collection
    - Extend Component base class
    - Implement render() method iterating over URLs
    - Create UrlCard instances for each URL
    - Display empty state when no URLs exist
    - Subscribe to state changes for URL updates
    - _Requirements: 4.1, 4.4, 4.7_
  
  - [ ] 16.2 Implement pagination or infinite scroll
    - Add pagination controls if more than 10 URLs
    - Implement page navigation logic
    - Update state with current page
    - Alternatively implement infinite scroll with Intersection Observer
    - _Requirements: 4.5, 12.4_
  
  - [ ] 16.3 Create URL list styles
    - Style list container with grid or flexbox layout
    - Create empty state styling with helpful message
    - Add pagination control styles
    - Implement responsive grid (1 column mobile, 2-3 desktop)
    - _Requirements: 2.7, 4.7_

- [ ] 17. Implement SearchBar component
  - [ ] 17.1 Create SearchBar.js for filtering URLs
    - Extend Component base class
    - Create render() method with search input
    - Implement debounced input handler (300ms delay)
    - Update state with search query
    - Add clear button when query exists
    - _Requirements: 6.1, 12.5_
  
  - [ ] 17.2 Implement search filtering logic
    - Filter URLs based on orgurl or shortId matching query
    - Update displayed URLs reactively
    - Display "no results" message when empty
    - Highlight matching text in results
    - _Requirements: 6.2, 6.3, 6.4, 6.6_
  
  - [ ] 17.3 Create search bar styles
    - Style search input with icon
    - Add clear button styling
    - Create responsive width adjustments
    - _Requirements: 9.1_

- [ ] 18. Build StatsModal component
  - [ ] 18.1 Create StatsModal.js for displaying URL analytics
    - Extend Component base class
    - Implement open(urlData) method showing modal
    - Implement close() method hiding modal
    - Display total clicks, creation date, last accessed
    - Add click outside to close functionality
    - Add escape key handler to close
    - _Requirements: 5.1, 5.2, 5.4, 5.5_
  
  - [ ] 18.2 Integrate Chart.js for visit history visualization
    - Lazy load Chart.js library when modal opens
    - Implement renderChart(visitHistory) method
    - Create line or bar chart showing clicks over time
    - Format dates on x-axis
    - Display "no activity" message if no clicks
    - _Requirements: 5.3, 5.7_
  
  - [ ] 18.3 Create stats modal styles
    - Style modal overlay with backdrop
    - Style modal content with centered positioning
    - Add fade-in animation for modal appearance
    - Create responsive modal sizing
    - Add loading skeleton for chart
    - _Requirements: 5.6, 9.4, 9.7_

- [ ] 19. Implement DashboardView
  - [ ] 19.1 Create DashboardView.js composing dashboard layout
    - Extend Component base class
    - Implement render() method composing Header, UrlForm, SearchBar, and UrlList
    - Fetch user's URLs on mount
    - Subscribe to state changes for reactive updates
    - Handle loading state while fetching data
    - _Requirements: 2.1, 2.3, 2.6_
  
  - [ ] 19.2 Implement dashboard data fetching
    - Call ApiService.getUrls() on component mount
    - Update state with fetched URLs
    - Handle errors with toast notifications
    - Show loading spinner during fetch
    - _Requirements: 4.1, 11.1_
  
  - [ ] 19.3 Create dashboard layout styles
    - Create responsive grid layout for components
    - Style main content area with proper spacing
    - Implement mobile-first responsive design
    - Add smooth transitions between states
    - _Requirements: 2.1, 2.7, 8.1, 9.4_

- [ ] 20. Build AdminView component
  - [ ] 20.1 Create AdminView.js for admin dashboard
    - Extend DashboardView or Component base class
    - Implement render() method with admin-specific features
    - Add user filter dropdown
    - Display creator information on URL cards
    - Fetch all URLs using ApiService.getAllUrlsAdmin()
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [ ] 20.2 Implement admin filtering functionality
    - Add filter by user dropdown
    - Filter URLs based on selected user
    - Display aggregate statistics (total URLs, total clicks)
    - _Requirements: 7.4, 7.5_
  
  - [ ] 20.3 Create admin view styles
    - Extend dashboard styles with admin-specific elements
    - Style user filter dropdown
    - Style aggregate statistics display
    - Add visual distinction for admin view
    - _Requirements: 7.1, 7.6_

- [ ] 21. Implement main application entry point
  - [ ] 21.1 Create app.js initializing application
    - Import all necessary modules and components
    - Initialize StateManager with initial state
    - Initialize Router with route configuration
    - Check authentication status on load
    - Mount root component
    - Add global error handler
    - _Requirements: 10.3, 10.4_
  
  - [ ] 21.2 Setup global event listeners
    - Add window.onload handler
    - Add online/offline event listeners
    - Add unhandledrejection handler for promise errors
    - _Requirements: 11.7_

- [ ] 22. Create comprehensive CSS styling
  - [ ] 22.1 Create main.css with base styles
    - Add CSS reset/normalize
    - Define base typography styles
    - Create utility classes (flex, grid, spacing)
    - Add focus styles for accessibility
    - _Requirements: 8.2, 8.4, 9.1_
  
  - [ ] 22.2 Create components.css with all component styles
    - Import and organize all component-specific styles
    - Ensure consistent spacing and sizing
    - Add transition and animation definitions
    - _Requirements: 9.1, 9.2, 9.4_
  
  - [ ] 22.3 Create responsive.css with media queries
    - Define breakpoints for mobile, tablet, desktop
    - Add responsive adjustments for all components
    - Test on various screen sizes
    - _Requirements: 2.7, 8.1_
  
  - [ ] 22.4 Implement accessibility styles
    - Add focus-visible styles for keyboard navigation
    - Ensure sufficient color contrast
    - Add skip-to-content link
    - Style for reduced motion preference
    - _Requirements: 8.2, 8.3, 8.4, 8.7_

- [ ] 23. Add ARIA attributes and semantic HTML
  - Review all components for semantic HTML usage
  - Add role attributes where needed
  - Add aria-label to icon buttons
  - Add aria-live regions for dynamic content
  - Add aria-invalid for form validation
  - Add aria-expanded for collapsible elements
  - Test with screen reader (NVDA or JAWS)
  - _Requirements: 8.3, 8.5, 8.6_

- [ ] 24. Implement error handling throughout application
  - [ ] 24.1 Add error boundaries for components
    - Create ErrorBoundary component catching render errors
    - Display user-friendly error message
    - Provide option to reload or return to dashboard
    - _Requirements: 11.6_
  
  - [ ] 24.2 Enhance API error handling
    - Parse different error response formats
    - Map error codes to user-friendly messages
    - Implement retry logic for network errors
    - Add timeout handling
    - _Requirements: 11.1, 11.5_
  
  - [ ] 24.3 Add form validation error handling
    - Display inline errors for each field
    - Prevent submission with validation errors
    - Clear errors when user corrects input
    - _Requirements: 11.4_

- [ ] 25. Optimize performance
  - [ ] 25.1 Implement lazy loading for non-critical resources
    - Lazy load Chart.js only when stats modal opens
    - Lazy load admin view code only for admin users
    - Defer non-critical CSS
    - _Requirements: 12.3_
  
  - [ ] 25.2 Add debouncing and throttling
    - Debounce search input (300ms)
    - Throttle scroll events if using infinite scroll
    - Debounce window resize handlers
    - _Requirements: 12.5_
  
  - [ ] 25.3 Implement caching strategies
    - Cache API responses in memory
    - Implement stale-while-revalidate for URL list
    - Cache user preferences in LocalStorage
    - _Requirements: 12.6_
  
  - [ ] 25.4 Optimize rendering performance
    - Implement virtual scrolling for large URL lists
    - Use event delegation for list items
    - Minimize DOM manipulations
    - Batch state updates
    - _Requirements: 12.2, 12.4_

- [ ] 26. Add backend API modifications
  - [ ] 26.1 Create API detection middleware
    - Write isAjaxRequest() helper function
    - Add middleware to detect JSON requests
    - _Requirements: Backend Integration_
  
  - [ ] 26.2 Modify authentication controllers for JSON responses
    - Update login controller to return JSON for AJAX requests
    - Update signup controller to return JSON for AJAX requests
    - Keep EJS rendering for non-AJAX fallback
    - _Requirements: 1.3, 1.4_
  
  - [ ] 26.3 Modify URL controllers for JSON responses
    - Update generateShortUrl to return JSON instead of redirect
    - Update getAllUrls to return JSON array
    - Update getUrlStats to ensure JSON response
    - Update admidviewroute to return JSON for AJAX
    - _Requirements: 3.3, 4.1, 5.1, 7.2_
  
  - [ ] 26.4 Add logout endpoint
    - Create POST /user/logout route
    - Clear cookie in response
    - Return success JSON
    - _Requirements: 10.6_
  
  - [ ] 26.5 Update Express static file serving
    - Serve public directory as static files
    - Add catch-all route serving index.html for SPA
    - Ensure API routes are defined before catch-all
    - _Requirements: Deployment_

- [ ] 27. Create index.html entry point
  - Create semantic HTML structure with header, main, footer
  - Add meta tags for viewport, description, charset
  - Link all CSS files in correct order
  - Add script tags for JavaScript modules
  - Include Font Awesome or icon library CDN
  - Add noscript fallback message
  - _Requirements: 8.1, 8.3_

- [ ] 28. Cross-browser testing and fixes
  - Test on Chrome, Firefox, Safari, Edge
  - Test on iOS Safari and Android Chrome
  - Fix any browser-specific issues
  - Add polyfills if needed for older browsers
  - Test with JavaScript disabled
  - _Requirements: 8.1, 12.1_

- [ ] 29. Accessibility audit and fixes
  - Run Lighthouse accessibility audit
  - Test keyboard navigation throughout app
  - Test with screen reader (NVDA or JAWS)
  - Fix any contrast issues
  - Ensure all interactive elements are keyboard accessible
  - Test with reduced motion preference
  - _Requirements: 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

- [ ] 30. Final integration and polish
  - [ ] 30.1 Add smooth animations and transitions
    - Add page transition animations
    - Add micro-interactions for buttons
    - Add loading state animations
    - Respect prefers-reduced-motion
    - _Requirements: 9.4, 8.7_
  
  - [ ] 30.2 Add final UI polish
    - Review all spacing and alignment
    - Ensure consistent styling across components
    - Add favicon and app icons
    - Test all user flows end-to-end
    - _Requirements: 9.1, 9.5_
  
  - [ ] 30.3 Performance optimization final pass
    - Run Lighthouse performance audit
    - Minify CSS and JavaScript
    - Optimize images and assets
    - Test on slow network (throttling)
    - Ensure page load < 2s, interactive < 3s
    - _Requirements: 12.1, 12.2_
