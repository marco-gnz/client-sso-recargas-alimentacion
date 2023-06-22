<template>
  <div>
    <div class="field">
      <div class="columns">
        <div class="column">
          <p>Ingresado por {{esquema.user_created_by}} el {{esquema.date_created_by}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  computed:{
      ...mapGetters({
            esquema: "esquemas/esquemaFuncionario/esquema",
        }),
    },
}
</script>

<style>

</style>
