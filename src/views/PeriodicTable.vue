<template>
    <v-container>
      <h1 class="text-center mb-4">Tabla Periódica</h1>
      <div class="periodic-table">
        <div
          v-for="element in elements"
          :key="element.atomicNumber"
          class="element"
          :class="getGroupClass(element.group)"
          :style="getElementStyle(element)"
          @mouseover="hoverElement(element)"
          @mouseleave="hoverElement(null)"
          @click="selectElement(element)"
        >
          <div class="element-number">{{ element.atomicNumber }}</div>
          <div class="element-symbol">{{ element.symbol }}</div>
          <div class="element-name">{{ element.name }}</div>
        </div>
      </div>
  
      <!-- Diálogo para mostrar detalles del elemento -->
      <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-title class="text-h5">{{ selectedElement?.name }}</v-card-title>
          <v-card-text>
            <p><strong>Símbolo:</strong> {{ selectedElement?.symbol }}</p>
            <p><strong>Número Atómico:</strong> {{ selectedElement?.atomicNumber }}</p>
            <p><strong>Peso Atómico:</strong> {{ selectedElement?.atomicMass }}</p>
            <p><strong>Grupo:</strong> {{ selectedElement?.group }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  
  
  
  
  <script>// Asegúrate de que este JSON tenga gridColumn y gridRow
//import { ref, onMounted, computed } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
  export default {
    data() {
      return {
        elements:[], // Los datos de los elementos de la tabla periódica
        dialog: false,
        selectedElement: null,
        hoveredElement: null,
      };
    },
    methods: {
      hoverElement(element) {
        this.hoveredElement = element;
      },
      selectElement(element) {
        this.selectedElement = element;
        this.dialog = true;
      },
      getElementStyle(element) {
        return {
          gridColumn: element.gridColumn,
          gridRow: element.gridRow,
        };
      },
      getGroupClass(group) {
        // Asignar clases según el grupo
        switch (group) {
          case "Metal alcalino":
            return "metales-alcalinos";
          case "Metal alcalinotérreo":
            return "metales-alcalinoterreos";
          case "Metal de transición":
            return "metales-transicion";
          case "Lantánido":
            return "lantánidos";
          case "Actínido":
            return "actínidos";
          case "Gas noble":
            return "gases-nobles";
          case "Halógeno":
            return "halogenuros";
          case "Metaloide":
            return "metaloides";
          case "No metal":
            return "no-metales";
          default:
            return "grupo-desconocido";
        }
      },
      async fetchElements() {
      try {
        const querySnapshot = await getDocs(collection(db, "tabla_periodica"));
        this.elements = querySnapshot.docs.map((doc) => doc.data());
        console.log("Datos cargados desde Firebase:", this.elements);
      } catch (error) {
        console.error("Error al cargar datos de Firebase:", error);
      }
    },
    },
    mounted() {
    this.fetchElements(); // Llama a la función para cargar los datos al montar el componente
  },
 
  };
  
</script>

<style>.periodic-table {
    display: grid;
    grid-template-columns: repeat(18, 1fr); /* 18 columnas */
    grid-template-rows: repeat(7, 1fr); /* 7 filas principales */
    gap: 4px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .element {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    padding: 8px;
    text-align: center;
    font-family: Arial, sans-serif;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .element:hover {
    transform: scale(1.1);
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  }
  
  /* Clases por grupo */
  .metales-alcalinos {
    background-color: #ffcccc;
  }
  
  .metales-alcalinoterreos {
    background-color: #ffcc99;
  }
  
  .metales-transicion {
    background-color: #ffff99;
  }
  
  .lantánidos {
    background-color: #ccccff;
  }
  
  .actínidos {
    background-color: #cc99ff;
  }
  
  .gases-nobles {
    background-color: #99ccff;
  }
  
  .halogenuros {
    background-color: #99ffff;
  }
  
  .metaloides {
    background-color: #ffccff;
  }
  
  .no-metales {
    background-color: #ccffcc;
  }
  
  .element-number {
    font-size: 0.75rem;
  }
  
  .element-symbol {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .element-name {
    font-size: 0.75rem;
  }
</style>
  