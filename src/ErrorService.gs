const ErrorService = {
  record: function(functionName, error) {
    try {
      SheetRepository.ensureDatabase();
      const user = String(Session.getActiveUser().getEmail() || '');
      SheetRepository.append(Config.SHEETS.ERRORS, {
        id: createId('err'),
        fecha: nowIso(),
        usuario: user,
        funcion: functionName,
        mensaje: error && error.message ? error.message : String(error),
        detalle: error && error.stack ? String(error.stack).slice(0, 5000) : ''
      });
    } catch (ignored) {
      console.error(ignored);
    }
  }
};
