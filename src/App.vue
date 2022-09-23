<template>
  <v-app>
    <v-dialog v-model="loginDialogo" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Acceder al sistema</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="nombre"
                  label="Usuario"
                  :rules="[rules.required]"
                  :error="nombre.length <= 0"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  :append-icon="verClave ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required]"
                  :type="verClave ? 'text' : 'password'"
                  name="txClave"
                  label="Contraseña"
                  v-model="clave"
                  :error="clave.length <= 0"
                  @click:append="verClave = !verClave"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cerrar()"> Cancelar </v-btn>
          <v-btn color="blue darken-1" text @click="login()"> Acceder </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Logo Ecuamedica"
          class="shrink mr-2"
          contain
          src="./assets/logo_ecuamedica.png"
          transition="scale-transition"
          width="42"
        />
      </div>
      <div v-show="accedido">
        <v-btn
          v-if="esCompacto($vuetify.breakpoint.name)"
          icon
          @click="pacientesIr()"
          title="Pacientes"
          class="ml-4"
        >
          <v-icon>mdi-account-multiple</v-icon>
        </v-btn>
        <v-btn v-else text @click="pacientesIr()" class="ml-4">
          <span class="mr-2">Pacientes</span>
          <v-icon>mdi-account-multiple</v-icon>
        </v-btn>

        <v-btn
          v-if="esCompacto($vuetify.breakpoint.name)"
          title="Citas médicas"
          icon
          @click="citasIr()"
        >
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
        <v-btn v-else text @click="citasIr()">
          <span class="mr-2">Citas médicas</span>
          <v-icon>mdi-calendar</v-icon>
        </v-btn>
      </div>

      <v-spacer></v-spacer>
      <v-btn text @click="acceder()">
        <span class="mr-2">{{ accederEtiqueta }}</span>
        <v-icon v-if="accedido">mdi-exit-to-app</v-icon>
        <v-icon v-else>mdi-key</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  data: () => ({
    loginDialogo: false,
    nombre: "",
    clave: "",
    verClave: false,
    rules: {
      required: (value) => !!value || "Campo requerido.",
    },
    accedido: false,
  }),
  computed: {
    ...mapState(["token", "usuario"]),
    accederEtiqueta() {
      return this.usuario.length > 0 ? this.usuario : "Acceder";
    },
  },
  methods: {
    pacientesIr() {
      this.$router.push({
        path: "/pacientes",
      });
    },
    citasIr() {
      this.$router.push({
        path: "/citas",
      });
    },
    esCompacto(s) {
      switch (s) {
        case "xs":
          return true;
        case "sm":
          return true;
        default:
          return false;
      }
    },
    acceder() {
      if (this.usuario.length <= 0) {
        this.loginDialogo = true;
      } else {
        this.$store.commit("pasarSesion", {
          usuario: "",
          token: "",
        });
        this.accedido = false;
        this.$router.push({
          name: "Inicio",
        });
      }
    },
    login() {
      this.$store
        .dispatch("usuarioAcceder", {
          usuario: this.nombre,
          clave: this.clave,
        })
        .then(
          function (r) {
            this.$store.commit("pasarSesion", {
              usuario: this.nombre,
              token: r,
            });
            this.loginDialogo = false;
            this.nombre = "";
            this.clave = "";
            this.accedido = true;
          }.bind(this)
        );
    },
    cerrar() {
      this.nombre = "";
      this.clave = "";
      this.loginDialogo = false;
    },
  },
};
</script>
