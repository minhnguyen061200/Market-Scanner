async function contactUsEmail(email) {
  await fetch('https://hooks.zapier.com/hooks/catch/3637891/o22ycws/', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(email)
  }).then(data => (data.json())
    .then(res => console.log(res)));
  document.getElementById("emailForm").reset();
}

async function contactUsForm(name,email,phone,message) {
  await fetch('https://hooks.zapier.com/hooks/catch/3637891/o2pyaw9/', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify([{name,email,phone,message}])
  }).then(data => (data.json())
      .then(res => console.log(res)));
  document.getElementById("contactForm").reset();

  await fetch('https://hooks.zapier.com/hooks/catch/3637891/o2po99w/', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify([{name,email,phone,message}])
  }).then(data => (data.json())
      .then(res => console.log(res)));
}

const delete_cookie = function(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

const products = [{
  id: 1,
  name: 'Morning Cleanse',
  price: 125,
  caption: 'Once daily for a healthier and happier life',
  imgUrl: 'images/morning_cleanse.png',
  reviews: 123,
  linkToProduct: 'morning_cleanse.php'
},
  {
    id: 2,
    name: 'Penta Delight',
    price: 120,
    caption: 'The delight from five iconic fruits of Juice Earth',
    imgUrl: 'images/penta_delight.png',
    reviews: 163,
    linkToProduct: 'penta_delight.php'
  },
  {
    id: 3,
    name: 'Detoxes',
    price: 130,
    caption: 'A great choice of detoxification with five natural juices',
    imgUrl: 'images/detoxes.png',
    reviews: 145,
    linkToProduct: 'detoxes.php'
  },
  {
    id: 4,
    name: 'Rainbow Euphoria',
    price: 135,
    caption: 'The intense happiness coming from natural ingredients',
    imgUrl: 'images/rainbow_europhia.jpg',
    reviews: 233,
    linkToProduct: 'rainbow_europhia.php'
  },
  {
    id: 5,
    name: 'Immunity Boost',
    price: 130,
    caption: 'Enhance your immune system with the nutrients of these six juices',
    imgUrl: 'images/immunity_boost.jpg',
    reviews: 170,
    linkToProduct: 'immunity_boost.php'
  },
  {
    id: 6,
    name: 'Fruity Deluxe',
    price: 130,
    caption: 'Enjoy the legendary feeling from three special smoothies',
    imgUrl: 'images/fruity_deluxe.png',
    reviews: 70,
    linkToProduct: 'fruity_deluxe.php'
  },
];
const cookie = ['products', '=', JSON.stringify(products)].join('');
document.cookie = cookie;

function addToCart(id) {
  let oldCart = read_cookie('cart');
  let cartItem;

  const checkExistingProduct = oldCart ? oldCart.find(x => x.id === id) : undefined;
  if (checkExistingProduct) {
    oldCart = oldCart.filter(el => el.id !== id);
    //Remove Existing Product
    cartItem = [
      {
        id: id,
        quantity: (checkExistingProduct.quantity + 1),
      }
    ]
  } else {
    cartItem = [
      {
        id: id,
        quantity: 1,
      }
    ];
  }
  let updatedCart = cartItem;
  if (oldCart && oldCart.length > 0) {
    updatedCart = [...oldCart, ...cartItem];
  }
  const cookie = ['cart', '=', JSON.stringify(updatedCart)].join('');
  document.cookie = cookie;
  updateCartCount();
  showToast();
}

function read_cookie(name) {
  let result = document.cookie.match(new RegExp(name + '=([^;]+)'));
  result && (result = JSON.parse(result[1]));
  return result;
}

function updateCartCount() {
  const cookie = read_cookie('cart');
  if (cookie && cookie.length > 0) {
    document.getElementById('cartCounter').innerHTML = `${cookie.filter(x => x.quantity > 0).length}`;
  } else {
    document.getElementById('cartCounter').innerHTML = '0';
  }
}

function removeFromCart(id) {
  let oldCart = read_cookie('cart');
  let cartItem;

  const checkExistingProduct = oldCart ? oldCart.find(x => x.id === id) : undefined;
  if (checkExistingProduct) {
    oldCart = oldCart.filter(el => el.id !== id);
    //Remove Existing Product
    cartItem = [
      {
        id: id,
        quantity: 0,
      }
    ]
  } else {
    cartItem = [
      {
        id: id,
        quantity: 0,
      }
    ];
  }
  let updatedCart = cartItem;
  if (oldCart && oldCart.length > 0) {
    updatedCart = [...oldCart, ...cartItem];
  }
  const cookie = ['cart', '=', JSON.stringify(updatedCart)].join('');
  document.cookie = cookie;
  updateCartCount();
  location.reload();
  showToast();
}

function showToast() {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";

  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}


function generateCartProducts() {
  let cartBody = '';
  const products = read_cookie('products');
  let productList = read_cookie('cart');
  let totalPrice = 0;
  productList.map((value, index) => {
      if (value.quantity > 0) {
        const prod = products.find(item => item.id == value.id);
        const subtotal = (prod.price * value.quantity)
        totalPrice += subtotal;
        return (cartBody += `<div class="basket-product">
        <div class="item">
          <div class="product-image">
            <img src=${prod.imgUrl} style="max-width: 120px;" class="product-frame">
          </div>
          <div class="product-details">
            <h1><strong><span class="item-quantity">${value.quantity} </span></strong> ${prod.name}</h1>
            <p>Product Code - ${value.id}</p>
          </div>
        </div>
        <div class="price">${prod.price}</div>
        <div class="quantity">
          <input type="number" onchange="updateQuantity()" value=${value.quantity} min="1" disabled class="quantity-field">
        </div>
        <div class="subtotal">${subtotal}</div>
        <div class="remove">
          <button onclick="removeFromCart('${value.id}')">Remove</button>
        </div>
      </div>`)
      }
    }
  );
  document.getElementById('cartPagePlaceholder').innerHTML = cartBody;
  document.getElementById('basket-subtotal').innerHTML = totalPrice;
  document.getElementById('basket-total').innerHTML = totalPrice;
}

function updateDelivery() {
  const subtotal = document.getElementById('basket-subtotal').textContent;
  const del = document.getElementById('deliverySelect');
  const deliveryCost = del.options[del.selectedIndex].value;
  document.getElementById('basket-total').innerHTML = (parseFloat(deliveryCost) + parseFloat(subtotal));
}

function updateQuantity() {
  addToCart(1);
  generateCartProducts();
}

