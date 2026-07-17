const SecurityService = {
  requireAuthenticatedUser: function() {
    const email = String(Session.getActiveUser().getEmail() || '').trim();
    if (!email) {
      return {
        email: 'usuario.google.no.identificado',
        displayName: 'Usuario Google',
        identified: false
      };
    }
    return {
      email: email,
      displayName: email,
      identified: true
    };
  }
};
