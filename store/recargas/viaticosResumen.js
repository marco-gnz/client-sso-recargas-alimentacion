import { Notification } from "element-ui";
export const state = () => ({
  paso: 0,
  modal: false,
  full_screen_loading: false,
  viaticos: [],
  loading_table: false,
  filtro: {
    input: "",
  },
  carga: {
    file: null,
  },
  errors_file: null,
  filas: [],
  success_import: false,
  message_success: "",
  errors_column: "",
  tipo_carga: 0,
});

export const mutations = {
  SET_TIPO_CARGA(state, value) {
    state.tipo_carga = value;
  },
  SET_MODAL(state, value) {
    state.modal = value;
  },
  SET_LOADING(state, value) {
    state.full_screen_loading = value;
  },
  SET_VITATICOS(state, value) {
    state.viaticos = value;
  },
  SET_LOADING_TABLE(state, value) {
    state.loading_table = value;
  },
  SET_FILTRO_INPUT(state, value) {
    state.filtro.input = value;
  },
  SET_PASO(state, value) {
    state.paso = value;
  },
  SET_NEGATIVE_PASO_MODAL_FUNCIONARIO(state, value) {
    state.paso--;
  },
  SET_POSITIVE_PASO_MODAL_FUNCIONARIO(state, value) {
    state.paso++;
  },
  SET_FILE(state, value) {
    state.carga.file = value;
  },
  SET_ERRORS_FILE(state, value) {
    state.errors_file = value;
  },
  SET_SUCCESS_IMPORT(state, value) {
    state.success_import = value;
  },
  SET_SUCCESS_MESSAGE_IMPORT(state, value) {
    state.message_success = value;
  },
  SET_ERROR_COLUMN(state, value) {
    state.errors_column = value;
  },
  SET_FILAS(state, value) {
    state.filas = value;
  },
  SET_POSITION_PASO_MODAL(state, value) {
    state.paso = value;
  },
};

export const getters = {
  viaticos(state) {
    return state.viaticos;
  },
  loadingTable(state) {
    return state.loading_table;
  },
  openModalViaticos(state) {
    return state.modal;
  },
  paso(state) {
    return state.paso;
  },
  errorsColumn(state) {
    return state.errors_column;
  },
  successMessagge(state) {
    return state.message_success;
  },
  successImport(state) {
    return state.success_import;
  },
  fullScreenLoading(state) {
    return state.full_screen_loading;
  },
  filas(state) {
    return state.filas;
  },
};

export const actions = {
  successLoadFile({ commit }) {
    commit("SET_VITATICOS", []);
    commit("SET_ERRORS_FILE", null);
    commit("SET_ERROR_COLUMN", "");
    commit("SET_SUCCESS_IMPORT", true);
  },
  errorsLoadFile({ commit }) {
    commit("SET_FILE", null);
    commit("SET_VITATICOS", []);
    commit("SET_FILAS", []);
  },
  successStoreFile({ commit }) {
    commit("SET_FILE", null);
    commit("SET_VITATICOS", []);
    commit("SET_TIPO_CARGA", 0);
  },
  closeModal({ commit }) {
    commit("SET_MODAL", false);
    commit("SET_POSITION_PASO_MODAL", 0);
    commit("SET_FILE", null);
    commit("SET_ERRORS_FILE", null);
    commit("SET_ERROR_COLUMN", "");
    commit("SET_TIPO_CARGA", 0);
    commit("SET_VITATICOS", []);
  },
  async uploadFileViaticos({ commit, dispatch }, data) {
    commit("SET_LOADING", true);

    const formData = new FormData();

    formData.append("codigo_recarga", data.recarga_codigo);
    formData.append("file", data.file);
    formData.append("columnas", JSON.stringify(data.columnas));
    formData.append("row_columnas", data.row_columnas);
    formData.append("id_carga", "viaticos");
    formData.append("tipo_carga", data.tipo_carga);

    const url = "/api/admin/recargas/recarga/masivo/viaticos";

    try {
      const response = await this.$axios.$post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === "Success") {
        dispatch("successLoadFile");
        commit("SET_FILAS", response.data[0]);
        commit("SET_VITATICOS", response.data);
      } else {
        dispatch("errorsLoadFile");

        commit("SET_ERRORS_FILE", response.failures || []);

        commit("SET_ERROR_COLUMN", response.message || null);
      }
    } catch (error) {
      dispatch("errorsLoadFile");

      const responseData = error.response?.data || {};

      const failures = responseData.failures || [];

      commit("SET_ERRORS_FILE", failures);

      commit(
        "SET_ERROR_COLUMN",
        responseData.message ||
          error.message ||
          "Ocurrió un error al procesar el archivo."
      );
    } finally {
      commit("SET_LOADING", false);
    }
  },
  async storeFileViaticos({ commit, dispatch }, data) {
    commit("SET_LOADING", true);

    const formData = new FormData();

    formData.append("codigo_recarga", data.recarga_codigo);
    formData.append("file", data.file);
    formData.append("columnas", JSON.stringify(data.columnas));
    formData.append("row_columnas", data.row_columnas);
    formData.append("id_carga", "viaticos");
    formData.append("tipo_carga", data.tipo_carga);

    const url = "/api/admin/recargas/recarga/masivo/viaticos/import";

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
      } else {
        dispatch("errorsLoadFile");
        commit("SET_ERRORS_FILE", response.failures || []);
        commit("SET_SUCCESS_IMPORT", false);
      }
    } catch (error) {
      const responseData = error.response?.data || {};

      dispatch("errorsLoadFile");

      commit("SET_ERRORS_FILE", responseData.failures || []);

      commit("SET_SUCCESS_IMPORT", false);
    } finally {
      commit("SET_LOADING", false);
    }
  },
};
