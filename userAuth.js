function login() {
    const loginUrl = "http://localhost:5000/auth/login"
    const axios = require("axios");
    const userElement = document.getElementById('username');
    const passwordElement = document.getElementById('password');
    let tokenElement;
    const email = userElement.value;
    const password = passwordElement.value;
    
    let data = {
        Email: email.toLowerCase(),
        Password: password
    }
    axios
        .post("http://localhost:3001/user/authenticate", data)
        .then(res => {
            console.log('res', res);
            if (res.data.token) {
                tokenElement = res.data.token;
                companyId = res.data.dado.companyId;
                window.location.href = "index.html";
                window.localStorage.setItem('token', tokenElement);
                window.localStorage.setItem('companyId', companyId);
                window.localStorage.setItem('user', JSON.stringify(res.data.dado))

            } else {
                window.location.href = "unauthorized.html";
            }
        }, err => {
            console.log(err);
        });
}