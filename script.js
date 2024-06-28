let displayerCards = document.getElementById("display");
let button = document.getElementById("button");

async function fetchRandom() {
  try {
    // displayerCards.innerHTML="";

    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
  //  console.log(response);
    const radomRecipe = await response.json();
//console.log(radomRecipe);
    let recipe = radomRecipe.meals[0];

    displayRecipeCards(recipe);
  } catch (error) {
    console.log("error fetch data");
    displayerCards.innerHTML = `<h1 class="not-found">404 Error :(</h1>
    <hr class="hr-row" style="border-top: 2px solid white;">`;
  }
}

//random();
function random() {
  displayerCards.innerHTML="";
  for (let i = 0; i < 12; i++) {
    fetchRandom();
  }
}
const filterForm = document.getElementById("filter-form");
const filterSelected = document.getElementById("filter-selector");
const dataForFilter = document.getElementById("data-to-filter");
dataForFilter.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    console.log("inside enter click");
    event.preventDefault();
  }
});

filterSelected.addEventListener("change", function () {
  let selectOption = this.value;

  if (filterForm.style.display === "none") {
    filterForm.style.display = "flex";
  }
  if (selectOption === "none") {
    filterForm.style.display = "none";
  }
  dataForFilter.placeholder = "Enter " + selectOption;
  if (selectOption == "none") {
    random();
  }
  return selectOption;
});
let filterButton = document.getElementById("filter-button");
filterButton.addEventListener("click", filterclicked);

async function filterclicked() {
  let data = dataForFilter.value;

  let filter = filterSelected.value;

  if (data.length > 0) {
    displayerCards.innerHTML =
      "<h1 style='color:white; text-align:center'>Fetching Response .... </h1>";
    try {
      if (filter == "cuizine") {
        const fetchByCuizine = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${data}`
        );
        const cuizine = await fetchByCuizine.json();
        // console.log("inside cuzz");
        destructure(cuizine);
        dataForFilter.value = "";
      } else if (filter == "ingredient") {
        let newData = data.toLowerCase();
        const fetchByIngredient = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${data}`
        );
        const ingredient = await fetchByIngredient.json();
        destructure(ingredient);
        dataForFilter.value = "";
      } else if(filter == "none") {
        dataForFilter.value = "";
        console.log("inside none");
        random();
      }
    } catch (error) {
      console.log("erro fetch data");
      dataForFilter.value = "";
      // displayerCards.innerHTML = `<h1 class="not-found">404 Error :(</h1>
      // <hr class="hr-row" style="border-top: 2px solid white;">`;
    }
  } else {
    displayerCards.innerHTML =
      "<h1 style='color:white; text-align:center'>Enter Valid Data</h1>";
  }
}
// displayerCards.innerHTML="";
//   let errorMessage=`<div>  NO DATA FOUND  </div>`;
//   displayerCards.innerHTML=errorMessage;
 function destructure(response) {
  let cuizine = response.meals;
  // console.log(cuizine);
  displayerCards.innerHTML = "";
  try {
    cuizine.forEach(async (element) => {
      let mealId = element.idMeal;
      // let ans=searchByID(mealId);
      let res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );
      let meal = await res.json();
      // console.log(meal.meals[0]);
      displayRecipeCards(meal.meals[0]);
    });
  } catch (error) {
    displayerCards.innerHTML = `<h1 class="not-found">Recipe Not Found :(</h1>
      <hr class="hr-row" style="border-top: 2px solid white;">`;
  }
}
//working on displaying full recipe when button clicked
const fullRecipe = document.getElementById("view-recipe");
let fullDisplay = document.getElementById("full-recipe-display");

async function fullRecipeDisplay(event) {
  let res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${event}`
  );
  let ans = await res.json();
  let fullAns = ans.meals[0];
  let imgPath = fullAns.strMealThumb;
  let ingredientList = "";
  for (let i = 0; i < 20; i++) {
    const val = fullAns[`strIngredient${i}`];
    if (val) {
      ingredientList += "<li>" + fullAns[`strIngredient${i}`];
      ingredientList += "  " + fullAns[`strMeasure${i}`] + "</li>";
    }
  }
  document.getElementById("full-recipe-display").style.display = "block";

  let fullRecipeCard = ` <div class="card full" style="width: 80% ; color:white" id="view-recipe">
  <div class="">
  <div class="card-body d-flex justify-content-between text-center"  data-bs-theme="dark">
  <h1 class="card-title " style=" text-align: center;" >${fullAns.strMeal}</h1>
  
  <button type="button" class="btn-close"   data-bs-theme="dark" aria-label="Close" id="close-button" onclick="closeDisplay()"></button>
       
    </div>
   <div style="height:300px;width:18rem;"> 
   <img style="height:300px;width=10%; margin-left:10px" src="${imgPath}" class="card-img-top" alt="..."> 
   </div>
  </div>
  <h3 style="margin:15px;"> Ingredients </h3>
  <div style="margin-left:25px";>
  <ul class="list-group list-group-flush">
  ${ingredientList}
  
</ul>
  </div>
 <h3 style="    margin: 15px 0 0 15px; ">Procedure </h3>
  <div class="card-body">
    <p class="card-text">${fullAns.strInstructions}</p>
    </div>
    </div>`;
  // console.log(recipe);
  fullDisplay.innerHTML = fullRecipeCard;
}
function closeDisplay() {
  // console.log("inside close button");
  fullDisplay.style.display = "none";
}
function displayRecipeCards(recipe) {
  ///console.log(recipe);
  let imgPath = recipe.strMealThumb;
  let recipeResult = `<div class="col margin disp"><div class="card mx-auto text-center" data-bs-theme="dark" style="width: 18rem;">
<img style="height:300px" src="${imgPath}" class="card-img-top" alt="...">
<div class="card-body ">
  <h5 class="card-title">${recipe.strMeal}</h5>
  <p class="card-text" style="margin-bottom: 2px;"> ${recipe.strArea} Cuisine</p>
  <p class="card-text" style="margin-bottom: 2px;">${recipe.strCategory}</p>
  <button class="btn btn-outline-light btn-secondary fullView"  style="margin-top: 10px;" data-bs-theme="dark"type="submit" value="" onclick=fullRecipeDisplay(${recipe.idMeal})>View Full Recipe</button>
  
</div>
</div>
</div>`;
  displayerCards.innerHTML += recipeResult;
}
let searchInput = document.getElementById("search-name");
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    console.log("inside enter click");
    event.preventDefault();
  }
});
async function searchByName() {
  let sInput = searchInput.value;

  displayerCards.innerHTML =
    "<h1 style='color:white; text-align:center'>Fetching Response .... </h1>";
  const input = sInput;

  // console.log("Input value ",search);
  if (input.length > 0) {
    document.getElementById("search-name").value = "";
    try {
      let response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`
      );
      const cuizine = await response.json();

      destructure(cuizine);
    } catch {
      console.log("error");
    }
  } else {
    displayerCards.innerHTML =
      "<h1 style='color:white; text-align:center'>Enter Valid Data</h1>";
  }
}
