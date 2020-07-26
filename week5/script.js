import zh from './zh_TW.js';

// VeeValidate語系包
VeeValidate.localize('tw', zh);

// VeeValidate custom class
VeeValidate.configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  }
});

Vue.component('ValidationProvider', VeeValidate.ValidationProvider);

Vue.component('ValidationObserver', VeeValidate.ValidationObserver);

//Loading
Vue.use(VueLoading);
Vue.component('loading', VueLoading);

const uuid = "31e50ae2-761f-42e4-b9da-0c081fdb851d";
const getProductUrl = `https://course-ec-api.hexschool.io/api/${uuid}/ec/products`;
const editShopCartUrl = `https://course-ec-api.hexschool.io/api/${uuid}/ec/shopping`;
const editShopCartAllUrl = `https://course-ec-api.hexschool.io/api/${uuid}/ec/shopping/all/product`;
const sendOrderUrl = `https://course-ec-api.hexschool.io/api/${uuid}/ec/orders`;


var app = new Vue({
  el: "#app",
  data: {
    isLoading: false,
    products: [],
    shopCart: [],
    customer: {
      name: '',
      email: '',
      tel: '',
      address: '',
      payment: 'WebATM',
      message: ''
    },
    messageModelOpen: false,
    messageText: '',
  },
  mounted() {
    this.getDataApi()
    this.getShopCartApi()
  },
  computed: {
    total() {
      let sum = 0
      this.shopCart.forEach((item) => {
        sum += (item.product.price * item.quantity)
      })
      return sum
    }
  },
  methods: {
    openMessage(msg) {
      this.messageText = msg
      $("#messageModal").modal("show");
      this.messageModelOpen = true
    },
    closeMessage() {
      this.messageText = ''
      $("#messageModal").modal("hide");
      this.messageModelOpen = false
    },
    sendOrderApi() {
      this.isLoading = true
      axios
        .post(sendOrderUrl, this.customer)
        .then((res) => {
          this.getShopCartApi()
          this.shopCart = [];
          this.isLoading = false
          this.openMessage('已收到您的訂單!')
        })
        .catch(function (err) {
          console.log("err", err);
        });
    },
    getShopCartApi() {
      axios
        .get(editShopCartUrl)
        .then((res) => {
          this.shopCart = res.data.data;
        })
        .catch(function (err) {
          console.log("err", err);
        });
    },
    isAlreadyInCart(id) {
      return this.shopCart.findIndex((item) => {
        return item.id === id
      })
    },
    deleteCartAll() {
      this.isLoading = true
      axios
        .delete(editShopCartAllUrl)
        .then((res) => {
          this.shopCart = res.data.data;
          this.getDataApi()
          this.getShopCartApi()
          this.isLoading = false;
        })
    },
    deleteCartItem(id) {
      this.isLoading = true
      const data = {
        product: id
      }
      axios
        .delete(`${editShopCartUrl}/${id}`)
        .then((res) => {
          this.shopCart = res.data.data;
          this.getDataApi()
          this.getShopCartApi()
          this.isLoading = false;
        })
    },
    editCart(id, quantity = 1) {
      this.isLoading = true
      const data = {
        product: id,
        quantity: quantity
      }
      axios
        .patch(editShopCartUrl, data)
        .then((res) => {
          this.shopCart = res.data.data;

          this.getDataApi()
          this.getShopCartApi()
          this.isLoading = false;
        })
        .catch(function (err) {
          console.log("err", err);
        });
    },
    addToCart(item, quantity = 1) {
      this.isLoading = true
      const data = {
        product: item.id,
        quantity: quantity
      }
      axios
        .post(editShopCartUrl, data)
        .then((res) => {
          this.shopCart = res.data.data;

          this.getDataApi()
          this.getShopCartApi()
          this.isLoading = false;
        })
        .catch(function (err) {
          console.log("err", err);
        });


    },
    getDataApi() {
      axios
        .get(getProductUrl)
        .then((res) => {
          this.products = res.data.data;
        })
        .catch(function (err) {
          console.log("err", err);
        });
    },
  },
})