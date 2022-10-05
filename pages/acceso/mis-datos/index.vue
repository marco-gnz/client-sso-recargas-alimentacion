<template>
  <div>
    <div class="container.is-fullhd">
      <div class="card p-6 m-6">
        <div class="columns">
          <div class="column pt-6 is-centered">
            <Menu />
            <div class="field">
              <span>Para consultar el historial de sus recargas es necesario ingresar sesión.</span>
            </div>
            <div class="field">
              <p class="control has-icons-left has-icons-right">
                <label class="label">Ingrese su rut</label>
                <input class="input is-rounded" type="email" placeholder="Ingrese su rut">
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left has-icons-right">
                <label class="label">Ingrese su correo electrónico</label>
                <input class="input is-rounded" type="email" placeholder="Ingrese correo electrónico">
              </p>
            </div>
            <div class="field">
              <p class="control has-icons-left">
                <label class="label">Ingrese su contraseña</label>
                <input class="input is-rounded" type="password" placeholder="Ingrese contraseña">
              </p>
            </div>
            <div class="field">
              <div class="buttons is-right">
                <a class="button is-link is-light is-fullwidth is-rounded">Ingresar</a>
              </div>
            </div>
          </div>
          <div class="column">
            <figure class="image is-16by9">
              <img class="is-rounded" src="https://img.freepik.com/vector-gratis/mano-calendario-marca-pluma_1325-126.jpg?w=826&t=st=1664894561~exp=1664895161~hmac=b556f10b78bdd765b0e265afee7ac47a4576929abe6dad0a1d00acc201d1e49e">
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
            title: "Consulta de recargas"
        };
    },
    components: {Menu }
}
</script>
