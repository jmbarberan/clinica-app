<template>
  <div class="mt-4">
    <v-data-table
      :headers="encabezados"
      :items="citas"
      :loading="consultando"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Citas médicas</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-menu
            ref="menuDesde"
            v-model="menuDesde"
            :close-on-content-click="false"
            :return-value.sync="desde"
            transition="scale-transition"
            offset-y
            min-width="auto"
            :loading="consultando"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="desde"
                label="Fecha de inicio"
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="desde" no-title scrollable locale="es">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menuDesde = false"> Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.menuDesde.save(desde)">
                Aceptar
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-menu
            ref="menuHasta"
            v-model="menuHasta"
            :close-on-content-click="false"
            :return-value.sync="hasta"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="hasta"
                label="Fecha de corte"
                append-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                class="mx-4"
              ></v-text-field>
            </template>
            <v-date-picker v-model="hasta" no-title scrollable locale="es">
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menuHasta = false"> Cancelar</v-btn>
              <v-btn text color="primary" @click="$refs.menuHasta.save(hasta)">
                Aceptar
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-btn icon @click="listar()" title="Ejeciutar busqueda" class="ml-4">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </v-toolbar>
      </template>
      <template v-slot:footer>
        <v-pagination
          v-model="paginaActual"
          :length="paginasConteo"
          @input="cambiarPagina"
          class="mt-4"
        ></v-pagination>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "Citas",
  data() {
    return {
      desde: new Date().toISOString().split("T")[0],
      hasta: new Date().toISOString().split("T")[0],
      menuDesde: false,
      menuHasta: false,
      encabezados: [
        { text: "Paciente", value: "paciente.nombre" },
        { text: "Medico", value: "paciente.cedula" },
        { text: "Especialidad", value: "especialidad.denominacion" },
        { text: "Fecha", value: "fecha" },
        { text: "Sintomas", value: "sintomas" },
        { text: "Diagnostico", value: "diagnostico" },
        { text: "Tratamiento", value: "tratamiento" },
        { text: "S. vitales", value: "signos_vitales" },
      ],
      citas: [],
      consultando: false,
      paginaActual: 1,
      paginasConteo: 0,
      porPagina: 10,
      paginasVisibles: 0,
    };
  },
  methods: {
    listar() {
      this.consultando = true;
      this.$store
        .dispatch("citasPeriodo", {
          desde: this.desde,
          hasta: this.hasta,
          pagina: this.porPagina.toString() + "?page=" + this.paginaActual.toString(),
        })
        .then(
          function (r) {
            this.citas = r.data;
            this.paginasConteo = r.links.length - 2;
            this.consultando = false;
          }.bind(this)
        );
    },
    cambiarPagina(val) {
      this.paginaActual = val;
      this.listar();
    },
  },
};
</script>
