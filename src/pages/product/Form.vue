<!-- eslint-disable -->
<template>
  <!-- Muito bom colocar este "padding", desgruda
       das laterais, de cima, e de baixo  -->
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">Form Product</p>
      </div>

      <q-form
        class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
        @submit.prevent="handleSubmit"
      >
        <q-input
          label="Image"
          stack-label
          v-model="img"
          type="file"
          accept="image/*"
        />

        <q-input
          label="Name"
          v-model="form.name"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Name is required']"
        />

        <q-editor v-model="form.description" min-height="5rem" />

        <q-input
          label="Amount"
          v-model="form.amount"
          :rules="[(val) => !!val || 'Amount is required']"
          type="number"
        />

        <q-input
          label="Price"
          v-model="form.price"
          lazy-rules
          :rules="[(val) => !!val || 'Price is required']"
          prefix="R$"
        />

        <!-- option-value: Qual o "id" da categoria que vai vir -->
        <!-- option-label: O que vai ser exibido da categoria no select,
                           no caso, o "name" -->
        <!-- map-options: Para poder mapear as opções acima -->
        <!-- emit-value: Para que no retôrno, seja emitido somente o valor
                         desejado(id), e não o objeto completo. -->
        <q-select
          v-model="form.category_id"
          :options="optionsCategory"
          label="Category"
          option-value="id"
          option-label="name"
          map-options
          emit-value
          :rules="[(val) => !!val || 'Category is required']"
        />

        <!-- Um debug -->
        <!-- {{ form.category_id }} -->

        <q-btn
          :label="isUpdate ? 'Update' : 'Save'"
          color="primary"
          class="full-width"
          rounded
          type="submit"
        />

        <q-btn
          label="Cancel"
          color="primary"
          class="full-width"
          rounded
          flat
          :to="{ name: 'product' }"
        />
      </q-form>
    </div>
  </q-page>
</template>

<script>
/* Vuejs 3: */
/* "defineComponent": para fazer o "export default" */
/* "ref": Para fazer o formulário reativo */
/* "onMounted": Gancho, ciclo de vida */
/* "computed": Propriedades computadas */
import { defineComponent, ref, onMounted, computed } from "vue";
/* useRouter: Fazer roteamento */
/* useRoute: Verificar a rota atual */
import { useRouter, useRoute } from "vue-router";
/* Importando o composable de acesso a API(UseApi.js) */
/* Sem as chaves, porque ainda não está pegando nada lá de dentro */
import useApi from "src/composables/UseApi";
/* Importando o composable de notify(useNotify.js) */
/* Sem as chaves, porque ainda não está pegando nada lá de dentro */
import useNotify from "src/composables/UseNotify";

/* "export default": Para exportar também para outros componentes  */
export default defineComponent({
  name: "PageFormCategory",

  setup() {
    const table = "product";
    const router = useRouter();
    const route = useRoute();
    const { post, getById, update, list, uploadImg } = useApi();
    const { notifyError, notifySuccess } = useNotify();

    /* Propriedade computada verificando se é para atualizar ou salvar uma nova categoria */
    /* Verificando se existe ou não o "id" na rota(url) */
    const isUpdate = computed(() => route.params.id);

    let product = {};

    const optionsCategory = ref([]);

    const form = ref({
      name: "",
      description: "",
      amount: 0,
      price: "",
      category_id: "",
      img_url: "",
    });

    const img = ref([]);

    /* Quando este componente for montado, verifica se tem o "id"
       na rota ou não, para saber se é um novo registro ou atualização
       É usado o mesmo formulário para ambos */
    onMounted(() => {
      handleListCategories();
      /* Verificando se "isUpdate" é true ou false
         Se existe o "id" na rota, ou não */
      if (isUpdate.value) {
        /* alert("É para atualizar!"); */
        handleGetProduct(isUpdate.value);
      }
    });

    const handleListCategories = async () => {
      optionsCategory.value = await list("category");
    };

    const handleSubmit = async () => {
      try {
        if (img.value.length > 0) {
          /* "products": Storage(file) de imagens no supabase */
          const imgUrl = await uploadImg(img.value[0], "products");
          form.value.img_url = imgUrl;
        }
        /* Verificando se "isUpdate" é true ou false
           Se existe o "id" na rota, ou não */
        if (isUpdate.value) {
          /* console.log(form.value) */
          await update(table, form.value);
          notifySuccess("Update Successfully");
        } else {
          /* Sem o id na rota, então só faz o submit normalmente */
          await post(table, form.value);
          notifySuccess("Saved Successfully");
        }
        router.push({ name: "product" });
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetProduct = async (id) => {
      try {
        product = await getById(table, id);
        form.value = product;
      } catch (error) {
        notifyError(error.message);
      }
    };

    /* "return": Para exportar para que este componente mesmo(Form.vue) tenha acesso. */
    return {
      handleSubmit,
      /* handleGetCategory, */
      isUpdate,
      form,
      optionsCategory,
      img,
    };
  },
});
</script>
