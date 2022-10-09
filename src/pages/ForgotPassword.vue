<template>
  <q-page padding>
    <q-form class="row justify-center" @submit.prevent="handleForgotPassword">
      <p class="col-12 text-h5 text-center">Resetar a senha</p>
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">

        <q-input label="Email" v-model="email" />

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
import useAuthUser from 'src/composables/UseAuthUser';

export default defineComponent({
  setup() {
    const { sendPasswordRestEmail } = useAuthUser();

    const email = ref('');

    const handleForgotPassword = async () => {
      await sendPasswordRestEmail(email.value)
      alert(`Email para resetar a senha enviado com sucesso para: ${email.value}`)
    }

    /* Este "return" é para que eles sejam usados aqui neste componente mesmo */
    return {
      email,
      handleForgotPassword,
    }
  },
})
</script>






