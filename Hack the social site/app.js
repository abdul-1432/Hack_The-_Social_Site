// Application Data
const platformsData = [
  {
    name: "LinkedIn",
    icon: "💼",
    characterLimit: 3000,
    color: "#0077B5",
    bestTime: "8-10 AM, 12 PM, 5-6 PM"
  },
  {
    name: "Instagram", 
    icon: "📸",
    characterLimit: 2200,
    color: "#E4405F",
    bestTime: "11 AM-1 PM, 7-9 PM"
  },
  {
    name: "Facebook",
    icon: "👥", 
    characterLimit: 63206,
    color: "#1877F2",
    bestTime: "1-3 PM, 3-4 PM"
  },
  {
    name: "Twitter",
    icon: "🐦",
    characterLimit: 280,
    color: "#1DA1F2", 
    bestTime: "8-10 AM, 7-9 PM"
  },
  {
    name: "TikTok",
    icon: "🎵",
    characterLimit: 2200,
    color: "#FF0050",
    bestTime: "6-10 AM, 7-9 PM"
  }
];

const hashtagSuggestions = [
  "#socialmedia", "#digitalmarketing", "#content", "#entrepreneur", 
  "#business", "#marketing", "#branding", "#success", "#motivation",
  "#innovation", "#technology", "#startup", "#growth", "#networking"
];

const emojiData = [
  {"name": "Smileys", "emojis": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇"]},
  {"name": "Business", "emojis": ["💼", "📊", "📈", "💡", "🎯", "🚀", "💰", "📱", "💻", "📝"]},
  {"name": "Social", "emojis": ["👥", "🤝", "💬", "📢", "📣", "🎉", "🎊", "👍", "❤️", "🔥"]}
];

// Application State
let selectedPlatforms = [];
let savedDrafts = [];

// Global functions for onclick handlers
window.loadDraft = function(draftId) {
  const draft = savedDrafts.find(d => d.id === draftId);
  if (!draft) return;
  
  const textarea = document.getElementById('postContent');
  textarea.value = draft.content;
  
  // Clear current platform selections
  document.querySelectorAll('.platform-checkbox').forEach(cb => {
    cb.checked = false;
    cb.closest('.platform-item').classList.remove('selected');
  });
  selectedPlatforms = [];
  
  // Select draft platforms
  draft.platforms.forEach(platform => {
    const checkbox = document.getElementById(`platform-${platform.name}`);
    if (checkbox) {
      checkbox.checked = true;
      checkbox.closest('.platform-item').classList.add('selected');
      selectedPlatforms.push(platform);
    }
  });
  
  updateUI();
};

window.deleteDraft = function(draftId) {
  savedDrafts = savedDrafts.filter(d => d.id !== draftId);
  updateDraftsList();
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializePlatforms();
  initializeHashtagSuggestions();
  initializeEmojiPicker();
  setupEventListeners();
  updateUI();
});

// Platform Management
function initializePlatforms() {
  const platformList = document.getElementById('platformList');
  
  platformsData.forEach(platform => {
    const platformItem = createPlatformItem(platform);
    platformList.appendChild(platformItem);
  });
}

function createPlatformItem(platform) {
  const div = document.createElement('div');
  div.className = 'platform-item';
  div.innerHTML = `
    <input type="checkbox" class="platform-checkbox" id="platform-${platform.name}" data-platform="${platform.name}">
    <div class="platform-info">
      <div class="platform-name">${platform.icon} ${platform.name}</div>
      <div class="platform-limit">${platform.characterLimit.toLocaleString()} character limit</div>
    </div>
  `;
  
  const checkbox = div.querySelector('.platform-checkbox');
  checkbox.addEventListener('change', function() {
    handlePlatformSelection(platform, this.checked);
    div.classList.toggle('selected', this.checked);
  });
  
  div.addEventListener('click', function(e) {
    if (e.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    }
  });
  
  return div;
}

function handlePlatformSelection(platform, isSelected) {
  if (isSelected) {
    selectedPlatforms.push(platform);
  } else {
    selectedPlatforms = selectedPlatforms.filter(p => p.name !== platform.name);
  }
  updateUI();
}

// Content Management
function updateCharacterCount() {
  const textarea = document.getElementById('postContent');
  const content = textarea.value;
  const length = content.length;
  
  const characterCount = document.getElementById('characterCount');
  const charCurrentSpan = characterCount.querySelector('.char-current');
  if (charCurrentSpan) {
    charCurrentSpan.textContent = length;
  }
  
  // Update character count color based on limits
  characterCount.className = 'character-count';
  if (selectedPlatforms.length > 0) {
    const minLimit = Math.min(...selectedPlatforms.map(p => p.characterLimit));
    if (length > minLimit * 0.9) {
      characterCount.classList.add('warning');
    }
    if (length > minLimit) {
      characterCount.classList.add('error');
    }
  }
  
  updateCharacterLimits(content);
  updatePreview(content);
}

function updateCharacterLimits(content) {
  const characterLimits = document.getElementById('characterLimits');
  
  if (selectedPlatforms.length === 0) {
    characterLimits.innerHTML = '';
    return;
  }
  
  const length = content.length;
  characterLimits.innerHTML = selectedPlatforms.map(platform => {
    let className = 'char-limit-item';
    if (length > platform.characterLimit * 0.9) className += ' warning';
    if (length > platform.characterLimit) className += ' error';
    
    const remaining = platform.characterLimit - length;
    return `
      <div class="${className}">
        <span>${platform.icon} ${platform.name}</span>
        <span>${remaining < 0 ? 'Over by ' + Math.abs(remaining) : remaining + ' left'}</span>
      </div>
    `;
  }).join('');
}

function updateBestTimes() {
  const bestTimes = document.getElementById('bestTimes');
  
  if (selectedPlatforms.length === 0) {
    bestTimes.innerHTML = '<p class="text-secondary">Select platforms to see optimal posting times</p>';
    return;
  }
  
  bestTimes.innerHTML = selectedPlatforms.map(platform => `
    <div class="best-time-item">
      <span>${platform.icon}</span>
      <div>
        <div style="font-weight: 500;">${platform.name}</div>
        <div style="color: var(--color-text-secondary);">${platform.bestTime}</div>
      </div>
    </div>
  `).join('');
}

function updatePreview(content) {
  const previewPlatforms = document.getElementById('previewPlatforms');
  
  if (selectedPlatforms.length === 0) {
    previewPlatforms.innerHTML = '<p class="text-secondary">Select platforms to see preview</p>';
    return;
  }
  
  const displayContent = content || 'Your post content will appear here...';
  const isEmpty = !content;
  
  previewPlatforms.innerHTML = selectedPlatforms.map(platform => `
    <div class="platform-preview">
      <div class="platform-preview__header">
        <div class="platform-preview__icon">${platform.icon}</div>
        <div class="platform-preview__name">${platform.name}</div>
      </div>
      <div class="platform-preview__content ${isEmpty ? 'empty' : ''}">
        ${displayContent}
      </div>
    </div>
  `).join('');
}

// Hashtag Management
function initializeHashtagSuggestions() {
  const hashtagList = document.getElementById('hashtagList');
  
  hashtagList.innerHTML = hashtagSuggestions.map(hashtag => `
    <span class="hashtag-item" data-hashtag="${hashtag}">${hashtag}</span>
  `).join('');
  
  hashtagList.addEventListener('click', function(e) {
    if (e.target.classList.contains('hashtag-item')) {
      const hashtag = e.target.dataset.hashtag;
      insertTextAtCursor(hashtag + ' ');
      const hashtagSuggestionsCard = document.getElementById('hashtagSuggestions');
      hashtagSuggestionsCard.style.display = 'none';
    }
  });
}

function toggleHashtagSuggestions() {
  const hashtagSuggestionsCard = document.getElementById('hashtagSuggestions');
  const emojiPickerCard = document.getElementById('emojiPicker');
  
  const isVisible = hashtagSuggestionsCard.style.display !== 'none';
  hashtagSuggestionsCard.style.display = isVisible ? 'none' : 'block';
  emojiPickerCard.style.display = 'none';
}

// Emoji Management
function initializeEmojiPicker() {
  const emojiCategoriesContainer = document.getElementById('emojiCategories');
  
  emojiCategoriesContainer.innerHTML = emojiData.map(category => `
    <div class="emoji-category">
      <h4 class="emoji-category-title">${category.name}</h4>
      <div class="emoji-list">
        ${category.emojis.map(emoji => `
          <span class="emoji-item" data-emoji="${emoji}">${emoji}</span>
        `).join('')}
      </div>
    </div>
  `).join('');
  
  emojiCategoriesContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('emoji-item')) {
      const emoji = e.target.dataset.emoji;
      insertTextAtCursor(emoji);
      const emojiPickerCard = document.getElementById('emojiPicker');
      emojiPickerCard.style.display = 'none';
    }
  });
}

function toggleEmojiPicker() {
  const emojiPickerCard = document.getElementById('emojiPicker');
  const hashtagSuggestionsCard = document.getElementById('hashtagSuggestions');
  
  const isVisible = emojiPickerCard.style.display !== 'none';
  emojiPickerCard.style.display = isVisible ? 'none' : 'block';
  hashtagSuggestionsCard.style.display = 'none';
}

// Text Formatting
function insertTextAtCursor(text) {
  const textarea = document.getElementById('postContent');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const currentValue = textarea.value;
  
  textarea.value = currentValue.slice(0, start) + text + currentValue.slice(end);
  textarea.selectionStart = textarea.selectionEnd = start + text.length;
  textarea.focus();
  
  updateCharacterCount();
}

function formatText(format) {
  const textarea = document.getElementById('postContent');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.slice(start, end);
  
  if (!selectedText) {
    // If no text is selected, handle special cases
    if (format === 'hashtag') {
      toggleHashtagSuggestions();
      return;
    }
    
    let formatText = '';
    switch(format) {
      case 'bold':
        formatText = '**bold text**';
        break;
      case 'italic':
        formatText = '*italic text*';
        break;
    }
    insertTextAtCursor(formatText);
    return;
  }
  
  let formattedText = selectedText;
  switch(format) {
    case 'bold':
      formattedText = `**${selectedText}**`;
      break;
    case 'italic':
      formattedText = `*${selectedText}*`;
      break;
    case 'hashtag':
      formattedText = `#${selectedText}`;
      break;
  }
  
  textarea.value = textarea.value.slice(0, start) + formattedText + textarea.value.slice(end);
  textarea.selectionStart = start;
  textarea.selectionEnd = start + formattedText.length;
  textarea.focus();
  
  updateCharacterCount();
}

// Draft Management
function saveDraft() {
  const textarea = document.getElementById('postContent');
  const content = textarea.value;
  
  if (!content.trim()) {
    alert('Please write some content before saving a draft.');
    return;
  }
  
  const draft = {
    id: Date.now(),
    content: content,
    platforms: [...selectedPlatforms],
    timestamp: new Date().toLocaleString()
  };
  
  savedDrafts.unshift(draft);
  updateDraftsList();
  
  // Show success message
  const btn = document.getElementById('saveDraftBtn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '✅ Saved!';
  setTimeout(() => {
    btn.innerHTML = originalText;
  }, 2000);
}

function updateDraftsList() {
  const draftList = document.getElementById('draftList');
  
  if (savedDrafts.length === 0) {
    draftList.innerHTML = '<p class="text-secondary">No saved drafts yet</p>';
    return;
  }
  
  draftList.innerHTML = savedDrafts.map(draft => `
    <div class="draft-item">
      <div class="draft-content">${draft.content}</div>
      <div class="draft-actions">
        <button class="btn btn--outline" onclick="loadDraft(${draft.id})">Load</button>
        <button class="btn btn--outline" onclick="deleteDraft(${draft.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// Copy Functionality
async function copyToClipboard() {
  const textarea = document.getElementById('postContent');
  const content = textarea.value;
  
  if (!content.trim()) {
    alert('No content to copy.');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(content);
    
    const btn = document.getElementById('copyBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Copied!';
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 2000);
  } catch (err) {
    // Fallback for browsers that don't support clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = content;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    alert('Content copied to clipboard!');
  }
}

// Post Simulation
function simulatePost() {
  const textarea = document.getElementById('postContent');
  const content = textarea.value;
  
  if (!content.trim()) {
    alert('Please write some content before posting.');
    return;
  }
  
  if (selectedPlatforms.length === 0) {
    alert('Please select at least one platform to post to.');
    return;
  }
  
  showSuccessModal();
}

function showSuccessModal() {
  const successModal = document.getElementById('successModal');
  const publishedPlatformsContainer = document.getElementById('publishedPlatforms');
  const postingProgress = document.getElementById('postingProgress');
  
  // Populate published platforms
  publishedPlatformsContainer.innerHTML = selectedPlatforms.map(platform => `
    <div class="published-platform">
      <span>${platform.icon}</span>
      <span>${platform.name}</span>
    </div>
  `).join('');
  
  // Show posting progress animation
  postingProgress.innerHTML = selectedPlatforms.map((platform, index) => `
    <div class="progress-item" style="animation-delay: ${index * 0.5}s;">
      <div class="progress-icon">${platform.icon}</div>
      <div class="progress-text">Posting to ${platform.name}...</div>
      <div class="progress-status success">✅ Success</div>
    </div>
  `).join('');
  
  successModal.classList.remove('hidden');
}

function closeSuccessModal() {
  const successModal = document.getElementById('successModal');
  successModal.classList.add('hidden');
  clearPost();
}

function clearPost() {
  const textarea = document.getElementById('postContent');
  textarea.value = '';
  
  // Clear platform selections
  document.querySelectorAll('.platform-checkbox').forEach(cb => {
    cb.checked = false;
    cb.closest('.platform-item').classList.remove('selected');
  });
  selectedPlatforms = [];
  
  // Hide pickers
  const hashtagSuggestionsCard = document.getElementById('hashtagSuggestions');
  const emojiPickerCard = document.getElementById('emojiPicker');
  hashtagSuggestionsCard.style.display = 'none';
  emojiPickerCard.style.display = 'none';
  
  updateUI();
}

// UI Update
function updateUI() {
  updateCharacterCount();
  updateBestTimes();
}

// Event Listeners
function setupEventListeners() {
  const postContentTextarea = document.getElementById('postContent');
  
  // Post content textarea
  postContentTextarea.addEventListener('input', updateCharacterCount);
  
  // Toolbar buttons
  document.getElementById('boldBtn').addEventListener('click', () => formatText('bold'));
  document.getElementById('italicBtn').addEventListener('click', () => formatText('italic'));
  document.getElementById('hashtagBtn').addEventListener('click', () => formatText('hashtag'));
  document.getElementById('emojiBtn').addEventListener('click', toggleEmojiPicker);
  
  // Action buttons
  document.getElementById('saveDraftBtn').addEventListener('click', saveDraft);
  document.getElementById('clearBtn').addEventListener('click', clearPost);
  document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
  document.getElementById('postBtn').addEventListener('click', simulatePost);
  
  // Modal
  document.getElementById('closeModalBtn').addEventListener('click', closeSuccessModal);
  
  const successModal = document.getElementById('successModal');
  
  // Click outside modal to close
  successModal.addEventListener('click', function(e) {
    if (e.target === successModal || e.target.classList.contains('modal__backdrop')) {
      closeSuccessModal();
    }
  });
  
  // Hide pickers when clicking outside
  document.addEventListener('click', function(e) {
    const hashtagSuggestionsCard = document.getElementById('hashtagSuggestions');
    const emojiPickerCard = document.getElementById('emojiPicker');
    
    if (!e.target.closest('#hashtagSuggestions') && !e.target.closest('#hashtagBtn')) {
      hashtagSuggestionsCard.style.display = 'none';
    }
    if (!e.target.closest('#emojiPicker') && !e.target.closest('#emojiBtn')) {
      emojiPickerCard.style.display = 'none';
    }
  });
}