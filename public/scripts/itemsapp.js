
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function createListItems(itemname) {
  return $(`
    <li>
      <form>
        <input type="checkbox" value="${escape(itemname)}" class="itemname"> <p>${escape(itemname)}</p>
        <input type="submit" value="Delete">
      </form>
    </li>
  `);
}

function deleteElementFromList(){
 $('body').on('submit', 'form', function(e){
    let itemname = $(this).parent().find('p').text();
    e.preventDefault();
    //ajax call
    $.ajax({
      method: "DELETE",
      url: `/api/items/${itemname}`
    }).done((itemname) => {
      $('ul').empty();
      loadDataIntoList();
    });
  });
}


function loadDataIntoList() {
  $.ajax({
    method: "GET",
    url: "/api/items"
  }).done((items) => {
    let category = $('.category-name').text();
    let categoryFiltered = category.toUpperCase().trim();
    for (item of items) {
      if (item.category.toUpperCase().trim() === categoryFiltered) {
        $('ul').append(createListItems(item.name));
      }
    }
  });
}


function createDescription(category, item) {
  let discriptBox
  switch (category){
    case 'eat':
    console.log(item)
      discriptBox = `
        <div>
          <h1>${escape(item.name)}</h1>
          <p>Are they open? ${escape(item.is_closed)}
          <p>Food Type : ${escape(item.categories[0].title)}</p>
          <img src="${(item.image_url)}" height="300px" width="300px">
          <p>Address: ${escape(item.location.address1)}</p>
          <p>Rating: ${escape(item.rating)}</p>
          <p>Phone #: ${escape(item.phone)}</p>
          <a href="${item.url}">Visit Link</a>
        </div>
      `;
      break;
    case 'watch':
      console.log(item);
      discriptBox = `
      <div>
      <h1>${escape(item.Title)}</h1>
      <img src="${(item.Poster)}" height="500px" width="300px">
      <p>Released: ${escape(item.Released)}</p>
      <p>Rating: ${escape(item.imdbRating)}</p>
      <p>Type: ${escape(item.Type)}</p>
      <p>Runtime: ${escape(item.Runtime)}</p>
      <p>Genre: ${escape(item.Genre)}</p>
      <p>Plot: ${escape(item.Plot)}</p>


      `
      break;
    case 'read':
      break;
    case 'buy':
      break;
  }
  return discriptBox;
}


function showItemDetails() {
  $('ul').on('click', 'p', function() {
    const categoryName = $('.category-name').text().toLowerCase().trim();
    $.ajax({
      method: "GET",
      url: `/api/items/${categoryName}/${$(this).text()}`
    }).done((res) => {
      let description = createDescription(categoryName, res);
      $('.item-description').empty();
      $('.item-description').append(description);
      $('.item-description').toggle(() => {});
    });
  });
}


$(() => {
  deleteElementFromList();
  loadDataIntoList();
  showItemDetails();
});
