export const state = () => ({
  row_columnas_funcionarios:1
});

export const mutations = {
  SET_COLUMNA_FUNCIONARIOS(state, row){
    state.row_columnas_funcionarios = row;
  }
};

export const getters = {
  rowColumnasFuncionarios(state){
    return state.row_columnas_funcionarios;
  }
};
