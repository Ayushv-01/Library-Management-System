export default {
    template:`
    <div class="container-fluid" style="background-image: url(../static/images/bokeh-2072271_1280.jpg) ; background-size: cover; height: 100vh;">
    <div class="row">
      <div class="col-sm-6 mt-5">
        <div class="card">
          <div class="card-header text-center" style="background-color: #F5B7B1;"><h5>Add Section</h5></div>
          <div class="card-body">
            <p class="card-text">You can Add Mutliple Sections.</p>
            <router-link to="/add_section" class="btn btn-secondary">Click to Add Section</router-link>
          </div>
        </div>
      </div>
      <div class="col-sm-6 mt-5">
        <div class="card">
          <div class="card-header text-center" style="background-color: #F5B7B1;"><h5>View Section</h5></div>
          <div class="card-body">
            <p class="card-text">You can view created section and add books in it. You can also edit and delete section from here and also delete and edit books from here</p>
            <router-link to="/view_section" class="btn btn-secondary">Click to View Section</router-link>
          </div>
        </div>
      </div>
    </div>
    <div><br></div>
    <div class="row">
      <div class="col-sm-6">
        <div class="card">
          <div class="card-header text-center" style="background-color: #F5B7B1;"><h5>Requests And Issued Book</h5></div>
          <div class="card-body">
            <p class="card-text">You can see the requested books and issued books here.</p>
            <router-link to="/request_and_issue_book" class="btn btn-secondary">Click to View Request</router-link>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card">
          <div class="card-header text-center" style="background-color: #F5B7B1;"><h5>All Books</h5></div>
          <div class="card-body">
            <p class="card-text">You can view all the books in one Shot here and read feedbacks given by users.</p>
            <router-link to="/all_books" class="btn btn-secondary">Click to view all Books</router-link>
          </div>
        </div>
      </div>
    </div>
    
    </div>
    
    </div>`,
}