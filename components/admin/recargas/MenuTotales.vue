<template>
  <div>
    <nav class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Días en mes</p>
          <p class="title">{{recarga.total_dias_mes}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Días hábiles</p>
          <p class="title">{{recarga.total_dias_habiles}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Monto día</p>
          <p class="title">{{`$${Intl.NumberFormat('de-DE').format(recarga.monto_dia)}`}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Funcionarios</p>
          <p class="title">{{recarga.users_count}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Monto total</p>
          <p class="title">{{recarga.monto_total}}</p>
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
