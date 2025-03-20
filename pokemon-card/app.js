// DOM Elements
const elements = {
  pokemonGrid: document.getElementById("pokemon-grid"),
  clickSound: document.getElementById("clickSound"),
  searchInput: document.getElementById("searchInput"),
  loadMoreBtn: document.getElementById("loadMore"),
  filterBtns: document.querySelectorAll(".filter-btn"),
  backToTop: document.getElementById("backToTop")
};

// State
let currentPage = 1;
let isLoading = false;
let hasMore = true;
let currentFilter = "all";
const pokemonsPerPage = 20;
let allPokemons = [];

// Utility Functions
function createLoadingSpinner() {
  const spinner = document.createElement("div");
  spinner.className = "loading-spinner";
  spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  return spinner;
}

function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  return errorDiv;
}

// Animation Functions
function animateNumber(element, start, end, duration = 2000) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    element.textContent = current;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function animateCards() {
  const cards = document.querySelectorAll('.cards');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// API Functions
async function getPokemonDetails(name) {
  if (!name) return null;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching Pokemon details:", error);
    return null;
  }
}

async function getPokemons(offset = 0, limit = pokemonsPerPage) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return {
      results: data.results,
      hasMore: data.next !== null
    };
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    return null;
  }
}

// UI Functions
function createPokemonCard(pokemon, data) {
  const card = document.createElement("div");
  card.className = "cards";
  
  const image = document.createElement("img");
  image.src = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
  image.alt = `${pokemon.name} sprite`;
  image.loading = "lazy";
  
  const textContainer = document.createElement("div");
  textContainer.id = "text-card";
  
  const name = document.createElement("h2");
  name.id = "name";
  name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  
  const types = document.createElement("p");
  types.id = "description";
  types.textContent = `Types: ${data.types.map(type => 
    type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
  ).join(", ")}`;
  
  const property = document.createElement("div");
  property.className = "proprty";
  
  const height = document.createElement("div");
  height.className = "line";
  height.id = "speed";
  height.innerHTML = `<i class="fas fa-ruler-vertical"></i> ${(data.height/10).toFixed(1)}m`;
  
  const weight = document.createElement("div");
  weight.className = "line";
  weight.id = "power";
  weight.innerHTML = `<i class="fas fa-weight-hanging"></i> ${(data.weight/10).toFixed(1)}kg`;
  
  property.appendChild(height);
  property.appendChild(weight);
  
  textContainer.appendChild(name);
  textContainer.appendChild(types);
  
  card.appendChild(image);
  card.appendChild(textContainer);
  card.appendChild(property);
  
  card.addEventListener("click", () => {
    if (elements.clickSound) elements.clickSound.play();
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      window.location.href = `../deatils/pokemon-details.html?name=${pokemon.name}`;
    }, 200);
  });
  
  return card;
}

async function displayPokemons(offset = 0) {
  if (isLoading) return;
  
  isLoading = true;
  if (offset === 0) {
    elements.pokemonGrid.innerHTML = "";
    elements.pokemonGrid.appendChild(createLoadingSpinner());
  }
  
  const result = await getPokemons(offset);
  
  if (!result) {
    elements.pokemonGrid.innerHTML = "";
    elements.pokemonGrid.appendChild(showError("Failed to load Pokemon. Please try again later."));
    isLoading = false;
    return;
  }
  
  if (offset === 0) {
    elements.pokemonGrid.innerHTML = "";
  }
  
  for (const pokemon of result.results) {
    const data = await getPokemonDetails(pokemon.name);
    if (data) {
      if (currentFilter === "all" || data.types.some(type => type.type.name === currentFilter)) {
        const card = createPokemonCard(pokemon, data);
        elements.pokemonGrid.appendChild(card);
      }
    }
  }
  
  animateCards();
  hasMore = result.hasMore;
  if (elements.loadMoreBtn) {
    elements.loadMoreBtn.style.display = hasMore ? "flex" : "none";
  }
  isLoading = false;
}

// Filter Functions
function handleFilterClick(e) {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  
  elements.filterBtns.forEach(button => button.classList.remove('active'));
  btn.classList.add('active');
  
  currentFilter = btn.dataset.type;
  currentPage = 1;
  displayPokemons(0);
}

// Search Functionality
let searchTimeout;
if (elements.searchInput) {
  elements.searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    const searchTerm = e.target.value.toLowerCase();
    
    searchTimeout = setTimeout(async () => {
      if (searchTerm.length < 2) {
        currentPage = 1;
        await displayPokemons(0);
        return;
      }
      
      elements.pokemonGrid.innerHTML = "";
      elements.pokemonGrid.appendChild(createLoadingSpinner());
      
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
        if (!response.ok) {
          elements.pokemonGrid.innerHTML = "";
          elements.pokemonGrid.appendChild(showError("No Pokemon found with that name."));
          return;
        }
        
        const data = await response.json();
        const pokemon = { name: data.name };
        const card = createPokemonCard(pokemon, data);
        
        elements.pokemonGrid.innerHTML = "";
        elements.pokemonGrid.appendChild(card);
        if (elements.loadMoreBtn) {
          elements.loadMoreBtn.style.display = "none";
        }
      } catch (error) {
        elements.pokemonGrid.innerHTML = "";
        elements.pokemonGrid.appendChild(showError("Error searching for Pokemon. Please try again."));
      }
    }, 500);
  });
}

// Load More Functionality
if (elements.loadMoreBtn) {
  elements.loadMoreBtn.addEventListener("click", async () => {
    if (!hasMore || isLoading) return;
    
    currentPage++;
    const offset = (currentPage - 1) * pokemonsPerPage;
    await displayPokemons(offset);
  });
}

// Back to Top Functionality
window.addEventListener('scroll', () => {
  if (elements.backToTop) {
    if (window.scrollY > 500) {
      elements.backToTop.classList.add('visible');
    } else {
      elements.backToTop.classList.remove('visible');
    }
  }
});

if (elements.backToTop) {
  elements.backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Filter Event Listeners
elements.filterBtns.forEach(btn => {
  btn.addEventListener('click', handleFilterClick);
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  displayPokemons(0);
  
  // Animate stats numbers
  const statCounts = document.querySelectorAll('.stat-count');
  statCounts.forEach(stat => {
    const endValue = parseInt(stat.textContent);
    stat.textContent = '0';
    animateNumber(stat, 0, endValue);
  });
  
  // Intersection Observer for footer sections
  const footerSections = document.querySelectorAll('.footer-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  footerSections.forEach(section => {
    observer.observe(section);
  });
});