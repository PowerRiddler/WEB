/*
function addToCart(productName) {
    let cartData = JSON.parse(localStorage.getItem('cartData.json')) || { products: [] };
    const product = cartData.products.find(p => p.name === productName);
    var totalItems = 1;
    cartData.products.forEach(p => totalItems += p.quantity);
    const mainShoppingCart = document.querySelector('.totalQuantityBubble');
    mainShoppingCart.innerHTML = totalItems;
    mainShoppingCart.style.display = 'block';
    if (product) {
      product.quantity++;
    } else {
      cartData.products.push({ name: productName, quantity: 1 });
    }
    localStorage.setItem('cartData.json', JSON.stringify(cartData));
    console.log(`${productName} added to cart.`);
}
  
  function addQuantityBubble(productName) {
    let cartData = JSON.parse(localStorage.getItem('cartData.json')) || { products: [] };
    const product = cartData.products.find(p => p.name === productName);
    if(product) {
      const qBubble = document.querySelector(`.list__item #${productName.replace(/[\s%.,&]/g, '')} .quantityBubble`);
      qBubble.innerHTML = product.quantity;
      qBubble.style.display = 'block';
    }
}
*/
fetch('../data/data.json')
  .then(response => response.json())
  .then(data => {
    const categoryNames = data.categories.map(category => category.name);
    const ul = document.querySelector('.navigation ul');
    const headerSelectedCategory = document.querySelector('.header__category');

    categoryNames.forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      ul.appendChild(li);

      li.addEventListener("click", function() {
        var totalItemCount = 0;
        var prevSelected = document.getElementsByClassName("selected");
        for (var j = 0; j < prevSelected.length; j++) {
          prevSelected[j].classList.remove("selected");
        }
        this.classList.add("selected");
        const listItems = document.querySelectorAll('.list__item');
        listItems.forEach(item => item.remove());

        const mainContainer = document.querySelector('.list');
        mainContainer.style.height = 'fit-content';
        const selectedCategory = data.categories.find(category => category.name === name);
        headerSelectedCategory.textContent = selectedCategory.name;
        const bannerImage = document.querySelector('.storefront img');
        bannerImage.src = '../images/' + selectedCategory.image;















        var cData = JSON.parse(localStorage.getItem('cartData.json')) || { products: [] };
        selectedCategory.products.forEach(product => {
          const div = document.createElement('div');
          div.className = 'list__item';
          const divImage = document.createElement('div');
          divImage.id = product.name.replace(/[\s%.,&]/g, '');
          const img = document.createElement('img');
          img.src = '../images/' + product.image;
          img.alt = product.name;
          const p1 = document.createElement('p');
          const p2 = document.createElement('p');
          p1.textContent = product.name;
          p2.textContent = selectedCategory.name;
          divImage.appendChild(img);
          divImage.appendChild(p1);
          divImage.appendChild(p2);
          const cartImg = document.createElement('div');
          cartImg.src = "../images/shoppingcart.png";
          cartImg.alt = 'Shopping Cart';
          cartImg.className = 'cart';
          divImage.appendChild(cartImg);

          const productQuantityBubble = document.createElement('div');
          productQuantityBubble.className = 'quantityBubble';
          divImage.appendChild(productQuantityBubble);














          
          divImage.addEventListener('mouseover', function() {
              const cartImg = divImage.querySelector('.cart');
              cartImg.style.display = 'block';
        
          });

          cartImg.addEventListener('click', function() {
              addToCart(product.name);
              addQuantityBubble(product.name);
          });

          divImage.addEventListener('mouseout', function() {
            const cartImg = divImage.querySelector('.cart');
            if (cartImg) {
              cartImg.style.display = 'none';
            }
          });

          div.appendChild(divImage);
          document.querySelector('.list').appendChild(div);
          console.log("Item count: " + totalItemCount);
          cData.products.forEach(obj => {
            
            if (obj.name === product.name){
              totalItemCount += obj.quantity;
              if (obj.quantity > 0) {
                document.querySelector(`#${product.name.replace(/[\s%.,&]/g, '')} .quantityBubble`).style.display = 'block';
                document.querySelector(`#${product.name.replace(/[\s%.,&]/g, '')} .quantityBubble`).innerHTML = obj.quantity;
              }
            }
            if(totalItemCount > 0){
              document.querySelector('.totalQuantityBubble').innerHTML = totalItemCount;
              document.querySelector('.totalQuantityBubble').style.display = 'block';
            }
          });
          if(selectedCategory.name !== 'Sve'){
            div.style.marginLeft = 'calc(8% + 10px)';
            div.style.marginRight = 'calc(8% - 10px)';
          }
        });
      });
    });
})
.catch(error => console.error(error));

/*
window.addEventListener('load', (event) => {
  let cartData = JSON.parse(localStorage.getItem('cartData.json')) || { products: [] };
  const tBubble = document.querySelector('.totalQuantityBubble');
  var totalItems = 0;
  cartData.products.forEach(p => totalItems += p.quantity);
  if(totalItems > 0){
    tBubble.innerHTML = totalItems;
    tBubble.style.display = 'block';
  }
});
*/