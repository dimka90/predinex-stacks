# Implementation Plan

- [x] 1. Set up contract integration and data types
  - Create TypeScript interfaces for pool data and processed markets
  - Set up contract integration utilities for fetching pool data
  - Implement market status and odds calculation functions
  - _Requirements: 1.1, 2.4, 2.5, 2.7, 4.5_

- [ ]* 1.1 Write property test for market status calculation
  - **Property 10: Market status calculation accuracy**
  - **Validates: Requirements 4.5**

- [ ]* 1.2 Write unit tests for data processing utilities
  - Create unit tests for odds calculation
  - Write unit tests for time remaining calculation
  - Write unit tests for market data transformation
  - _Requirements: 2.4, 2.7_

- [x] 2. Create core market discovery hook
  - Implement useMarketDiscovery hook for data fetching and state management
  - Add loading, error, and success states
  - Implement contract integration for fetching pools
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 2.1 Write unit tests for market discovery hook
  - Test loading states and error handling
  - Test successful data fetching
  - Test empty state handling
  - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [x] 3. Build MarketCard component
  - Create MarketCard component with all required information display
  - Implement responsive design and hover effects
  - Add click navigation to market detail page
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 7.1, 7.2_

- [ ]* 3.1 Write property test for market card rendering
  - **Property 1: Market card information completeness**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**

- [ ]* 3.2 Write property test for navigation parameters
  - **Property 9: Navigation parameter correctness**
  - **Validates: Requirements 7.2**

- [x] 4. Implement search functionality
  - Create SearchBar component with debounced input
  - Implement case-insensitive search filtering for titles and descriptions
  - Add search state management to market discovery hook
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 4.1 Write property test for search filtering
  - **Property 2: Search filtering accuracy**
  - **Validates: Requirements 3.1, 3.2, 3.5**

- [ ]* 4.2 Write unit tests for search edge cases
  - Test empty search query behavior
  - Test no results scenario
  - Test search input debouncing
  - _Requirements: 3.3, 3.4_

- [x] 5. Build status filtering system
  - Create FilterControls component for status selection
  - Implement filtering logic for active, settled, and expired markets
  - Add filter state management to market discovery hook
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 5.1 Write property test for status filtering
  - **Property 3: Status filtering correctness**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.5**

- [ ]* 5.2 Write unit tests for filter edge cases
  - Test "All" filter behavior
  - Test filter state transitions
  - _Requirements: 4.4_

- [x] 6. Implement sorting functionality
  - Create SortControls component with dropdown selection
  - Implement sorting logic for volume, newest, and ending soon
  - Add sort state management and default sorting
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 6.1 Write property test for sort order consistency
  - **Property 4: Sort order consistency**
  - **Validates: Requirements 5.1, 5.2, 5.3**

- [ ]* 6.2 Write property test for sort preservation
  - **Property 5: Sort preservation during filtering**
  - **Validates: Requirements 5.4**

- [ ]* 6.3 Write unit tests for sort defaults and edge cases
  - Test default sort on page load
  - Test sort state management
  - _Requirements: 5.5_

- [x] 7. Create pagination system
  - Create Pagination component with next/previous navigation
  - Implement pagination logic with 12 items per page
  - Add pagination state management and boundary checking
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [ ]* 7.1 Write property test for pagination size consistency
  - **Property 6: Pagination size consistency**
  - **Validates: Requirements 6.6**

- [ ]* 7.2 Write property test for pagination navigation
  - **Property 7: Pagination navigation accuracy**
  - **Validates: Requirements 6.2, 6.3**

- [ ]* 7.3 Write property test for pagination information
  - **Property 8: Pagination information accuracy**
  - **Validates: Requirements 6.7**

- [ ]* 7.4 Write unit tests for pagination edge cases
  - Test first page button states
  - Test last page button states
  - Test pagination with small datasets
  - _Requirements: 6.4, 6.5_

- [x] 8. Build MarketGrid layout component
  - Create MarketGrid component with responsive grid layout
  - Implement loading states and empty state displays
  - Add error handling and retry functionality
  - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [ ]* 8.1 Write unit tests for MarketGrid states
  - Test loading state display
  - Test empty state display
  - Test error state and retry functionality
  - _Requirements: 1.2, 1.4, 1.5_

- [x] 9. Create main MarketsPage component
  - Assemble all components into the main markets page
  - Implement responsive layout and component coordination
  - Add URL state management for filters and pagination
  - _Requirements: 1.1, 1.2, 1.3_

- [ ]* 9.1 Write integration tests for MarketsPage
  - Test component integration and data flow
  - Test URL state synchronization
  - Test responsive behavior
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 10. Add routing and navigation integration
  - Set up routing for the markets page
  - Implement navigation from existing pages to markets
  - Add market detail page routing with pool ID parameters
  - Update navigation components with markets page links
  - _Requirements: 7.1, 7.2_

- [ ]* 10.1 Write integration tests for navigation
  - Test routing to markets page
  - Test navigation to market detail with correct parameters
  - Test navigation state preservation
  - _Requirements: 7.1, 7.2_

- [ ] 11. Final integration and testing
  - Ensure all tests pass, ask the user if questions arise