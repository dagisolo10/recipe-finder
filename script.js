const searchInput = document.getElementById('search-input')
const searchForm = document.getElementById('search-form')
const searchBtn = document.querySelector('.search-btn')
const searchResult = document.querySelector('.search-result')
const errorMessage = document.querySelector('.error-message')
const mealsContainer = document.querySelector('.meals-container')
const mealDetails = document.querySelector('.meal-details')
const allMeals = document.querySelectorAll('.meal')


const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/'
const SEARCH_URL = `${BASE_URL}search.php?s=`
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`

searchInput.focus()

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    searchMeal()
})

mealsContainer.addEventListener('click', handleClickEvent)

async function handleClickEvent(e) {
    const mealId = e.target.parentElement.id
    searchResult.classList.remove('hidden')
    searchResult.textContent = 'Loading Recipe...'
    if (!mealId) return
    try {
        const response = await fetch(`${LOOKUP_URL}${mealId}`)
        const data = await response.json()
        displayMealContent(data.meals[0])
    }
    catch (error) {
        errorMessage.textContent = 'Error occurred while fetching recipe. Try again'
        errorMessage.classList.remove('hidden')
    }
}

async function searchMeal() {
    mealDetails.classList.add('hidden')
    const searchInput = document.getElementById('search-input')
    const searchTerm = searchInput.value.trim()
    
    if (!searchTerm) {
        errorMessage.textContent = 'Please Enter a search term'
        errorMessage.classList.remove('hidden')
        return
    }
    
    
    try {
        searchResult.textContent = `Searching for "${searchTerm}"...`
        mealsContainer.innerHTML = ''
        errorMessage.classList.add('hidden')
        searchResult.classList.remove('hidden')
        searchBtn.toggleAttribute('disabled')
        
        const response = await fetch(`${SEARCH_URL}${searchTerm}`)
        const data = await response.json()
        
        if (!data.meals) {
            searchInput.value = ''
            mealsContainer.innerHTML = ''
            mealDetails.classList.add('hidden')
            searchResult.classList.add('hidden')
            errorMessage.classList.remove('hidden')
            errorMessage.textContent = `No recipes found for "${searchTerm}". Try another search term`
            searchBtn.removeAttribute('disabled')
            setTimeout(() => {
                errorMessage.classList.add('hidden')
                searchInput.focus()
            }, 2000);
            return
        }
        
        searchInput.value = ''
        searchResult.textContent = `Search result for "${searchTerm}":`
        searchBtn.removeAttribute('disabled')

        displayMeals(data.meals)

    }
    catch (error) {
        searchBtn.removeAttribute('disabled')
        errorMessage.textContent = 'Error occurred while fetching recipe. Try again'
        errorMessage.classList.remove('hidden')
    }
}

function displayMeals(meals) {
    mealsContainer.innerHTML = ''

    meals.forEach(meal => {
        mealsContainer.innerHTML += `
            <div class="meal" id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-info">
                    <h2>${meal.strMeal}</h2>
                    ${meal.strCategory ? `<p class="category">${meal.strCategory}</p>` : ''}
                </div>
            </div>`
    })
}

function displayMealContent(meal) {
    const ingredients = []

    searchResult.textContent = ''
    searchResult.classList.add('hidden')

    for (let i = 1; i <= 20; i++) {
        const ingredientKey = `strIngredient${i}`
        const measureKey = `strMeasure${i}`
        if (!meal[ingredientKey]) continue
        ingredients.push({
            ingredient: meal[ingredientKey],
            measure: meal[measureKey]
        })
    }

    mealDetails.innerHTML = `
    <button class="back-to-top">
        <i class="fa fa-long-arrow-left"></i>
        Back to recipes
    </button>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <h1>${meal.strMeal}</h1>
    ${meal.strCategory ? `<p class="category">${meal.strCategory}</p>` : ''}
    <h3>Instructions</h3>
    <p>${meal.strInstructions}</p>
    <div class="ingredients">
    <h3>Ingredients</h3>
    ${ingredients.map(ingredient =>
        `<p>
        <i class="fa fa-check"></i> 
        ${ingredient.ingredient} - ${ingredient.measure}
        </p>`
    ).join('')}
    </div>
    <a href="${meal.strYoutube}">
    <i class="fab fa-youtube"></i>
    Watch Video
    </a>
    `

    const backToTop = document.querySelector('.back-to-top')
    backToTop.addEventListener('click', () => {
        mealDetails.classList.add('hidden')
        document.querySelector('.container').scrollTo({ top: 0, behavior: 'smooth' })
    })
    mealDetails.classList.remove('hidden')
    mealDetails.scrollIntoView({ behavior: 'smooth' })
}