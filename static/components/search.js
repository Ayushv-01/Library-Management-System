export default {
    template:`
    <div style="background-image: url(../static/images/bokeh-2072271_1280.jpg) ; background-size: cover; height: 100vh;">
    <div class="row justify-content-center">
      <div class="col-md-10">
      <br>
      <br>
        <div class="input-group mb-3">
        <center>
            <label for='section' class="form-label">Section</label>
            <select class="px-2 py-1 ml-2 border border-gray-300 rounded" id="section" v-model="sec">
                <option v-for="section in sections" :value="section.id">{{section.section_name}}</option>
            </select>
            <input type="text" class="px-2 py-1 ml-2 border border-gray-300 rounded" placeholder="Search by Book Name" v-model="book_name">
            <input type="text" class="px-2 py-1 ml-2 border border-gray-300 rounded" placeholder="Search by Author Name" v-model="author_name">
            <div class="input-group-append">
            <button class="btn btn-secondary" type="button" @click="search">Search</button>
            </div>
        </center>
          </div>
        
          <div v-if="searchresult.length">
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
              
                      <tr v-for="(book,index) in searchresult" :key="index" >
                          <td class="py-2 px-4 border border-gray-200">{{index+1}}</td>
                          <td class="py-2 px-4 border border-gray-200">{{ searchresult[index].book_name }}</td>
                          <td class="py-2 px-4 border border-gray-200">{{ searchresult[index].author_name }}</td>
                          <td class="py-2 px-4 border border-gray-200">{{ searchresult[index].section }}</td>
                          <td class="py-2 px-4 border border-gray-200">
                              <span v-if="role=='admin'">
                              <router-link :to="'/read_book/' + searchresult.id" type="button" class="btn btn-success">Read</router-link>
                              </span>
                              <span v-if="role=='user'">
                              <a  type="button" class="btn btn-success" @click="request(searchresult.id)">Request</a>
                              </span>
                              <router-link :to="'/read_feedback/' + searchresult.id"  type="button" class="btn btn-primary">Read Feedback</router-link>
                          </td>
                      </tr>
              </tbody>
          </table>
      </div>
      <div v-else-if="click">
      <h4>No Match Found </h4>
      </div>

        </div>
        </div>
        </div>
        </div>
    `,

    data(){
        return {
            book_name:'',
            author_name:'',
            sec:'',
            sections:[],
            searchresult:[],
            click:false
        }
    },

    async mounted(){
        try {
            const res = await fetch ('/all_sections', {
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

    methods:{
        async search(){
            this.click = true
            const queryparam = new URLSearchParams({
                book_name:this.book_name,
                author_name:this.author_name,
                section:this.sec
            }).toString();

            try{
                const res2 = await fetch(`/search?${queryparam}` ,{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authentication-token': localStorage.getItem('auth-token')
                    }
                })
                const data = await res2.json()
                if (res2.ok){
                   this.searchresult = data
                }
                else{
                    console.log(data.message)
                }
            }
            catch (error)
            {
                console.log(error)
            }
    }
    }
}