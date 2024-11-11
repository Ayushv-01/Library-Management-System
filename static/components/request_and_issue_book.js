export default {
    template:`
    <div class="overflow-x-auto rounded-lg" style="background-image: url(../static/images/bokeh-2072271_1280.jpg) ; background-size: cover; height: 100vh;">
    <div class="container mx-auto py-8">
        <center><h2 class="text-2xl font-semibold mb-4">Requests</h2></center>

        <center>
            <div v-if="request_book.length==0">
            <h4>No Pending request </h4>
            </div>
            <div v-else>
                <table class="w-full bg-white border border-gray-200 border-collapse">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="py-2 px-4 text-left border border-gray-200">Index</th>
                            <th class="py-2 px-4 text-left border border-gray-200">Book Name</th>
                            <th class="py-2 px-4 text-left border border-gray-200">User Name</th>
                            <th class="py-2 px-4 text-left border border-gray-200">Action</th>
        
                        </tr>
                    </thead>
                    <tbody>
                            <tr v-for="(request,loop) in request_book" :key="loop">
                                <td class="py-2 px-4 border border-gray-200" >{{loop+1}}</td>
                                <td class="py-2 px-4 border border-gray-200" >{{ request.book_name }}</td>
                                <td class="py-2 px-4 border border-gray-200">{{ request.user_name }}</td>
                                <td class="py-2 px-4 border border-gray-200">
                                <a  type="button" class="btn btn-success" @click="approve(request.id)">Approve</a>
                                <a  type="button" class="btn btn-danger" @click="deny(request.id)">Deny</a></td>
                            </tr>
                    </tbody>
                </table>
            </div>

    </center>

    <br>
    <br>

    <center><h2 class="text-2xl font-semibold mb-4">Issued Book</h2></center>

    <br>

    <center>
        <div v-if="issued_book.length==0">
        <h4>No Book Issued </h4>
        </div>
        <div v-else>
                <table class="w-full bg-white border border-gray-200 border-collapse">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="py-2 px-4 text-left border border-gray-200">Index</th>
                            <th class="py-2 px-4 text-left border border-gray-200">Book Name</th>
                            <th class="py-2 px-4 text-left border border-gray-200">User Name</th>
                            <th class="py-2 px-4 text-left border border-gray-200">Issue Date</th>
                            <th class="py-2 px-4 text-left border border-gray-200">Return Date</th>
                            <th class="py-2 px-4 text-left border border-gray-200">Action</th>
        
                        </tr>
                    </thead>
                    <tbody>
                            <tr v-for="(issue,loop) in issued_book" :key="loop">
                                <td class="py-2 px-4 border border-gray-200" >{{loop+1}}</td>
                                <td class="py-2 px-4 border border-gray-200" >{{ issue.book_name }}</td>
                                <td class="py-2 px-4 border border-gray-200">{{ issue.user_name }}</td>
                                <td class="py-2 px-4 border border-gray-200">{{ issue.issue_date }}</td>
                                <td class="py-2 px-4 border border-gray-200">{{ issue.return_date }}</td>
                                <td class="py-2 px-4 border border-gray-200">
                                <a  type="button" class="btn btn-danger" @click="revoke(issue.id)">Revoke</a></td>
                            </tr>
                        
                    </tbody>
                </table>
        </div>
    </center>
<br>
<br>
</div>
</div>
    `,

    data(){
        return {
            request_book:[],
            issued_book:[],
        }
    },

    async mounted (){
        try {
            const res = await fetch('/view_request', {
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token':localStorage.getItem('auth-token')
                }
            })

            const data = await res.json()
            if (res.ok){
                this.request_book = data
                console.log(this.request_book)
            }

            const res2 = await fetch('/view_issue_book', {
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authentication-token':localStorage.getItem('auth-token')
                }})
            const data2 = await res2.json()
            if (res2.ok){
                this.issued_book = data2
                for (let i = 0; i < this.issued_book.length; i++) {
                let issue_date =new Date(this.issued_book[i].issue_date)
                let return_date = new Date(this.issued_book[i].return_date)
                this.issued_book[i].issue_date = issue_date.toISOString().split('T')[0];
                this.issued_book[i].return_date = return_date.toISOString().split('T')[0];
                }
            }
        } 
        catch (error) {
        console.log(error)
        }
    },

    methods:{
        async approve(id){
            try{
                const res = await fetch(`/approve_request/${id}`,{
                    method:'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authentication-token':localStorage.getItem('auth-token')
                    }
                })
                const data = await res.json()
                if (res.ok){
                    alert(data.message)
                    window.location.reload()
                }
                else{
                    alert(data.message)
                }
            }
            catch(error){
                console.log(error)
            }
        },

        async deny(id){
            try{
                const res = await fetch (`/reject_request/${id}`,{
                    method:'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authentication-token':localStorage.getItem('auth-token')
                    }}
                )
                const data = await res.json()
                if (res.ok){
                    alert(data.message)
                    window.location.reload()
                }
                else{
                    alert(data.message)
                }
            }catch(error)
            {console.log(error)}
        },

        async revoke(id){
            try{
                const res = await fetch (`/revoke/${id}`,{
                    method:'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authentication-token':localStorage.getItem('auth-token')
                    }}
                )
                const data = await res.json()
                if (res.ok){
                    alert(data.message)
                    window.location.reload()
                }
                else{
                    alert(data.message)
                }
            }catch(error)
            {console.log(error)}
        }
    }
}
