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
        <q-input label="Name" v-model="form.name" />
        <q-btn
          label="Save"
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
/* Vuejs 3: "defineComponent": para fazer o "export default" */
/* "ref": Para fazer o formulário reativo */
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
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
    const { post } = useApi();
    const { notifyError, notifySuccess } = useNotify();

    const form = ref({
      name: "",
    });

    const handleSubmit = async () => {
      try {
        await post(table, form.value);
        notifySuccess("Saved Successfully");
        router.push({ name: "category" });
      } catch (error) {
        notifyError(error.message);
      }
    };

    /* "return": Para exportar para este componente mesmo */
    return {
      handleSubmit,
      form,
    };
  },
});
</script>
