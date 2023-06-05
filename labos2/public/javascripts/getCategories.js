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
        });
    });
});