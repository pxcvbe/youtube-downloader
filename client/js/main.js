// KONFIGURASI API ===
// Ganti dengan URL Railway kalo mau deploy!
const API_BASE_URL = "http://localhost:5000/v1/api";
// Contoh production: 'https://your-app.up.railway.app/v1/api'

// ===== ELEMENTS =====
const videoUrlInput = document.getElementById("videoUrl");
const fetchBtn = document.getElementById("fetchBtn");
const loading = document.getElementById("loading");
const loadingText = document.getElementById("loadingText");
const error = document.getElementById("error");
const errorMsg = document.getElementById("errorMsg");
const success = document.getElementById("success");
const successMsg = document.getElementById("successMsg");
const videoInfo = document.getElementById("videoInfo");
const thumbnail = document.getElementById("thumbnail");
const videoTitle = document.getElementById("videoTitle");
const videoDuration = document.getElementById("videoDuration");
const videoAuthor = document.getElementById("videoAuthor");
const videoViews = document.getElementById("videoViews");
const formatsList = document.getElementById("formatsList");

let currentVideoUrl = "";
let videoData = null;

// ===== EVENT LISTENERS =====
fetchBtn.addEventListener("click", fetchVideoInfo);
videoUrlInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchVideoInfo();
});

// Check API health on load
window.addEventListener("load", checkApiHealth);

// ===== API HEALTH CHECK =====
async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();

    if (data.status === "ok") {
      document.getElementById("apiStatus").className =
        "w-3 h-3 rounded-full bg-green-500";
      document.getElementById("apiStatusText").textContent = "Connected";
    } else {
      throw new Error("API not responding.");
    }
  } catch (error) {
    document.getElementById("apiStatus").className =
      "w-3 h-3 rounded-full bg-red-500";
    document.getElementById("apiStatusText").textContent = "Disconnected";
    console.error("API Health Check Failed:", err);
  }
}

// ===== FETCH VIDEO INFO =====
async function fetchVideoInfo() {
  const url = videoUrlInput.value.trim();

  if (!url) {
    showError("Masukkan URL YouTube terlebih dahulu!");
    return;
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    showError("URL YouTube tidak valid!");
    return;
  }

  currentVideoUrl = url;
  hideMessages();
  videoInfo.classList.add("hidden");
  loading.classList.remove("hidden");
  loadingText.textContent = "Mengambil informasi video...";
  fetchBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/video-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch video info.");
    }

    const data = await response.json();
    videoData = data;

    displayVideoInfo(data);
    await loadFormats(url);
  } catch (error) {
    showError("Gagal mengambil informasi video: " + err.message);
  } finally {
    loading.classList.add("hidden");
    fetchBtn.disabled = false;
  }
}

// ===== LOAD AVAILABLE FORMATS =====
async function loadFormats(url) {
  try {
    formatsList.innerHTML =
      '<p class="text-gray-600 text-sm">Loading formats...</p>';

    const response = await fetch(`${API_BASE_URL}/formats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url }),
    });

    if (!response.ok) {
      throw new Error("Failed to load formats.");
    }

    const data = await response.json();
    displayFormats(data.formats);
  } catch (error) {
    formatsList.innerHTML =
      '<p class="text-red-600 text-sm">Failed to load formats</p>';
    console.error("Load formats error:", error);
  }
}

// ===== DISPLAY FORMATS =====
function displayFormats(formats) {
  if (!formats || formats.length === 0) {
    formatsList.innerHTML =
      '<p class="text-gray-600 text-sm">No custom formats available</p>';
    return;
  }

  // Filter unique resolutions
  const uniqueFormats = formats
    .filter(
      (format, index, self) =>
        index === self.findIndex((f) => f.resolution === format.resolution),
    )
    .slice(0, 5); // Limit to 5 formats

  formatsList.innerHTML = uniqueFormats
    .map(
      (format) => `
                  <button
                      onclick="downloadCustomFormat('${format.format_id}')"
                      class="w-full bg-white hover:bg-gray-100 border-2 border-gray-300 hover:border-red-500 px-4 py-3 rounded-lg text-left transition"
                  >
                      <div class="flex justify-between items-center">
                          <span class="font-semibold">${format.resolution} - ${format.quality}</span>
                          <span class="text-sm text-gray-600">${format.ext.toUpperCase()}</span>
                      </div>
                  </button>
              `,
    )
    .join("");
}

// ===== DISPLAY VIDEO INFO =====
function displayVideoInfo(data) {
  thumbnail.src = data.thumbnail || "";
  videoTitle.textContent = data.title || "Unknown Title";
  videoAuthor.textContent = data.uploader || "Unknown";
  videoDuration.textContent = formatDuration(data.duration);
  videoViews.textContent = formatNumber(data.view_count);

  videoInfo.classList.remove("hidden");
}

// ===== DOWNLOAD FUNCTION =====
async function downloadQuick(format) {
  if (!currentVideoUrl) {
    showError("Please fetch video info first!");
    return;
  }

  hideMessages();
  loading.classList.remove("hidden");
  loadingText.textContent = "Preparing download...";

  try {
    const response = await fetch(`${API_BASE_URL}/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: currentVideoUrl,
        format_id: format,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Download failed");
    }

    // Download file
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = videoData.title + ".mp4";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showSuccess("Download started! Check your downloads folder.");
  } catch (error) {
    showError("Download failed: " + error.message);
  } finally {
    loading.classList.add("hidden");
  }
}

async function downloadAudio() {
  if (!currentVideoUrl) {
    showError("Please fetch video info first!");
    return;
  }

  hideMessages();
  loading.classList.remove("hidden");
  loadingText.textContent = "Preparing audio download...";

  try {
    const response = await fetch(`${API_BASE_URL}/download-audio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: currentVideoUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Download failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = videoData.title + ".mp3";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showSuccess("Audio download started! Check your downloads folder.");
  } catch (error) {
    showError("Audio download failed: " + error.message);
  } finally {
    loading.classList.add("hidden");
  }
}

async function downloadCustomFormat(formatId) {
  await downloadQuick(formatId);
}

// ===== UTILITY FUNCTIONS =====
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
    /youtube\.com\/v\/([^&\s]+)/,
  ];

  for (let pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function formatDuration(seconds) {
  if (!seconds) return "Unknown";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function formatNumber(num) {
  if (!num) return "0";
  return num.toLocaleString();
}

function showError(message) {
  errorMsg.textContent = message;
  error.classList.remove("hidden");
  success.classList.add("hidden");
}

function showSuccess(message) {
  successMsg.textContent = message;
  success.classList.remove("hidden");
  error.classList.add("hidden");
}

function hideMessages() {
  error.classList.add("hidden");
  success.classList.add("hidden");
}
