export default {
    template: `
    <div style="background-image: url(../static/images/bokeh-2072271_1280.jpg) ; background-size: cover; height: 100vh;">
    <br>
    <br>
    <div class='d-flex justify-content-center'>
  
    <div class="mb-3 p-5 bg-light rounded-3">
    <div class="text-danger">{{error}} </div>  
        <div class="container-fluid py-5" >
            <h1 class="h3 mb-3 font-weight-normal text-center mb-5">
                Please Login
            </h1>
            <label for="username" class="form-label">Username</label> 
            <input type="text" class="form-control" id="username" v-model="cred.username">
            <label for="user_email" class="form-label">Email address</label> 
            <input type="email" class="form-control" id="user_email" v-model="cred.email">
            <label for="user_password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user_password" v-model="cred.password">
            <input type="submit" class="btn btn-primary mt-2" @click="register" value="Register">
            <p class="mt-3">Already have an account? <router-link to="/login">Login</router-link></p>
        </div>
        </div>    
    </div>
    </div>`,

    data(){
        return{
            cred:{
                username:null,
                email:null,
                password:null,
            },
            error:null,
        }
    },

    methods:{
        async register(){
            const res = await fetch('/user-register', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.cred),
        })
        const data = await res.json()
        if(res.ok){
            localStorage.setItem('auth-token', data.token)
            localStorage.setItem('role', data.role)
            this.$router.push({path:'/'})
        }
        else {
            this.error = data.message
        }
        }

    }
}