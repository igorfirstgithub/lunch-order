import { menuArray } from "./data.js";

const modalPay = document.getElementById("modal-pay");
const payForm = document.getElementById("pay-form");

let order = "";
const orderArray = [];

const menu = document.getElementById("menu");

document.addEventListener("click", function (event) {
  const payDisplay = document.getElementById("modal-pay").style.display;
  const rateDisplay = document.getElementById("modal-rating").style.display;

  if (
    (payDisplay === "" || payDisplay === "none") &&
    (rateDisplay === "" || rateDisplay === "none")
  ) {
    if (event.target.dataset.foodtype) {
      addFood(event.target.dataset.foodtype);
      if (document.getElementById("thanks-header")) {
        document.getElementById("thanks-header").style.display = "none";
      }
    } else if (event.target.id === "btn-complete-order") {
      completeOrder();
    } else if (
      event.target.id === "thanks-header" ||
      event.target.parentElement.id === "thanks-header"
    ) {
      document.getElementById("thanks-header").style.display = "none";
    } else if (event.target.id === "remove-item") {
      orderArray.splice(event.target.dataset.removeIndex, 1);
      recombineOrder();
      render();
    }
  } else {
    console.log("at least one modal open");
    console.log("pay", document.getElementById("modal-pay").style);
    console.log("rate", document.getElementById("modal-rating"));
    if (event.target.id === "submit-pay-form") {
      event.preventDefault();
      handleFormSubmit();
    } else if (event.target.id.includes("star")) {
      const rating = event.target.id.slice(-1).toString();
      for (let i = 1; i <= 5; i++) {
        document.getElementById(`star${i}`).style.color =
          i <= rating ? "orange" : "lightgrey";
      }
    } else if (event.target.id === "rate-button") {
      document.getElementById("modal-rating").style.display = "none";
    }
  }
});

function recombineOrder() {
  order = "";
  orderArray.forEach(function (elem, index) {
    order += `<div class="one-piece-order">
                <p class="basket-item-title">${elem.name}</p>
                <button class="basket-item-remove" id="remove-item" data-remove-index="${index}">remove</button>
                <p class="basket-item-price">$${elem.price}</p>
              </div>`;
  });
}

function addFood(foodId) {
  const oneFood = menuArray.filter((el) => el.id == foodId)[0];
  orderArray.push(oneFood);
  recombineOrder();
  render();
}

function completeOrder() {
  modalPay.style.display = "block";
}

function handleFormSubmit() {
  const payFormData = new FormData(payForm);
  const clientName = payFormData.get("client-name");
  const cardNumber = payFormData.get("card-number");
  const cvv = payFormData.get("cvv");
  if (
    clientName !== "" &&
    cardNumber.toString().length === 2 &&
    cvv.toString().length === 3
  ) {
    console.log(clientName);
    payForm.reset();
    modalPay.style.display = "none";
    orderArray.splice(0);
    getRating();
    render();
    document.getElementById(
      "menu"
    ).innerHTML += `<div id="thanks-header" class="thanks-header">
                      <h3>Thanks, ${clientName}! Your order is on its way</h3>
                      
                    </div>`;
    document.getElementById("thanks-header").style.display = "block";
  }
}

function getRating() {
  document.getElementById("modal-rating").style.display = "block";
  const ratingBlock = document.getElementById("rating-inner");

  let starIcons = "<div>";
  for (let i = 1; i <= 5; i++) {
    starIcons += `<span id="star${i}" class="fa fa-star star"></span>`;
  }
  starIcons +=
    '</div> <button class="rate-button" id="rate-button">Rate</button>';
  ratingBlock.innerHTML = starIcons;
}

function getPage() {
  let menuString = "";
  menuArray.forEach(function (elem) {
    menuString += `
        <div class="food-position">
            <div class="img-and-text">
                <img class="food-pic" src="${elem.foodPic}" alt="${elem.emoji}">
                <div class="text">
                    <p class="item-title">${elem.name}</p>
                    <p class="item-description">${elem.ingredients}</p>
                    <p class="item-price">$${elem.price}</p>
                </div>
            </div>
            <div class="flex-add-button">
                <button data-foodtype="${elem.id}" class="add-button">+</button>
            </div>
        </div>`;
  });

  if (orderArray.length > 0) {
    menuString += `
            <div class="total-order">
                <h3 class="title-total-order">Your order</h3>
                ${order}
                <hr class="total-price-divider">
                <div class="price-line">
                  <p class="total-price">Total price:</p>
                  <p class="total-price-number">
                    $${orderArray.reduce((acc, elem) => acc + elem.price, 0)}
                  </p>
                </div>
                
                <button class="btn-complete-order" id="btn-complete-order">Complete order</button>
            </div>

           
            `;
  }

  return menuString;
}

function render() {
  document.getElementById("menu").innerHTML = getPage();
}

render();
