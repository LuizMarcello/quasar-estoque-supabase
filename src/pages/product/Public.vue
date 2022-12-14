<!-- eslint-disable -->
<!-- Este é o componente pai do "DialogProductDetails.vue" -->
<template>
  <q-page padding>
    <div class="row" v-if="brand.name">
      <div class="col-12 text-center text-h4">
        {{ brand.name }}
      </div>
    </div>
    <div class="row">
      <!-- option-label: ) O label deste objeto.O campo do objeto selecionado que ficará visivel no select -->
      <!-- option-value: O campo do objeto(no caso, o ID) que será o value do objeto selecionado -->
      <!-- map-options: mapeia todas as opções do objeto -->
      <!-- emit-value: Para emitir somente o valor já definido, no caso, o ID -->
      <!-- clearable: Permite limpar o filtro, após selecionar uma categoria -->
      <!-- Este select permite selecionar uma das categorias, para posteriormente
           pesquisar somente os itens desta categoria escolhida -->
      <!-- @update: Se houve alguma modificação neste select -->
      <q-select
        outlined
        v-model="categoryId"
        :options="optionsCategories"
        label="Category"
        option-label="name"
        option-value="id"
        map-options
        emit-value
        clearable
        class="col-12"
        dense
        @update:model-value="handleListProducts(route.params.id)"
      />
      <!-- {{ categoryId }} -->

      <!-- Como o "initialPagination", na "table.js", está com "ref", e aqui,
     com "v-model:pagination", então vai ser reativo, qualquer modificação
     lá, já vai ser alterado aqui também  -->
      <!-- "hide-pagination": Para esconder a paginação padrão do quasar -->
      <q-table
        title="Products"
        :rows="products"
        :columns="columnsProduct"
        v-model:pagination="initialPagination"
        row-key="id"
        class="col-12"
        :loading="loading"
        :filter="filter"
        grid
        hide-pagination
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
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3">
            <!-- "props.row": Toda informação deste produto -->
            <q-card
              class="cursor-pointer"
              v-ripple:primary
              @click="handleShowDetails(props.row)"
            >
              <q-img :src="props.row.img_url" :ratio="4 / 3" />
              <q-card-section class="text-center">
                <div class="text-h6">{{ props.row.name }}</div>
                <div class="text-subtitle2">
                  {{ formatCurrency(props.row.price) }}
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Este "props" vem da "q-table"(tabela) acima. São propriedades desta tabela -->
          <!-- rowIndex: Qual o número da linha -->
          <div class="col-12" v-if="props.rowIndex === 3 && brand.paralax_url">
            <q-parallax :height="200" :speed="0.5">
              <template v-slot:media>
                <img :src="brand.paralax_url" />
              </template>
              <h3 class="text-white">{{ brand.name }}</h3>
            </q-parallax>
          </div>
        </template>
      </q-table>
    </div>
    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="initialPagination.page"
        :max="pagesNumber"
        direction-links
        @update:model-value="handleScrollToTop"
      />
    </div>
    <!-- Estas "props" foram criadas lá no componente
         filho, "DialogProductDetails.vue" -->
    <dialog-product-details
      :show="showDialogDetails"
      :product="productDetails"
      @hide-dialog="showDialogDetails = false"
    />
    <!-- "offset": espaçamentos -->
  </q-page>
</template>

<script>
/* vue3 */
/* Na "compositionApi" do vue3, temos que importar
   este "onMounted" */
import { defineComponent, ref, onMounted, computed } from "vue";
import useApi from "src/composables/UseApi";
import { useRoute } from "vue-router";
import useNotify from "src/composables/UseNotify";
import { columnsProduct, initialPagination } from "./table";
import { formatCurrency } from "src/utils/format";
/* Importando aqui este componente(também será declarado) */
import DialogProductDetails from "src/components/DialogProductDetails.vue";

/* vue3 */
export default defineComponent({
  name: "PageproductPublic",

  /* Declarando aqui este componente(já foi importado) */
  components: {
    DialogProductDetails,
  },

  setup() {
    const products = ref([]);

    /* Com esta variável "api", temos acesso a todos os métodos
       dentro do composable de acesso a api (para o supabase)
       (UseApi.js)  */
    //const api = useApi();
    /* Mas assim, importamos os métodos "listPublic" e "remove" diretamente de
       dentro do composable */

    /* Para listar todos os produtos */
    /*  const { list, remove } = useApi(); */

    /* const { user } = useAuthUser(); */

    const loading = ref(true);

    const filter = ref("");

    const table = "product";

    const showDialogDetails = ref(false);

    /* É reativo e começa com um "array de objetos" vazio */
    const productDetails = ref({});

    /* É reativo e começa com um "array" vazio */
    const optionsCategories = ref([]);

    /* É reativo e começa com uma "string" vazia */
    const categoryId = ref("");

    /* Para listar somente os produtos dddaqueleee usuário */
    const { listPublic, brand } = useApi();

    const { notifyError } = useNotify();

    const route = useRoute();

    /* Trás todos os produtos */
    const handleListProducts = async (userId) => {
      try {
        /* Tabela do supabase "product" */
        loading.value = true;
        /* Para listar todos os produtos */
        /* products.value = await list(table); */
        /* Para listar somente os produtos dddaqueleee usuário */
        /* products.value = await listPublic(table, user.value.id); */
        products.value = categoryId.value
          ? await listPublic(table, userId, "category_id", categoryId.value)
          : await listPublic(table, userId);
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleShowDetails = (product) => {
      /* Recebendo os detalhes deste produto */
      productDetails.value = product;
      /* Abrindo o Dialog(modal) */
      showDialogDetails.value = true;
    };

    const handleListCategories = async (userId) => {
      /* Categorias por usuário(deste usuário) */
      optionsCategories.value = await listPublic("category", userId);
    };

    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    onMounted(() => {
      if (route.params.id) {
        handleListCategories(route.params.id);
        handleListProducts(route.params.id);
      }
    });

    /* "export": Para ser usado em "outro" componente */
    /* "return": Para ser usado no "mesmo" componente */

    /* export{}: Só pode ser importado exatamente com o mesmo nome */
    /* export default: Pode ser importando com qualquer nome */
    return {
      columnsProduct,
      products,
      loading,
      filter,
      formatCurrency,
      showDialogDetails,
      productDetails,
      handleShowDetails,
      handleListProducts,
      brand,
      optionsCategories,
      categoryId,
      route,
      initialPagination,
      handleScrollToTop,
      pagesNumber: computed(() =>
        Math.ceil(products.value.length / initialPagination.value.rowsPerPage)
      ),
    };
  },
});
</script>
