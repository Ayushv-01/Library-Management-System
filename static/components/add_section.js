export default {
    template:`
    <div class="container-fluid" style="background-image: url(../static/images/bokeh-2072271_1280.jpg) ; background-size: cover; height: 100vh;">
    <div class='d-flex justify-content-center'>
    <div class="mb-3 p-5 bg-light rounded-3 mt-3" style="width: 50%;">
        <div class="container-fluid py-2" >
            <h1 class="h3 mb-3 font-weight-normal text-center mb-5">
                Add Section
            </h1>
            <div :class="color">{{message}} </div> 
            <br>
            <label for="section_name" class="form-label">Section Name</label> 
            <input type="text" class="form-control" id="section_name" v-model="sec.section_name"  required>
            <label for="description" class="form-label">Description</label>
            <input type="text" class="form-control" id="description" v-model="sec.description" required>
            <input type="submit" class="btn btn-primary mt-2" @click="submit" value="Submit">
            
        </div>
    </div>
    </div>
    </div>
    `,
    data(){
        return {
            sec :{
                section_name:null,
                description:null,
            },
            message:null,
            color:"text-danger",
    }
},

methods:{
    async submit(){
        const res = await fetch('/api/sections' , 
        { 
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authentication-token' : localStorage.getItem('auth-token')
            },
            body : JSON.stringify(this.sec)
        })

        const data = await res.json()
        if (res.ok){
            this.color = "text-success"
            this.message = data.message
            setTimeout(()=>{this.$router.push({path:'/'})},2000)
        }
        else{
            this.message = data.message
        }
}
}
}
