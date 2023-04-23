class Product {
  //deal with a single product

  constructor(product) {
    this.product = product;
  }

  render() {
    //rendering a single product
    let html = `
        
        <div class="item">
        <img src=${this.product.productImg} alt="${this.product.productName}" >
        <div class="product-item__content">
          <h2>${this.product.productName}</h2>
          <h3>\$ ${this.product.productPrice}</h3>
          <p>${this.product.productDescription}</p>
          <button onclick="new Product().updateProduct(${this.product.id})">update</button>
         <button onclick="new Product().deleteProduct(${this.product.id})" ><ion-icon name="trash-outline"></ion-icon></button>
         <button onclick="addToCart(${this.product.id})" >add to cart</button>
        </div>
     </div>
        
        `;

    return html;
  }
  async deleteProduct(id) {
    await fetch(`http://localhost:3000/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  async updateProduct(id) {
    const response = await fetch(`http://localhost:3000/products/${id}`);
    const product = await response.json();
    this.prePopulate(product);
    const btn = document.querySelector("#btn");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const updatedProduct = new Product().readValues();
      if (btn.innerText === "Update Product") {
        console.log("Updating");
        this.sendUpdate({ ...updatedProduct, id });
      }
    });
  }

  async sendUpdate(product) {
    await fetch(`http://localhost:3000/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  prePopulate(product) {
    document.querySelector("#p_name").value = product.productName;
    document.querySelector("#p_image").value = product.productImg;
    document.querySelector("#p_price").value = product.productPrice;
    document.querySelector("#p_description").value = product.productDescription;
    document.querySelector("#btn").textContent = `Update Product`;
  }

  readValues() {
    const productName = document.querySelector("#p_name").value;
    const productImg = document.querySelector("#p_image").value;
    const productPrice = document.querySelector("#p_price").value;
    const productDescription = document.querySelector("#p_description").value;
    return { productName, productImg, productDescription, productPrice };
  }
  async addProduct() {
    const newProduct = new Product().readValues();
    await fetch(" http://localhost:3000/products", {
      method: "POST",
      body: JSON.stringify(newProduct),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

}

const btn = document.querySelector("#btn");
if (btn.innerText === "Add Product") {
  btn.addEventListener("click", new Product().addProduct);
  console.log("Adding");
}

class ProductList {
  //deal with all products

  async render() {
    //get list of products and render- api call
    let products = await this.fetchProduct();
    // console.log(products);
    let html = "";
    for (let product of products) {
      const productHTML = new Product(product).render();
      html += productHTML;
    }
    return html;
  }

  async fetchProduct() {
    const response = await fetch("http://localhost:3000/products");
    const products = await response.json();
    return products;
  }
}

class App {
  static async Init() {
    let productList = new ProductList();
    let htmlProducts = await productList.render();
    // console.log((htmlProducts));
    let app = document.querySelector("#app");
    app.innerHTML = htmlProducts;
  }
}

App.Init();

class Cart {
  constructor() {
    this.items = [];
  }

  // Add item to cart
  addItem(product) {
    this.items.push(product);
  }

  // Remove item from cart
  removeItem(id) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  // Calculate total cost of items in cart
  getTotal() {
    let total = 0;
    let subtotal=0;
    this.items.forEach((item) => {
      subtotal -= item.productPrice;
      total=Math.abs(subtotal)
    });
    return total;
  }

  // Render the cart
  render() {
    let html = `
        <div class="cart">
          <h2>Cart</h2>
          <ul>`;
    this.items.forEach((item) => {
      html += `
            <li>${item.productName} - $${item.productPrice}
              <button onclick="removeFromCart(${item.id})">Remove</button>
            </li>`;
    });
    html += `
          </ul>
          <p>Total: $${this.getTotal()}</p>
        </div>`;
    return html;
  }
}

// Initialize a new cart
const cart = new Cart();

// Function to add item to cart
async function addToCart(productId) {
  const response = await fetch("http://localhost:3000/products");
  const products = await response.json();
  const product = products.find((item) => item.id === productId);
  cart.addItem(product);
  renderCart();
}

// Function to remove item from cart
function removeFromCart(productId) {
  cart.removeItem(productId);
  renderCart();
}

// Function to render the cart
function renderCart() {
  const cartContainer = document.querySelector("#cart-container");
  cartContainer.innerHTML = cart.render();
}


