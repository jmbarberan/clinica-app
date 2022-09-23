<template>
  <div>
    <v-data-table
      :headers="encabezados"
      :items="pacientes"
      sort-by="nombre"
      class="elevation-1"
      :loading="consultando"
      loading-text="Consultando... Espere por favor"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Pacientes</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-switch v-model="eliminados" label="Ver eliminados" class="mt2"></v-switch>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialogo" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Nuevo
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ tituloEditor }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="pacienteEditando.nombre"
                        label="Nombre"
                        :rules="[rules.required]"
                        :error="pacienteEditando.nombre.length <= 0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="pacienteEditando.cedula"
                        label="Cédula"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="pacienteEditando.direccion"
                        label="Dirección"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        v-model="pacienteEditando.email"
                        label="Correo electrónico"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="pacienteEditando.telefono"
                        label="Telefono"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-menu
                        ref="menu"
                        v-model="menuFecha"
                        :close-on-content-click="false"
                        :return-value.sync="pacienteEditando.fecha_nacimiento"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="pacienteEditando.fecha_nacimiento"
                            label="Fecha de nacimiento"
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="pacienteEditando.fecha_nacimiento"
                          no-title
                          scrollable
                          locale="es"
                        >
                          <v-spacer></v-spacer>
                          <v-btn text color="primary" @click="menuFecha = false">
                            Cancelar</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.menu.save(pacienteEditando.fecha_nacimiento)"
                          >
                            Aceptar
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cerrar()"> Cancelar </v-btn>
                <v-btn color="blue darken-1" text @click="guardar()"> Guardar </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogoEliminar" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Seguro de eliminar este item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="cerrarEliminar()"
                  >Cancelar</v-btn
                >
                <v-btn color="blue darken-1" text @click="eliminarPaciente()"
                  >Proceder</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="modificar(item)"> mdi-pencil </v-icon>
        <v-icon v-show="esActivo(item)" small @click="eliminarConfirmar(item)">
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:item.deleted_at="{ item }">
        <v-chip :color="getColor(item.deleted_at)" dark> </v-chip>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="listar()"> Reiniciar </v-btn>
      </template>
    </v-data-table>
    <v-overlay :value="ocupado">
      <v-progress-circular indeterminate size="48"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
  name: "Pacientes",
  data() {
    return {
      dialogo: false,
      dialogoEliminar: false,
      eliminarId: 0,
      eliminados: false,
      menuFecha: false,
      consultando: false,
      ocupado: false,
      encabezados: [
        { text: "Nombre", value: "nombre" },
        { text: "Cedula", value: "cedula" },
        { text: "Direccion", value: "direccion" },
        { text: "Telefono", value: "telefono" },
        { text: "Fecha nac.", value: "fecha_nacimiento" },
        { text: "Status", value: "deleted_at", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      pacientes: [],
      pacienteEditando: {
        id: 0,
        nombre: "",
        cedula: "",
        fecha_nacimiento: null,
        direccion: "",
        telefono: "",
        email: "",
      },
      rules: {
        required: (value) => !!value || "Campo requerido.",
      },
    };
  },
  computed: {
    tituloEditor() {
      return this.pacienteEditando.id > 0 ? "Modicando paciente" : "Paciente nuevo";
    },
  },
  watch: {
    eliminados() {
      this.listar();
    },
  },
  methods: {
    listar() {
      this.consultando = true;
      this.$store.dispatch("pacientesFiltrado", this.eliminados ? 1 : 0).then(
        function (r) {
          this.pacientes = r;
          this.consultando = false;
        }.bind(this)
      );
    },
    modificar(paciente) {
      if (paciente.id > 0) {
        this.pacienteEditando = JSON.parse(JSON.stringify(paciente));
        this.dialogo = true;
      }
    },
    guardar() {
      this.ocupado = true;
      if (this.pacienteEditando.nombre.length > 0) {
        let fun = this.pacienteEditando.id > 0 ? "pacienteModificar" : "pacienteNuevo";
        this.$store.dispatch(fun, this.pacienteEditando).then(
          function () {
            this.cerrar();
            this.listar();
            this.ocupado = false;
          }.bind(this)
        );
      }
    },
    cerrar() {
      this.dialogo = false;
      this.pacienteEditando = {
        id: 0,
        nombre: "",
        cedula: "",
        fecha_nacimiento: null,
        direccion: "",
        telefono: "",
        email: "",
      };
    },
    cerrarEliminar() {
      this.dialogoEliminar = false;
      this.eliminarId = 0;
    },
    eliminarConfirmar(paciente) {
      if (paciente.id > 0) {
        this.eliminarId = paciente.id;
        this.dialogoEliminar = true;
      }
    },
    eliminarPaciente() {
      if (this.eliminarId > 0) {
        this.$store.dispatch("pacienteEliminar", this.eliminarId).then(
          function () {
            this.cerrarEliminar();
            this.listar();
          }.bind(this)
        );
      }
    },
    getColor(p) {
      if (p != null) return "red";
      else return "green";
    },
    esActivo(p) {
      return p.deleted_at == null;
    },
  },
  mounted() {
    this.listar();
  },
};
</script>
