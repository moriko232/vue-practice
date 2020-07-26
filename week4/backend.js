var app = new Vue({
  el: "#app",
  data: {
    uuid: "31e50ae2-761f-42e4-b9da-0c081fdb851d",
    token: '',
    baseUrl: 'https://course-ec-api.hexschool.io/api/',
    pagination: {
      current_page:1
    },
    tempDelete: {
      id: '',
      title: ''
    },
    shopDatas: [],
    baseData: {
      imageUrl: [],
    },
    tempData: {
      imageUrl: [],
    }
  },
  created() {
    this.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    //token不存在則導回登入畫面
    if (this.token === "") {
      console.log(document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1"))
      window.location = 'index.html';
    } else {
      this.getData();
    }
  },
  methods: {
    //pagenation
    emitPages(val) {
      console.log('nav', val)

    },

    //登出
    logOut() {
      this.deleteCookie('token')
      this.deleteCookie('expired')
      window.location = 'index.html';
    },
    deleteCookie(name, path, domain) {
      if (this.getCookie(name)) {
        document.cookie = name + "=" +
          ((path) ? ";path=" + path : "") +
          ((domain) ? ";domain=" + domain : "") +
          ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
      }
    },
    getCookie(name) {
      return document.cookie.split(';').some(c => {
        return c.trim().startsWith(name + '=');
      });
    },

    //取得資料 api
    getData(page = 1) {
      const api = `${this.baseUrl}${this.uuid}/admin/ec/products?page=${page}`
      axios.defaults.headers[
        "Authorization"
      ] = `Bearer ${this.token}`;

      axios.get(api).then((response) => {
        console.log(response)
        this.shopDatas = response.data.data
        this.pagination = response.data.meta.pagination;
      }).catch((err) => {
        console.log('err ', err)
      })
    },
    //新增+編輯資料
    updateData() {
      //update data
      if (this.tempData.id) {
        this.apiEditData(this.tempData.id)
        this.shopDatas.forEach((shopData, idx) => {
          if (this.tempData.id === shopData.id) {
            this.shopDatas[idx] = this.tempData;
          }
        });
      } else {
        //new data
        const id = new Date().getTime(); // Unix Timestamp
        this.tempData.id = id;
        this.shopDatas.push(this.tempData);
        this.apiAddNewData(this.tempData)
      }
      //產品表單回復空值
      this.tempData = JSON.parse(JSON.stringify(this.baseData));
      $("#editModal").modal("hide");
    },

    //編輯資料
    editData(data = this.baseData) {
      this.tempData = JSON.parse(JSON.stringify(data));
      $("#editModal").modal("show");
    },
    //編輯資料api
    apiEditData(id) {
      const url = `${this.baseUrl}${this.uuid}/admin/ec/product/${id}`;
      axios.defaults.headers[
        "Authorization"
      ] = `Bearer ${this.token}`;
      axios.patch(url, this.tempData).then((response) => {
        // console.log(response)
        this.getData();
      }).catch((err) => {
        console.log(err)
      })
    },
    //新增資料api
    apiAddNewData(data) {
      console.log('new', data)
      const url = `${this.baseUrl}${this.uuid}/admin/ec/product`;
      axios.defaults.headers[
        "Authorization"
      ] = `Bearer ${this.token}`;
      axios.post(url, data).then((response) => {
        // console.log(response)
        this.getData();
      }).catch((err) => {
        console.log(err)
      })
    },

    deleteQA(id, title) {
      this.tempDelete.id = id
      this.tempDelete.title = title
      $("#deleteModal").modal("show");
    },
    deleteData() {
      const id = this.tempDelete.id
      this.apiDeleteData(id)
      //update screen
      this.shopDatas.forEach((shopData, idx) => {
        if (shopData.id === id) {
          this.shopDatas.splice(idx, 1);
        }
      });
      this.tempDelete.id = ''
      this.tempDelete.title = ''
      $("#deleteModal").modal("hide");
    },
    apiDeleteData(id) {
      //api
      const url = `${this.baseUrl}${this.uuid}/admin/ec/product/${id}`
      axios.defaults.headers[
        "Authorization"
      ] = `Bearer ${this.token}`;
      axios.delete(url).then(function (response) {
        // console.log(response)
        this.getData();
      }).catch((err) => {
        console.log(err)
      })
    }
  }
});