<template>
  <div>
    <section class="hero pt-5">
      <div class="hero-body">
        <p class="title">
          {{title}}
        </p>
        <p class="subtitle">
          {{subtitle}}
        </p>
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
