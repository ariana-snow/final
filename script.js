let cart = document.querySelectorAll(".add-to-cart");

let tours = [
  {
    type: "Market Tour",
    tag: "market",
    price: 50,
    inCart: 0
  },
  {
    type: "Dessert Tour",
    tag: "dessert",
    price: 60,
    inCart: 0
  },
  {
    type: "Food Tour",
    tag: "food",
    price: 75,
    inCart: 0
  },
  {
    type: "Drink Tour",
    tag: "drink",
    price: 50,
    inCart: 0
  },
];

for (let i = 0; i < cart.length; i++) {
  cart[i].addEventListener("click", () => {
    cartNumbers(tours[i]);
    totalCost(tours[i]);
  });
}

function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector(".cart span").textContent = productNumbers;
  }
}

function cartNumbers(tours, action) {
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers);

  let cartItems = localStorage.getItem("toursInCart");
  cartItems = JSON.parse(cartItems);

  if (action == "decrease") {
    localStorage.setItem("cartNumbers", productNumbers - 1);
    document.querySelector(".cart span").textContent = productNumbers - 1;
  } else if (productNumbers) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".cart span").textContent = productNumbers + 1;
  } else {
    localStorage.setItem("cartNumbers", 1);
    document.querySelector(".cart span").textContent = 1;
  }
  setItems(tours);
}

function setItems(tours) {
  let cartItems = localStorage.getItem("toursInCart");
  cartItems = JSON.parse(cartItems);

  if (cartItems !== null) {
    if (cartItems[tours.tag] == undefined) {
      cartItems = {
        ...cartItems,
        [tours.tag]: tours
      };
    }
    cartItems[tours.tag].inCart += 1;
  } else {
    tours.inCart = 1;

    cartItems = {
      [tours.tag]: tours
    };
  }

  localStorage.setItem("toursInCart", JSON.stringify(cartItems));
}

function totalCost(tours, action) {
  let cartCost = localStorage.getItem("totalCost");

  if (action == "decrease") {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost - tours.price);
  } else if (cartCost != null) {
    cartCost = parseInt(cartCost);
    localStorage.setItem("totalCost", cartCost + tours.price);
  } else {
    localStorage.setItem("totalCost", tours.price);
  }
}

function displayCart() {
  let cartItems = localStorage.getItem("toursInCart");
  cartItems = JSON.parse(cartItems);
  let productsContainer = document.querySelector(".products");

  let cartCost = localStorage.getItem("totalCost");

  console.log(cartItems);

  if (cartItems && productsContainer) {
    productsContainer.innerHTML = "";
    Object.values(cartItems).map((item) => {
      productsContainer.innerHTML += `
    <div class="product">
   <ion-icon name="close-circle-outline"></ion-icon>
   <img src="images/${item.tag}.jpg">
  <span class="item-type">${item.type}</span>
  </div>
  <div class="price">£${item.price}.00</div>
    
    <div class="quantity">
    <ion-icon class="decrease" name="arrow-dropleft-circle"></ion-icon>
      <span>${item.inCart}</span>
      <ion-icon class="increase" name="arrow-dropright-circle"></ion-icon>
      </div>
    `;
    });

    productsContainer.innerHTML += `
  <div class="cartTotalContainer">
  <h4 class="cartTotalTitle">Total</h4>
  <h4 class="cartTotal">£${cartCost}.00</h4>
  `;
  }

  deleteButtons();
  manageQuantity();
}

function deleteButtons() {
  let deleteButtons = document.querySelectorAll(".product ion-icon");
  let productName;
  let productNumbers = localStorage.getItem("cartNumbers");
  let cartItems = localStorage.getItem("toursInCart");
  cartItems = JSON.parse(cartItems);
  let cartCost = localStorage.getItem("totalCost");

  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", () => {
      productName = deleteButtons[i].parentElement.textContent
        .trim()
        .toLowerCase()
        .replace(/ /g, "");
      localStorage.setItem(
        "cartNumbers",
        productNumbers - cartItems[productName].inCart
      );

      localStorage.setItem(
        "totalCost",
        cartCost - cartItems[productName].price * cartItems[productName].inCart
      );

      delete cartItems[productName];
      localStorage.setItem("toursInCart", JSON.stringify(cartItems));

      displayCart();
      onLoadCartNumbers();
    });
  }
}

function manageQuantity() {
  let decreaseButtons = document.querySelectorAll(".decrease");
  let increaseButtons = document.querySelectorAll(".increase");
  let cartItems = localStorage.getItem("toursInCart");
  let currentQuantity = 0;

  cartItems = JSON.parse(cartItems);

  for (let i = 0; i < decreaseButtons.length; i++) {
    decreaseButtons[i].addEventListener("click", () => {
      currentQuantity = decreaseButtons[i].parentElement.querySelector("span")
        .textContent;

      currentProduct = decreaseButtons[
        i
      ].parentElement.previousElementSibling.previousElementSibling
        .querySelector("span")
        .textContent.toLowerCase()
        .trim()
        .replace(/ /g, "");

      if (cartItems[currentProduct].inCart > 1) {
        cartItems[currentProduct].inCart -= 1;
        cartNumbers(cartItems[currentProduct], "decrease");
        totalCost(cartItems[currentProduct], "decrease");
        localStorage.setItem("toursInCart", JSON.stringify(cartItems));
        displayCart();
      }
    });
  }

  for (let i = 0; i < increaseButtons.length; i++) {
    increaseButtons[i].addEventListener("click", () => {
      currentQuantity = increaseButtons[i].parentElement.querySelector("span")
        .textContent;

      currentProduct = increaseButtons[
        i
      ].parentElement.previousElementSibling.previousElementSibling
        .querySelector("span")
        .textContent.toLowerCase()
        .trim()
        .replace(/ /g, "");

      cartItems[currentProduct].inCart += 1;
      cartNumbers(cartItems[currentProduct]);
      totalCost(cartItems[currentProduct]);
      localStorage.setItem("toursInCart", JSON.stringify(cartItems));
      displayCart();
    });
  }
}

onLoadCartNumbers();
displayCart();