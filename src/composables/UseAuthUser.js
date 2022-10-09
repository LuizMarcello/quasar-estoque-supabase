/* eslint-disable */
/* Este composable é para login, logout, usuários, senhas */
/* Para reatividade (vue3) */
import {
  ref
} from "vue";

import useSupabase from "src/boot/supabase";

/* "user": Como se fosse um "estado global" */
/* Todos que importarem deste composable, tenham
   acesso a este usuário */
const user = ref(null);

export default function useAuthUser() {
  const {
    supabase
  } = useSupabase();

  const login = async ({
    email,
    password
  }) => {
    const {
      user,
      error
    } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) throw error;
    return user;
  };

  /* Logar com redes sociais */
  const loginWithSocialProvider = async (provider) => {
    const {
      user,
      error
    } = await supabase.auth.signIn({
      provider,
    });
    if (error) throw error;
    return user;
  };

  const logout = async () => {
    const {
      error
    } = await supabase.auth.signOut();
    if (error) throw error;
  };

  /* Para verificar se está logado */
  const isLoggedIn = () => {
    return !!user.value;
  };

  /* Para cadastrar(registrar) um novo usuário */
  const register = async ({
    email,
    password,
    ...meta
  }) => {
    const {
      user,
      error
    } = await supabase.auth.signUp({
      email,
      password,
    }, {
      data: meta,
      redirectTo: `${window.location.origin}
      /me?fromEmail=registrationConfirmation`,
    });
    if (error) throw error;
    return user;
  };

  /* Para atualizar alguma informação */
  const update = async (data) => {
    const {
      user,
      error
    } = await supabase.auth.update(data);
    if (error) throw error;
    return user;
  };

  /* Resetar a senha */
  const sendPasswordRestEmail = async (email) => {
    const {
      user,
      error
    } = await supabase.auth.api.resetPasswordForEmail(email)
    if (error) throw error
    return user
  }
  
  /* Envio para o e-mail, o qual a senha será resetada */
  const resetPassword = async (accessToken, newPassword) => {
    const {
      user,
      error
    } = await supabase.auth.api.updateUser(
      accessToken, {
        password: newPassword
      }
    )
    if (error) throw error
    return user
  }

  /* Por ser vuejs3, retornar todos estes métodos */
  return {
    user,
    login,
    loginWithSocialProvider,
    logout,
    isLoggedIn,
    register,
    update,
    sendPasswordRestEmail,
    resetPassword,
  };
}
