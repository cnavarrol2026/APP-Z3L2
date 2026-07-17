const SecurityService = {
  requireAuthenticatedUser: function() {
    const email = String(Session.getActiveUser().getEmail() || '').trim();
    const effectiveEmail = String(Session.getEffectiveUser().getEmail() || '').trim();
    if (!email) {
      return {
        email: 'usuario.google.no.identificado',
        displayName: 'Usuario Google',
        identified: false,
        effectiveEmail: effectiveEmail
      };
    }
    return {
      email: email,
      displayName: email,
      identified: true,
      effectiveEmail: effectiveEmail
    };
  }
};
