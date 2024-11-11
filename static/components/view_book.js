export default {
    template: `
    <div class="overflow-x-auto rounded-lg " style="background-image: url(../static/images/bokeh-2072271_1280.jpg) ; background-size: cover; height: 100vh;">
    <div class="container mx-auto py-8">
        <center><h1 class="text-2xl font-semibold mb-4">Books</h1>

        </center>
        <div v-if="books.length==0">
        <center><h3 class="text-2xl font-semibold mb-4">No Books to Show!!</h3></center>
        </div>
        <div v-else>
        <center>
        <table class="w-full bg-white border border-gray-200 border-collapse">
            <thead>
                <tr class="bg-gray-100">
                    <th class="py-2 px-4 text-left border border-gray-200">Index</th>
                    <th class="py-2 px-4 text-left border border-gray-200">Title</th>
                    <th class="py-2 px-4 text-left border border-gray-200">Author</th>
                    <th class="py-2 px-4 text-left border border-gray-200">Action</th>
  
                </tr>
            </thead>
            <tbody>
                
                    <tr v-for="(book,index) in books" :key="index">
                        <td class="py-2 px-4 border border-gray-200" >{{index+1}}</td>
                        <td class="py-2 px-4 border border-gray-200" >{{ book.book_name }}</td>
                        <td class="py-2 px-4 border border-gray-200">{{ book.author_name }}</td>
                        <td class="py-2 px-4 border border-gray-200">
                            <router-link :to="'/update_book/' + book.id" type="button" class="btn btn-primary">Edit</router-link>
                            <button @click="deleteBook(book.id)" type="button" class="btn btn-danger">Delete</button>
                          </td>
                    </tr>
                
            </tbody>
        </table>
        <br>
        
    </center>
    </div>
</div>
</div>
    `,
    data(){
        return {
            books:[]
        }
    },

    async mounted(){
        const res = await fetch(`api/books/${this.$route.params.section_id}` ,
    {
        method:"GET",
        headers:{
            'Content-Type': 'application/json',
            'Authentication-token' : localStorage.getItem('auth-token')
        }
    })
    const data = await res.json()
    if (res.ok){
        this.books = data
    }
},
methods:{
    async deleteBook(id){
        try {
        const res = await fetch(`api/books/delete/${id}` ,
        {
            method:"DELETE",
            headers:{
                'Content-Type': 'application/json',
                'Authentication-token' : localStorage.getItem('auth-token')
            }
        })
        const data = await res.json()
        if (res.ok){
            alert('Book deleted successfully')
            window.location.reload()
        }
    } catch(error){
        console.log(error)
    }
}
}
}
