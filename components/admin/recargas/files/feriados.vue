<template>
  <div>
    <div class="modal is-large" :class="openModalFeriados ? 'is-active' : '' ">
      <div class="modal-background" @click.prevent="hideModalFeriados"></div>
      <div class="modal-card" style="width: 80%;">
        <header class="modal-card-head">
          <p class="modal-card-title">Carga/actualización de feriados en la recarga</p>
          <button class="delete" aria-label="close" @click.prevent="hideModalFeriados"></button>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column">
              <h5 class="title is-5">Seleccione feriados para asociar a la recarga</h5>
                <table class="table is-striped is-narrow is-hoverable is-fullwidth" v-loading="loadingTable" aria-disabled="">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Fecha</th>
                      <th>Día</th>
                      <th>Nombre</th>
                      <th>Irrenunciable</th>
                      <th>Tipo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="feriados.length">
                      <tr v-for="(feriado, index) in feriados" :key="index" class="is-clickable">
                        <td><input type="checkbox" v-model="feriados_selected" :value="{fecha:feriado.fecha_not_format, nombre:feriado.nombre, irrenunciable:feriado.irrenunciable_value, tipo:feriado.tipo, observacion:feriado.observacion}"></td>
                        <td>{{ feriado.fecha_corta ? feriado.fecha_corta : '--' }}</td>
                        <td>{{ feriado.fecha_larga ? feriado.fecha_larga : '--' }}</td>
                        <td>{{ feriado.nombre ? feriado.nombre : '--' }}</td>
                        <td>{{ feriado.irrenunciable ? feriado.irrenunciable : '--' }}</td>
                        <td>{{ feriado.tipo ? feriado.tipo : '--' }}</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
                <template v-if="!feriados.length && !loadingTable">
                  <div class="columns is-mobile is-centered has-text-centered">
                    <div class="column is-one-fifth has-text-centered">
                      <div class="tabs is-toggle is-toggle-rounded is-small is-centered">
                        <el-empty class="is-centered" description="No se han encontrado feriados" :image-size="100"></el-empty>
                      </div>
                    </div>
                  </div>
                </template>
            </div>
          </div>
        </section>
        <footer class="modal-card-foot buttons is-right">
          <button :disabled="!feriados_selected.length" class="button is-primary is-rounded" :class="(loadingStore ? 'is-loading' : '')" @click.prevent="storeFeriadosAction">Ingresar {{feriados_selected.length > 1 ? 'feriados' : 'feriado'}}</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
export default {
  mounted(){
    this.getFeriados(this.$route.params.id);
  },
  computed:{
    ...mapGetters({
      loadingTable:'recargas/feriados/loadingTable',
      openModalFeriados:'recargas/feriados/modal',
      feriados:'recargas/feriados/feriados',
      loadingStore:'recargas/feriados/loadingStore',
    }),
    feriados_selected:{
      get(){
        return this.$store.state.recargas.feriados.feriados_selected;
      },
      set(newValue){
        this.$store.commit('recargas/feriados/SET_FERIADOS_SELECTED', newValue);
      }
    }
  },
  methods:{
    ...mapActions({
      getFeriados:'recargas/feriados/getFeriados',
      storeFeriados:'recargas/feriados/storeFeriados'
    }),
    hideModalFeriados:function(){
      this.$store.commit('recargas/feriados/SET_MODAL', false);
    },
    storeFeriadosAction:function(){
      const data = {
        codigo_recarga:this.$route.params.id,
        feriados:this.feriados_selected
      };
      this.storeFeriados(data);
    }
  }
}
</script>

<style>

</style>
