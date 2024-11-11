import librarian_dashboard from "./librarian_dashboard.js"
import user_dashboard from "./user_dashboard.js"

export default  {
    template: `
    <div>
        <user_dashboard v-if="userRole == 'user'"/>
        <librarian_dashboard v-if="userRole == 'admin'"/>
    </div>`,
    data(){
        return {
            userRole: localStorage.getItem('role'),
        }
    },

    components:{
        librarian_dashboard,
        user_dashboard,
    }
}