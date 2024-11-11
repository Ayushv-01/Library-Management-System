export default {
    template: `
    <div class="container mt-3">
        <div v-if="feedback.length ==0">
        <h3>No feedback Available</h3>
        </div>
        <div v-else>
        <h3>Book Feedback:</h3>
        <br><br>
        <ul v-for="feed in feedback">
                <li> <h5>{{ feed.feedback }} </h5></li>
        </ul>
        </div>
    </div>
    `,
    data (){
        return {
            feedback:[]
        }
    },

    async mounted(){
        try {
            const res = await fetch(`/read_feedback/${this.$route.params.book_id}` , {
                method:'GET',
                headers:{
                    'Authentication-token' : localStorage.getItem('auth-token') 
                }})
            const data = await res.json()
            if (res.ok){
                this.feedback = data
            }
        }
        catch (error){
            console.log(error)
        }
    }
}   