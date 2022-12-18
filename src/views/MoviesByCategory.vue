<template>
  <div class="container">
      <form @submit.prevent="getMovies(category_id)" class="row justify-content-center my-4">
          <div class="col-md-4">
            <select v-model="category_id" class="form-control">
                <option value="">Select Category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
            </select>
          </div>
          
          <div class="col-md-8 text-center">
            <button :disabled="loading" class="btn btn-success">Get Movies</button>
            <button v-if="category_id" type="button" class="btn mx-2 btn-info"
            data-bs-toggle="modal" @click="showActionModal('edit')" data-bs-target="#exampleModal">Edit</button>
            <button type="button" @click="deleteCategory()" v-if="category_id" class="btn btn-danger">delete</button>
            <button type="button" class="btn mx-2 btn-primary"
             data-bs-toggle="modal" @click="showActionModal('add')" data-bs-target="#exampleModal">
              Add Category
            </button>
            <button type="button" @click="showMovieForm = !showMovieForm" v-if="category_id" class="btn btn-primary">Add Movie</button>
          </div>
      </form>
        
        <form @submit.prevent="addMovie()" class="row" v-if="showMovieForm">
          <div v-if="success" v-html="success" class="text-center mb-2 text-success"></div>
          <div class="mb-3 col-md-4">
            <label for="nameMovie">Name</label>
            <input class="form-control" :class="errorsMovie.name ? 'is-invalid' : ''" id="nameMovie" placeholder="Enter your name"
              v-model="formMovie.name" />
            <div v-if="errorsMovie.name" class="text-danger">
              {{ errorsMovie.name[0] }}
            </div>
          </div>
          <div class="mb-3 col-md-4">
            <label for="description">description</label>
            <input class="form-control" :class="errorsMovie.description ? 'is-invalid' : ''" id="description" placeholder="Enter your description"
              v-model="formMovie.description" />
            <div v-if="errorsMovie.description" class="text-danger">
              {{ errorsMovie.description[0] }}
            </div>
          </div>
          <div class="mb-3 col-md-4">
              <label for="image">image</label>
              <input @change="handleImageUpload()"
               accept="image/x-png,image/gif,image/jpeg,image/jpg" ref="image" type="file"
                id="image" class="form-control"
                :class="{ 'is-invalid': errorsMovie.image}" />
              <div v-if="errorsMovie.image" class="text-danger">
                {{ errorsMovie.image[0] }}
              </div>
          </div>
          <div class="mb-3 text-center">
            <button class="btn btn-primary px-5">add</button>
          </div>
      </form>

      <hr />

      <div v-if="movies.length > 0" class="row">
        <div v-for="movie in movies" :key="movie.id" class="col-md-4">
          <Movie class="mb-4" :id="movie.id" :name="movie.name" :description="movie.description" :image="movie.image" />
        </div>
      </div>
      <div v-else class="text-center text-danger">No data Found</div>



    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {{ action == 'add' ? "Add New Category" : "Edit Category " + form.name }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <form @submit.prevent="action == 'add' ? addCategoy() : editCategoy()">
                <div v-if="success" v-html="success" class="text-center mb-2 text-success"></div>
                <div class="mb-3">
                  <label for="name">Name</label>
                  <input class="form-control" :class="errors.name ? 'is-invalid' : ''" id="name" placeholder="Enter your name"
                    v-model="form.name" />
                  <div v-if="errors.name" class="text-danger">
                    {{ errors.name[0] }}
                  </div>
                </div>
                <div class="mb-3 text-center">
                  <button class="btn btn-primary px-5">{{ action }}</button>
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Movie from '@/components/Movie.vue';
import axios from 'axios';

export default {
  name: 'MoviesByCategory',
  components: {
    Movie
  },
  data() {
    return {
      categories: [],
      movies: [],
      category_id: "",
      loading: false,
      action: "",
      form: {
        id:"",
        name: ""
      },
      errors: [],
      success: "",
      showMovieForm: false,
      errorsMovie: [],
      formMovie: {
        name: "",
        description: "",
        image: "",
        category_id:""
      }
    }
  },
  mounted() {
    this.getCategoies();
  },
  methods: {
    async getCategoies() {
      await axios.get('category').then((res) => {
        if (res.data.status == "success") {
          this.categories = res.data.message;
        }
      })
    },
    async getMovies(cat_id) {
      if (cat_id) {
        this.loading = true;
        await axios.get('moviesByCategory/' + cat_id)
          .then((res) => {
            if (res.data.status == "success") {
              this.movies = res.data.message;
            }
          }).finally(() => {
            this.loading = false;
          }) 
      }
    },
    showActionModal(action) {
      this.action = action;
      this.success = "";
      this.errors = [];
      this.form = {
        id: "",
        name: ""
      }
      this.categories.filter((category) => {
        if (action == 'edit' && category.id == this.category_id) {
          this.form = {
            id: category.id,
            name: category.name
          }          
        }
        }, false);
    },
    async addCategoy() {
      this.errors = [];
      this.success = "";
      await axios.post('category', this.form)
        .then((response) => {
          if (response.data.status && response.data.status == 'failed') {
            this.errors = response.data.message;
          } else if (response.data.status == "success") {
            this.getCategoies();
            this.success = "Added successfully";
            this.formMovie = {
              name: "",
            }
          }
        })
    },
    async editCategoy() {
      this.errors = [];
      this.success = "";
      await axios.put('category/' + this.form.id, this.form)
        .then((response) => {
          if (response.data.status && response.data.status == 'failed') {
            this.errors = response.data.message;
          } else if (response.data.status == "success") {
            this.getCategoies();
            this.formMovie = {
              name: "",
            }
            this.success = "updated successfully";
          }
        })
    },
    async deleteCategory() {
      await axios.delete('category/' + this.category_id).then(() => { 
        this.category_id = '';
        this.getCategoies();
      })

    },
    async addMovie() {
      this.errorsMovie = [];
      this.formMovie.category_id = this.category_id;
      await axios.post('movies', this.formMovie, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((response) => {
          if (response.data.status && response.data.status == 'failed') {
            this.errorsMovie = response.data.message;
          } else if (response.data.status == "success") {
            this.getMovies(this.category_id);
            this.formMovie = {
              name: "",
              description: "",
            }
          }
        })
    },
    handleImageUpload() {
      let image = this.$refs.image.files;
      if (image.length > 0) {
        this.formMovie.image = image[0];
      } else {
        this.formMovie.image = "";
      }
      console.log(this.formMovie.image);
    },
  }
}
</script>
