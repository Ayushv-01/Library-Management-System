export default {
    template:`
    <div class="form-group">
      
      <label for="section_name" class="form-label">Section Name</label> 
      <input type="text" class="form-control" style="width: 50%; padding-left: 10px;" id="section_name" v-model="feed.feedback_text"  required>
    
      <button type="submit" class="btn btn-primary" @click="submit">Submit Feedback</button>
    </div>
    `,
    data(){
        return {
            feed:{
            feedback_text: '',
            }
        }
    },

    methods:{
        async submit(){
            const res = await fetch(`/give_feedback/${this.$route.params.book_id}` , {
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token' : localStorage.getItem('auth-token')
                },
                body : JSON.stringify(this.feed)
            })
            const data = await res.json()
            if (res.ok){
                alert(data.message)
                this.$router.push({path:'/my_books'})
            }
            else{
                alert(data.message)
                this.$router.push({path:'/my_books'})
            }
        }
    }
}