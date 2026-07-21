function doGet() {
  const template = HtmlService.createTemplateFromFile('index');
  template.appName = Config.APP_NAME;
  return template
    .evaluate()
    .setTitle(Config.APP_NAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setupDatabase() {
  return Api.withAuth('setupDatabase', function(user) {
    SheetRepository.ensureDatabase();
    TemplateService.ensureDefaultTechnicalTemplate(user.email || user.effectiveEmail || 'usuario.google');
    HistoryService.recordEvent({
      user: user.email,
      type: 'SETUP_DATABASE',
      entity: 'SISTEMA',
      entityId: 'DATABASE',
      productId: '',
      reason: 'Inicialización de hojas vacías.',
      details: []
    });
    return ok(null, 'Base inicial creada con hojas vacías.');
  });
}
