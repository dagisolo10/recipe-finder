const searchForm = document.getElementById('search-form')
const searchBtn = document.querySelector('.search-btn')
const searchResult = document.querySelector('.search-result')
const errorMessage = document.querySelector('.error-message')
const mealsContainer = document.querySelector('.meals-container')

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/'
const SEARCH_URL = `${BASE_URL}search.php?s=`
const LOOKUP_URL = `${BASE_URL}lookup.php?i=`

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    searchMeal()
})

async function searchMeal() {
    const searchInput = document.getElementById('search-input')
    const searchTerm = searchInput.value.trim()

    if (!searchTerm) {
        errorMessage.textContent = 'Please Enter a search term<'
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
            searchResult.classList.add('hidden')
            errorMessage.classList.remove('hidden')
            errorMessage.textContent = `No recipes found for "${searchTerm}. Try another search term"`
            return
        }
        
        searchInput.value = ''
        searchResult.textContent = `Search result for "${searchTerm}":`
        data.meals.forEach(meal => {
            console.log(meal)
        })
        searchBtn.removeAttribute('disabled')
        displayMeals(data.meals)
        
    }
    catch (error) {
        searchBtn.removeAttribute('disabled')
        errorMessage.textContent = 'Error occurred while fetching recipes. Try again'
        errorMessage.classList.remove('hidden')
    }
}

function displayMeals(meals) {
    mealsContainer.innerHTML = ''
    
    meals.forEach(meal => {
        mealsContainer.innerHTML += `
            <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-info">
                    <h2>${meal.strMeal}</h2>
                    ${meal.strCategory ? `<p class="catagory">${meal.strCategory}</p>` : ''}
                </div>
            </div>`
    })
}