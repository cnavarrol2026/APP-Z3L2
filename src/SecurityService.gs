const SecurityService = {
  requireAuthenticatedUser: function() {
    const email = String(Session.getActiveUser().getEmail() || '').trim();
    if (!email) {
      const error = new Error('No fue posible identificar tu cuenta Google. Vuelve a ingresar con una cuenta Google y autoriza la aplicación.');
      error.code = 'USER_NOT_IDENTIFIED';
      throw error;
    }
    return { email: email };
  }
};
