<template>
  <div class="container mt-4">
      
      <div v-if="movies.length > 0" class="row">
        <div v-for="movie in movies" :key="movie.id" class="col-md-4">
          <Movie class="mb-4" :id="movie.id" :name="movie.name" :description="movie.description" :image="movie.image" />
        </div>
      </div>
  </div>
</template>

<script>
import Movie from '@/components/Movie.vue';
import axios from 'axios';

export default {
  name: 'Home',
  components: {
    Movie
  },
  data() {
    return {
      movies:[]
    }
  },
  mounted() {
    this.getMovies();
  },
  methods: {
    async getMovies() {
      await axios.get('movies').then((res) => {
        if (res.data.status == "success") {
          this.movies = res.data.message;
        }
      })
    }
  }
}
</script>
