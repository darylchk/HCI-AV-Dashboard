# AV Overtake Scenario - User Guide

## How to Run the AV Overtake Scenario

### Setup (3 Screens Recommended)
1. **Screen 1 - Dashboard**: http://localhost:3000/dashboard
2. **Screen 2 - OBU**: http://localhost:3000/obu
3. **Screen 3 - Presenter Control**: http://localhost:3000/presenter

### Running the Scenario

1. **Go to Presenter Control** (http://localhost:3000/presenter)
2. **Click the big green button**: "Start AV Overtake Scenario"
3. **Watch the sequence unfold automatically**:

### What Happens:

**Step 1 (Immediate):**
- OBU shows: "Acknowledged Presence!" with checkmark icon
- Dashboard Messages shows: "ABC-1234 Sees You!"
- Message appears in the message history

**Step 2 (After 3 seconds):**
- OBU switches to: "Overtaking From: RIGHT" with arrow
- Dashboard Messages adds new message: "ABC-1234 Wants to Overtake"
- Dashboard AR screen activates (red flashing indicator on LEFT where AV is)
- Message history now shows both messages in order

### Features:
- ✅ **Message History**: Dashboard Messages panel shows all messages as they arrive
- ✅ **Live OBU Updates**: OBU display changes in real-time with each message
- ✅ **AR Visualization**: Dashboard shows spatial AR overlay when overtaking starts
- ✅ **Timestamp**: Each message shows when it was received
- ✅ **Current Message Highlight**: Active message pulses with red border

### To Reset:
- Click "Reset Experiment" button in Presenter Control
- Or refresh all pages

### Technical Details:
- AV is positioned on your **LEFT** side
- First message: "Acknowledged Presence" (green icon)
- Second message: "Overtaking" (orange icon with arrow)
- 3-second delay between messages
- Messages persist in history for review
