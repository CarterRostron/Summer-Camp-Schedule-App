# Emma's Awesome App

A summer camp schedule management application for organizing staff into day-off groups.

## Features

- Add up to 24 staff members
- Organize staff into 4 groups of 6 (Red, Blue, Orange, Green)
- Automatic group capacity enforcement (6 members per group)
- Edit and delete staff members
- Data persistence using browser localStorage
- Clean, responsive interface

## Running Locally

1. Simply open `index.html` in any web browser
2. No installation or build process required!

## Free Hosting Options

### Option 1: GitHub Pages (Recommended)

1. Create a GitHub account if you don't have one
2. Create a new repository (e.g., "summer-camp-app")
3. Upload `index.html`, `styles.css`, and `app.js` to the repository
4. Go to repository Settings > Pages
5. Under "Source", select "main" branch
6. Click Save
7. Your app will be live at: `https://[your-username].github.io/[repository-name]`

### Option 2: Netlify

1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up for a free account
3. Drag and drop the entire folder into Netlify's deploy zone
4. Your app will be live instantly with a free URL

### Option 3: Vercel

1. Go to [vercel.com](https://vercel.com/)
2. Sign up for a free account
3. Click "Add New Project"
4. Import your GitHub repository or upload files directly
5. Deploy with one click

### Option 4: Run Locally

Simply open `index.html` in any web browser - no server needed!

## Usage

### Adding Staff

1. Click "Add Staff Member" button
2. Enter the staff member's name
3. Select a day-off group (or leave as Unassigned)
4. Click "Add Staff"

### Editing Staff

1. Click on any staff member's name
2. Modify their name or group assignment
3. Click "Save Changes"

### Deleting Staff

1. Click on the staff member you want to delete
2. Click the "Delete" button in the edit modal
3. Confirm the deletion

### Clearing All Data

Click the "Clear All" button to remove all staff members (warning: this cannot be undone)

## Technical Details

- Pure HTML, CSS, and JavaScript (no frameworks or build tools)
- Data stored in browser localStorage (persists across sessions)
- Responsive design works on desktop and mobile
- Maximum 24 staff members
- Each group limited to 6 members

## Data Persistence

All data is stored in your browser's localStorage. This means:
- Data persists when you close and reopen the browser
- Data is specific to the browser and device you're using
- Clearing browser data will delete the staff information
- Data is not shared across different browsers or devices

## Future Enhancements

The app is designed to be extended with additional scheduling features based on your summer camp's specific requirements.

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera
