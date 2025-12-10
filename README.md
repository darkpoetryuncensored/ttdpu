# DPU TikTok Content Library

A dark poetry-themed content management system for storing and organizing completed audio recordings and poetry texts for TikTok video production.

## Project Structure

```
dpu-tiktok/
├── index.html                          # Main webpage
├── README.md                           # This file
└── resources/
    ├── css/
    │   └── style.css                   # Styling with dark poetry aesthetic
    ├── javascript/
    │   └── script.js                   # Content loading and interactions
    └── content/
        ├── laura-l-glover/
        │   ├── manifest.json           # Lists available poems
        │   └── YYYY-MM-DD-poet-poem/   # Individual poem folders
        │       ├── metadata.json       # Poem information
        │       ├── audio.mp3           # Audio recording
        │       └── text.txt            # Poem text
        ├── georgia-gray/
        │   └── (same structure)
        └── others/
            └── (same structure)
```

## Features

- **Three Poet Categories**: Laura L Glover, Georgia Gray, and Others
- **Audio Playback**: Built-in audio player for each recording
- **Text Preview**: View poem text directly on the page
- **Download Options**: Download audio and text files separately
- **Copy to Clipboard**: One-click copy of poem text for video editing
- **Automatic Sorting**: Content sorted by date (newest first)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: Dyslexia-friendly fonts, high contrast, keyboard navigation

## Adding New Content

### Method 1: Command Line (Current Method)

#### Step 1: Create the folder structure

```bash
# Navigate to the poet's folder
cd resources/content/laura-l-glover/

# Create new poem folder with format: YYYY-MM-DD-poet-name-poem-title
mkdir 2024-12-10-laura-l-glover-shattered-dreams

# Navigate into the folder
cd 2024-12-10-laura-l-glover-shattered-dreams/
```

#### Step 2: Add your files

```bash
# Copy or move your audio file (rename it to audio.mp3)
cp /path/to/your/recording.mp3 audio.mp3

# Create or copy your text file (rename it to text.txt)
cp /path/to/your/poem.txt text.txt
```

#### Step 3: Create metadata.json

Create a file named `metadata.json` with this format:

```json
{
  "date": "2024-12-10",
  "poet": "Laura L Glover",
  "title": "Shattered Dreams"
}
```

**Important**: The date format MUST be `YYYY-MM-DD`

#### Step 4: Update manifest.json

Edit the `manifest.json` file in the poet's main folder:

```bash
# Go back to poet's folder
cd ../

# Edit manifest.json
nano manifest.json
```

Add your new folder to the `folders` array:

```json
{
  "folders": [
    "2024-12-10-laura-l-glover-shattered-dreams",
    "2024-12-09-laura-l-glover-midnight-whispers"
  ]
}
```

#### Step 5: Commit and push to GitHub

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Add new poem: Shattered Dreams by Laura L Glover"

# Push to GitHub
git push origin main
```

### Method 2: Upload Interface (Future Feature - Currently Commented Out)

An upload form interface is prepared in the code but commented out. To activate it later, you'll need:

1. A backend service (Firebase, Netlify Functions, etc.)
2. Uncomment the upload HTML in `index.html` (lines marked with `UPLOAD INTERFACE`)
3. Uncomment the upload CSS in `style.css` (section marked `UPLOAD MODAL STYLES`)
4. Uncomment the upload JavaScript in `script.js` (sections marked with comments)
5. Implement the actual file upload logic with your chosen backend

## Editing Existing Content

### To change a date, poet name, or title:

1. Navigate to the poem's folder
2. Edit `metadata.json` on GitHub or via command line
3. Commit and push the changes

Example via GitHub web interface:
1. Go to the poem folder on GitHub.com
2. Click on `metadata.json`
3. Click the pencil icon (Edit)
4. Make your changes
5. Click "Commit changes"

### To replace audio or text:

1. Navigate to the poem's folder
2. Replace the `audio.mp3` or `text.txt` file
3. Commit and push

## File Naming Conventions

### Folder Names
Format: `YYYY-MM-DD-poet-name-poem-title`

Examples:
- `2024-12-09-laura-l-glover-midnight-whispers`
- `2024-12-10-georgia-gray-crimson-night`
- `2024-12-11-john-smith-forgotten-souls` (for "Others" category)

**Rules:**
- Always use lowercase
- Replace spaces with hyphens
- Remove special characters
- Include poet name even though it's in the poet's folder (helps with organization)

### File Names (Inside Each Folder)
- **Audio**: Always name it `audio.mp3` (or `.wav`, `.m4a` depending on format)
- **Text**: Always name it `text.txt`
- **Metadata**: Always name it `metadata.json`

## Metadata.json Format

```json
{
  "date": "YYYY-MM-DD",
  "poet": "Poet's Display Name",
  "title": "Poem Title"
}
```

**Fields:**
- `date`: Upload/recording date in YYYY-MM-DD format
- `poet`: Poet's name as it should appear on the webpage
- `title`: Poem title as it should appear on the webpage

**Note**: The metadata overrides the folder name for display purposes, so you can use proper capitalization and spacing here.

## Git Command Reference

### Basic Workflow

```bash
# Check status of your changes
git status

# Stage all changes
git add .

# Commit with message
git commit -m "Your descriptive message here"

# Push to GitHub
git push origin main

# Pull latest changes from GitHub
git pull origin main
```

### Common Scenarios

**Adding multiple poems at once:**
```bash
git add .
git commit -m "Add 3 new poems: [list titles]"
git push origin main
```

**Fixing a mistake:**
```bash
# Edit the file(s)
git add .
git commit -m "Fix: correct date in metadata for [poem title]"
git push origin main
```

**Checking what changed:**
```bash
git diff
```

## Troubleshooting

### Content not showing up on webpage

1. **Check manifest.json**: Make sure the folder is listed in the poet's `manifest.json`
2. **Check metadata.json**: Ensure it exists and has valid JSON format
3. **Check file names**: Make sure files are named exactly `audio.mp3` and `text.txt`
4. **Clear browser cache**: Sometimes old versions are cached

### Audio not playing

1. **Check file format**: Browser supports MP3, WAV, and M4A
2. **Check file size**: Very large files may take time to load
3. **Check file path**: Ensure `audio.mp3` exists in the poem folder

### Text not displaying

1. **Check encoding**: Text files should be UTF-8 encoded
2. **Check file name**: Must be exactly `text.txt`
3. **Check content**: Make sure file isn't empty

### Date not displaying correctly

1. **Check format**: Must be `YYYY-MM-DD` (e.g., `2024-12-09`)
2. **Check metadata.json**: Ensure JSON is valid (use a JSON validator online)

## Design Features

### Color Scheme
- **Void Black** (#0a0a0a): Background
- **Blood Red** (#8b0000): Primary accent
- **Crimson** (#dc143c): Hover states
- **Bone White** (#e8e8e8): Text
- **Smoke Gray** (#2a2a2a): Containers

### Typography
- **Display Font**: Georgia (serif) - for titles and dates
- **Body Font**: Verdana (sans-serif) - for content
- Dyslexia-friendly with increased letter spacing

### Animations
- Fade-in effects on page load
- Smooth hover transitions
- Visual feedback for copy-to-clipboard

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Features

- High contrast color scheme
- Dyslexia-friendly fonts (Verdana, Georgia)
- Keyboard navigation support
- ARIA labels for screen readers
- Proper heading hierarchy
- Focus indicators on interactive elements

## Future Enhancements

- [ ] Upload interface with backend integration
- [ ] Search functionality
- [ ] Filter by poet or date range
- [ ] Bulk download options
- [ ] Admin authentication
- [ ] Automatic audio waveform visualization
- [ ] Text-to-speech preview
- [ ] Export to CSV for tracking

## License

Internal use for Dark Poetry Uncensored TikTok content management.

## Support

For questions or issues with the website, contact the DPU TikTok team lead or refer to this README.

---

**Version**: 1.0  
**Last Updated**: December 2024  
**Maintained By**: DPU TikTok Team
