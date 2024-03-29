export const state = () => ({
  row_columnas_funcionarios:1,
  row_columnas_grupo_uno:1,
  row_columnas_turnantes:1,
  row_columnas_asistencia:1,
  row_columnas_viaticos:1,
  row_columnas_ajustes:1
});

export const mutations = {
  SET_COLUMNA_FUNCIONARIOS(state, row){
    state.row_columnas_funcionarios = row;
  },
  SET_COLUMNA_GRUPO_UNO(state, row){
    state.row_columnas_grupo_uno = row;
  },
  SET_COLUMNA_TURNOS(state, row){
    state.row_columnas_turnantes = row;
  },
  SET_COLUMNA_ASISTENCIA(state, row){
    state.row_columnas_asistencia = row;
  },
  SET_COLUMNA_VIATICOS(state, row){
    state.row_columnas_viaticos = row;
  },
  SET_COLUMNA_AJUSTES(state, row){
    state.row_columnas_ajustes = row;
  }
};

export const getters = {
  rowColumnasFuncionarios(state){
    return state.row_columnas_funcionarios;
  },
  rowColumnasGrupoUno(state){
    return state.row_columnas_grupo_uno;
  },
  rowColumnasTurnos(state){
    return state.row_columnas_turnantes;
  },
  rowColumnasAsistencia(state){
    return state.row_columnas_asistencia;
  },
  rowColumnasViaticos(state){
    return state.row_columnas_viaticos;
  },
  rowColumnasAjustes(state){
    return state.row_columnas_ajustes;
  }
};
