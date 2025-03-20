const elements = {
  logo: document.getElementById("logo"),
  moreBtn: document.getElementById("more"),
  pokemonGrid: document.getElementById("pokemon-grid"),
  exploreBtn: document.getElementById("explore"),
  newsletterForm: document.querySelector(".newsletter-form")
};

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

function createLoadingSpinner() {
  const spinner = document.createElement("div");
  spinner.className = "loading-spinner";
  spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  return spinner;
}

function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
  `;
  return errorDiv;
}

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

async function getPokemons(limit = 20) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching Pokemon list:", error);
    return null;
  }
}

function createPokemonCard(pokemon, data) {
  const card = document.createElement("div");
  card.className = "cards";
  
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  
  const image = document.createElement("img");
  image.src = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
  image.alt = `${pokemon.name} sprite`;
  image.loading = "lazy";
  
  const textContainer = document.createElement("div");
  textContainer.id = "text-card";
  
  const name = document.createElement("h2");
  name.id = "name";
  name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  
  const description = document.createElement("p");
  description.id = "description";
  description.textContent = `Types: ${data.types.map(type => 
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
  textContainer.appendChild(description);
  
  card.appendChild(image);
  card.appendChild(textContainer);
  card.appendChild(property);
  
  card.addEventListener("click", () => {
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      window.location.href = `../deatils/pokemon-details.html?name=${pokemon.name}`;
    }, 200);
  });
  
  setTimeout(() => {
    card.style.transition = "all 0.5s ease";
    card.style.opacity = "1";
    card.style.transform = "translateY(0)";
  }, 100);
  
  return card;
}

async function displayPokemons() {
  if (!elements.pokemonGrid) return;
  
  elements.pokemonGrid.innerHTML = "";
  elements.pokemonGrid.appendChild(createLoadingSpinner());
  
  const pokemons = await getPokemons(8);
  
  if (!pokemons) {
    elements.pokemonGrid.innerHTML = "";
    elements.pokemonGrid.appendChild(
      showError("Failed to load Pokemon. Please try again later.")
    );
    return;
  }
  
  elements.pokemonGrid.innerHTML = "";
  
  for (const [index, pokemon] of pokemons.entries()) {
    const data = await getPokemonDetails(pokemon.name);
    if (data) {
      const card = createPokemonCard(pokemon, data);
      elements.pokemonGrid.appendChild(card);
      
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100);
    }
  }
}

if (elements.logo) {
  elements.logo.addEventListener("click", () => {
    window.location.href = `../home-page/index.html`;
  });
}

if (elements.moreBtn) {
  elements.moreBtn.addEventListener("click", () => {
    elements.moreBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      window.location.href = `../pokemon-card/pokemon-Card.html`;
    }, 200);
  });
}

if (elements.exploreBtn) {
  elements.exploreBtn.addEventListener("click", () => {
    scrollToSection("content");
  });
}

if (elements.newsletterForm) {
  elements.newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = elements.newsletterForm.querySelector("input").value;
    alert(`Thank you for subscribing with: ${email}`);
    elements.newsletterForm.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayPokemons();
  
  // Intersection Observer for feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  const sectionTitles = document.querySelectorAll('.section-title');
  const footerSections = document.querySelectorAll('.footer-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  // Observe feature cards
  featureCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.5s ease";
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
  });
  
  // Observe section titles
  sectionTitles.forEach(title => {
    title.style.opacity = "0";
    title.style.transform = "translateY(20px)";
    title.style.transition = "all 0.8s ease";
    observer.observe(title);
  });
  
  // Observe footer sections
  footerSections.forEach((section, index) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "all 0.8s ease";
    section.style.transitionDelay = `${index * 0.2}s`;
    observer.observe(section);
  });
  
  // Add hover animation for cards
  const cards = document.querySelectorAll('.cards');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = "translateY(-10px) rotateX(5deg)";
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = "translateY(0) rotateX(0)";
    });
  });
});

