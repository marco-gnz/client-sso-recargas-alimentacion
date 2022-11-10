export const state = () => ({
  row_columnas_funcionarios:1,
  row_columnas_grupo_uno:1
});

export const mutations = {
  SET_COLUMNA_FUNCIONARIOS(state, row){
    state.row_columnas_funcionarios = row;
  },
  SET_COLUMNA_GRUPO_UNO(state, row){
    state.row_columnas_grupo_uno = row;
  }
};

export const getters = {
  rowColumnasFuncionarios(state){
    return state.row_columnas_funcionarios;
  },
  rowColumnasGrupoUno(state){
    return state.row_columnas_grupo_uno;
  }
};
