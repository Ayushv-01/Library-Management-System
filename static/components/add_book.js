export default{
    template:`
    <div class="container-fluid" style="background-image: url(../static/images/bokeh-2072271_1280.jpg) ; background-size: cover; height: 100vh;">
    <div class='d-flex justify-content-center'>
    <div class="mb-3 p-5 bg-light rounded-3 mt-3" style="width: 50%;">
        <div class="container-fluid py-2" >
            <h1 class="h3 mb-3 font-weight-normal text-center mb-5">
                Add Book
            </h1>
            <div class="text-danger">{{message}} </div> 
            <br>
            <form @submit.prevent="addBook" enctype="multipart/form-data">
            <div class="form-group">
                <label for="book_name" class="form-label">Book Name</label> 
                <input type="text" class="form-control" id="book_name" v-model="book_name" required >
                <label for="author_name" class="form-label">Author Name</label>
                <input type="text" class="form-control" id="author_name" v-model="author_name" required>
                <label for="description" class="form-label">Description</label>
                <input type="text" class="form-control" id="description" v-model="description" required >
                <label for="price" class="form-label">Price</label>
                <input type="number" class="form-control" id="price" v-model="price" required >
                </div>
                <div class="form-group mt-2">
                    <label for="file" class="form-label">Upload Book: </label>
                    <input
                      type="file"
                      class="form-control"
                      v-on:change="onFileChange"
                      id="file"
                      accept=".pdf"
                      ref='file'
                      required
                    />
                  </div>
                <button type="submit" class="btn btn-primary form-control mt-3 mb-3" enctype="multipart/form-data">
                  Add Book
                </button>
              </form>
        </div>
    </div>
    </div>
    </div>
    `,
    data(){
        return {
            
                book_name:'',
                author_name:'',
                description:'',
                price:'',
                file:'',
                message:null,
            
        }
    },
    methods:{
        onFileChange(e) {
            this.file = e.target.files[0];
        },
        async addBook() {
            try {
                    let formdata = new FormData();
                    formdata.append('book_name', this.book_name);
                    formdata.append('author_name', this.author_name);
                    formdata.append('description', this.description);
                    formdata.append('price', this.price);
                    formdata.append('file', this.file);
                    
                    // console.log(this.file)
                    const res = await fetch(`/api/books/${this.$route.params.section_id}` , {
                        method:'POST',
                        headers: {
                            'Authentication-token' : localStorage.getItem('auth-token')
                        },
                        body : formdata
                    })

                    const data = await res.json()
                    if (res.ok){
                        alert("Book Added Successfully")
                        this.$router.push({name:'view_section'})
                        this.book_name=null;
                        this.author_name=null;
                        this.description=null;
                        this.price=null;
                    }
                    else {
                        this.message = data.message
                    }

                }catch(error){
                    console.log(error)
                }
    }

}
}