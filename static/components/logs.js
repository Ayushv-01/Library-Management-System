export default {
    template:`
    <div  style="background-image: url(../static/images/bokeh-2072271_1280.jpg) ; background-size: cover; height: 100vh;">
    <br>
    <center>
    <h2>Current Status</h2>
    <div v-if="logs.length == 0">
    <h4> No Records Available</h4>
    </div>
    <div v-else>
        <br>
        <table class="w-full bg-white border border-gray-200 border-collapse">
            <thead>
                <tr class="bg-gray-100">
                    <th class="py-2 px-4 text-left border border-gray-200">Index</th>
                    <th class="py-2 px-4 text-left border border-gray-200">User Name</th>
                    <th class="py-2 px-4 text-left border border-gray-200">Book Name</th>
                    <th class="py-2 px-4 text-left border border-gray-200">Date</th>
                    <th class="py-2 px-4 text-left border border-gray-200">Status</th>
  
                </tr>
            </thead>
            <tbody>
                    <tr v-for="(log,index) in logs" :key="index">
                        <td class="py-2 px-4 border border-gray-200" >{{index+1}}</td>
                        <td class="py-2 px-4 border border-gray-200" >{{ log.user_name }}</td>
                        <td class="py-2 px-4 border border-gray-200">{{ log.book_name }}</td>
                        <td class="py-2 px-4 border border-gray-200">{{ log.date }}</td>
                        <td class="py-2 px-4 border border-gray-200">{{ log.status }}</td>
                    </tr>
            
            </tbody>
        </table>
    </div>
        <br>
    </center>
</div>
    `,

    data(){
        return {
            logs:[]
        }
    },

    async mounted (){
        try{
            const res = await fetch('/logs',{
                method:'GET',
                headers:{
                    'Authentication-token' : localStorage.getItem('auth-token')
                }
            })
            const data = await res.json()
            if(res.ok){
                this.logs = data
            }
        }
        catch (error){
            console.log(error)
        }    
}
}