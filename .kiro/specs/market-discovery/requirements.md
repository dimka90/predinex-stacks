# Requirements Document

## Introduction

The Market Discovery & Filtering System enables users to browse, search, and filter prediction markets on the Predinex platform. This feature provides comprehensive market exploration capabilities, allowing users to discover active pools, view market statistics, and find markets that match their interests through search and filtering functionality.

## Glossary

- **Market_Discovery_System**: The system that enables users to browse, search, and filter prediction markets
- **Market_Card**: A UI component displaying summary information about a prediction market
- **Market_List**: A paginated collection of market cards displayed to the user
- **Filter_Criteria**: User-specified parameters to narrow down displayed markets (status, volume, time)
- **Search_Query**: User-entered text to find markets by title or description
- **Market_Status**: The current state of a market (active, settled, expired)
- **Pool_Data**: On-chain data structure containing market information from the smart contract
- **Pagination_State**: The current page number and items per page for market display

## Requirements

### Requirement 1

**User Story:** As a user, I want to view all available prediction markets, so that I can discover betting opportunities.

#### Acceptance Criteria

1. WHEN a user visits the markets page, THE Market_Discovery_System SHALL fetch all pools from the smart contract
2. WHEN pool data is loading, THE Market_Discovery_System SHALL display a loading indicator
3. WHEN pool data is successfully fetched, THE Market_Discovery_System SHALL display markets in a grid layout
4. WHEN no markets exist, THE Market_Discovery_System SHALL display an empty state message
5. WHEN fetching pool data fails, THE Market_Discovery_System SHALL display an error message with retry option

### Requirement 2

**User Story:** As a user, I want to see key information about each market at a glance, so that I can quickly evaluate betting opportunities.

#### Acceptance Criteria

1. WHEN displaying a market card, THE Market_Discovery_System SHALL show the pool title
2. WHEN displaying a market card, THE Market_Discovery_System SHALL show the pool description
3. WHEN displaying a market card, THE Market_Discovery_System SHALL show both outcome names
4. WHEN displaying a market card, THE Market_Discovery_System SHALL show the total volume in STX
5. WHEN displaying a market card, THE Market_Discovery_System SHALL show the market status (active, settled, expired)
6. WHEN displaying a market card, THE Market_Discovery_System SHALL show the time remaining or settlement status
7. WHEN displaying a market card, THE Market_Discovery_System SHALL show the current odds for each outcome

### Requirement 3

**User Story:** As a user, I want to search for markets by keywords, so that I can find specific topics I'm interested in.

#### Acceptance Criteria

1. WHEN a user types in the search input, THE Market_Discovery_System SHALL filter markets by title matching the search query
2. WHEN a user types in the search input, THE Market_Discovery_System SHALL filter markets by description matching the search query
3. WHEN the search query is empty, THE Market_Discovery_System SHALL display all markets
4. WHEN no markets match the search query, THE Market_Discovery_System SHALL display a "no results" message
5. THE Market_Discovery_System SHALL perform case-insensitive search matching

### Requirement 4

**User Story:** As a user, I want to filter markets by status, so that I can focus on active, settled, or expired markets.

#### Acceptance Criteria

1. WHEN a user selects the "Active" filter, THE Market_Discovery_System SHALL display only unsettled markets before expiry
2. WHEN a user selects the "Settled" filter, THE Market_Discovery_System SHALL display only markets that have been settled
3. WHEN a user selects the "Expired" filter, THE Market_Discovery_System SHALL display only markets past expiry that are unsettled
4. WHEN a user selects "All" filter, THE Market_Discovery_System SHALL display markets of all statuses
5. THE Market_Discovery_System SHALL calculate market status based on settled flag and expiry block height

### Requirement 5

**User Story:** As a user, I want to sort markets by different criteria, so that I can prioritize markets based on my preferences.

#### Acceptance Criteria

1. WHEN a user selects "Volume" sort, THE Market_Discovery_System SHALL order markets by total volume descending
2. WHEN a user selects "Newest" sort, THE Market_Discovery_System SHALL order markets by creation time descending
3. WHEN a user selects "Ending Soon" sort, THE Market_Discovery_System SHALL order markets by expiry time ascending
4. THE Market_Discovery_System SHALL maintain sort order when filters or search are applied
5. THE Market_Discovery_System SHALL default to "Newest" sort on initial page load

### Requirement 6

**User Story:** As a user, I want to navigate through multiple pages of markets, so that I can browse large numbers of markets efficiently.

#### Acceptance Criteria

1. WHEN more than 12 markets exist, THE Market_Discovery_System SHALL display pagination controls
2. WHEN a user clicks "Next", THE Market_Discovery_System SHALL display the next page of markets
3. WHEN a user clicks "Previous", THE Market_Discovery_System SHALL display the previous page of markets
4. WHEN on the first page, THE Market_Discovery_System SHALL disable the "Previous" button
5. WHEN on the last page, THE Market_Discovery_System SHALL disable the "Next" button
6. THE Market_Discovery_System SHALL display 12 markets per page
7. THE Market_Discovery_System SHALL show the current page number and total pages

### Requirement 7

**User Story:** As a user, I want to click on a market card to view detailed information, so that I can learn more before placing a bet.

#### Acceptance Criteria

1. WHEN a user clicks on a market card, THE Market_Discovery_System SHALL navigate to the market detail page
2. WHEN navigating to market detail, THE Market_Discovery_System SHALL pass the pool ID as a URL parameter
3. THE Market_Discovery_System SHALL provide visual feedback on hover to indicate cards are clickable
4. THE Market_Discovery_System SHALL maintain scroll position when returning from market detail page
