<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleForgotPassword">
      <p class="col-12 text-h5 text-center">Resetar a senha</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">

        <q-input label="Email" v-model="email" lazy-rules :rules="[
        val => (val && val.length > 0) || 'Informe o email para recuperar a senha']" type="email" />

        <div class="full-width q-pt-md q-gutter-y-sm">
          <q-btn label="Enviar email para resetar a senha" color="primary" class="full-width" outline rounded size="md"
            type="submit"></q-btn>
          <q-btn label="Voltar" color="dark" class="full-width" rounded flat size="sm" :to="{ name: 'login' }"></q-btn>
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import useNotify from "src/composables/UseNotify";
import useAuthUser from 'src/composables/UseAuthUser';

export default defineComponent({
  setup() {
    const { sendPasswordRestEmail } = useAuthUser();
    const { notifyError, notifySuccess } = useNotify()

    const email = ref('');

    const handleForgotPassword = async () => {
      try {
        await sendPasswordRestEmail(email.value)
        notifySuccess(`Email para resetar a senha enviado com sucesso para: ${email.value}`)
      } catch (error) {
        notifyError(error.message)
      }
    }

    /* Este "return" é para que eles sejam usados aqui neste componente mesmo */
    return {
      email,
      handleForgotPassword,
    }
  },
})
</script>






