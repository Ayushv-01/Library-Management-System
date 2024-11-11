export default {
    template: `
    <div class="container-fluid" style="background-image: url(../static/images/bokeh-2072271_1280.jpg) ; background-size: cover; height: 100vh;">
    <div class='d-flex justify-content-center'>
    <div class="mb-3 p-5 bg-light rounded-3 mt-3" style="width: 50%;">
        <div class="container-fluid py-2" >
            <h1 class="h3 mb-3 font-weight-normal text-center mb-5">
                Update Book
            </h1>
            <div class="text-danger">{{message}} </div> 
            <br>
            <form @submit.prevent="updateBook" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="book_name" class="form-label">Book Name</label> 
                    <input type="text" class="form-control" id="book_name" v-model="book_name" >
                    <label for="author_name" class="form-label">Author Name</label>
                    <input type="text" class="form-control" id="author_name" v-model="author_name" >
                    <label for="description" class="form-label">Description</label>
                    <input type="text" class="form-control" id="description" v-model="description" >
                    <label for="price" class="form-label">Price</label>
                    <input type="number" class="form-control" id="price" v-model="price" >
                    <label for='section' class="form-label">Section</label>
                    <select class="form-control" id="section" v-model="sec">
                        <option v-for="section in sections" :value="section.id">{{section.section_name}}</option>
                    </select>
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
                        />
                </div>
                <button type="submit" class="btn btn-primary form-control mt-3 mb-3" enctype="multipart/form-data">
                  Update Book
                </button>
              </form>
        </div>
    </div>
    </div>
    </div>
    `,

    data() {
        return {
            book_name: '',
            author_name: '',
            description: '',
            price: '',
            file: '',
            sec:'',
            message: null,
            sections: []
        }
    },
    async mounted(){
        try {
            const res = await fetch ('/api/sections', {
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token': localStorage.getItem('auth-token')
                }
            })
            const section = await res.json()
            if ( res.ok){
                this.sections = section
            }
        }
        catch (error){
            console.log(error)
        }
    },

    methods: {
        onFileChange(e) {
            this.file = e.target.files[0];
        },
        async updateBook() {
            try {
                const formData = new FormData();
                formData.append('book_name', this.book_name);
                formData.append('author_name', this.author_name);
                formData.append('description', this.description);
                formData.append('price', this.price);
                formData.append('section', this.sec);
                formData.append('file', this.file);
                                  
                const res = await fetch ( `api/books/update/${this.$route.params.book_id}` , {
                    method: 'PUT',
                    headers:{
                        'Authentication-token' : localStorage.getItem('auth-token')
                    },
                    body: formData })
                
                    const data = await res.json()

                    if (res.ok){
                        alert ( "Book updated successfully" )
                        this.book ="",
                        this.author_name ="",
                        this.description ="",
                        this.price ="",
                        this.section ="",
                        this.file =""
                        this.$router.push({name: 'view_section'})
                    }
                    else{
                        this.message = data.message
                    }

                }
                catch ( error){
                    console.log(error)
                }
            }
        }
    }