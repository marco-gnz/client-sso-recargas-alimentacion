<template>
  <div>
    <nav class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Funcionarios</p>
          <p class="title">721</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Días de ausentismo</p>
          <p class="title">3.142</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Días a cancelar</p>
          <p class="title">11.758</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Monto total</p>
          <p class="title">$30.540.000</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Último estado</p>
          <span class="tag is-warning is-large">{{recarga.last_estado != null ? recarga.last_estado.estado.nombre : '--'}}</span>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  props:['recarga']
}
</script>

<style>

</style>
