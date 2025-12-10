# DPU TikTok - Quick Start Guide

## What You Have

A complete, working content library website with:
- ✅ Dark poetry aesthetic matching DPU Admin Portal style
- ✅ Three poet categories (Laura L Glover, Georgia Gray, Others)
- ✅ Audio playback, text preview, and download features
- ✅ Copy-to-clipboard for easy text pasting
- ✅ Responsive design (works on all devices)
- ✅ Upload interface ready (commented out for future)
- ✅ Example content to show how it works

## Immediate Next Steps

### 1. Test Locally (Optional but Recommended)

Before uploading to GitHub, test the site locally:

```bash
# Navigate to the project folder
cd dpu-tiktok/

# Start a simple local server (pick one):

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# PHP
php -S localhost:8000

# Then open in browser: http://localhost:8000
```

### 2. Upload to GitHub

```bash
# Initialize git repository
cd dpu-tiktok/
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: DPU TikTok Content Library"

# Create new repository on GitHub.com
# Then connect and push:
git remote add origin https://github.com/YOUR-USERNAME/dpu-tiktok.git
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub.com
2. Click **Settings** tab
3. Click **Pages** in left sidebar
4. Under "Source", select **main** branch
5. Click **Save**
6. Your site will be live at: `https://YOUR-USERNAME.github.io/dpu-tiktok/`

### 4. Add Your First Real Recording

Replace the example with your actual content:

```bash
# Remove example folder
rm -rf resources/content/laura-l-glover/2024-12-09-laura-l-glover-midnight-whispers/

# Create your folder (use today's date)
mkdir resources/content/laura-l-glover/2024-12-10-laura-l-glover-YOUR-POEM-TITLE/

# Add your files
cp /path/to/recording.mp3 resources/content/laura-l-glover/2024-12-10-laura-l-glover-YOUR-POEM-TITLE/audio.mp3
cp /path/to/poem.txt resources/content/laura-l-glover/2024-12-10-laura-l-glover-YOUR-POEM-TITLE/text.txt

# Create metadata.json (see template below)

# Update manifest.json to include your new folder

# Commit and push
git add .
git commit -m "Add first recording: [Your Poem Title]"
git push
```

## metadata.json Template

Save this as `metadata.json` in your poem folder:

```json
{
  "date": "2024-12-10",
  "poet": "Laura L Glover",
  "title": "Your Poem Title"
}
```

## manifest.json Template

Edit `resources/content/laura-l-glover/manifest.json`:

```json
{
  "folders": [
    "2024-12-10-laura-l-glover-your-poem-title"
  ]
}
```

## File Checklist for Each Poem

Inside each poem folder, you need:
- [ ] `audio.mp3` - Your audio recording
- [ ] `text.txt` - The poem text
- [ ] `metadata.json` - Info about the poem

Don't forget to:
- [ ] Update the poet's `manifest.json` file
- [ ] Commit and push to GitHub

## Common Commands You'll Use

```bash
# Check what changed
git status

# Add new content
git add .
git commit -m "Add new poem: [title]"
git push

# Pull updates (if working with teammates)
git pull

# View commit history
git log --oneline
```

## Testing Your Site

After pushing to GitHub:
1. Wait 2-3 minutes for GitHub Pages to rebuild
2. Visit your site URL
3. Check that content displays correctly
4. Test audio playback
5. Test download buttons
6. Test copy-to-clipboard

## If Something Goes Wrong

### Content not showing?
- Check `manifest.json` includes the folder name
- Check `metadata.json` has valid JSON
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Audio not playing?
- Check file is named exactly `audio.mp3`
- Check file format is MP3, WAV, or M4A
- Check file size isn't too large (< 10MB recommended)

### Can't push to GitHub?
```bash
# Pull first, then try again
git pull origin main
git push
```

## Need Help?

1. Check the full **README.md** for detailed instructions
2. Review the example content structure
3. Reach out to DPU TikTok team lead

## What's Next?

Once you're comfortable with manual uploads:
1. Consider activating the upload interface (requires backend setup)
2. Add search/filter features
3. Customize the styling further
4. Add more categories if needed

---

**You're all set!** 🎤🖤

The site is ready to use. Start adding your recordings and share the URL with your TikTok team!
