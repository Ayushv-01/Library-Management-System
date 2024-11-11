export default {
    template:`
    <div class="overflow-x-auto rounded-lg" style="background-image: url(../static/images/bokeh-2072271_1280.jpg) ; background-size: cover; height: 100vh;">
    <div class="container mx-auto py-8">
    <div v-if="code!=403">
        <center><h1 class="text-2xl font-semibold mb-4">Sections</h1>
        <div v-if="sections.length">
        <table class="w-full bg-white border border-gray-200">
            <thead>
                <tr class="bg-gray-100">
                    <th class="py-2 px-4 text-left border border-gray-200">Index</th>
                    <th class="py-2 px-4 text-left border border-gray-200">Section Name</th>
                    <th class="py-2 px-4 text-left border border-gray-200">Date Created</th>
                    <th class="py-2 px-4 text-left border border-gray-200">Description</th>
                    <!-- <th class="py-2 px-4 text-left border border-gray-200"></th> -->
                    <th class="py-2 px-4 text-left border border-gray-200">Action</th>
  
                </tr>
            </thead>
            <tbody>
                    <tr v-for="(section,index) in sections" :key="index">
                        <td class="py-2 px-4 border border-gray-200" >{{ index+1 }}</td>
                        <td class="py-2 px-4 border border-gray-200" >{{ section.section_name }}</td>
                        <td class="py-2 px-4 border border-gray-200">{{ section.date_created }}</td>
                        <td class="py-2 px-4 border border-gray-200" style="white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-width: 300px;">{{ section.description }}</td>
                        <td class="py-2 px-4 border border-gray-200">
                          <router-link :to="'/update_section/' + section.id" type="button" class="btn btn-primary">Edit</router-link>
                          <button @click="deleteSection(section.id)" type="button" class="btn btn-danger">Delete</button>
                          <router-link :to="'/add_book/' + section.id" type="button" class="btn btn-success">Add Book</router-link>
                          <router-link :to="'/view_book/' + section.id" type="button" class="btn btn-info">View Books</router-link>
                        </td>
                    </tr>
                
            </tbody>
        </table>
        </div>
        <div v-else>
            <p>No sections found</p>
        </div>
        </center>
    </div>
    <div v-else>
        <center>
        <h1 class="text-2xl font-semibold mb-4">Forbidden</h1>
        <p>You don't have permission to view this page</p>
        </center>
    </div>
    </div>
    </div>
    `,
    data(){
        return {
            sections:[],
            code:'',
        }
    },
    async mounted(){
        try {
            const res = await fetch('/api/sections' ,
            {
                method:'GET',
                headers:{ 
                    'Content-Type': 'application/json',
                    'Authentication-token' : localStorage.getItem('auth-token')
                }
            })
            const data = await res.json()
            if (res.ok){
                this.sections = data
                console.log("Fetched data successfully")
            }
            else{
                this.code = res.status
                console.log('Failed to fetch section',res.status)
            }
            

        }
        catch(error){
            console.log(error)
        }
    },

    methods:{
        async deleteSection(id){
            try {
                const res = await fetch(`/api/sections/${id}` ,{
                    method:'DELETE',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authentication-token' : localStorage.getItem('auth-token')
                    }
                })
                const data = await res.json()
                if (res.ok){
                    this.sections = this.sections.filter(section => section.id !== id)
                    alert("Section Deleted Successfully")
                }
                else{
                  
                    console.log('Failed to delete section',res.status)
                }
            }
            catch (error)
            {
                this.message = error
            }

        }
}
}