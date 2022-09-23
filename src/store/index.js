import Vue from 'vue'
import Vuex from 'vuex'
const md5 = require("md5");

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiBase: 'http://127.0.0.1:8000/api',
    usuario: '',
    token: ''
  },
  getters: {
    token: state => state.token,
  },
  mutations: {
    pasarSesion(state, data) {
      state.usuario = data.usuario
      state.token = data.token
    }
  },
  actions: {
    async pacientesTodos({ state }) {
      const response = await fetch(state.apiBase + '/pacientes/todos', {
        headers: {
          'Authorization': 'Bearer ' + state.token,
          'Access-Control-Allow-Origin': '*'
        }
      });
      const data = await response.json();
      return data;
    },
    async pacientesFiltrado({ state }, filtro) {
      const response = await fetch(state.apiBase + '/pacientes/filtrados/' + filtro, {
        headers: {
          'Authorization': 'Bearer ' + state.token,
          'Access-Control-Allow-Origin': '*'
        }
      });
      const data = await response.json();
      return data;
    },
    async usuarioAcceder({ state }, p) {
      const response = await fetch(state.apiBase + '/usuario/acceder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          usuario: p.usuario,
          clave: md5(p.clave)
        })
      });
      return response.text();
    },
    async pacienteNuevo({ state }, paciente) { 
      await fetch(state.apiBase + '/paciente/crear', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + state.token,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(paciente)
      });
    },
    async pacienteModificar({ state }, paciente) {
      await fetch(state.apiBase + '/paciente/modificar', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + state.token,
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(paciente)
      });
    },
    async pacienteEliminar({ state }, pacienteId) {
      await fetch(state.apiBase + '/paciente/'  + pacienteId + '/eliminar', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + state.token,
          'Access-Control-Allow-Origin': '*'
        },
      });
    },
    async citasPeriodo({ state }, filtro) {
      const response = await fetch(state.apiBase + '/citas/desde/' + filtro.desde + '/hasta/' + filtro.hasta + '/paginas/' + filtro.pagina, {
        headers: {
          'Authorization': 'Bearer ' + state.token,
          'Access-Control-Allow-Origin': '*'
        }
      });
      const data = await response.json();
      return data;
    },
  },
  modules: {
  }
})
