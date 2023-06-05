const cartData = JSON.parse(localStorage.getItem('cartData.json'));
let totalCartItems = 0;               

var table = document.getElementById("table");
var tbody = table.getElementsByTagName("tbody")[0];

cartData.products.forEach(product => {
    var row = tbody.insertRow();
    var nameCell = row.insertCell();
    var quantityCell = row.insertCell();
    nameCell.innerHTML = product.name;

    var buttonLeft = document.createElement("span");
    buttonLeft.className = "button";
    buttonLeft.innerHTML = "-";

    buttonLeft.addEventListener("click", function() {
        var currentValue = parseInt(this.nextElementSibling.innerHTML);
        if (currentValue > 0) {
            this.nextElementSibling.innerHTML = currentValue - 1;
            totalCartItems -= 1;
            product.quantity = parseInt(quantityValue.innerHTML);
            localStorage.setItem('cartData.json', JSON.stringify(cartData));
        }
    });

    quantityCell.appendChild(buttonLeft);

    var quantityValue = document.createElement("span");
    quantityValue.innerHTML = product.quantity;
    totalCartItems += product.quantity;
    quantityCell.appendChild(quantityValue);

    var buttonRight = document.createElement("span");
    buttonRight.className = "button";
    buttonRight.innerHTML = "+";

    buttonRight.addEventListener("click", function() {
        var currentValue = parseInt(this.previousElementSibling.innerHTML);
        this.previousElementSibling.innerHTML = currentValue + 1;
        totalCartItems += 1;
        product.quantity = parseInt(quantityValue.innerHTML);
        localStorage.setItem('cartData.json', JSON.stringify(cartData));
    });
    quantityCell.appendChild(buttonRight);

}); 
console.log(totalCartItems);