'use strict';

const apiKey = '1';
const searchNameURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}
  
function displayResults(responseJson) {
  $('#results-list').empty();
  $('#js-error-message').empty();
  for (let i = 0; i < responseJson.drinks.length; i++){  
    $('#results-list').append(
      `<div class="thumbs">
        <h2>${responseJson.drinks[i].strDrink}</h2>
        <a href="javascript:displayCocktail()"><img src="${responseJson.drinks[i].strDrinkThumb}" class="drink-image" alt="image of cocktail"></a>
        <div class="details" id="${responseJson.drinks[i].idDrink}">
          <ul class="js-ul"><h3>Ingredients:</h3>
            ${Object.keys(responseJson.drinks[i])
            .filter(key => key.includes('strIngredient'))
            .map(key => {
            const value = responseJson.drinks[i][key];
            if (!value) {
            return '';
            }
            return '<li>' + value + '</li>';
            }).join('')
            }
            </ul>
            <h3>Instructions:</h3>
            <p>${responseJson.drinks[i].strInstructions}</p>
            <h3>Serving Glass:</h3>
            <p>${responseJson.drinks[i].strGlass}</p>
        </div>
      </div>
      `
    );}
  $('#results-list').append(
    '<footer><a href="#top">Click here to go to top of page</a></footer>'   
  );
  $('#results').removeClass('hidden');
  $('.details').hide();
  
  // $('#button').click(function(event) {
  //   event.preventDefault();
  //   $('html, body').animate({
  //     scrollTop: $('#results').offset().top
  //   }, 1000);
  // });
  var offset = 0;

    offset = $('#results').offset().top;

    $('html, body').animate({
        scrollTop: offset
    }, 1000);
}

function displayCocktail(){
  $('#results-list').on('click', '.drink-image', function () {
    $(this).parent().siblings().toggle(800); 
    event.preventDefault();
  });
}

function searchByName(query) {
  const params = {
    key: apiKey,
    s: query,
  };

  const queryString = formatQueryParams(params);
  const url = searchNameURL + '?' + queryString;
    
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(responseJson => displayResults(responseJson))
    .then(responseJson => displayCocktail(responseJson))
    .catch(err => {
      $('#js-error-message').text('Couldn\'t find anything like that. Please try again');
    });
}

function watchForm() {
  $('form').submit(event => {
    $('.results').empty();
    const searchTerm = $('#js-search-term').val();
    searchByName(searchTerm);
    event.preventDefault();
  });
}
  
$(watchForm);