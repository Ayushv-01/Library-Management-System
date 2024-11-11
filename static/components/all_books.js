export default {
    template: `
    <div class="overflow-x-auto rounded-lg" style="background-image: url(../static/images/bokeh-2072271_1280.jpg) ; background-size: cover; height: 100vh;">
    <div class="container mx-auto py-8">
        
        <center><h1 class="text-2xl font-semibold mb-4">Book List</h1>
        <div v-if="books.length">
            <table class="w-full bg-white border border-gray-200 border-collapse">
                <thead>
                    <tr class="bg-gray-100">
                        <th class="py-2 px-4 text-left border border-gray-200">Index</th>
                        <th class="py-2 px-4 text-left border border-gray-200">Title</th>
                        <th class="py-2 px-4 text-left border border-gray-200">Author</th>
                        <th class="py-2 px-4 text-left border border-gray-200">Section</th>
                        <th class="py-2 px-4 text-left border border-gray-200">Action</th>

                    </tr>
                </thead>
                <tbody>
                
                        <tr v-for="(book,index) in books" :key="index" >
                            <td class="py-2 px-4 border border-gray-200">{{index+1}}</td>
                            <td class="py-2 px-4 border border-gray-200">{{ book.book_name }}</td>
                            <td class="py-2 px-4 border border-gray-200">{{ book.author_name }}</td>
                            <td class="py-2 px-4 border border-gray-200">{{ book.section_name }}</td>
                            <td class="py-2 px-4 border border-gray-200">
                                <span v-if="role=='admin'">
                                <router-link :to="'/read_book/' + book.id" type="button" class="btn btn-success">Read</router-link>
                                </span>
                                <span v-if="role=='user'">
                                <a  type="button" class="btn btn-success" @click="request(book.id)">Request</a>
                                </span>
                                <router-link :to="'/read_feedback/' + book.id"  type="button" class="btn btn-primary">Read Feedback</router-link>
                            </td>
                        </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
        <h4>No book Available </h4>
        </div>
    <br>
</center>
</div>
</div>
    `,

    data (){
        return {
            books:[],
            role: '',
        }
    },

    async mounted(){
        try {
            const user = await fetch ('/api/user', {
                method:'GET',
                headers:{
                    'Authentication-token' : localStorage.getItem('auth-token')
                }
            })
            const userrole = await user.json()
            if (user.ok){
                console.log(userrole)
                this.role = userrole[0].role
            }
            const res = await fetch ('/api/books' ,{
                method:'GET',
                headers:{
                    'Authentication-token' : localStorage.getItem('auth-token')
                }
            })
            const data = await res.json()
            if (res.ok){
                this.books = data
                }
        }
        catch (error){
            console.log(error)
        }
    },

    methods :{
        async request(id){
            try {
                const res = await fetch(`/request/${id}`,{
                    method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    'Authentication-token' : localStorage.getItem('auth-token')
                }
                })
                const data = await res.json()
                if (res.ok){
                    alert('Book Requested Successfully')

                }
                else{
                    alert(data.message)
                }


                }

            catch(error){
                console.log(error)
                }

    }


    }
}