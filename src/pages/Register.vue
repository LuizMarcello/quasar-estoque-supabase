<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleRegister">
      <p class="col-12 text-h5 text-center">Registrar</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <q-input label="Nome" v-model="form.name" lazy-rules :rules="[
        val => (val && val.length > 0) || 'Informe seu nome completo']" />

        <q-input label="Email" v-model="form.email" lazy-rules :rules="[
        val => (val && val.length > 0) || 'Informe seu email']" type="email" />

        <q-input label="Password" v-model="form.password" lazy-rules :rules="[
        val => (val && val.length >= 6) || 'Informe uma senha (mínimo 6 digitos)']" />

        <div class="full-width q-pt-md q-gutter-y-md">
          <q-btn label="Registrar" color="primary" class="full-width" outline rounded size="lg" type="submit" />
          <q-btn label="Voltar" color="dark" class="full-width" rounded flat size="sm" :to="{ name: 'login' }" />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import useNotify from "src/composables/UseNotify";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PageRegister",

  setup() {
    const router = useRouter();
    const { register } = useAuthUser();
    const { notifyError, notifySuccess } = useNotify()

    const form = ref({
      name: "",
      email: "",
      password: "",
    });

    const handleRegister = async () => {
      try {
        /* "form.value" já tem todos os valores do formulário  */
        await register(form.value);
        notifySuccess()
        router.push({
          name: "email-confirmation",
          query: {
            email: form.value.email,
          },
        });
      } catch (error) {
        /* alert(error); */
        notifyError(error.message)
      }
    };

    return {
      form,
      handleRegister,
    };
  },
});
</script>
