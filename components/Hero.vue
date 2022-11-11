<template>
  <div>
    <section class="hero bd-hero bd-is-basic pt-5">
      <div class="hero-body">
        <div class="container">
          <div class="bd-hero-heading">
            <h1 class="title algolia-lvl0">{{title}}</h1>
            <div class="subtitle is-4 algolia-lvl1">
              <p>{{subtitle}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props:['title', 'subtitle']
}
</script>

<style>

</style>
