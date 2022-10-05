<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Quasar Estoque </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
<<<<<<< HEAD
export default defineComponent({
  name: "LoginLayout",
=======

export default defineComponent({
  name: "LoginLayout",

>>>>>>> a82c2da86fb5be7cef9aff98014e8f0fd38b038a
  setup() {
    return {};
  },
});
</script>
