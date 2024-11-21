<template>
  <v-container>
    <v-text-field
      v-model="filter"
      label="Buscar minerales"
      class="mb-4"
    ></v-text-field>
    <v-data-table
  :items="filteredMinerals"
 
  class="elevation-1"
>
  
</v-data-table>
  </v-container>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  setup() {
    const minerals = ref([]);
    const filter = ref("");

    const headers = [
      { text: "Familia", value: "Familia" },
      { text: "Nombre Común", value: "Nombre_Común" },
      { text: "Nombre Científico", value: "Nombre_Científico" },
      { text: "Fórmula Química", value: "Fórmula_Química" },
      { text: "Color", value: "Color" },
      { text: "Dureza", value: "Dureza" },
      { text: "Peso Específico", value: "Peso_Específico" },
      { text: "Forma", value: "Forma" },
      { text: "Raya", value: "Raya" },
      { text: "Brillo", value: "Brillo" },
      { text: "Comentarios", value: "Comentarios" },
      { text: "Identificación", value: "Identificación" },
      { text: "Limitaciones", value: "Limitaciones" },
      { text: "Grupo", value: "grupo" }
    ];

    const filteredMinerals = computed(() => {
      return minerals.value.filter((mineral) =>
        mineral.Nombre_Común?.toLowerCase().includes(filter.value.toLowerCase())
      );
    });

    onMounted(async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "minerales"));
        minerals.value = querySnapshot.docs.map((doc) => doc.data());
      } catch (error) {
        console.error("Error al obtener los datos de Firebase:", error);
      }
    });

    return { minerals, filter, headers, filteredMinerals };
  },
};
</script>
