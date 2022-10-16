<!-- eslint-disable -->
<template>
  <!-- Muito bom colocar este "padding", desgruda
       das laterais, de cima, e de baixo  -->
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">Form Category</p>
      </div>

      <q-form
        class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
        @submit.prevent="handleSubmit"
      >
        <q-input
          label="Name"
          v-model="form.name"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Informe seu nome completo',
          ]"
        />
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
          :to="{ name: 'category' }"
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
    const table = "category";
    const router = useRouter();
    const route = useRoute();
    const { post, getById, update } = useApi();
    const { notifyError, notifySuccess } = useNotify();

    /* Propriedade computada verificando se é para atualizar ou salvar uma nova categoria */
    /* Verificando se existe ou não o "id" na rota(url) */
    const isUpdate = computed(() => route.params.id);

    let category = {};

    const form = ref({
      name: "",
    });

    /* Quando este componente for montado, verifica se tem o "id"
       na rota ou não, para saber se é um novo registro ou atualização
       É usado o mesmo formulário para ambos */
    onMounted(() => {
      /* Verificando se "isUpdate" é true ou false
         Se existe o "id" na rota, ou não */
      if (isUpdate.value) {
        /* alert("É para atualizar!"); */
        handleGetCategory(isUpdate.value);
      }
    });

    const handleSubmit = async () => {
      try {
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
        router.push({ name: "category" });
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetCategory = async (id) => {
      try {
        category = await getById(table, id);
        form.value = category;
      } catch (error) {
        notifyError(error.message);
      }
    };

    /* "return": Para exportar para este componente mesmo */
    return {
      handleSubmit,
      /* handleGetCategory, */
      isUpdate,
      form,
    };
  },
});
</script>
