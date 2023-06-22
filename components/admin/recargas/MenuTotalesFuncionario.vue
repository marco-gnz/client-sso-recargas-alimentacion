<template>
  <div>
    <nav class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Beneficio</p>
          <p class="title">{{esquema.beneficio ? 'Si' : 'No'}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Turno</p>
          <p class="title">{{esquema.es_turnante_nombre}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Días contrato</p>
          <p class="title">{{esquema.total_dias_contrato}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Días descuento</p>
          <p class="title">{{esquema.total_descuento}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Total ajustes</p>
          <p class="title">{{esquema.total_monto_ajuste}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Días a cancelar</p>
          <p class="title">{{esquema.total_dias_cancelar}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Monto a pagar</p>
          <p class="title">{{esquema.monto_cancelar}}</p>
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
      esquema:'recargas/esquema/esquema',
    })
  }
}
</script>

<style>

</style>
