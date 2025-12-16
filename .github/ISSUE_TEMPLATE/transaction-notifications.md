# Add Transaction Notifications (Toast Messages)

## Description
Currently, users get basic alert dialogs when transactions complete or fail. This is not a great user experience. We need a toast notification system to show transaction status updates in a more elegant way.

## What's Missing
- Toast notification component
- Success notifications for completed transactions
- Error notifications for failed transactions
- Loading notifications for pending transactions
- Ability to dismiss notifications
- Notifications that auto-dismiss after a few seconds

## What Needs to Be Done

### 1. Create Toast Notification System
**File:** `web/app/components/Toast.tsx` (new file)

- Create a Toast component that displays notifications
- Support different types: success, error, loading, info
- Show notification message
- Show optional action button (e.g., "View on Explorer")
- Auto-dismiss after 5 seconds
- Allow manual dismiss with close button

### 2. Create Toast Context
**File:** `web/app/components/ToastProvider.tsx` (new file)

- Create a context to manage toast notifications globally
- Provide functions to show/hide toasts
- Store multiple toasts in a queue
- Handle auto-dismissal

### 3. Wrap App with Toast Provider
**File:** `web/app/layout.tsx`

- Import ToastProvider
- Wrap the app with ToastProvider so toasts work everywhere

### 4. Update Pages to Use Toasts
Replace alert() calls with toast notifications in:
- `web/app/create/page.tsx` - Show success when pool created
- `web/app/markets/[id]/page.tsx` - Show success when bet placed
- Any other pages that handle transactions

### 5. Toast Types to Support
- **Success**: Green background, checkmark icon, "Transaction successful"
- **Error**: Red background, X icon, error message
- **Loading**: Blue background, spinner, "Processing transaction..."
- **Info**: Gray background, info icon, informational message

### 6. Optional: Add Explorer Link
- For successful transactions, include a link to view on Stacks Explorer
- Link should open in new tab

## Acceptance Criteria
- [ ] Toast component displays notifications
- [ ] Toasts auto-dismiss after 5 seconds
- [ ] Toasts can be manually dismissed
- [ ] Success toasts show for completed transactions
- [ ] Error toasts show for failed transactions
- [ ] Loading toasts show while transaction is pending
- [ ] Multiple toasts can be displayed
- [ ] Toast provider is available globally
- [ ] All transaction pages use toasts instead of alerts
- [ ] Explorer links work correctly

## Testing
- [ ] Test success toast appears when pool created
- [ ] Test error toast appears when transaction fails
- [ ] Test loading toast appears during transaction
- [ ] Test toast auto-dismisses after 5 seconds
- [ ] Test manual dismiss button works
- [ ] Test multiple toasts display correctly
- [ ] Test explorer link opens correct transaction
- [ ] Test on mobile (responsive)

## Resources
- React Context: https://react.dev/reference/react/useContext
- Lucide icons: `lucide-react` (already installed)
- Create page: `web/app/create/page.tsx`
- Market detail page: `web/app/markets/[id]/page.tsx`

## Difficulty
🟡 Medium - Requires React Context and component composition
