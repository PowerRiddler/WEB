const liList = document.querySelectorAll('.navigation li');
console.log(liList);
liList.forEach(li => {
  li.addEventListener("click", function() {
    var prevSelected = document.getElementsByClassName("selected");
    for (var j = 0; j < prevSelected.length; j++) {
      prevSelected[j].classList.remove("selected");
    }
    li.classList.add("selected");
    });
});