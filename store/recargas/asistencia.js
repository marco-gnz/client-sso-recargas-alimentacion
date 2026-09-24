export const state = () => ({
  full_screen_loading: false,
  open_modal: false,
  paso: 0,
  carga: {
    grupo_id: "",
    file: "",
  },
  errors_file: [],
  filas: [],
  success_import: false,
  message_success: "",
  errors_column: {},
  asistencias: [],
  turno: {
    largo: "L",
    nocturno: "N",
    libre: "L",
  },
});

export const mutations = {
  SET_MODAL(state, value) {
    state.open_modal = value;
  },
  SET_LOADING(state, value) {
    state.full_screen_loading = value;
  },
  SET_NEGATIVE_PASO_MODAL(state) {
    state.paso--;
  },
  SET_POSITIVE_PASO_MODAL(state) {
    state.paso++;
  },
  SET_POSITION_PASO_MODAL(state, value) {
    state.paso = value;
  },
  SET_FILE(state, value) {
    state.carga.file = value;
  },
  SET_ERRORS_FILE(state, value) {
    state.errors_file = Array.isArray(value) ? value : [];
  },
  SET_FILAS(state, value) {
    state.filas = value && typeof value === "object" ? value : {};
  },
  SET_SUCCESS_IMPORT(state, value) {
    state.success_import = value;
  },
  SET_SUCCESS_MESSAGE_IMPORT(state, value) {
    state.message_success = value;
  },
  SET_ERROR_COLUMN(state, value) {
    state.errors_column = value && typeof value === "object" ? value : {};
  },
  SET_ASISTENCIAS(state, value) {
    state.asistencias = Array.isArray(value) ? value : [];
  },
};

export const getters = {
  modal(state) {
    return state.open_modal;
  },
  paso(state) {
    return state.paso;
  },
  fullScreenLoading(state) {
    return state.full_screen_loading;
  },
  filas(state) {
    return state.filas;
  },
  successImport(state) {
    return state.success_import;
  },
  successMessagge(state) {
    return state.message_success;
  },
  errorsColumn(state) {
    return state.errors_column;
  },
  asistencias(state) {
    return state.asistencias;
  },
  turno(state) {
    return state.turno;
  },
};

export const actions = {
  successLoadFile({ commit }) {
    commit("SET_ASISTENCIAS", []);
    commit("SET_ERRORS_FILE", []);
    commit("SET_ERROR_COLUMN", {});
    commit("SET_SUCCESS_IMPORT", true);
  },
  errorsLoadFile({ commit }) {
    commit("SET_FILE", "");
    commit("SET_ASISTENCIAS", []);
    commit("SET_FILAS", []);
    commit("SET_SUCCESS_IMPORT", false);
  },
  successStoreFile({ commit }) {
    commit("SET_FILE", "");
    commit("SET_ASISTENCIAS", []);
  },
  closeModal({ commit }) {
    commit("SET_MODAL", false);
    commit("SET_POSITION_PASO_MODAL", 0);
    commit("SET_FILE", "");
    commit("SET_ERRORS_FILE", []);
    commit("SET_ERROR_COLUMN", {});
    commit("SET_ASISTENCIAS", []);
    commit("SET_FILAS", {});
    commit("SET_SUCCESS_IMPORT", false);
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

    let response;

    try {
      response = await this.$axios.$post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      const responseData = error.response?.data || {};

      const failures = Array.isArray(responseData.failures)
        ? responseData.failures
        : [];

      await dispatch("errorsLoadFile");

      commit("SET_ASISTENCIAS", []);
      commit("SET_SUCCESS_IMPORT", false);

      if (failures.length > 0) {
        commit("SET_ERRORS_FILE", failures);
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

      commit("SET_LOADING", false);

      return;
    }

    if (response.status === "Success") {
      const asistencias = Array.isArray(response.data) ? response.data : [];

      const primeraFila = asistencias.length > 0 ? asistencias[0] : {};

      await dispatch("successLoadFile");

      commit("SET_FILAS", primeraFila);
      commit("SET_ASISTENCIAS", asistencias);

      commit("SET_ERRORS_FILE", []);
      commit("SET_ERROR_COLUMN", {});
      commit("SET_SUCCESS_IMPORT", true);

      // Debe ejecutarse después de actualizar todos los estados.
      commit("SET_LOADING", false);

      return;
    }

    const failures = Array.isArray(response.failures) ? response.failures : [];

    await dispatch("errorsLoadFile");

    commit("SET_ASISTENCIAS", []);
    commit("SET_SUCCESS_IMPORT", false);

    if (failures.length > 0) {
      commit("SET_ERRORS_FILE", failures);
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

    commit("SET_LOADING", false);
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
        /*
         * Primero se ejecuta la acción de éxito y después
         * se establece el estado definitivo.
         */
        await dispatch("successStoreFile");

        commit("SET_POSITION_PASO_MODAL", 3);
        commit("SET_SUCCESS_MESSAGE_IMPORT", response.message);
        commit("SET_SUCCESS_IMPORT", true);
        commit("SET_ERRORS_FILE", []);
        commit("SET_ERROR_COLUMN", {});

        return;
      }

      const failures = Array.isArray(response.failures)
        ? response.failures
        : [];

      await dispatch("errorsLoadFile");

      commit("SET_SUCCESS_IMPORT", false);

      if (failures.length > 0) {
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
    } catch (error) {
      const responseData = error.response?.data || {};

      const failures = Array.isArray(responseData.failures)
        ? responseData.failures
        : [];

      await dispatch("errorsLoadFile");

      commit("SET_SUCCESS_IMPORT", false);

      if (failures.length > 0) {
        commit("SET_ERRORS_FILE", failures);
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
