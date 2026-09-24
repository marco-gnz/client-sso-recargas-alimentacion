export const state = () => ({
  full_screen_loading:false,
  loading_reglas:false,
  open_modal:false,
  paso:0,
  carga:{
    grupo_id:'',
    file:''
  },
  errors_file:null,
  reglas:[],
  ausentismos:[],
  ausentismos_sobrante:[],
  filas:[],
  success_import:false,
  message_success:'',
  errors_column:'',
  cookie_grupo:1
});

export const mutations = {
  SET_MODAL(state, value){
    state.open_modal = value;
  },
  SET_LOADING(state, value){
    state.full_screen_loading = value;
  },
  SET_NEGATIVE_PASO_MODAL(state){
    state.paso--;
  },
  SET_POSITIVE_PASO_MODAL(state){
    state.paso++;
  },
  SET_POSITION_PASO_MODAL(state, value){
    state.paso = value;
  },
  SET_REGLAS(state, value){
    state.reglas = value;
  },
  SET_GRUPO(state, value){
    state.carga.grupo_id = value;
  },
  SET_FILE(state, value){
    state.carga.file = value;
  },
  SET_LOADING_REGLAS(state, value){
    state.loading_reglas = value;
  },
  SET_ERRORS_FILE(state, value){
    state.errors_file = value;
  },
  SET_AUSENTISMOS(state, value){
    state.ausentismos = value;
  },
  SET_AUSENTISMOS_SOBRANTE(state, value){
    state.ausentismos_sobrante = value;
  },
  SET_FILAS(state, value){
    state.filas = value;
  },
  SET_SUCCESS_IMPORT(state, value){
    state.success_import = value;
  },
  SET_SUCCESS_MESSAGE_IMPORT(state, value){
    state.message_success = value;
  },
  SET_ERROR_COLUMN(state, value){
    state.errors_column = value;
  }
};

export const getters = {
  modal(state){
    return state.open_modal;
  },
  paso(state){
    return state.paso;
  },
  fullScreenLoading(state){
    return state.full_screen_loading;
  },
  reglas(state){
    return state.reglas;
  },
  loadingReglas(state){
    return state.loading_reglas;
  },
  ausentismos(state){
    return state.ausentismos;
  },
  filas(state){
    return state.filas;
  },
  successImport(state){
    return state.success_import;
  },
  successMessagge(state){
    return state.message_success;
  },
  errorsColumn(state){
    return state.errors_column;
  },
  ausentismosSobrante(state){
    return state.ausentismos_sobrante;
  }
};

export const actions = {
  successLoadFile({ commit }) {
    commit("SET_AUSENTISMOS", []);
    commit("SET_ERRORS_FILE", null);
    commit("SET_ERROR_COLUMN", "");
    commit("SET_SUCCESS_IMPORT", true);
    commit("SET_AUSENTISMOS_SOBRANTE", []);
  },
  errorsLoadFile({ commit }) {
    commit("SET_FILE", "");
    /* commit('SET_GRUPO', ''); */
    commit("SET_AUSENTISMOS", []);
    commit("SET_FILAS", []);
  },
  successStoreFile({ commit }) {
    commit("SET_FILE", "");
    commit("SET_GRUPO", "");
    commit("SET_REGLAS", []);
    commit("SET_GRUPO", "");
    commit("SET_AUSENTISMOS", []);
    commit("SET_AUSENTISMOS_SOBRANTE", []);
  },
  closeModal({ commit }) {
    commit("SET_MODAL", false);
    commit("SET_POSITION_PASO_MODAL", 0);
    commit("SET_FILE", "");
    commit("SET_GRUPO", "");
    commit("SET_REGLAS", []);
    commit("SET_ERRORS_FILE", null);
    commit("SET_ERROR_COLUMN", "");
    commit("SET_AUSENTISMOS_SOBRANTE", []);
  },
  async getReglas({ commit }, data) {
    commit("SET_LOADING_REGLAS", true);
    const url = `/api/admin/recargas/grupo/reglas`;

    await this.$axios
      .$get(url, { params: data })
      .then((response) => {
        commit("SET_LOADING_REGLAS", false);
        console.log(response.reglas);
        if (response.status === "Success") {
          commit("SET_REGLAS", response.reglas);
        }
      })
      .catch((error) => {
        commit("SET_LOADING_REGLAS", false);
        console.log(error);
      });
  },
  async uploadFileAusentismo({ commit, dispatch }, data) {
    commit("SET_LOADING", true);

    const grupos = {
      1: {
        nombre: "uno",
        idCarga: "ausentismos_grupo_uno",
      },
      2: {
        nombre: "dos",
        idCarga: "ausentismos_grupo_dos",
      },
      3: {
        nombre: "tres",
        idCarga: "ausentismos_grupo_tres",
      },
    };

    const grupo = grupos[Number(data.grupo_id)];

    if (!grupo) {
      dispatch("errorsLoadFile");

      commit("SET_ERRORS_FILE", [
        {
          errors: ["El grupo de ausentismo seleccionado no es válido."],
        },
      ]);

      commit("SET_LOADING", false);

      return;
    }

    const formData = new FormData();

    formData.append("codigo_recarga", data.recarga_codigo);
    formData.append("grupo_id", data.grupo_id);
    formData.append("file", data.file);
    formData.append("columnas", JSON.stringify(data.columnas));
    formData.append("row_columnas", data.row_columnas);
    formData.append("id_carga", grupo.idCarga);

    const url = `/api/admin/recargas/recarga/masivo/grupo/${grupo.nombre}`;

    try {
      const response = await this.$axios.$post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === "Success") {
        dispatch("successLoadFile");

        commit("SET_FILAS", response.ausentismos?.[0] || null);

        commit("SET_AUSENTISMOS", response.ausentismos || []);

        commit("SET_AUSENTISMOS_SOBRANTE", response.ausentismos_sobrante || []);

        commit("SET_ERRORS_FILE", []);
      } else {
        dispatch("errorsLoadFile");

        commit("SET_ERRORS_FILE", response.failures || []);
      }
    } catch (error) {
      const responseData = error.response?.data || {};

      const failures = responseData.failures?.length
        ? responseData.failures
        : responseData.message
        ? [{ errors: [responseData.message] }]
        : [
            {
              errors: ["Ocurrió un error al procesar el archivo."],
            },
          ];

      dispatch("errorsLoadFile");
      commit("SET_ERRORS_FILE", failures);
      commit("SET_ERROR_COLUMN", responseData.message || null);
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async storeFileGrupoUno({ commit, dispatch }, data) {
    commit("SET_LOADING", true);

    const grupos = {
      1: {
        nombre: "uno",
        idCarga: "ausentismos_grupo_uno",
      },
      2: {
        nombre: "dos",
        idCarga: "ausentismos_grupo_dos",
      },
      3: {
        nombre: "tres",
        idCarga: "ausentismos_grupo_tres",
      },
    };

    const grupo = grupos[Number(data.grupo_id)];

    if (!grupo) {
      dispatch("errorsLoadFile");

      commit("SET_ERRORS_FILE", [
        {
          errors: ["El grupo de ausentismo seleccionado no es válido."],
        },
      ]);

      commit("SET_SUCCESS_IMPORT", false);
      commit("SET_LOADING", false);

      return;
    }

    const formData = new FormData();

    formData.append("codigo_recarga", data.recarga_codigo);
    formData.append("grupo_id", data.grupo_id);
    formData.append("file", data.file);
    formData.append("columnas", JSON.stringify(data.columnas));
    formData.append("row_columnas", data.row_columnas);
    formData.append("id_carga", grupo.idCarga);

    const url = `/api/admin/recargas/recarga/masivo/grupo/${grupo.nombre}/import`;

    try {
      const response = await this.$axios.$post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === "Success") {
        dispatch("successStoreFile");

        commit("SET_POSITION_PASO_MODAL", 4);
        commit("SET_SUCCESS_MESSAGE_IMPORT", response.message);
        commit("SET_SUCCESS_IMPORT", true);
        commit("SET_ERRORS_FILE", []);
      } else {
        dispatch("errorsLoadFile");
        commit("SET_ERRORS_FILE", response.failures || []);
        commit("SET_SUCCESS_IMPORT", false);
      }
    } catch (error) {
      const responseData = error.response?.data || {};

      const failures = responseData.failures?.length
        ? responseData.failures
        : responseData.message
        ? [{ errors: [responseData.message] }]
        : [
            {
              errors: ["Ocurrió un error al importar el archivo."],
            },
          ];

      dispatch("errorsLoadFile");
      commit("SET_ERRORS_FILE", failures);
      commit("SET_SUCCESS_IMPORT", false);
    } finally {
      commit("SET_LOADING", false);
    }
  },
};
