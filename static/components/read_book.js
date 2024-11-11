export default {
    template:`
    <div>
    <center>
    <div>
    <h1 class="text-danger">{{message}}</h1>
    <canvas id="pdf-canvas" style="border: 2px solid #ddd;"></canvas>
    </div>
    <br>
    <div class="btn-group" role="group" aria-label="PDF Navigation">
      <button type="button" class="btn btn-primary" @click="prevPage">Previous Page</button>
      <span class="btn btn-secondary">Page {{ pageNum }}</span>
      <button type="button" class="btn btn-primary" @click="nextPage">Next Page</button>
    </div>
    <br>
    </center>
  </div>
`,

data() {
    return {
      pdfDoc: null,
      pageNum: 1,
      currentRole: '',
      message: ''
    }
  },
  mounted() {
    this.loadPDF(); // Load PDF when component is mounted
  },
  methods: {
    async renderPage(num) {
      try {
        const page = await this.pdfDoc.getPage(num);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.getElementById('pdf-canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        };
  
        await page.render(renderContext).promise;
        this.pageNum = num;
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    },
    async loadPDF() {
      try {
        const bookId = this.$route.params.book_id; // Replace 123 with the actual book ID you want to fetch
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
  
        const response = await fetch(`/read_book/${bookId}`, {
          method: 'GET',
          headers: {
            'Authentication-token': localStorage.getItem('auth-token')
          }
        });
        if (response.status==403){
            this.message="Forbidden to read this book"
        }
        else {
        const data = await response.arrayBuffer();
        const uint8Array = new Uint8Array(data);
        this.pdfDoc = await pdfjsLib.getDocument(uint8Array).promise;
        await this.renderPage(1); }
      } catch (error) {
        this.message = error;
        console.error('Error loading PDF:', error);
      }
    },
    nextPage() {
      if (this.pageNum < this.pdfDoc.numPages) {
        this.pageNum++;
        this.renderPage(this.pageNum);
      }
    },
    prevPage() {
      if (this.pageNum > 1) {
        this.pageNum--;
        this.renderPage(this.pageNum);
      }
    }
  }
}
