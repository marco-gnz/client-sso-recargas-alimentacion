export const state = () => ({
  open_modal:false,
  full_screen_loading:false,
  paso:0,
  carga:{
    grupo_id:'',
    file:''
  },
  errors_file:null,
  turnos:[],
  filas:[],
  success_import:false,
  message_success:'',
  errors_column:''
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
  SET_FILE(state, value){
    state.carga.file = value;
  },
  SET_ERRORS_FILE(state, value){
    state.errors_file = value;
  },
  SET_SUCCESS_IMPORT(state, value){
    state.success_import = value;
  },
  SET_SUCCESS_MESSAGE_IMPORT(state, value){
    state.message_success = value;
  },
  SET_ERROR_COLUMN(state, value){
    state.errors_column = value;
  },
  SET_FILAS(state, value){
    state.filas = value;
  },
  SET_TURNOS(state, value){
    state.turnos = value;
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
  successImport(state){
    return state.success_import;
  },
  successMessagge(state){
    return state.message_success;
  },
  errorsColumn(state){
    return state.errors_column;
  },
  turnos(state){
    return state.turnos;
  },
  filas(state){
    return state.filas;
  },
};

export const actions = {
  successLoadFile({ commit }) {
    commit("SET_TURNOS", []);
    commit("SET_ERRORS_FILE", null);
    commit("SET_ERROR_COLUMN", "");
    commit("SET_SUCCESS_IMPORT", true);
  },
  errorsLoadFile({ commit }) {
    commit("SET_FILE", "");
    commit("SET_TURNOS", []);
    commit("SET_FILAS", []);
  },
  successStoreFile({ commit }) {
    commit("SET_FILE", "");
    commit("SET_TURNOS", []);
  },
  closeModal({ commit }) {
    commit("SET_MODAL", false);
    commit("SET_POSITION_PASO_MODAL", 0);
    commit("SET_FILE", "");
    commit("SET_ERRORS_FILE", null);
    commit("SET_ERROR_COLUMN", "");
  },
  async uploadFileTurnos({ commit, dispatch }, data) {
    commit("SET_LOADING", true);

    const formData = new FormData();

    formData.append("codigo_recarga", data.recarga_codigo);
    formData.append("file", data.file);
    formData.append("columnas", JSON.stringify(data.columnas));
    formData.append("row_columnas", data.row_columnas);
    formData.append("id_carga", "asignaciones");

    const url = "/api/admin/recargas/recarga/masivo/turnos";

    try {
      const response = await this.$axios.$post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === "Success") {
        dispatch("successLoadFile");

        commit("SET_FILAS", response.data?.[0] || null);

        commit("SET_TURNOS", response.data || []);

        commit("SET_ERRORS_FILE", []);
        commit("SET_ERROR_COLUMN", null);
      } else {
        const failures = Array.isArray(response.failures)
          ? response.failures
          : [];

        dispatch("errorsLoadFile");

        commit("SET_TURNOS", []);
        commit("SET_ERRORS_FILE", failures);

        if (failures.length > 0) {
          commit("SET_ERROR_COLUMN", null);
        } else {
          commit(
            "SET_ERROR_COLUMN",
            response.message ||
              "Ocurrió un error al procesar el archivo de turnos."
          );
        }
      }
    } catch (error) {
      const responseData = error.response?.data || {};

      const failures = Array.isArray(responseData.failures)
        ? responseData.failures
        : [];

      dispatch("errorsLoadFile");

      commit("SET_TURNOS", []);

      if (failures.length > 0) {
        // Envía los errores detallados de Laravel Excel.
        commit("SET_ERRORS_FILE", failures);

        // Evita que el mensaje genérico tape el detalle.
        commit("SET_ERROR_COLUMN", null);
      } else {
        const message =
          responseData.message ||
          "Ocurrió un error al procesar el archivo de turnos.";

        commit("SET_ERRORS_FILE", [
          {
            row: null,
            attribute: null,
            errors: [message],
          },
        ]);

        commit("SET_ERROR_COLUMN", message);
      }
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async storeFileTurnos({ commit, dispatch }, data) {
    commit("SET_LOADING", true);

    const formData = new FormData();

    formData.append("codigo_recarga", data.recarga_codigo);
    formData.append("file", data.file);
    formData.append("columnas", JSON.stringify(data.columnas));
    formData.append("row_columnas", data.row_columnas);
    formData.append("id_carga", "asignaciones");

    const url = "/api/admin/recargas/recarga/masivo/turnos/import";

    try {
      const response = await this.$axios.$post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === "Success") {
        dispatch("successStoreFile");

        commit("SET_POSITION_PASO_MODAL", 3);
        commit("SET_SUCCESS_MESSAGE_IMPORT", response.message);
        commit("SET_SUCCESS_IMPORT", true);
        commit("SET_ERRORS_FILE", []);
        commit("SET_ERROR_COLUMN", null);
      } else {
        const failures = Array.isArray(response.failures)
          ? response.failures
          : [];

        dispatch("errorsLoadFile");
        commit("SET_SUCCESS_IMPORT", false);

        if (failures.length > 0) {
          commit("SET_ERRORS_FILE", failures);
          commit("SET_ERROR_COLUMN", null);
        } else {
          const message =
            response.message || "Ocurrió un error al importar los turnos.";

          commit("SET_ERRORS_FILE", [
            {
              row: null,
              attribute: null,
              errors: [message],
            },
          ]);

          commit("SET_ERROR_COLUMN", message);
        }
      }
    } catch (error) {
      const responseData = error.response?.data || {};

      const failures = Array.isArray(responseData.failures)
        ? responseData.failures
        : [];

      dispatch("errorsLoadFile");
      commit("SET_SUCCESS_IMPORT", false);

      if (failures.length > 0) {
        // Mantiene los seis errores, o los que correspondan.
        commit("SET_ERRORS_FILE", failures);
        commit("SET_ERROR_COLUMN", null);
      } else {
        const message =
          responseData.message || "Ocurrió un error al importar los turnos.";

        commit("SET_ERRORS_FILE", [
          {
            row: null,
            attribute: null,
            errors: [message],
          },
        ]);

        commit("SET_ERROR_COLUMN", message);
      }
    } finally {
      commit("SET_LOADING", false);
    }
  },
};
