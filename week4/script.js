var app = new Vue({
  el: "#app",
  data: {
    uuid: "31e50ae2-761f-42e4-b9da-0c081fdb851d",
    user: {
      email: '',
      password: ''
    },
    errorMessage: '',
    successMessage: ''
  },
  methods: {
    login() {
      const api = `https://course-ec-api.hexschool.io/api/auth/login`;
      const data = {
        email: this.user.email,
        password: this.user.password
      }

      axios.post(api, data).then((response) => {
        this.successMessage = "登入成功，請等待跳轉"

        const token = response.data.token;
        const expired = response.data.expired;
        console.log('rea', response)
        document.cookie = `token=${token}`;
        document.cookie = `expired=${new Date(expired * 1000)}`
        window.location = 'backend.html'




      }).catch((err) => {
        if (err) {
          this.errorMessage = "登入失敗"
          this.password = ''
        }
        console.log('err', err)
      })
    },
    clearMessage() {
      this.errorMessage = ""
      this.successMessage = ""
    }
  }

});