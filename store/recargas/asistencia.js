export const state = () => ({
    full_screen_loading:false,
    open_modal:false,
    paso:0,
    carga:{
        grupo_id:'',
        file:''
      },
    errors_file:null,
    filas:[],
    success_import:false,
    message_success:'',
    errors_column:'',
    asistencias:[],
    turno:{
        largo:'L',
        nocturno:'N',
        libre:'L'
    },
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
    },
    SET_ASISTENCIAS(state, value){
        state.asistencias = value;
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
    asistencias(state){
        return state.asistencias;
    },
    turno(state){
        return state.turno;
    }
};

export const actions = {
  successLoadFile({ commit }) {
    commit("SET_ASISTENCIAS", []);
    commit("SET_ERRORS_FILE", null);
    commit("SET_ERROR_COLUMN", "");
    commit("SET_SUCCESS_IMPORT", true);
  },
  errorsLoadFile({ commit }) {
    commit("SET_FILE", "");
    commit("SET_ASISTENCIAS", []);
    commit("SET_FILAS", []);
  },
  successStoreFile({ commit }) {
    commit("SET_FILE", "");
    commit("SET_ASISTENCIAS", []);
  },
  closeModal({ commit }) {
    commit("SET_MODAL", false);
    commit("SET_POSITION_PASO_MODAL", 0);
    commit("SET_FILE", "");
    commit("SET_ERRORS_FILE", null);
    commit("SET_ERROR_COLUMN", "");
  },
  async uploadFileAsistencia({ commit, dispatch }, data) {
    commit("SET_LOADING", true);

    const url = "/api/admin/recargas/recarga/masivo/asistencia";

    const formData = new FormData();

    formData.append("codigo_recarga", data.recarga_codigo);
    formData.append("grupo_id", data.grupo_id);
    formData.append("file", data.file);
    formData.append("columnas", JSON.stringify(data.columnas));
    formData.append("row_columnas", data.row_columnas);
    formData.append("id_carga", "asistencias");

    try {
      const response = await this.$axios.$post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === "Success") {
        dispatch("successLoadFile");

        commit("SET_FILAS", response.data?.[0] || null);

        commit("SET_ASISTENCIAS", response.data || []);

        commit("SET_ERRORS_FILE", []);
        commit("SET_ERROR_COLUMN", {});
      } else {
        const failures = Array.isArray(response.failures)
          ? response.failures
          : [];

        dispatch("errorsLoadFile");
        commit("SET_ASISTENCIAS", []);

        if (failures.length > 0) {
          commit("SET_ERRORS_FILE", failures);

          // Objeto vacío para que errorColumn.status no falle.
          commit("SET_ERROR_COLUMN", {});
        } else {
          const message =
            response.message ||
            "Ocurrió un error al procesar el archivo de asistencias.";

          commit("SET_ERRORS_FILE", [
            {
              row: null,
              attribute: null,
              errors: [message],
            },
          ]);

          commit("SET_ERROR_COLUMN", {
            status: "Error",
            message,
          });
        }
      }
    } catch (error) {
      const responseData = error.response?.data || {};

      const failures = Array.isArray(responseData.failures)
        ? responseData.failures
        : [];

      dispatch("errorsLoadFile");
      commit("SET_ASISTENCIAS", []);

      if (failures.length > 0) {
        commit("SET_ERRORS_FILE", failures);

        // No muestra el mensaje genérico, pero mantiene un objeto.
        commit("SET_ERROR_COLUMN", {});
      } else {
        const message =
          responseData.message ||
          "Ocurrió un error al procesar el archivo de asistencias.";

        commit("SET_ERRORS_FILE", [
          {
            row: null,
            attribute: null,
            errors: [message],
          },
        ]);

        commit("SET_ERROR_COLUMN", {
          status: responseData.status || "Error",
          message,
        });
      }
    } finally {
      commit("SET_LOADING", false);
    }
  },

  async storeFileAsistencia({ commit, dispatch }, data) {
    commit("SET_LOADING", true);

    const url = "/api/admin/recargas/recarga/masivo/asistencia/import";

    const formData = new FormData();

    formData.append("codigo_recarga", data.recarga_codigo);
    formData.append("file", data.file);
    formData.append("columnas", JSON.stringify(data.columnas));
    formData.append("row_columnas", data.row_columnas);
    formData.append("id_carga", "asistencias");

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
        commit("SET_ERROR_COLUMN", {});
      } else {
        const failures = Array.isArray(response.failures)
          ? response.failures
          : [];

        dispatch("errorsLoadFile");
        commit("SET_SUCCESS_IMPORT", false);

        if (failures.length > 0) {
          // Errores de validación detallados.
          commit("SET_ERRORS_FILE", failures);
          commit("SET_ERROR_COLUMN", {});
        } else {
          const message =
            response.message || "Ocurrió un error al importar las asistencias.";

          commit("SET_ERRORS_FILE", [
            {
              row: null,
              attribute: null,
              errors: [message],
            },
          ]);

          commit("SET_ERROR_COLUMN", {
            status: "Error",
            message,
          });
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
        // Envía el detalle a la tabla o listado de errores.
        commit("SET_ERRORS_FILE", failures);

        // Evita el mensaje genérico sin dejar el estado en null.
        commit("SET_ERROR_COLUMN", {});
      } else {
        const message =
          responseData.message ||
          "Ocurrió un error al importar las asistencias.";

        commit("SET_ERRORS_FILE", [
          {
            row: null,
            attribute: null,
            errors: [message],
          },
        ]);

        commit("SET_ERROR_COLUMN", {
          status: responseData.status || "Error",
          message,
        });
      }
    } finally {
      commit("SET_LOADING", false);
    }
  },
};
