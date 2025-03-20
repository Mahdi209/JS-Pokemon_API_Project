// Get Pokemon name from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const pokemonName = urlParams.get('name');

// DOM Elements
const elements = {
  pokemonTitle: document.getElementById('pokemon-title'),
  pokemonTitleDe: document.getElementById('pokemon-title-de'),
  pokemonImg: document.getElementById('pokemon-img'),
  pokemonImg2: document.getElementById('pokemon-img2'),
  pokemonImg3: document.getElementById('pokemon-img3'),
  pokemonTypes: document.getElementById('pokemon-types'),
  pokemonAbilities: document.getElementById('pokemon-abilities'),
  statsSection: document.getElementById('stats-section'),
  loadingSpinner: document.querySelector('.loading-spinner'),
  errorMessage: document.querySelector('.error-message')
};

// Colors for different Pokemon types
const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC'
};

// Format Pokemon stats
function formatStatName(stat) {
  return stat.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Create stat bar
function createStatBar(value, maxValue) {
  const percentage = (value / maxValue) * 100;
  return `
    <div class="stat-bar-container">
      <div class="stat-bar" style="width: ${percentage}%"></div>
      <span class="stat-value">${value}</span>
    </div>
  `;
}

// Show loading state
function showLoading() {
  if (elements.loadingSpinner) {
    elements.loadingSpinner.style.display = 'flex';
  }
  if (elements.errorMessage) {
    elements.errorMessage.style.display = 'none';
  }
}

// Show error state
function showError(message) {
  if (elements.loadingSpinner) {
    elements.loadingSpinner.style.display = 'none';
  }
  if (elements.errorMessage) {
    elements.errorMessage.style.display = 'flex';
    elements.errorMessage.querySelector('span').textContent = message;
  }
}

// Fetch Pokemon data
async function fetchPokemonData() {
  try {
    showLoading();

    if (!pokemonName) {
      throw new Error('No Pokemon name provided');
    }

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
    if (!response.ok) {
      throw new Error('Pokemon not found');
    }
    const data = await response.json();

    // Update Pokemon title
    if (elements.pokemonTitle) {
      elements.pokemonTitle.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    }
    if (elements.pokemonTitleDe) {
      elements.pokemonTitleDe.textContent = `#${String(data.id).padStart(3, '0')}`;
    }

    // Update Pokemon images
    if (elements.pokemonImg) {
      elements.pokemonImg.src = data.sprites.other['official-artwork'].front_default;
    }
    if (elements.pokemonImg2) {
      elements.pokemonImg2.src = data.sprites.front_default;
    }
    if (elements.pokemonImg3) {
      elements.pokemonImg3.src = data.sprites.back_default;
    }

    // Update Pokemon types
    if (elements.pokemonTypes) {
      elements.pokemonTypes.innerHTML = data.types
        .map(type => `
          <span class="type-badge" style="background-color: ${typeColors[type.type.name]}">
            ${type.type.name}
          </span>
        `)
        .join('');
    }

    // Update Pokemon abilities
    if (elements.pokemonAbilities) {
      elements.pokemonAbilities.innerHTML = data.abilities
        .map(ability => `
          <span class="ability-badge">
            ${ability.ability.name}
          </span>
        `)
        .join('');
    }

    // Update Pokemon stats
    if (elements.statsSection) {
      elements.statsSection.innerHTML = `
        <div class="stat-card">
          <i class="fas fa-heart"></i>
          <div class="stat-info">
            <p>HP</p>
            ${createStatBar(data.stats[0].base_stat, 255)}
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-fist-raised"></i>
          <div class="stat-info">
            <p>Attack</p>
            ${createStatBar(data.stats[1].base_stat, 255)}
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-shield-alt"></i>
          <div class="stat-info">
            <p>Defense</p>
            ${createStatBar(data.stats[2].base_stat, 255)}
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-bolt"></i>
          <div class="stat-info">
            <p>Speed</p>
            ${createStatBar(data.stats[5].base_stat, 255)}
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-star"></i>
          <div class="stat-info">
            <p>Special Attack</p>
            ${createStatBar(data.stats[3].base_stat, 255)}
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-shield-virus"></i>
          <div class="stat-info">
            <p>Special Defense</p>
            ${createStatBar(data.stats[4].base_stat, 255)}
          </div>
        </div>
      `;
    }

    // Add hover effects to images
    const images = [elements.pokemonImg, elements.pokemonImg2, elements.pokemonImg3].filter(Boolean);
    images.forEach(img => {
      if (img) {
        img.addEventListener('mouseover', () => {
          img.style.transform = 'scale(1.1)';
          img.style.transition = 'transform 0.3s ease';
        });
        img.addEventListener('mouseout', () => {
          img.style.transform = 'scale(1)';
        });
      }
    });

    // Hide loading spinner
    if (elements.loadingSpinner) {
      elements.loadingSpinner.style.display = 'none';
    }

  } catch (error) {
    showError(error.message);
    console.error('Error fetching Pokemon data:', error);
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  fetchPokemonData();
});

