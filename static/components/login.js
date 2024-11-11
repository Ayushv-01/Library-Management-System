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
            <label for="username" class="form-label">User Name</label> 
            <input type="text" class="form-control" id="username" v-model="cred.username">
            <label for="user_password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user_password" v-model="cred.password">
            <input type="submit" class="btn btn-primary mt-2" @click="login" value="Login">
            <p class="mt-3">Don't have an account? <router-link to="/register">Register</router-link></p>
             
            
        </div>
        </div>    
    </div>
    </div>`,
    
    data(){
        return {
            cred:{
                username: null,
                password: null,
            },
            error: null
        }
        
    },
    methods:{
        async login(){
            try {
            const res = await fetch('/user-login', {
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
                localStorage.setItem('id',data.id)
                this.$router.push({path:'/'})
            }
            else {
                this.error = data.message
            }
        }
        catch(error){
            console.log(error)
        }
        }
    }
}