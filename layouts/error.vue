<template>
  <div>
    <div class="container.is-fullhd">
      <div class="card p-6 m-6">
        <div class="columns">
          <div class="column pt-6 is-centered">
            <h1 class="title is-2 is-spaced">Error - <span class="tag is-danger is-light is-large">{{error.statusCode}}</span></h1>
            <template v-if="error.statusCode === 500">
              <h3 class="subtitle is-3">Lo sentimos, ocurrió un error en el servidor.</h3>
            </template>
            <template v-if="error.statusCode === 404">
              <h3 class="subtitle is-3">Lo sentimos, esta pagina no existe o ya no se encuentra disponible.</h3>
            </template>
            <template v-if="error.statusCode === 401">
              <h3 class="subtitle is-3">Lo sentimos, no tienes acceso a este contenido.</h3>
            </template>
            <p><NuxtLink to="/">Volver al inicio</NuxtLink></p>
          </div>
          <div class="column">
            <figure class="image is-16by9">
              <img class="is-rounded" src="https://img.freepik.com/vector-gratis/ilustracion-concepto-fallo-conexion_114360-626.jpg?w=1380&t=st=1665015464~exp=1665016064~hmac=169d0139dfd3572e5745983dbcfbac2c504b484cd25d5e12745f1e8df824a212">
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'error' // you can set a custom layout for the error page
}
</script>

<style>

</style>
