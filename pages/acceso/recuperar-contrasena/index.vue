<template>
  <div>
    <div class="container.is-fullhd">
      <div class="card p-6 m-6">
        <div class="columns">
          <div class="column pt-6 is-centered">
            <Menu />
            <div class="field">
              <p class="control has-icons-left has-icons-right">
                <label class="label">Ingrese correo electrónico</label>
                <input class="input is-rounded" type="email" placeholder="Ingrese correo electrónico">
              </p>
            </div>
            <div class="field">
              <div class="buttons is-right">
                <a class="button is-link is-light is-rounded">Enviar</a>
              </div>
            </div>
          </div>
          <div class="column">
            <figure class="image is-16by9">
              <img class="is-rounded" src="https://img.freepik.com/vector-gratis/hacker-rompiendo-bloqueo-acceder-informacion-personal-computadora-isometrica_1284-63723.jpg?w=826&t=st=1664894625~exp=1664895225~hmac=f594959aeeab8272b4de7d8f4cf6da74b147cea04019a108253fb83ff30ccfe2">
            </figure>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '../../../components/autenticacion/Menu.vue';
export default {
    name: "IndexPage",
    middleware: 'guest',
    head() {
        return {
            title: "Recuperar contraseña"
        };
    },
    components: {Menu }
}
</script>
