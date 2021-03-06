import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    productos: [],
    titulos: [
      {
        label: "Código",
        key: "codigo",
      },
      {
        label: "Producto",
        key: "nombre",
      },
      {
        label: "Stock",
        key: "stock",
      },
      {
        label: "Precio",
        key: "precio",
      },
      {
        key: "actions",
        label: "Acciones",
      },
    ],
    editar: false,
    jugueteEditar: {
      nombre: "",
      precio: "",
      codigo: "",
      id: "",
      stock: "",
    },
  },
  mutations: {
    guardarProductos(state, payload) {
      const juguete = payload;
      if (!juguete) return;
      state.productos.push(juguete);
    },
    borrarProducto(state, payload) {
      const juguete = payload;
      if (!juguete) return;
      const index = state.productos.indexOf(juguete);
      const index2 = state.productos.indexOf(index);
      console.log(index2);
      state.productos.splice(index, 1);
    },
    booleanEditar(state) {
      state.editar = true;
    },
    editarJuguete(state, payload) {
      const juguete = payload;
      state.jugueteEditar = juguete;
    },
  },
  actions: {
    async getProductos({ commit }) {
      const db = firebase.firestore();
      try {
        const req = await db.collection("ottoklaus").get();
        if (req) {
          req.docs.forEach((juguete) => {
            const obj = juguete.data();
            const id = juguete.id;
            obj.id = id;
            commit("guardarProductos", obj);
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async deleteProducto({ commit }, payload) {
      const juguete = payload;
      if (!juguete) return;
      // const idFirebase = juguete.id;

      // Eliminar desde Firebase
      // try {
      //   const db = firebase.firestore();
      //   const req = await db.collection("juguetes").doc(idFirebase).delete();
      //   console.log(req);
      // } catch (error) {
      //   console.log(error);
      // }

      // Eliminar desde Vuex
      commit("borrarProducto", juguete);
    },
    async updateProducto({ commit }, payload) {
      const juguete = payload;
      if (!juguete) return;
      const idFirebase = juguete.id;
      
      // Firebase
      try {
        const req = await firebase
          .firestore()
          .collection("ottoklaus")
          .doc(idFirebase)
          .update({
            stock: juguete.stock,
            nombre: juguete.nombre,
            precio: juguete.precio
          });
        console.log(req);
      } catch (error) {
        console.log(error);
      }
      // Vuex
      commit();
    },
  },
  modules: {},
});
