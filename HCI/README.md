# HCI Experiment Dashboard - Setup Guide

## Prerequisites

You need Node.js installed on your system. 

### Install Node.js

1. Download Node.js from: https://nodejs.org/
2. Install the LTS version (recommended)
3. Restart your terminal after installation

## Installation Steps

Once Node.js is installed:

```powershell
# Navigate to project directory
cd "c:\Users\daryl\OneDrive\Desktop\VS Codes\HCI"

# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Routes

Once the app is running, you can access:

- **Dashboard**: http://localhost:3000/ or http://localhost:3000/dashboard
- **OBU Display**: http://localhost:3000/obu
- **Presenter Control**: http://localhost:3000/presenter

## Project Structure

```
HCI/
├── src/
│   ├── main.jsx          # Application entry point
│   ├── index.css         # Global styles
│   └── pages/
│       ├── Dashboard.jsx      # Main dashboard view
│       ├── OBU.jsx            # On-Board Unit display
│       └── PresenterControl.jsx  # Experiment control panel
├── Components/
│   ├── dashboard/        # Dashboard UI components
│   │   ├── TopBar.jsx
│   │   ├── DrivingView.jsx
│   │   ├── DashboardMessages.jsx
│   │   ├── RightPanels.jsx
│   │   ├── LocationModal.jsx
│   │   ├── SpatialAROverlay.jsx
│   │   └── StandardTextOverlay.jsx
│   └── experiment/
│       └── ExperimentContext.jsx  # Experiment state management
├── components/ui/        # Reusable UI components
├── api/                  # API client (mock for now)
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Dependencies and scripts

```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Lucide React** - Icon library

## Development

The application uses:
- Vite for fast development and hot module replacement
- Tailwind CSS for styling (configured with custom colors)
- React Router for navigation between pages
- React Context for experiment state management

## Troubleshooting

### If you see import errors:
- Make sure all dependencies are installed: `npm install`
- Restart the dev server

### If styles don't load:
- Check that Tailwind CSS is properly configured
- Make sure `src/index.css` is imported in `main.jsx`

### Port already in use:
The dev server runs on port 3000 by default. If occupied, Vite will suggest an alternative port.
