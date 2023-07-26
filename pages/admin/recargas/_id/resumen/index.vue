<template>
  <div v-loading.fullscreen.lock="loadingSpinner" element-loading-text="Cargando datos..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.9)">
    <template v-if="recarga">
      <Hero namepage="Tabla general de resumen de datos" :recarga="recarga" />
    </template>
    <div class="container.is-fullhd">
        <ModalAddEsquema v-if="modal_add_esquema" />
        <ModalPublicarPlanilla v-if="modal_publicar_planilla" />
        <ModalGenerarPlanilla v-if="modal_generar_planilla"  />
        <MenuTotales :recarga="recarga" />
        <ModalAddReajuste :esquema="esquema_selected" :tipo_reajuste="tipo_reajuste"  />
        <ModalShowErrores :errores="errors_funcionario" :advertencias="advertencias_funcionario" />
      <div class="card p-2 m-2">
        <MenuRecargaTablaResumen :recarga="recarga" />
        <div class="columns">
          <div class="column">
            <div class="field">
              <div class="control is-medium" :class="(loadingTablaResumen && input_query.length ? 'is-loading' : '')">
                <el-input
                    autofocus
                    placeholder="Buscar funcionarios por rut, nombre o apellidos"
                    v-model="input_query"
                    @keyup.native="keySearchInput"
                  >
                </el-input>
              </div>
            </div>
            <div class="field">
              <div class="columns">
                <div class="column">
                  <label class="label">Tipo de ingreso</label>
                  <el-checkbox-group v-model="filtro_tipo_ingreso" @change="actionGetFuncionariosFiltro">
                    <el-checkbox :label="1" :disabled="loadingTablaResumen">Manual</el-checkbox>
                    <el-checkbox :label="0" :disabled="loadingTablaResumen">Masivo</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="column">
                  <label class="label">Fecha alejamiento</label>
                  <el-checkbox-group v-model="filtro_fecha_alejamiento" @change="actionGetFuncionariosFiltro">
                    <el-checkbox :label="1" :disabled="loadingTablaResumen">Si</el-checkbox>
                    <el-checkbox :label="0" :disabled="loadingTablaResumen">No</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="column">
                  <label class="label">Beneficio</label>
                  <el-checkbox-group v-model="filtro_beneficio" @change="actionGetFuncionariosFiltro">
                    <el-checkbox :label="1" :disabled="loadingTablaResumen">Si</el-checkbox>
                    <el-checkbox :label="0" :disabled="loadingTablaResumen">No</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="column">
                  <label class="label">Reemplazo</label>
                  <el-checkbox-group v-model="filtro_reemplazo" @change="actionGetFuncionariosFiltro">
                    <el-checkbox :label="1" :disabled="loadingTablaResumen">Si</el-checkbox>
                    <el-checkbox :label="0" :disabled="loadingTablaResumen">No</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="column">
                  <label class="label">Turno (A)</label>
                  <el-checkbox-group v-model="filtro_turno_asignaciones" @change="actionGetFuncionariosFiltro">
                    <el-checkbox :label="1" :disabled="loadingTablaResumen">Si</el-checkbox>
                    <el-checkbox :label="0" :disabled="loadingTablaResumen">No</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="column">
                  <label class="label">Turnante</label>
                  <el-checkbox-group v-model="filtro_turno" @change="actionGetFuncionariosFiltro">
                    <el-checkbox :label="1" :disabled="loadingTablaResumen">Si</el-checkbox>
                    <el-checkbox :label="2" :disabled="loadingTablaResumen">No</el-checkbox>
                    <el-checkbox :label="3" :disabled="loadingTablaResumen">Error</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="column">
                  <label class="label">Ajustes</label>
                  <el-checkbox-group v-model="filtro_ajustes" @change="actionGetFuncionariosFiltro">
                    <el-checkbox :label="0" :disabled="loadingTablaResumen">Días</el-checkbox>
                    <el-checkbox :label="1" :disabled="loadingTablaResumen">Montos</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="column">
                  <label class="label">Errores/Advertencias</label>
                  <el-checkbox-group v-model="filtro_errores" @change="actionGetFuncionariosFiltro">
                    <el-checkbox label="errores" :disabled="loadingTablaResumen">Errores</el-checkbox>
                    <el-checkbox label="advertencias" :disabled="loadingTablaResumen">Advertencias</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="columns">
                <div class="column">
                  <label class="label">Ley contrato</label>
                  <el-select size="mini" v-model="filtro_leyes" multiple collapse-tags clearable placeholder="Seleccione ley" class="element-select">
                    <el-option
                      v-for="ley in leyes"
                      :key="ley.id"
                      :label="ley.nombre"
                      :value="ley.id">
                    </el-option>
                  </el-select>
                </div>
                <div class="column">
                  <label class="label">C. costo</label>
                  <el-select size="mini" v-model="filtro_centro_costo" multiple collapse-tags clearable placeholder="Seleccione centro" class="element-select">
                    <el-option
                      v-for="centro in centroCostosRecarga"
                      :key="centro"
                      :label="centro"
                      :value="centro">
                    </el-option>
                  </el-select>
                </div>
                <div class="column">
                  <div class="field">
                    <div class="columns">
                      <div class="column">
                        <label class="label">Unidad</label>
                        <el-select size="mini" v-model="filtro_unidad" filterable multiple collapse-tags clearable placeholder="Seleccione unidad" class="element-select">
                          <el-option
                            v-for="unidad in unidades"
                            :key="unidad.id"
                            :label="unidad.nombre"
                            :value="unidad.id">
                          </el-option>
                        </el-select>
                      </div>
                      <div class="column pt-6">
                        <el-checkbox :disabled="!filtro_unidad.length" v-model="equals_unidad">{{equals_unidad ? '=' : '!='}}</el-checkbox>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column">
                  <label class="label">Hora contrato</label>
                  <el-select size="mini" v-model="filtro_horas" filterable multiple collapse-tags clearable placeholder="Seleccione hora" class="element-select">
                    <el-option
                      v-for="hora in horas"
                      :key="hora.id"
                      :label="hora.nombre"
                      :value="hora.id">
                    </el-option>
                  </el-select>
                </div>
                <div class="column">
                  <label class="label">Tipo de ausentismo</label>
                  <el-select size="mini" v-model="filtro_tipo_ausentismo" filterable multiple collapse-tags clearable placeholder="Seleccione tipo" class="element-select">
                    <el-option
                      v-for="tipo in tipoAusentismos"
                      :key="tipo.id"
                      :label="tipo.nombre"
                      :value="tipo.id">
                    </el-option>
                  </el-select>
                </div>
                <div class="column">
                 <button class="button is-link mt-5" :class="(loadingTablaResumen ? 'is-loading' : '')" @click.prevent="actionGetFuncionariosFiltro">
                  <span class="icon is-small">
                    <i class="el-icon-search"></i>
                  </span>
                 </button>
                </div>
              </div>
            </div>
            <div class="field">
              <div class="columns">
                <div class="column">
                  <button @click.prevent="openModalAddEsquema" class="button is-primary is-light"><i class="el-icon-plus"></i></button>
                </div>
              </div>
            </div>
            <div class="table-container pt-2" v-loading.fullscreen.lock="loadingTablaResumen && pagination.total <= 0" element-loading-text="Cargando resultados...">
              <span v-if="(pagination)" class="tag is-info is-light">{{ `${pagination.total} ${pagination.total > 1 ? `resultados` : `resultado`}` }}</span>
              <template v-if="(pagination.total > 0)">
                <table class="table is-bordered  is-narrow is-hoverable is-fullwidth" v-loading="loadingTablaResumen" element-loading-text="Cargando resultados...">
                  <thead>
                    <tr>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <span class="click" @click.prevent="orderByData(ordenamientos[0])">Bene</span>
                            </div>
                        </div>
                        <div class="columns">
                          <div class="column">
                            <el-popover
                                placement="top"
                                width="300"
                                v-model="visible"
                                @hide="hideTop"
                                @after-enter="hideTop"
                                @after-leave="hideTop">
                                <p>Marcados({{esquemas_checked.length}}):</p>
                                <div style="text-align: center; margin: 0">
                                  <el-button :disabled="loadingMarcados" size="mini" type="danger" @click="statusEsquemas(false)">Deshabilitar</el-button>
                                  <el-button :disabled="loadingMarcados" type="primary" size="mini" @click="statusEsquemas(true)">Habilitar</el-button>
                                </div>
                                <el-checkbox slot="reference" :indeterminate="isIndeterminate" v-model="checked_all" @change="handleCheckAllChange">All</el-checkbox>
                              </el-popover>
                          </div>
                        </div>
                      </th>
                      <th>
                        Reem
                      </th>
                      <template v-if="!open_grupo">
                        <th>
                          <div class="columns">
                            <div class="column">
                              <span class="click" @click.prevent="orderByData(ordenamientos[1])">Nombres</span>
                            </div>
                            <div class="column">
                              <i v-if="isParamASC(ordenamientos[1])" class="el-icon-caret-top"></i>
                              <i v-if="isParamDESC(ordenamientos[1])" class="el-icon-caret-bottom"></i>
                            </div>
                          </div>
                        </th>
                      </template>
                      <template v-else>
                        <th>Apellidos</th>
                      </template>
                      <th>
                        Tur (A)
                      </th>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <span class="click" @click.prevent="orderByData(ordenamientos[2])">Tur</span>
                            </div>
                            <div class="column">
                              <i v-if="isParamASC(ordenamientos[2])" class="el-icon-caret-top"></i>
                              <i v-if="isParamDESC(ordenamientos[2])" class="el-icon-caret-bottom"></i>
                            </div>
                        </div>
                      </th>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <span class="click" @click.prevent="orderByData(ordenamientos[3])">Días</span>
                            </div>
                            <div class="column">
                              <i v-if="isParamASC(ordenamientos[3])" class="el-icon-caret-top"></i>
                              <i v-if="isParamDESC(ordenamientos[3])" class="el-icon-caret-bottom"></i>
                            </div>
                        </div>
                      </th>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <span class="click" @click.prevent="orderByData(ordenamientos[3])">Uni</span>
                            </div>
                        </div>
                      </th>
                      <th>
                        <div class="columns">
                          <div class="column">
                            <span class="click" @click.prevent="orderByData(ordenamientos[4])">T L+N</span>
                          </div>
                          <div class="column">
                            <i v-if="isParamASC(ordenamientos[4])" class="el-icon-caret-top"></i>
                            <i v-if="isParamDESC(ordenamientos[4])" class="el-icon-caret-bottom"></i>
                          </div>
                        </div>
                      </th>
                      <template v-if="recarga.total_grupos">
                        <th :class="(open_grupo === 1 ? 'has-background-grey-lighter' : '')">
                          <el-link :underline="false" @click.prevent="openGrupo(1)" :type="open_grupo === 1 ? 'warning' : 'info' ">1 <i :class="open_grupo === 1 ? 'el-icon-minus' : 'el-icon-plus' "></i></el-link>
                        </th>
                        <template v-if="open_grupo != undefined && open_grupo === 1">
                          <td v-for="(tipo, index) in recarga.total_grupos" :key="index" class="has-background-white-ter">
                            <el-tooltip :content="tipo.nombre" placement="top">
                              <i>{{tipo.sigla}}</i>
                            </el-tooltip>
                          </td>
                        </template>
                        <th :class="(open_grupo === 2 ? 'has-background-grey-lighter' : '')">
                          <el-link :underline="false" @click.prevent="openGrupo(2)" :type="open_grupo === 2 ? 'warning' : 'info' ">2 <i :class="open_grupo === 2 ? 'el-icon-minus' : 'el-icon-plus' "></i></el-link>
                        </th>
                        <template v-if="open_grupo != undefined && open_grupo === 2">
                          <td v-for="(tipo, index) in recarga.total_grupos" :key="index" class="has-background-white-ter">
                            <el-tooltip :content="tipo.nombre" placement="top">
                              <i>{{tipo.sigla}}</i>
                            </el-tooltip>
                          </td>
                        </template>
                        <th :class="(open_grupo === 3 ? 'has-background-grey-lighter' : '')">
                          <el-link :underline="false" @click.prevent="openGrupo(3)" :type="open_grupo === 3 ? 'warning' : 'info' ">3 <i :class="open_grupo === 3 ? 'el-icon-minus' : 'el-icon-plus' "></i></el-link>
                        </th>
                        <template v-if="open_grupo != undefined && open_grupo === 3">
                          <td v-for="(tipo, index) in recarga.total_grupos" :key="index" class="has-background-white-ter">
                            <el-tooltip :content="tipo.nombre" placement="top">
                              <i>{{tipo.sigla}}</i>
                            </el-tooltip>
                          </td>
                        </template>
                      </template>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <span class="click" @click.prevent="orderByData(ordenamientos[8])">Viá</span>
                            </div>
                            <div class="column">
                              <i v-if="isParamASC(ordenamientos[8])" class="el-icon-caret-top"></i>
                              <i v-if="isParamDESC(ordenamientos[8])" class="el-icon-caret-bottom"></i>
                            </div>
                        </div>
                      </th>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <span class="click" @click.prevent="orderByData(ordenamientos[9])">A. días</span>
                            </div>
                            <div class="column">
                              <i v-if="isParamASC(ordenamientos[9])" class="el-icon-caret-top"></i>
                              <i v-if="isParamDESC(ordenamientos[9])" class="el-icon-caret-bottom"></i>
                            </div>
                        </div>
                      </th>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <span class="click" @click.prevent="orderByData(ordenamientos[10])">DC</span>
                            </div>
                            <div class="column">
                              <i v-if="isParamASC(ordenamientos[10])" class="el-icon-caret-top"></i>
                              <i v-if="isParamDESC(ordenamientos[10])" class="el-icon-caret-bottom"></i>
                            </div>
                        </div>
                      </th>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <span class="click" @click.prevent="orderByData(ordenamientos[11])">A. $</span>
                            </div>
                            <div class="column">
                              <i v-if="isParamASC(ordenamientos[11])" class="el-icon-caret-top"></i>
                              <i v-if="isParamDESC(ordenamientos[11])" class="el-icon-caret-bottom"></i>
                            </div>
                        </div>
                      </th>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <span class="click" @click.prevent="orderByData(ordenamientos[12])">MC</span>
                            </div>
                            <div class="column">
                              <i v-if="isParamASC(ordenamientos[12])" class="el-icon-caret-top"></i>
                              <i v-if="isParamDESC(ordenamientos[12])" class="el-icon-caret-bottom"></i>
                            </div>
                        </div>
                      </th>
                      <th><i class="el-icon-more-outline"></i></th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>
                        <template v-if="recarga.last_status_value === 0 && hasPermission('esquema.delete')">
                          <el-popconfirm
                            @confirm="deleteData('esquema')"
                            confirm-button-type="warning"
                            confirm-button-text='Si, eliminar'
                            cancel-button-text='No'
                            icon="el-icon-info"
                            icon-color="warning"
                            title="¿Eliminar cartolas?"
                            >
                            <el-button :class="(loadingDeleteData ? 'is-loading' : '')" size="mini" type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
                          </el-popconfirm>
                        </template>
                      </th>
                      <th></th>
                      <th></th>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <template v-if="recarga.last_status_value === 0 && hasPermission('asignacion.delete')">
                                <el-popconfirm
                                  @confirm="deleteData('asignacion')"
                                  confirm-button-type="warning"
                                  confirm-button-text='Si, eliminar'
                                  cancel-button-text='No'
                                  icon="el-icon-info"
                                  icon-color="warning"
                                  title="¿Eliminar asignaciones?"
                                  >
                                  <el-button :class="(loadingDeleteData ? 'is-loading' : '')" size="mini" type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
                                </el-popconfirm>
                              </template>
                            </div>
                        </div>
                      </th>
                      <th></th>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <p>{{recarga.total_calculo_contrato_query}}</p>
                            </div>
                            <div class="column">
                              <template v-if="recarga.last_status_value === 0 && hasPermission('contrato.delete')">
                                <el-popconfirm
                                  @confirm="deleteData('contrato')"
                                  confirm-button-type="warning"
                                  confirm-button-text='Si, eliminar'
                                  cancel-button-text='No'
                                  icon="el-icon-info"
                                  icon-color="warning"
                                  title="¿Eliminar contratos? Al eliminar contratos, tambien eliminarás las cartolas de esta lista."
                                  >
                                  <el-button :class="(loadingDeleteData ? 'is-loading' : '')" size="mini" type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
                                </el-popconfirm>
                              </template>
                            </div>
                        </div>
                      </th>
                      <th></th>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <p>{{recarga.total_calculo_turno_query}}</p>
                            </div>
                            <div class="column">
                              <template v-if="recarga.last_status_value === 0 && hasPermission('turno.delete')">
                                <el-popconfirm
                                  @confirm="deleteData('asistencias')"
                                  confirm-button-type="warning"
                                  confirm-button-text='Si, eliminar'
                                  cancel-button-text='No'
                                  icon="el-icon-info"
                                  icon-color="warning"
                                  title="¿Eliminar turnos?"
                                  >
                                  <el-button :class="(loadingDeleteData ? 'is-loading' : '')" size="mini" type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
                                </el-popconfirm>
                              </template>
                            </div>
                        </div>
                      </th>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <p>{{recarga.total_calculo_grupo_uno_query}}</p>
                            </div>
                            <div class="column">
                              <template v-if="recarga.last_status_value === 0 && hasPermission('ausentismo.delete')">
                                <el-popconfirm
                                    @confirm="deleteData('ausentismos_grupo_uno')"
                                    confirm-button-type="warning"
                                    confirm-button-text='Si, eliminar'
                                    cancel-button-text='No'
                                    icon="el-icon-info"
                                    icon-color="warning"
                                    title="¿Eliminar ausentismos de grupo 1?"
                                    >
                                    <el-button :class="(loadingDeleteData ? 'is-loading' : '')" size="mini" type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
                                </el-popconfirm>
                              </template>
                            </div>
                        </div>
                      </th>
                      <template v-if="(recarga.total_grupos) && (open_grupo != undefined && open_grupo === 1)">
                        <th v-for="(tipo, index) in recarga.total_grupos" :key="index">--</th>
                      </template>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <p>{{recarga.total_calculo_grupo_dos_query}}</p>
                            </div>
                            <div class="column">
                              <template v-if="recarga.last_status_value === 0 && hasPermission('ausentismo.delete')">
                                <el-popconfirm
                                  @confirm="deleteData('ausentismos_grupo_dos')"
                                  confirm-button-type="warning"
                                  confirm-button-text='Si, eliminar'
                                  cancel-button-text='No'
                                  icon="el-icon-info"
                                  icon-color="warning"
                                  title="¿Eliminar ausentismos de grupo 2?"
                                  >
                                  <el-button :class="(loadingDeleteData ? 'is-loading' : '')" size="mini" type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
                                </el-popconfirm>
                              </template>
                            </div>
                        </div>
                      </th>
                      <template v-if="(recarga.total_grupos) && (open_grupo != undefined && open_grupo === 2)">
                        <th v-for="(tipo, index) in recarga.total_grupos" :key="index">--</th>
                      </template>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <p>{{recarga.total_calculo_grupo_tres_query}}</p>
                            </div>
                            <div class="column">
                              <template v-if="recarga.last_status_value === 0 && hasPermission('ausentismo.delete')">
                                <el-popconfirm
                                  @confirm="deleteData('ausentismos_grupo_tres')"
                                  confirm-button-type="warning"
                                  confirm-button-text='Si, eliminar'
                                  cancel-button-text='No'
                                  icon="el-icon-info"
                                  icon-color="warning"
                                  title="¿Eliminar ausentismos de grupo 3?"
                                  >
                                  <el-button :class="(loadingDeleteData ? 'is-loading' : '')" size="mini" type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
                                </el-popconfirm>
                              </template>
                            </div>
                        </div>
                      </th>
                      <template v-if="(recarga.total_grupos) && (open_grupo != undefined && open_grupo === 3)">
                        <th v-for="(tipo, index) in recarga.total_grupos" :key="index">--</th>
                      </template>
                      <th>
                        <div class="columns">
                            <div class="column">
                              <p>{{recarga.total_calculo_viaticos_query}}</p>
                            </div>
                            <div class="column">
                              <template v-if="recarga.last_status_value === 0 && hasPermission('viatico.delete')">
                                <el-popconfirm
                                  @confirm="deleteData('viatico')"
                                  confirm-button-type="warning"
                                  confirm-button-text='Si, eliminar'
                                  cancel-button-text='No'
                                  icon="el-icon-info"
                                  icon-color="warning"
                                  title="¿Eliminar viáticos?"
                                  >
                                  <el-button :class="(loadingDeleteData ? 'is-loading' : '')" size="mini" type="danger" icon="el-icon-delete" circle slot="reference" ></el-button>
                                </el-popconfirm>
                              </template>
                            </div>
                        </div>
                      </th>
                      <th>--</th>
                      <th>--</th>
                      <th>--</th>
                      <th>{{recarga.total_clp}}</th>
                      <th></th>
                    </tr>
                  </tfoot>
                  <tbody>
                    <tr v-for="(funcionario, index) in funcionarios" :key="index" @click.prevent="clickItem(index)" :class="(index_selected_table === index ? 'row-selected' : '')">
                      <td>
                        <template v-if="recarga.last_status_value === 0 && hasPermission('esquema.status')">
                          <div class="columns">
                            <div class="column">
                              <el-tooltip :content="`${!funcionario.beneficio ? `No` : `Si`}`" placement="top">
                                <el-switch v-loading.lock="loadingIndex && index_click_funcionario === index" :disabled="(loadingIndex) || (funcionario.checked)" @change="editBeneficio(index, funcionario.id)" :active-value="!funcionario.beneficio" :inactive-value="funcionario.beneficio" inactive-color="#F1948A" active-color="#13ce66"></el-switch>
                              </el-tooltip>
                            </div>
                            <div class="column">
                              <el-checkbox v-model="funcionario.checked" @click.native="toggleFuncionarioCheck(funcionario)"></el-checkbox>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <el-tag effect="dark" size="mini" :type="(!funcionario.beneficio ? 'danger' : 'success')" disable-transitions>{{!funcionario.beneficio ? 'No' : 'Si'}}</el-tag>
                        </template>
                      </td>
                      <td>
                        <template v-if="recarga.last_status_value === 0 && hasPermission('esquema.update')">
                          <el-checkbox v-loading.lock="loadingIndex && index_click_funcionario_reemplazo === index" :value="funcionario.es_remplazo" @click.native="editReemplazo(index, funcionario.id)">{{funcionario.es_remplazo ? 'Si' : 'No'}}</el-checkbox>
                        </template>
                        <template v-else>
                          <el-tag effect="dark" size="mini" :type="(funcionario.es_remplazo ? 'warning' : 'primary')" disable-transitions>{{funcionario.es_remplazo ? 'Si' : 'No'}}</el-tag>
                        </template>
                      </td>
                      <td>
                        <template v-if="!open_grupo">
                          <p :class="(funcionario.tipo_ingreso ? 'has-background-warning-light' : '')">{{funcionario.funcionario_apellidos ? funcionario.funcionario_apellidos : '--'}} {{funcionario.funcionario_nombre ? funcionario.funcionario_nombre : '--'}}</p>
                        </template>
                        <template v-else>
                          <p :class="(funcionario.tipo_ingreso ? 'has-background-warning-light' : '')">{{funcionario.funcionario_apellidos ? funcionario.funcionario_apellidos : '--'}}</p>
                        </template>
                      </td>
                      <td>
                        <nuxt-link :to="`/admin/esquemas/${funcionario.uuid}/asignaciones`">
                          <el-tag effect="dark" size="mini" :type="(funcionario.turno_asignacion ? 'warning' : 'info')" disable-transitions>{{funcionario.turno_asignacion ? 'Si' : 'No'}}</el-tag>
                        </nuxt-link>
                      </td>
                      <td>
                        <template v-if="recarga.last_status_value === 0 && hasPermission('esquema.update')">
                          <el-tooltip :content="`${funcionario.es_turnante_nombre}`" placement="top">
                            <el-switch v-loading.lock="loadingIndex && index_click_funcionario === index" :disabled="(loadingIndex)" @change="editTurno(index, funcionario.id)" :active-value="!funcionario.es_turnante_value" :inactive-value="funcionario.es_turnante_value" inactive-color="#e9ae55" active-color="#0e6db8"></el-switch>
                          </el-tooltip>
                        </template>
                        <template v-else>
                          <el-tag effect="dark" size="mini" :type="(funcionario.es_turnante_type)" disable-transitions>{{funcionario.es_turnante_nombre}}</el-tag>
                        </template>
                      </td>
                      <td>
                        <div class="columns">
                          <div class="column">
                            <el-tooltip :disabled="(funcionario.contrato_n_registros <= 0 ? true : false)" class="item" effect="dark" :content="`${funcionario.contrato_n_registros} ${funcionario.contrato_n_registros > 1 ? 'registros' : 'registro'}`" placement="top-start">
                              <nuxt-link :to="`/admin/esquemas/${funcionario.uuid}/contratos`">
                                <p :class="(funcionario.total_dias_contrato === 0 || funcionario.total_dias_contrato  < recarga.total_dias_habiles_beneficio ? 'has-text-danger has-text-weight-semibold' : '')">{{ funcionario.total_dias_contrato }}</p>
                              </nuxt-link>
                            </el-tooltip>
                          </div>
                          <div class="column">
                            <i v-if="funcionario.fecha_alejamiento" class="el-icon-date has-text-danger-dark"></i>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div class="columns">
                          <div class="column">
                            <el-tooltip :content="`${funcionario.unidad_nom ? funcionario.unidad_nom : '--'}`" placement="top-start">
                                <p>{{funcionario.unidad_abre ? funcionario.unidad_abre : '--'}}</p>
                            </el-tooltip>
                          </div>
                        </div>
                      </td>
                      <td>
                        <nuxt-link :to="`/admin/esquemas/${funcionario.uuid}/turnos`">
                        <el-popover
                          :disabled="(funcionario.total_dias_turno_largo <= 0 && funcionario.total_dias_turno_nocturno <= 0 && funcionario.total_dias_libres <= 0)"
                          placement="top-end"
                          width="150"
                          trigger="hover"
                          >
                          <el-descriptions title="Turnos">
                              <el-descriptions-item label="L">{{funcionario.total_dias_turno_largo_en_periodo_contrato}}</el-descriptions-item>
                              <el-descriptions-item label="N">{{funcionario.total_dias_turno_nocturno_en_periodo_contrato}}</el-descriptions-item>
                              <el-descriptions-item label="X">{{funcionario.total_dias_libres_en_periodo_contrato}}</el-descriptions-item>
                          </el-descriptions>
                          <span slot="reference" :class="(funcionario.es_turnante && funcionario.total_turno > 0 ? 'has-text-success' : (funcionario.es_turnante && funcionario.total_turno <= 0 ? 'has-text-danger' : 'has-text-black'))">{{funcionario.total_turno}}</span>
                        </el-popover>
                        </nuxt-link>
                      </td>
                      <td :class="(open_grupo === 1 ? 'has-background-grey-lighter' : '')">
                        <el-tooltip :disabled="(funcionario.total_dias_grupo_uno <= 0 ? true : false)" class="item" effect="dark" :content="`${funcionario.grupo_uno_n_registros} ${funcionario.grupo_uno_n_registros > 1 ? 'registros' : 'registro'}`" placement="top-start">
                          <nuxt-link :to="`/admin/esquemas/${funcionario.uuid}/ausentismos?grupo=${1}`">
                            <strong :class="funcionario.total_dias_grupo_uno > recarga.total_dias_mes_calculo || funcionario.total_dias_grupo_uno <= 0  ? 'has-text-danger' : 'has-text-success' ">{{funcionario.total_dias_grupo_uno}}</strong>
                          </nuxt-link>
                        </el-tooltip>
                      </td>
                      <template v-if="(open_grupo === 1) && (funcionario.ausentismos_grupo)">
                        <td class="is-bordered has-background-white-ter" v-for="(grupo, index) in funcionario.ausentismos_grupo" :key="index"><span :class="(grupo.total_dias <= 0 ? 'has-text-danger' : 'has-text-success-dark has-text-weight-semibold')">{{grupo.total_dias}}</span></td>
                      </template>
                      <td :class="(open_grupo === 2 ? 'has-background-grey-lighter' : '')">
                        <el-tooltip :disabled="(funcionario.total_dias_grupo_dos <= 0 ? true : false)" class="item" effect="dark" :content="`${funcionario.grupo_dos_n_registros} ${funcionario.grupo_dos_n_registros > 1 ? 'registros' : 'registro'}`" placement="top-start">
                          <nuxt-link :to="`/admin/esquemas/${funcionario.uuid}/ausentismos?grupo=${2}`">
                            <strong :class="funcionario.total_dias_grupo_dos > recarga.total_dias_mes_calculo || funcionario.total_dias_grupo_dos <= 0  ? 'has-text-danger' : 'has-text-success' ">{{funcionario.total_dias_grupo_dos}}</strong>
                          </nuxt-link>
                        </el-tooltip>
                      </td>
                       <template v-if="(open_grupo === 2) && (funcionario.ausentismos_grupo)">
                        <td class="is-bordered has-background-white-ter" v-for="(grupo, index) in funcionario.ausentismos_grupo" :key="index"><span :class="(grupo.total_dias <= 0 ? 'has-text-danger' : 'has-text-success-dark has-text-weight-semibold')">{{grupo.total_dias}}</span></td>
                      </template>
                      <td :class="(open_grupo === 3 ? 'has-background-grey-lighter' : '')">
                        <el-tooltip :disabled="(funcionario.total_dias_grupo_tres <= 0 ? true : false)" class="item" effect="dark" :content="`${funcionario.grupo_tres_n_registros} ${funcionario.grupo_tres_n_registros > 1 ? 'registros' : 'registro'}`" placement="top-start">
                          <nuxt-link :to="`/admin/esquemas/${funcionario.uuid}/ausentismos?grupo=${3}`">
                            <strong :class="funcionario.total_dias_grupo_tres > recarga.total_dias_mes_calculo || funcionario.total_dias_grupo_tres <= 0  ? 'has-text-danger' : 'has-text-success' ">{{funcionario.total_dias_grupo_tres}}</strong>
                          </nuxt-link>
                        </el-tooltip>
                      </td>
                      <template v-if="(open_grupo === 3) && (funcionario.ausentismos_grupo)">
                        <td class="is-bordered has-background-white-ter" v-for="(grupo, index) in funcionario.ausentismos_grupo" :key="index"><span :class="(grupo.total_dias <= 0 ? 'has-text-danger' : 'has-text-success-dark has-text-weight-semibold')">{{grupo.total_dias}}</span></td>
                      </template>
                      <td>
                        <nuxt-link :to="`/admin/esquemas/${funcionario.uuid}/viaticos`">
                            <span :class="(funcionario.calculo_viaticos > 0 ? 'has-text-danger-dark has-text-weight-semibold' : '')">{{ funcionario.calculo_viaticos }}</span>
                        </nuxt-link>
                      </td>
                      <td style="border-bottom: 1px solid; border-color: rgb(14,109,184, 0.5);">
                        <div class="columns">
                          <div class="column is-one-quarter">
                            <el-badge :value="funcionario.ajustes_dias_n_registros" :max="10" class="item" type="warning" :hidden="(funcionario.ajustes_dias_n_registros > 0  ? false : true)">
                              <nuxt-link :to="`/admin/esquemas/${funcionario.uuid}/ajustes`"><span :class="(funcionario.calculo_dias_ajustes  <= 0 ? 'has-text-dark' : 'has-text-danger has-text-weight-semibold')">{{funcionario.calculo_dias_ajustes}}</span></nuxt-link>
                            </el-badge>
                          </div>
                          <template v-if="recarga.last_status_value === 0 && hasPermission('ajuste.create')">
                            <div class="column">
                              <button  class="button is-small" @click.prevent="openModalAddReajuste(index, funcionario, 0)">
                                <span class="icon is-small">
                                  <i class="el-icon-plus"></i>
                                </span>
                              </button>
                            </div>
                          </template>
                        </div>
                      </td>
                      <td><span :class="(funcionario.total_dias_cancelar <= 0 ||  funcionario.total_dias_cancelar < recarga.total_dias_habiles_beneficio ? 'has-text-danger' : (funcionario.total_dias_cancelar > recarga.total_dias_habiles_beneficio ? 'has-background-danger-dark has-text-weight-semibold has-text-white' : '') )">{{funcionario.total_dias_cancelar}}</span></td>
                      <td style="border-bottom: 1px solid; border-color: rgb(14,109,184, 0.5);">
                        <div class="columns">
                          <div class="column">
                            <el-badge :value="funcionario.ajustes_monto_n_registros" :max="10" class="item" type="warning" :hidden="(funcionario.ajustes_monto_n_registros > 0  ? false : true)">
                              <nuxt-link :to="`/admin/esquemas/${funcionario.uuid}/ajustes`"><span :class="(funcionario.total_monto_ajuste <= 0 ? 'has-text-dark' : 'has-text-danger has-text-weight-semibold')">{{funcionario.total_monto_ajuste}}</span></nuxt-link>
                            </el-badge>
                          </div>
                          <template v-if="recarga.last_status_value === 0 && hasPermission('ajuste.create')">
                            <div class="column">
                              <button  class="button is-small" @click.prevent="openModalAddReajuste(index, funcionario, 1)">
                                <span class="icon is-small">
                                  <i class="el-icon-plus"></i>
                                </span>
                              </button>
                            </div>
                          </template>
                        </div>
                      </td>
                      <td><strong :class="(funcionario.monto_cancelar.monto_total_cancelar_value <= 0 ? 'has-text-danger' : (funcionario.monto_cancelar.monto_total_cancelar_value > recarga.monto_estimado_no_turnante ? 'has-background-danger-dark has-text-weight-semibold has-text-white' : 'has-text-success'))">{{ funcionario.monto_cancelar.monto_total_cancelar_format }}</strong></td>
                      <td>
                        <nuxt-link v-if="hasPermission('esquema.read')"  :to="`/admin/esquemas/${funcionario.uuid}/detalle`"><el-button size="mini" type="primary" icon="el-icon-view" circle></el-button></nuxt-link>
                        <template v-if="funcionario.tipo_ingreso && recarga.last_status_value === 0 && hasPermission('esquema.delete')">
                          <el-popconfirm
                            @confirm="deleteEsquema(index, funcionario.id)"
                            confirm-button-type="warning"
                            confirm-button-text='Si, eliminar'
                            cancel-button-text='No'
                            icon="el-icon-info"
                            icon-color="warning"
                            title="¿Eliminar cartola? Los registros asociados no se eliminarán."
                            >
                            <el-button :class="(loadingDeleteData ? 'is-loading' : '')" size="mini" type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
                          </el-popconfirm>
                        </template>
                        <el-button v-if="funcionario.errores.length" type="danger" size="mini" icon="el-icon-message-solid" class="click" circle @click.prevent="showErrores(index, funcionario.errores, funcionario.advertencias)"></el-button>
                        <el-button v-if="funcionario.advertencias.length" type="warning" size="mini" icon="el-icon-message-solid" class="click" circle @click.prevent="showErrores(index, funcionario.errores, funcionario.advertencias)"></el-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <nav class="pagination is-rounded" role="navigation" aria-label="pagination">
                  <a class="pagination-previous" v-if="pagination.current_page > 1" @click.prevent="changePage(pagination.current_page - 1)">Volver</a>
                  <a class="pagination-next" v-if="pagination.current_page < pagination.last_page" @click.prevent="changePage(pagination.current_page + 1)">Siguiente pagina</a>
                  <ul class="pagination-list">
                    <li v-for="page in pagesNumber" :key="page" class="active">
                      <a class="pagination-link" :class="(page === isActived ? 'is-current' : '')" @click.prevent="changePage(page)" >{{page}}</a>
                    </li>
                  </ul>
                </nav>
              </template>
              <template v-else>
                  <el-empty :image-size="90">
                      <div class="row" slot="description">
                      <div class="col-md-12"><span>Sin resultados...</span></div>
                      </div>
                  </el-empty>
              </template>
            </div>
            <div class="buttons">
              <button class="button is-info is-outlined" @click.prevent="openModalGenerarPlanilla">
                <span>Generar planilla</span>
                <span class="icon is-small">
                 <i class="el-icon-download"></i>
                </span>
              </button>
              <button v-if="(recarga.last_status_value === 0 || recarga.last_status_value === 1)" class="button is-is-success is-outlined" @click.prevent="openModalPublicarPlanilla">
                <span>Publicar recarga</span>
                <span class="icon is-small">
                 <i class="el-icon-success"></i>
                </span>
              </button>
              <button :class="(loadingSendCartolas ? 'is-loading' : '')" @click.prevent="sendCartolas" class="button is-is-success is-outlined" v-if="recarga.last_status_value === 2">
                <span>Notificar planilla</span>
                <span class="icon is-small">
                 <i class="el-icon-message"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import MenuRecarga from '../../../../../components/admin/recargas/MenuRecarga.vue';
import MenuRecargaTablaResumen from '../../../../../components/admin/recargas/MenuRecargaTablaResumen.vue';
import MenuTotales from '../../../../../components/admin/recargas/MenuTotales.vue';
import ModalPublicarPlanilla from '../../../../../components/recarga/resumen/modalPublicarPlanilla.vue';
import ModalShowErrores from '../../../../../components/admin/recargas/resumen/ModalShowErrores.vue';
import ModalAddReajuste from '../../../../../components/recarga/resumen/modalAddReajuste.vue';
import ModalGenerarPlanilla from '../../../../../components/recarga/resumen/modalGenerarPlanilla.vue';
import ModalAddEsquema from '../../../../../components/recarga/resumen/modalAddEsquema.vue';

export default {
    middleware: "auth",
    head() {
        return {
            title: `Tabla resumen #${this.$route.params.id}`
        };
    },
    data(){
      return{
        beneficio:true,
        grupo_dos_open:false,
        grupo_tres_open:false,
        esquema_selected:'',
        tipo_reajuste:null,
        setTimeoutBuscador:'',
        errors_funcionario:'',
        advertencias_funcionario:'',
        isIndeterminate: true,
      };
    },
    created() {
        this.getFuncionarios(this.$route.params.id);
        this.getRolesPermissions();
        /* this.getGruposAusentismos(); */

    },
    mounted(){
      this.createdValueGrupo();
      this.getLeyes();
      this.getUnidades(this.$route.params.id);
      this.getCentroCostosRecarga(this.$route.params.id);
      this.getHoras();
      this.getTiposAusentismos();
    },
    computed: {
        ...mapGetters({
            loadingSpinner: "recarga/resumen/resumen/fullScreenLoading",
            loadingIndex:'recarga/resumen/resumen/loadingIndex',
            recarga: "recarga/resumen/resumen/recarga",
            grupos:'modulos/modulos/gruposAusentismos',
            /* funcionarios:'recarga/resumen/resumen/funcionarios', */
            pagination:'recarga/resumen/resumen/pagination',
            offset:'recarga/resumen/resumen/offset',
            loadingTablaResumen:'recarga/resumen/resumen/loadingTablaResumen',
            leyes:'modulos/modulos/leyes',
            unidades:'modulos/modulos/unidadesRecarga',
            horas:'modulos/modulos/horas',
            centroCostosRecarga:'modulos/modulos/centroCostosRecarga',
            tipoAusentismos:'modulos/modulos/tiposAusentismos',
            ordenamientos:'recarga/resumen/resumen/ordenamientos',
            filtrosOrder:'recarga/resumen/resumen/filtroOrder',
            loadingMarcados:'recarga/resumen/resumen/loadingMarcados',
            loadingDeleteData:'recarga/resumen/resumen/loadingDeleteData',
            loadingSendCartolas:'recarga/resumen/resumen/loadingSendCartolas',
            loadingDeleteEsquemaManual:'recarga/resumen/resumen/loadingDeleteEsquemaManual',
        }),
        permissions() {
          return this.$store.state.usuarios.administradores.main.permissions;
        },
        funcionarios:{
          get(){
            return this.$store.state.recarga.resumen.resumen.funcionarios;
          },
          set(newValue){
            this.$store.commit('recarga/resumen/resumen/SET_FUNCIONARIOS', newValue);
          }
        },
        modal_publicar_planilla:{
          get(){
            return this.$store.state.recarga.resumen.resumen.modal_publicar_planilla;
          },
          set(newValue){
            this.$store.commit('recarga/resumen/resumen/SET_MODAL_PUBLICAR_PLANILLA', newValue);
          }
        },
        modal_add_esquema:{
          get(){
            return this.$store.state.recarga.resumen.resumen.modal_add_esquema;
          },
          set(newValue){
            this.$store.commit('recarga/resumen/resumen/SET_MODAL_ADD_ESQUEMA', newValue);
          }
        },
        modal_generar_planilla:{
          get(){
            return this.$store.state.recarga.resumen.resumen.modal_generar_planilla;
          },
          set(newValue){
            this.$store.commit('recarga/resumen/resumen/SET_MODAL_GENERAR_PLANILLA', newValue);
          }
        },
        index_selected_table:{
          get() {
            return this.$store.state.recarga.resumen.resumen.index_selected_table;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_INDEX_SELECTED_TABLE', newValue);
          }
        },
        input_query:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.input;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_INPUT', newValue);
          }
        },
        filtro_tipo_ingreso:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.tipo_ingreso;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_TIPO_INGRESO', newValue);
          }
        },
        filtro_fecha_alejamiento:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.fecha_alejamiento;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_FECHA_ALEJAMIENTO', newValue);
          }
        },
        filtro_beneficio:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.beneficio;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_BENEFICIO', newValue);
          }
        },
        filtro_reemplazo:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.reemplazo;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_REEMPLAZO', newValue);
          }
        },
        filtro_turno_asignaciones:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.turno_asignaciones;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_TURNO_ASIGNACIONES', newValue);
          }
        },
        filtro_turno:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.is_turno;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_TURNO', newValue);
          }
        },
        filtro_errores:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.errores;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_ERRORES', newValue);
          }
        },
        filtro_ajustes:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.ajustes;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_AJUSTES', newValue);
          }
        },
        filtro_leyes:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.leyes;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_LEYES', newValue);
          }
        },
        filtro_unidad:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.unidades;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_UNIDADES', newValue);
          }
        },
        filtro_horas:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.horas;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_HORAS', newValue);
          }
        },
        equals_unidad:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.equals_unidad;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_EQUALS_UNIDADES', newValue);
          }
        },
        filtro_tipo_ausentismo:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.tipo_ausentismo;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_TIPO_AUSENTISMO', newValue);
          }
        },
        filtro_centro_costo:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.centro_costo;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_CENTRO_COSTO', newValue);
          }
        },
        index_click_funcionario:{
          get() {
            return this.$store.state.recarga.resumen.resumen.index_click_funcionario;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_INDEX_CLICK_FUNCTIONARIO', newValue);
          }
        },
        index_click_funcionario_reemplazo:{
          get() {
            return this.$store.state.recarga.resumen.resumen.index_click_reemplazo;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_INDEX_CLICK_REEMPLAZO', newValue);
          }
        },
        current_page:{
          get() {
            return this.$store.state.recarga.resumen.resumen.pagination.current_page;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_CURRENT_PAGE', newValue);
          }
        },
        modalShowErrores:{
          get() {
            return this.$store.state.recarga.resumen.resumen.modal_show_errores;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_MODAL_ERRORES', newValue);
          }
        },
        open_grupo:{
          get() {
            return this.$store.state.recargas.cookies.load_grupo;
          },
          set(newValue) {
            this.$store.commit('recargas/cookies/SET_LOAD_GRUPO', newValue);
          }
        },
        filtro_open_grupo:{
          get() {
            return this.$store.state.recarga.resumen.resumen.filtro.load_grupo;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_FILTRO_GRUPO', newValue);
          }
        },
        visible:{
          get() {
            return this.$store.state.recarga.resumen.resumen.modal_status_marcados;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_MODAL_STATUS_MARCADOS', newValue);
          }
        },
        esquemas_checked:{
          get() {
            return this.$store.state.recarga.resumen.resumen.esquemas_checked;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_ESQUEMAS_CHECKED', newValue);
          }
        },
        checked_all:{
          get() {
            return this.$store.state.recarga.resumen.resumen.checked_all;
          },
          set(newValue) {
            this.$store.commit('recarga/resumen/resumen/SET_CHECKED_ALL', newValue);
          }
        },
        isActived: function () {
          return this.pagination.current_page;
        },
        pagesNumber: function () {
            if (!this.pagination.to) {
                return [];
            }
            var from = this.pagination.current_page - this.offset;
            if (from < 1) {
                from = 1;
            }
            var to = from + (this.offset * 2);
            if (to >= this.pagination.last_page) {
                to = this.pagination.last_page;
            }
            var pagesArray = [];
            while (from <= to) {
                pagesArray.push(from);
                from++;
            }
            return pagesArray;
        },
        isParamASC() {
          return (param) => {
            const element = this.filtrosOrder.find(order => order.nombre === param.nombre);
            if ((element) && (element.order === 'ASC')) {
              return true;
            } else {
              return false;
            }
          }
        },
        isParamDESC() {
          return (param) => {
            const element = this.filtrosOrder.find(order => order.nombre === param.nombre);
            if ((element) && (element.order === 'DESC')) {
              return true;
            } else {
              return false;
            }
          }
        }
    },
    methods: {
        ...mapActions({
            getFuncionarios: "recarga/resumen/resumen/getFuncionarios",
            getGruposAusentismos: "modulos/modulos/getGruposAusentismos",
            changeBeneficioFuncionario:'recarga/resumen/resumen/changeBeneficioFuncionario',
            changeReemplazoFuncionario:'recarga/resumen/resumen/changeReemplazoFuncionario',
            changeTurnoFuncionario:'recarga/resumen/resumen/changeTurnoFuncionario',
            createdValueGrupo:'recargas/cookies/createdValueGrupo',
            getLeyes:'modulos/modulos/getLeyes',
            getHoras:'modulos/modulos/getHoras',
            getUnidades:'modulos/modulos/getUnidadesRecarga',
            getTiposAusentismos:'modulos/modulos/getTiposAusentismos',
            getCentroCostosRecarga:'modulos/modulos/getCentroCostosRecarga',
            getRolesPermissions:'usuarios/administradores/main/getRolesPermissions',
            updateStatusMarcadosAction:'recarga/resumen/resumen/updateStatusMarcados',
            deleteDataRecarga:'recarga/resumen/resumen/deleteDataRecarga',
            sendCartolasAction:'recarga/resumen/resumen/sendCartolas',
            deleteEsquemaAction:'recarga/resumen/resumen/deleteEsquema'
        }),
        keySearchInput:function(){
            if(this.input_query.length > 1){
              this.current_page = 1;
              clearTimeout(this.setTimeoutBuscador);
              this.setTimeoutBuscador = setTimeout(this.actionGetFuncionarios, 800);
            }else if(this.input_query.length === 0){
              this.current_page = 1;
              clearTimeout(this.setTimeoutBuscador);
              this.setTimeoutBuscador = setTimeout(this.actionGetFuncionarios, 800);
            }
          },
        editBeneficio:function(index, funcionario_id){
          this.open_grupo = null;
          this.index_click_funcionario = index;
          let data = {
            user_id:funcionario_id,
            codigo_recarga:this.$route.params.id
          };
          this.changeBeneficioFuncionario(data);
        },
        editReemplazo(index, funcionario_id){
          this.open_grupo = null;
          this.index_click_funcionario_reemplazo = index;
          let data = {
            user_id:funcionario_id,
            codigo_recarga:this.$route.params.id
          };
          this.changeReemplazoFuncionario(data);
        },
        openGrupo:function(value){
          if(this.open_grupo != null && this.open_grupo === value){
            this.open_grupo = null;
          }else{
            this.open_grupo = value;
          }
          this.filtro_open_grupo = this.open_grupo;
          this.getFuncionarios(this.$route.params.id);
        },
        openModalAddReajuste:function(index, esquema, tipo_reajuste){
          this.esquema_selected     = esquema;
          this.tipo_reajuste        = tipo_reajuste;
          this.$store.commit('recarga/resumen/resumen/SET_MODAL_REAJUSTE', true);
        },
        actionGetFuncionarios:function(){
          this.getFuncionarios(this.$route.params.id);
        },
        actionGetFuncionariosFiltro:function(){
          clearTimeout(this.setTimeoutBuscador);
          this.setTimeoutBuscador = setTimeout(this.changePage(1), 2000);
        },
        changePage(page) {
          this.current_page = page;
          this.actionGetFuncionarios();
        },
        clickItem:function(index){
          this.changeColorSelected(index);
        },
        showErrores:function(index, errores, advertencias){
          this.changeColorSelected(index);
          this.modalShowErrores       = true;
          this.errors_funcionario       = errores;
          this.advertencias_funcionario = advertencias;
        },
        changeColorSelected:function(index){
          if(this.index_selected_table === undefined){
              this.index_selected_table = index;
          }else if(this.index_selected_table != index){
              this.index_selected_table = index;
          }
        },
        orderByData:function(value){
          this.$store.commit('recarga/resumen/resumen/SET_VALUE_ORDENACION', value);
          this.actionGetFuncionariosFiltro();
        },
        openModalPublicarPlanilla:function(){
          this.modal_publicar_planilla = true;
        },
        openModalGenerarPlanilla:function(){
          this.modal_generar_planilla = true;
        },
        openModalAddEsquema:function(){
          this.modal_add_esquema = true;
        },
        hasPermission:function(permission){
          return this.permissions.includes(permission);
        },
        checkAllButton:function(){
          console.log(this.checked_all);
          if(this.checked_all === true){
            this.visible = true;
          }
        },
        handleCheckAllChange(val) {
          this.isIndeterminate = false;
          if(this.checked_all === true){
            this.visible = true;
            this.esquemas_checked = this.funcionarios ? this.funcionarios.map(f => f.id) : [];
            this.funcionarios = this.funcionarios.map(funcionario => {
              return {
                ...funcionario,
                checked: true
              };
            });
          }else{
            this.visible = false;
            this.esquemas_checked = [];
            this.funcionarios = this.funcionarios.map(funcionario => {
              return {
                ...funcionario,
                checked: false
              };
            });
          }
        },
        hideTop:function(){
          if((this.checked_all === true) && (this.esquemas_checked && this.esquemas_checked.length > 0)){
            this.visible = true;
          }else{
            this.visible = false;
          }
        },
        toggleFuncionarioCheck:function(funcionario){
          this.visible = true;
          this.$store.commit('recarga/resumen/resumen/SET_UPDATE_FUNCIONARIO_CHECKED', funcionario.id);
          this.updateFuncionariosMarcados();
        },
        updateFuncionariosMarcados() {
          this.esquemas_checked = this.funcionarios.filter(funcionario => funcionario.checked).map(funcionario => funcionario.id);
        },
        statusEsquemas:function(value){
          const data = {
            codigo:this.$route.params.id,
            esquemas_id:this.esquemas_checked,
            status:value
          };
          this.updateStatusMarcadosAction(data);
        },
        editTurno:function(index, funcionario_id){
          this.index_click_funcionario = index;
          let data = {
            user_id:funcionario_id,
            codigo_recarga:this.$route.params.id
          };
          this.changeTurnoFuncionario(data);
        },
        deleteEsquema:function(index, esquema_id){
          this.changeColorSelected(index);
          this.deleteEsquemaAction(esquema_id);
        },
        deleteData:function(value){
          const data = {
            codigo_recarga:this.$route.params.id,
            modulo:value
          };
          this.deleteDataRecarga(data);
        },
        sendCartolas:function(){
          this.sendCartolasAction(this.$route.params.id);
        }
    },
    components: { MenuRecarga, MenuTotales, MenuRecargaTablaResumen, ModalPublicarPlanilla, ModalShowErrores, ModalAddReajuste, ModalGenerarPlanilla, ModalAddEsquema }
}
</script>

<style>
  .reajuste {
    border-bottom: 1px solid;
  }
</style>
