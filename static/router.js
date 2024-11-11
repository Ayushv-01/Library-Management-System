import home from './components/home.js'
import login from './components/login.js'
import register from './components/register.js' 
import add_section from './components/add_section.js'
import view_section from './components/view_section.js'
import add_book from './components/add_book.js'
import update_section from './components/update_section.js'
import update_book from './components/update_book.js'
import view_book from './components/view_book.js'
import all_books from './components/all_books.js'
import request_and_issue_book from './components/request_and_issue_book.js'
import unauthorized from './components/unauthorized.js'
import my_books from './components/my_books.js'
import read_book from './components/read_book.js'
import give_feedback from './components/give_feedback.js'
import read_feedback from './components/read_feedback.js'
import logs from './components/logs.js'
import all_logs from './components/all_logs.js'
import profile from './components/profile.js'
import search from './components/search.js'
import Not_found_page from './components/Not_found_page.js'

const routes = [
    { path:'/' , component : home },
    { path:'/login', component: login , name:'login'},
    { path:'/register', component: register, name:'register'},
    { path:'/add_section' , component: add_section , name:'add_section' , meta: { requiresAuth: true ,role:'admin'}},
    { path:'/view_section' , component: view_section , name:'view_section' },
    { path: '/add_book/:section_id', component: add_book , name:'add_book' , meta: { requiresAuth: true ,role:'admin'}},
    { path: '/update_section/:section_id', component: update_section , name:'update_section' ,meta: { requiresAuth: true ,role:'admin'}},
    { path: '/update_book/:book_id', component: update_book , name:'update_book' , meta: { requiresAuth: true ,role:'admin'}},
    { path: '/view_book/:section_id', component: view_book , name:'view_book' ,meta: { requiresAuth: true ,role:'admin'}},
    { path: '/all_books', component: all_books , name:'all_books'},
    { path: '/request_and_issue_book', component: request_and_issue_book , name:'request_and_issue_book' , meta: { requiresAuth: true ,role:'admin'}},
    { path: '/unauthorized', component: unauthorized , name:'unauthorized'},
    { path: '/my_books' , component: my_books ,name:'my_books' , meta: { requiresAuth: true ,role:'user'}},
    { path: '/read_book/:book_id', component: read_book , name:'read_book' },
    { path: '/give_feedback/:book_id', component: give_feedback , name:'give_feedback', meta: { requiresAuth: true ,role:'user'}},
    { path: '/read_feedback/:book_id', component: read_feedback , name:'read_feedback' },
    { path: '/logs' , component: logs , name:'logs' , meta :{ requiresAuth: true ,role:'user'}},
    { path: '/all_logs' , component: all_logs , name:'all_logs' , meta: { requiresAuth: true ,role:'admin'}},
    { path: '/profile' , component: profile , name:'profile'},
    { path: '/search' , component: search , name: 'search'},
    { path: '/404_page' , component: Not_found_page , name:'404_page'}
] 

export default new VueRouter({
    routes,
})