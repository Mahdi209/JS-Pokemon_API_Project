const pokemonContainer = document.getElementById("container");
const pokemonTitle = document.getElementById("pokemon-title");
const pokemonImg = document.getElementById("pokemon-img");
const pokemonTypesContainer = document.getElementById("pokemon-types");
const pokemonAbilitiesContainer = document.getElementById("pokemon-abilities");
const pokemonHeight = document.getElementById("pokemon-height");
const pokemonWeight = document.getElementById("pokemon-weight");

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

async function displayPokemonDetails() {
  const searchParams = new URLSearchParams(window.location.search);
  const name = searchParams.get("name");

  const data = await getPokemonDetails(name);

  if (!data) {
    pokemonContainer.textContent = "Error fetching pokemon details";
    return;
  }

  pokemonTitle.textContent = data.name;

  pokemonImg.src = data.sprites.front_default;

  data.types.forEach((type, index) => {
    if (index == 0) {
      pokemonTypesContainer.textContent += type.type.name;
    } else {
      pokemonTypesContainer.textContent += " - " + type.type.name;
    }
  });

  data.abilities.forEach((ability, index) => {
    if (index == 0) {
      pokemonAbilitiesContainer.textContent += ability.ability.name;
    } else {
      pokemonAbilitiesContainer.textContent += " - " + ability.ability.name;
    }
  });

  pokemonHeight.textContent += " " + data.height;

  pokemonWeight.textContent += " " + data.weight;
}

displayPokemonDetails();
