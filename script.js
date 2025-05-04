const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipePopup = document.querySelector('.recipe-details'); // Assuming the popup is the parent container
const recipeCloseBtn = document.querySelector('.recipe-close-btn'); // Close button in the popup

// Function to fetch recipes from API
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = "<h2>Fetching Recipes....</h2>"; // Feedback when fetching
  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    recipeContainer.innerHTML = ''; // Clear previous results

    if (response.meals) {
      response.meals.forEach(meal => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML = `
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
          <p><span>${meal.strArea}</span> Dish</p>
          <p>Belongs to <span>${meal.strCategory}</span> Category</p>
        `;
        const button = document.createElement('button');
        button.textContent = "View Recipe";
        recipeDiv.appendChild(button);

        // Add event listener to open recipe popup
        button.addEventListener('click', () => {
          openRecipePopup(meal); // Opens the popup with recipe details
        });

        recipeContainer.appendChild(recipeDiv);
      });
    } else {
      recipeContainer.innerHTML = '<p>No recipes found.</p>';
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    recipeContainer.innerHTML = '<p>Something went wrong. Please try again.</p>';
  }
};

// Function to fetch ingredients and return them as an HTML list
const fetchIngredients = (meal) => {
  let ingredientsList = ""; // Initialize ingredients list
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

// Function to open the recipe details popup and show the ingredients
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul>${fetchIngredients(meal)}</ul>
  `;
    
  recipePopup.style.display = "block"; // Show the popup
};

// Function to close the recipe details popup
const closeRecipePopup = () => {
  recipePopup.style.display = "none"; // Hide the popup
};

// Event listener to handle search button click
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (searchInput) {
    fetchRecipes(searchInput);
  }
});

// Event listener to close the recipe popup when the close button is clicked
recipeCloseBtn.addEventListener('click', closeRecipePopup);

// Optionally, hide the recipe popup when clicking outside of it (if you want that feature)
window.addEventListener('click', (e) => {
  if (e.target === recipePopup) {
    closeRecipePopup();
  }
});
