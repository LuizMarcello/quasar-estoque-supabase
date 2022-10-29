<!-- eslint-disable -->
<template>
  <q-page padding>
    <div class="row">
      <q-table
        title="Products"
        :rows="products"
        :columns="columnsProduct"
        row-key="id"
        class="col-12"
        :loading="loading"
        :filter="filter"
        grid
      >
      <!-- "debounce:" Esperar para começar a pesquisar -->
        <template v-slot:top>
          <span class="text-h6"> Products </span>
          <q-space />
          <q-input
            outlined
            dense
            debounce="300"
            v-model="filter"
            placeholder="Search"
            class="q-mr-sm"
          >
            <template v-slot:append>
              <q-icon name="mdi-magnify" />
            </template>
          </q-input>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-card>
              <q-img :src="props.row.img_url" :ratio="4 / 3" />
              <q-card-section class="text-center">
                <div class="text-h6">{{ props.row.name }}</div>
                <div class="text-subtitle2">
                  {{ formatCurrency(props.row.price) }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
    <!-- "offset": espaçamentos -->
  </q-page>
</template>

<script>
/* vue3 */
/* Na "compositionApi" do vue3, temos que importar
   este "onMounted" */
import { defineComponent, ref, onMounted } from "vue";
import useApi from "src/composables/UseApi";
import { useRoute } from "vue-router";
import useNotify from "src/composables/UseNotify";
import { columnsProduct } from "./table";
import { formatCurrency } from "src/utils/format";

/* vue3 */
export default defineComponent({
  name: "PageproductPublic",

  setup() {
    const products = ref([]);

    /* Com esta variável "api", temos acesso a todos os métodos
       dentro do composable de acesso a api (para o supabase)
       (UseApi.js)  */
    //const api = useApi();
    /* Mas assim, importamos os métodos "listPublic" e "remove" diretamente de
       dentro do composable */

    /* Para listar somente os produtos dddaqueleee usuário */
    const { listPublic } = useApi();

    /* Para listar todos os produtos */
    /*  const { list, remove } = useApi(); */

    /* const { user } = useAuthUser(); */

    const loading = ref(true);

    const filter = ref("");

    const table = "product";

    const { notifyError } = useNotify();

    const route = useRoute();

    const handleListProducts = async (userId) => {
      try {
        /* Tabela do supabase "product" */
        loading.value = true;
        /* Para listar todos os produtos */
        /* products.value = await list(table); */
        /* Para listar somente os produtos dddaqueleee usuário */
        /* products.value = await listPublic(table, user.value.id); */
        products.value = await listPublic(table, userId);
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
      }
    };

    onMounted(() => {
      if (route.params.id) {
        handleListProducts(route.params.id);
      }
    });

    /* return: Para serem usados aqui neste componente mesmo */
    return {
      columnsProduct,
      products,
      loading,
      filter,
      formatCurrency,
    };
  },
});
</script>
