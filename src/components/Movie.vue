<template>
  <div class="card">
    <img :src="$myGlobalVariable + image" class="card-img-top" :alt="name"
      style="height: 150px; object-fit: cover;">
    <div class="card-body">
      <h5 class="card-title" v-html="name"></h5>
      <p class="card-text" v-html="description"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Movie',
  props: {
    id: Number,
    name: String,
    image: String,
    description: String
  }
}
</script>