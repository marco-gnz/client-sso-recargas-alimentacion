<template>
  <div>
    <!-- <Hero /> -->
    <div class="container.is-fullhd">
      <!-- <Content /> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  middleware: 'auth',
  head(){
    return{
      title:'Inicio'
    };
  }
}
</script>
