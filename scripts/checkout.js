import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderpaymentSummary } from './checkout/paymentSummary.js';
import { loadProductsFetch } from '../data/products.js';
import { loadCart , cart, calculateCartQuantity,updateQuantity} from '../data/cart.js';
//import '../data/cart-class.js';
//import '../data/backend-practice.js'

export function updateCartQuantity(){
  let cartQuantity = calculateCartQuantity();

  document.querySelector('.js-return-to-home-link').innerHTML=`${cartQuantity} items`;
}

async function loadPage() {
  try {

    //throw 'error1';

    await loadProductsFetch();
    const value = await new Promise((resolve,reject) => {
      //throw 'error2';
      loadCart(() => {
        //reject('error3');
        resolve();
      });
    });
  } catch (error) {
    console.log('Unexpected error. Please try again later.')
  }

  renderOrderSummary();
  renderpaymentSummary();
  updateCartQuantity();
}
loadPage();

export function addUpdateQuantityEventListeners(){
  document.querySelectorAll('.js-update-quantity').forEach((link)=>{
    link.addEventListener('click',()=>{
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
    });
  });
}
export function addSaveQuantityEventListeners() {
  document.querySelectorAll('.js-save-quantity').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      const input = container.querySelector('.quantity-input');
      const newQuantity = Number(input.value);

      if (isNaN(newQuantity) || newQuantity < 0 || newQuantity >= 1000) {
        alert('Please enter a valid quantity between 0 and 999.');
        return;
      }

      updateQuantity(productId,newQuantity);
      renderOrderSummary();
      renderpaymentSummary();
      updateCartQuantity();
    });
  });
  document.querySelectorAll('.quantity-input').forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const productId = input.dataset.productId;
        const saveButton = document.querySelector(`.js-save-quantity[data-product-id="${productId}"]`);
        saveButton.click();
      }
    });
  });
}


/*Promise.all([
  loadProductsFetch(),
new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  })
]).then((values)=>{
  console.log(values);
  renderOrderSummary();
  renderpaymentSummary();
});


/*new Promise((resolve) => {
  loadProducts(() => {
    resolve('value1');
  });

}).then((value) => {
  console.log(value);
  return new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  });

}).then(() => {
  renderOrderSummary();
  renderpaymentSummary();
});

/*loadProducts(() => {
  loadCart(() => {
    renderOrderSummary();
    renderpaymentSummary();
  });
});*/
