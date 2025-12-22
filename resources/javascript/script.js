/**
 * DPU TikTok Content Portal
 * Handles poems library and visuals gallery
 */

// Configuration
const POETS = {
    'laura-l-glover': 'Laura L Glover',
    'georgia-gray': 'Georgia Gray',
    'others': 'Others'
};

const CONTENT_BASE_PATH = 'resources/content/';
const VISUAL_BASE_PATH = 'resources/visual/';

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'poems.html' || currentPage === '') {
        // Load poems content
        loadAllContent();
    } else if (currentPage === 'visuals.html') {
        // Load visuals gallery
        loadVisuals();
        initializeLightbox();
    }
	
	// Initialize collapsible sections for poems page
    if (currentPage === 'poems.html' || currentPage === '') {
        initializeCollapsible();
    }
    
    // UPLOAD MODAL HANDLERS (COMMENTED OUT FOR FUTURE USE)
    /*
    const uploadBtn = document.getElementById('upload-btn');
    const modal = document.getElementById('upload-modal');
    
    if (uploadBtn && modal) {
        const closeBtn = document.querySelector('.close');
        const uploadForm = document.getElementById('upload-form');
        
        uploadBtn.onclick = () => modal.style.display = 'block';
        closeBtn.onclick = () => modal.style.display = 'none';
        
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
        
        if (currentPage === 'poems.html') {
            const poetSelect = document.getElementById('poet-select');
            const customPoetGroup = document.getElementById('custom-poet-group');
            
            poetSelect.onchange = () => {
                if (poetSelect.value === 'others') {
                    customPoetGroup.style.display = 'block';
                    document.getElementById('custom-poet').required = true;
                } else {
                    customPoetGroup.style.display = 'none';
                    document.getElementById('custom-poet').required = false;
                }
            };
            
            uploadForm.onsubmit = handlePoemUpload;
        } else if (currentPage === 'visuals.html') {
            uploadForm.onsubmit = handleVisualUpload;
        }
    }
    */
});

/* ========================================
   POEMS PAGE FUNCTIONS
   ======================================== */

/**
 * Load content for all poets
 */
async function loadAllContent() {
    for (const [poetKey, poetName] of Object.entries(POETS)) {
        await loadPoetContent(poetKey);
    }
}

/**
 * Load content for a specific poet
 */
async function loadPoetContent(poetKey) {
    const container = document.querySelector(`.content-list[data-poet="${poetKey}"]`);
    
    if (!container) return;
    
    try {
        const folders = await getPoetFolders(poetKey);
        
        if (folders.length === 0) {
            container.innerHTML = '<div class="no-content">No content available yet.</div>';
            return;
        }
        
        const entries = [];
        for (const folder of folders) {
            const metadata = await loadMetadata(poetKey, folder);
            if (metadata) {
                entries.push({
                    folder: folder,
                    ...metadata
                });
            }
        }
        
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (entries.length === 0) {
            container.innerHTML = '<div class="no-content">No content available yet.</div>';
        } else {
            container.innerHTML = entries.map(entry => createEntryHTML(poetKey, entry)).join('');
            attachEventListeners(container);
        }
        
    } catch (error) {
        console.error(`Error loading content for ${poetKey}:`, error);
        container.innerHTML = '<div class="no-content">Error loading content. Please try again later.</div>';
    }
}

/**
 * Get list of folders for a poet
 */
async function getPoetFolders(poetKey) {
    try {
        const response = await fetch(`${CONTENT_BASE_PATH}${poetKey}/manifest.json`);
        if (response.ok) {
            const manifest = await response.json();
            return manifest.folders || [];
        }
    } catch (error) {
        console.log(`No manifest found for ${poetKey}`);
    }
    
    return [];
}

/**
 * Load metadata.json for a specific folder
 */
async function loadMetadata(poetKey, folder) {
    try {
        const response = await fetch(`${CONTENT_BASE_PATH}${poetKey}/${folder}/metadata.json`);
        if (!response.ok) return null;
        
        const metadata = await response.json();
        return metadata;
    } catch (error) {
        console.error(`Error loading metadata for ${folder}:`, error);
        return null;
    }
}

/**
 * Create HTML for a content entry
 */
function createEntryHTML(poetKey, entry) {
    const formattedDate = formatDate(entry.date);
    const audioPath = `${CONTENT_BASE_PATH}${poetKey}/${entry.folder}/audio.mp3`;
    const textPath = `${CONTENT_BASE_PATH}${poetKey}/${entry.folder}/text.txt`;
    
    return `
        <div class="content-entry" data-folder="${entry.folder}">
            <div class="entry-header collapsible-entry">
                <span class="entry-arrow"></span>
                <span class="entry-date">${formattedDate}</span>
                <span class="entry-separator"> - </span>
                <span class="entry-title">${escapeHtml(entry.title)}</span>
            </div>
            
            <div class="entry-content collapsed-entry">
                <div class="audio-player">
                    <audio controls preload="metadata">
                        <source src="${audioPath}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
                
                <div class="text-preview" data-text-path="${textPath}">
                    <em>Loading text preview...</em>
                </div>
                
                <div class="entry-actions">
                    <a href="${audioPath}" download class="btn btn-download-audio">
                        <span>⬇</span> Download Audio
                    </a>
                    <a href="${textPath}" download class="btn btn-download-text">
                        <span>⬇</span> Download Text
                    </a>
                    <button class="btn btn-copy" data-text-path="${textPath}">
                        <span>📋</span> Copy Text
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Attach event listeners to buttons
 */
function attachEventListeners(container) {
    const previews = container.querySelectorAll('.text-preview');
    previews.forEach(preview => {
        loadTextPreview(preview);
    });
    
    const copyButtons = container.querySelectorAll('.btn-copy');
    copyButtons.forEach(button => {
        button.addEventListener('click', handleCopyText);
    });
    
    // Initialize entry collapsible - PASS CONTAINER!
    initializeEntryCollapsible(container);
}

/**
 * Load text preview
 */
async function loadTextPreview(previewElement) {
    const textPath = previewElement.dataset.textPath;
    
    try {
        const response = await fetch(textPath);
        if (!response.ok) throw new Error('Failed to load text');
        
        const text = await response.text();
        previewElement.textContent = text;
    } catch (error) {
        console.error('Error loading text preview:', error);
        previewElement.innerHTML = '<em>Error loading text preview</em>';
    }
}

/**
 * Handle copy text to clipboard
 */
async function handleCopyText(event) {
    const button = event.currentTarget;
    const textPath = button.dataset.textPath;
    
    try {
        const response = await fetch(textPath);
        if (!response.ok) throw new Error('Failed to load text');
        
        const text = await response.text();
        await navigator.clipboard.writeText(text);
        
        const originalText = button.innerHTML;
        button.innerHTML = '<span>✓</span> Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
        
    } catch (error) {
        console.error('Error copying text:', error);
        alert('Failed to copy text to clipboard. Please try again.');
    }
}

/* ========================================
   VISUALS PAGE FUNCTIONS
   ======================================== */

/**
 * Load visuals from manifest
 */
async function loadVisuals() {
    const grid = document.getElementById('visuals-grid');
    
    if (!grid) return;
    
    try {
        const response = await fetch(`${VISUAL_BASE_PATH}visual-manifest.json`);
        
        if (!response.ok) {
            throw new Error('Failed to load visual manifest');
        }
        
        const manifest = await response.json();
        const visuals = manifest.visuals || [];
        
        if (visuals.length === 0) {
            grid.innerHTML = '<div class="no-content">No visuals available yet.</div>';
            return;
        }
        
        grid.innerHTML = visuals.map(visual => createVisualCardHTML(visual)).join('');
        
        // Attach click handlers to cards
        const cards = grid.querySelectorAll('.visual-card');
        cards.forEach(card => {
            card.addEventListener('click', () => openLightbox(card.dataset));
        });
        
    } catch (error) {
        console.error('Error loading visuals:', error);
        grid.innerHTML = '<div class="no-content">Error loading visuals. Please try again later.</div>';
    }
}

/**
 * Create HTML for a visual card
 */
function createVisualCardHTML(visual) {
    const type = visual.type || 'image';
    const folder = type === 'video' ? 'videos' : 'images';
    const filePath = `${VISUAL_BASE_PATH}${folder}/${visual.filename}`;
    
    let thumbnailHTML = '';
    if (type === 'video') {
        thumbnailHTML = `
            <video preload="metadata">
                <source src="${filePath}#t=0.1" type="video/mp4">
            </video>
            <div class="video-indicator">▶</div>
        `;
    } else {
        thumbnailHTML = `<img src="${filePath}" alt="${escapeHtml(visual.description)}">`;
    }
    
    return `
        <div class="visual-card" 
             data-filename="${visual.filename}"
             data-type="${type}"
             data-description="${escapeHtml(visual.description)}"
             data-attribution="${escapeHtml(visual.attribution)}"
             data-filepath="${filePath}">
            <div class="visual-thumbnail">
                ${thumbnailHTML}
            </div>
            <div class="visual-info">
                <p class="visual-description">${escapeHtml(visual.description)}</p>
                <p class="visual-attribution">by ${escapeHtml(visual.attribution)}</p>
                <div class="visual-actions">
                    <a href="${filePath}" download="${visual.filename}" class="btn btn-download" onclick="event.stopPropagation()">
                        <span>⬇</span> Download
                    </a>
                </div>
            </div>
        </div>
    `;
}

/* ========================================
   LIGHTBOX FUNCTIONS
   ======================================== */

/**
 * Initialize lightbox
 */
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

/**
 * Open lightbox with visual
 */
function openLightbox(data) {
    const lightbox = document.getElementById('lightbox');
    const mediaContainer = document.getElementById('lightbox-media');
    const description = document.getElementById('lightbox-description');
    const attribution = document.getElementById('lightbox-attribution');
    const downloadBtn = document.getElementById('lightbox-download');
    
    // Clear previous content
    mediaContainer.innerHTML = '';
    
    // Add media
    if (data.type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.src = data.filepath;
        mediaContainer.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = data.filepath;
        img.alt = data.description;
        mediaContainer.appendChild(img);
    }
    
    // Set info
    description.textContent = data.description;
    attribution.textContent = `by ${data.attribution}`;
    downloadBtn.href = data.filepath;
    downloadBtn.download = data.filename;
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close lightbox
 */
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const mediaContainer = document.getElementById('lightbox-media');
    
    // Stop any playing videos
    const video = mediaContainer.querySelector('video');
    if (video) {
        video.pause();
    }
    
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Initialize collapsible sections
 * Makes poet name headers (Laura L Glover, Georgia Gray, etc.) clickable/touchable
 * Includes scroll detection to prevent accidental triggers while scrolling
 */
function initializeCollapsible() {
    // Find all poet headers that have the 'collapsible' class
    const collapsibleHeaders = document.querySelectorAll('.poet-name.collapsible');
    
    // Loop through each header and add event listeners
    collapsibleHeaders.forEach(header => {
        // Variables to track touch movement (detect scroll vs tap)
        let touchStartY = 0;
        let touchEndY = 0;
        const scrollThreshold = 10; // Pixels of movement to consider it a scroll
        
        // Create a toggle function that both click and touch will use
        // 'this' refers to the element that was clicked/touched
        const toggleSection = function() {
            // Toggle the 'active' class on the header (changes arrow direction via CSS)
            this.classList.toggle('active');
            
            // Find the next element after the header (the content list)
            const contentList = this.nextElementSibling;
            
            // Make sure we found the content list before trying to toggle it
            if (contentList && contentList.classList.contains('content-list')) {
                // Toggle 'collapsed' class (CSS handles the expand/collapse animation)
                contentList.classList.toggle('collapsed');
            }
        };
        
        // Desktop: Listen for regular clicks
        header.addEventListener('click', toggleSection);
        
        // Mobile: Track touch start position
        header.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true }); // passive = doesn't prevent scrolling
        
        // Mobile: Track touch end position and decide if it was a tap or scroll
        header.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].clientY;
            
            // Calculate how far the finger moved
            const touchDistance = Math.abs(touchEndY - touchStartY);
            
            // Only trigger if movement was less than threshold (was a tap, not scroll)
            if (touchDistance < scrollThreshold) {
                e.preventDefault(); // Prevent click event from also firing
                toggleSection.call(this);
            }
            // If movement >= threshold, do nothing (user was scrolling)
        });
    });
}

/**
 * Initialize collapsible poem entries
 * Makes individual poem headers (date + title) clickable/touchable
 * @param {HTMLElement} container - The content list div to search within
 */
/**
 * Initialize collapsible poem entries
 * Makes individual poem headers (date + title) clickable/touchable
 * Includes scroll detection to prevent accidental triggers while scrolling
 * @param {HTMLElement} container - The content list div to search within
 */
function initializeEntryCollapsible(container) {
    // Find all poem entry headers within this specific container
    const entryHeaders = container.querySelectorAll('.entry-header.collapsible-entry');
    
    // Loop through each poem entry header
    entryHeaders.forEach(header => {
        // Variables to track touch movement (detect scroll vs tap)
        let touchStartY = 0;
        let touchEndY = 0;
        const scrollThreshold = 10; // Pixels of movement to consider it a scroll
        
        // Create a toggle function for click events
        const toggleEntry = function(e) {
            // Stop the event from bubbling up to parent elements
            e.stopPropagation();
            e.preventDefault();
            
            // Toggle 'active' class on the header (rotates arrow via CSS)
            this.classList.toggle('active');
            
            // Find the next element (the entry content with audio/text/buttons)
            const entryContent = this.nextElementSibling;
            
            // Make sure we found the entry content before toggling
            if (entryContent && entryContent.classList.contains('entry-content')) {
                // Toggle 'collapsed-entry' class (CSS animates the expand/collapse)
                entryContent.classList.toggle('collapsed-entry');
            }
        };
        
        // Desktop: Listen for clicks
        header.addEventListener('click', toggleEntry);
        
        // Mobile: Track touch start position
        header.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true }); // passive = doesn't prevent scrolling
        
        // Mobile: Track touch end and decide if tap or scroll
        header.addEventListener('touchend', function(e) {
            touchEndY = e.changedTouches[0].clientY;
            
            // Calculate how far the finger moved
            const touchDistance = Math.abs(touchEndY - touchStartY);
            
            // Only trigger if movement was less than threshold (was a tap)
            if (touchDistance < scrollThreshold) {
                e.stopPropagation(); // Don't trigger parent elements
                e.preventDefault(); // Prevent click event from also firing
                
                // Toggle the entry
                this.classList.toggle('active');
                const entryContent = this.nextElementSibling;
                if (entryContent && entryContent.classList.contains('entry-content')) {
                    entryContent.classList.toggle('collapsed-entry');
                }
            }
            // If movement >= threshold, do nothing (user was scrolling)
        });
    });
}

/* ========================================
   UPLOAD HANDLERS (COMMENTED OUT FOR FUTURE USE)
   ======================================== */

/*
async function handlePoemUpload(event) {
    event.preventDefault();
    
    const poetSelect = document.getElementById('poet-select').value;
    const customPoet = document.getElementById('custom-poet').value;
    const poemTitle = document.getElementById('poem-title').value;
    const audioFile = document.getElementById('audio-file').files[0];
    const textContent = document.getElementById('text-content').value;
    
    const poetName = poetSelect === 'others' ? customPoet : POETS[poetSelect];
    const today = new Date().toISOString().split('T')[0];
    const folderName = `${today}-${poetSelect === 'others' ? sanitizeFilename(customPoet) : poetSelect}-${sanitizeFilename(poemTitle)}`;
    
    const metadata = {
        date: today,
        poet: poetName,
        title: poemTitle
    };
    
    console.log('Poem upload data:', {
        poetKey: poetSelect,
        folderName: folderName,
        metadata: metadata,
        audioFile: audioFile.name,
        textContent: textContent
    });
    
    alert('Upload functionality will be implemented with backend service (Firebase, etc.)');
    
    document.getElementById('upload-modal').style.display = 'none';
    event.target.reset();
    document.getElementById('custom-poet-group').style.display = 'none';
}

async function handleVisualUpload(event) {
    event.preventDefault();
    
    const contentType = document.getElementById('content-type').value;
    const mediaFile = document.getElementById('media-file').files[0];
    const description = document.getElementById('description').value;
    const attribution = document.getElementById('attribution').value || 'You';
    
    const visualData = {
        type: contentType,
        filename: mediaFile.name,
        description: description,
        attribution: attribution
    };
    
    console.log('Visual upload data:', visualData);
    
    alert('Upload functionality will be implemented with backend service (Firebase, etc.)');
    
    document.getElementById('upload-modal').style.display = 'none';
    event.target.reset();
}

function sanitizeFilename(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}
*/
