const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const inpWord = document.getElementById("inp-word");
const searchBtn = document.getElementById("search-btn");
const sound = new Audio();

// Tambahkan referensi ke preloader
const preloader = document.getElementById("preloader");

searchBtn.addEventListener("click", () => {
  let word = inpWord.value.trim().toLowerCase();
  if (word) {
    // Menampilkan preloader sebelum pencarian
    preloader.style.display = "flex";
    result.innerHTML = ""; // Clear previous results or errors
    getMeaning(word);
  } else {
    showErrorMessage("Please enter a word to search!");
  }
});

async function getMeaning(word) {
  try {
    const response = await fetch(url + word);
    if (response.ok) {
      const data = await response.json();
      displayResult(data);
    } else {
      result.innerHTML = `<div class="error"><h2>Word "${inpWord.value}" Not Found!</h2></div>`;
    }
  } catch (error) {
    result.innerHTML = `<div class="error"><h2>There was an error. Please try again.</h2></div>`;
  } finally {
    // Sembunyikan preloader setelah proses selesai
    preloader.style.display = "none";
  }
}

function displayResult(data) {
  const example =
    data[0].meanings[0]?.definitions[0]?.example ||
    "Word Example Not Available";

  let phonetic = data[0].phonetic || "Phonetic not available";
  let audioUrl = "";

  try {
    audioUrl = data[0].phonetics[0]?.audio || "";
    if (!audioUrl) {
      throw new Error("Audio not available");
    }
  } catch (error) {
    audioUrl = "";
  }

  const meanings = data[0].meanings
    .map((meaning) => {
      const definitions = meaning.definitions
        .map((def, index) => `<li>${index + 1}. ${def.definition}</li>`)
        .join("");
      return ` 
        <div class="alternative-meaning">
          <p>${meaning.partOfSpeech}</p>
          <ul>${definitions}</ul>
        </div>
      `;
    })
    .join("");

  result.innerHTML = `
    <div class="word">
      <h2>${inpWord.value}</h2>
      <button class="audio-btn" id="audio-btn" onclick="playSound()" ${
        audioUrl ? "" : "disabled"
      } ${audioUrl ? "" : 'class="disabled"'}>
        ${
          audioUrl
            ? '<i class="fas fa-volume-up"></i>'
            : '<i class="fas fa-volume-xmark"></i>'
        }
      </button>
    </div>
    <div class="details">
      <p>${data[0].meanings[0].partOfSpeech}</p>
      <p>${phonetic}</p>
    </div>
    <p class="word-meaning">
        ${data[0].meanings[0].definitions[0].definition}
    </p>
    <p class="word-example">
        ${example}
    </p>
    <h3 style="margin-top: 20px;">Alternative Meanings:</h3>
    ${meanings}`;

  if (audioUrl) {
    sound.setAttribute("src", audioUrl);
  } else {
    result.innerHTML += `<p class="audio-unavailable">Audio pronunciation not available.</p>`;
  }
}

function playSound() {
  sound.play();
}

function showErrorMessage(message) {
  result.innerHTML = `<div class="error"><h2>${message}</h2></div>`;
}
