const home = document.getElementById("logo");
const pokemonsContainer = document.querySelector("#contenr");
var clickSound = document.getElementById("clickSound");

async function getPokemonDetails(name) {
  if (!name) {
    return null;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
}
async function getPokemons() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data.results;
  } catch (error) {
    return null;
  }
}

async function displayPokemons() {
  const pokemons = await getPokemons();

  if (!pokemons) {
    pokemonsContainer.textContent = "Error fetching pokemons";
    return;
  }

  pokemons.forEach(async (pokemon) => {
    const pokemonCard = document.createElement("div");
    const textContainer = document.createElement("div");
    const pokemonImg = document.createElement("img");
    const pokemonStatus = document.createElement("p");
    const pokemonProprty = document.createElement("div");
    const pokemonHeight = document.createElement("p");
    const pokemonsWeight = document.createElement("p");
    const pokemonName = document.createElement("h2");
    textContainer.setAttribute("id", "text-card");
    pokemonName.setAttribute("id", "name");
    pokemonStatus.setAttribute("id", "description");
    pokemonCard.classList.add("cards");
    pokemonHeight.setAttribute("id", "speed");
    pokemonsWeight.setAttribute("id", "power");
    pokemonHeight.setAttribute("class", "line");
    pokemonsWeight.setAttribute("class", "line");
    pokemonProprty.classList.add("proprty");
    pokemonName.textContent = pokemon.name;
    const data = await getPokemonDetails(pokemon.name);
    pokemonImg.src = data.sprites.front_default;
    pokemonStatus.textContent = "abilities:  ";

    data.abilities.forEach((ability, index) => {
      if (index == 0) {
        pokemonStatus.textContent += ability.ability.name;
      } else {
        pokemonStatus.textContent += " - " + ability.ability.name;
      }
    });
    pokemonHeight.textContent += "H: " + data.height;

    pokemonsWeight.textContent += "W: " + data.weight;
    pokemonProprty.appendChild(pokemonHeight);
    pokemonProprty.appendChild(pokemonsWeight);

    textContainer.appendChild(pokemonName);
    pokemonCard.appendChild(pokemonImg);
    pokemonCard.appendChild(textContainer);
    pokemonCard.appendChild(pokemonStatus);
    pokemonCard.appendChild(pokemonProprty);

    pokemonsContainer.appendChild(pokemonCard);
    pokemonsContainer.addEventListener("click", () => {
      clickSound.play();
    });
    pokemonCard.addEventListener("click", () => {
      window.location.href = `../deatils/pokemon-details.html?name=${pokemon.name}`;
    });
  });
}

displayPokemons();
home.addEventListener("click", (event) => {
  window.location.href = `../home-page/index.html`;
});
