export function Error(error: any) {
  switch (error.code) {
    case "auth/invalid-email":
      return {
        err: "Formato de endereço de e-mail inválido."
      };
    case "auth/user-not-found":
      return {
        err: "Usuário não encontrado."
      };
    case "auth/wrong-password":
      return {
        err: "E-mail ou senha inválidos."
      };
    case "auth/too-many-requests":
      return {
        err: "Muitos pedidos. Tente novamente em um minuto"
      };
    case "auth/email-already-in-use":
      return {
        err: "E-mail já em uso."
      };
    case "auth/weak-password":
      return {
        err: "A senha é muito fraca."
      };
    default:
      return {
        err: "Verifique a sua conexão com a internet."
      };
  }
}