export default {
    template:`
    <div class="overflow-x-auto rounded-lg " style="background-image: url(../static/images/bokeh-2072271_1280.jpg) ; background-size: cover; height: 100vh;">
    <div class="container mx-auto py-8">
        <center><h1 class="text-2xl font-semibold mb-4">My Books</h1>
        
            <div v-if="my_book.length==0">
            <h3 class="text-2xl font-semibold mb-4"> You Don't have any Book</h3>
            </div>
            <div v-else>
                <table class="w-full bg-white border border-gray-200 border-collapse">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="py-2 px-4 text-left border border-gray-200">Index</th>
                            <th class="py-2 px-4 text-left border border-gray-200">Title</th>
                            <th class="py-2 px-4 text-left border border-gray-200">Author</th>
                            <th class="py-2 px-4 text-left border border-gray-200">Section</th>
                            <th class="py-2 px-4 text-left border border-gray-200">Return Date</th>
                            <th class="py-2 px-4 text-left border border-gray-200">Action</th>
        
                        </tr>
                    </thead>
                    <tbody>
                            <tr v-for="(book,index) in my_book" :key="index">
                                <td class="py-2 px-4 border border-gray-200" >{{index+1}}</td>
                                <td class="py-2 px-4 border border-gray-200" >{{ book.book_name }}</td>
                                <td class="py-2 px-4 border border-gray-200">{{ book.author }}</td>
                                <td class="py-2 px-4 border border-gray-200">{{ book.section }}</td>
                                <td class="py-2 px-4 border border-gray-200">{{ book.return_date }}</td>
                                <td class="py-2 px-4 border border-gray-200">
                                <router-link :to="'/read_book/' + book.book_id" type="button" class="btn btn-primary">Read</router-link>
                                <router-link :to="'/give_feedback/' + book.book_id" type="button" class="btn btn-success">Give Feedback</router-link>
                                <a  type="button" class="btn btn-danger" @click="return_book(book.book_id)">Return</a>
                                
                                </td>
                            </tr>
                    </tbody>
                </table>
            </div>
        <br>
        
    </center>
</div>
</div>
    `,

    data(){
        return {
            my_book:[],
        }
    },

    async mounted (){
        try{
            const res = await fetch('/my_books',{
                method:'GET',
                headers:{
                    'Authentication-token' : localStorage.getItem('auth-token')
                }
            })
            const data = await res.json()
            if(res.ok){
                this.my_book = data
            }

        }
        catch (error)
        {
            console.log(error)
        }
    },

    methods:{
        async return_book(id){
            try{
                const res = await fetch(`/return/${id}`,{
                    method:'GET',
                    headers:{
                        'Authentication-token' : localStorage.getItem('auth-token')
                    },
                    })
                const data = await res.json()
                if(res.ok){
                    alert(data.message)
                    window.location.reload()
                }
            }
            catch(error){
                console.log(error)

            }
        }
    }
}