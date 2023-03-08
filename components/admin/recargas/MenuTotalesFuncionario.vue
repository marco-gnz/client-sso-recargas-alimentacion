<template>
  <div>
    <nav class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Turnante</p>
          <p class="title">{{funcionario.es_turnante ? 'SI' : 'NO'}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Días de ausentismo</p>
          <p class="title">0</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Días de ajustes</p>
          <p class="title">0</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Total ajustes</p>
          <p class="title">$0</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Días a cancelar</p>
          <p class="title">0</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Monto a pagar</p>
          <p class="title">$0</p>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  computed:{
    ...mapGetters({
      funcionario:'recargas/funcionario/funcionario',
    })
  }
}
</script>

<style>

</style>
