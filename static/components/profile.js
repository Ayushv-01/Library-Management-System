export default {
    template:`
    <div>
    <div class="user-photo" style="display: block;
    margin: 20px auto; 
    width: 100px; 
    height: 100px; 
    border-radius: 50%; 
    background-color: #ddd;
    background-image: url('../static/images/user.png'); 
    background-size: cover;"></div>

  
  <div class="user-details" style="text-align: center; margin: 20px auto; width: 80%;">
    <h2>User Details</h2>
    <p><strong>Name:</strong> {{user_data[0].name}}</p>
    <p><strong>Email:</strong> {{user_data[0].email}}</p>
    <p><strong>Role:</strong> {{user_data[0].role}}</p>
    
  </div>
  </div>
    `,
  data (){
        return {
            user_data:[]
        }
    },

    async mounted (){
        try {
            const res = await fetch('/api/user',{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': localStorage.getItem('auth-token')
                }
            })
            const data = await res.json()
            if(res.ok){
                this.user_data = data
                // console.log(this.user_data[0].name)
            }
        }
        catch(error)
        {
            console.log(error)
        }
}
}