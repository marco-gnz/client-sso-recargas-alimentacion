<template>
  <div>
    <Hero :title="`Recarga #${$route.params.id} - 'Nombre Apellidos - funcionario -' `" />
    <div class="container.is-fullhd">
      <MenuTotalesFuncionario />
      <div class="card p-6 m-6">
        <MenuFuncionario />
      </div>
    </div>
  </div>
</template>

<script>
import MenuFuncionario from '../../../../../../components/admin/recargas/MenuFuncionario.vue';
import MenuTotalesFuncionario from '../../../../../../components/admin/recargas/MenuTotalesFuncionario.vue';
export default {
  components: { MenuFuncionario, MenuTotalesFuncionario },
  middleware: "auth",
  head() {
        return {
            title: `Funcionario`
        };
    },
  mounted(){
    this.paramsjaja();
  },
  methods:{
    paramsjaja(){
    }
  }
}
</script>

<style>

</style>
