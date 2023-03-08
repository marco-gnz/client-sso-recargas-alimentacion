<template>
  <div>
    <nav class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Días mes ausentismos</p>
          <p class="title">{{recarga.total_dias_mes_calculo}}/{{recarga.total_dias_habiles_calculo}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Días mes beneficio</p>
          <p class="title">{{recarga.total_dias_mes_beneficio}}/{{recarga.total_dias_habiles_beneficio}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Monto día/estimado</p>
          <p class="title">{{recarga.monto_dia}} / {{recarga.monto_estimado_no_turnante_format}}</p>
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
          <p class="title">$0</p>
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
