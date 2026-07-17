const Api = {
  withAuth: function(functionName, callback) {
    try {
      const user = SecurityService.requireAuthenticatedUser();
      SheetRepository.ensureDatabase();
      return callback(user);
    } catch (error) {
      ErrorService.record(functionName, error);
      return fail(error.message, error.code || 'APP_ERROR');
    }
  }
};

function apiGetInitialData() {
  return Api.withAuth('apiGetInitialData', function(user) {
    let templateWarning = '';
    try {
      TemplateService.ensureDefaultTechnicalTemplate(user.email);
    } catch (error) {
      templateWarning = 'No se pudo materializar la plantilla en Sheets: ' + error.message;
      ErrorService.record('TemplateService.ensureDefaultTechnicalTemplate', error);
    }
    const admin = CatalogService.getAdminData(false);
    const fallback = TemplateService.getFallbackAdminData();
    if (!admin.secciones.length) admin.secciones = fallback.secciones;
    if (!admin.campos.length) admin.campos = fallback.campos;
    if (!admin.unidades.length) admin.unidades = fallback.unidades;
    return ok({
      user: user,
      lookup: ArticleService.getLookupData(),
      admin: admin,
      drafts: DraftService.listPendingDrafts(),
      discarded: DraftService.listDiscardedDrafts(),
      history: HistoryService.listEvents({}),
      warnings: templateWarning ? [templateWarning] : []
    });
  });
}

function apiGetAdminData(showInactive) {
  return Api.withAuth('apiGetAdminData', function() {
    return ok(CatalogService.getAdminData(showInactive));
  });
}

function apiCreateCategory(payload) {
  return Api.withAuth('apiCreateCategory', function(user) {
    return ok(CatalogService.createSimpleEntity(Config.SHEETS.CATEGORIES, 'cat', payload, user.email), 'Categoría creada.');
  });
}

function apiCreateBottle(payload) {
  return Api.withAuth('apiCreateBottle', function(user) {
    return ok(CatalogService.createSimpleEntity(Config.SHEETS.BOTTLES, 'bot', payload, user.email), 'Botella creada.');
  });
}

function apiCreateUnit(payload) {
  return Api.withAuth('apiCreateUnit', function(user) {
    return ok(CatalogService.createOrderedEntity(Config.SHEETS.UNITS, 'uni', payload, user.email), 'Unidad creada.');
  });
}

function apiCreateSection(payload) {
  return Api.withAuth('apiCreateSection', function(user) {
    return ok(CatalogService.createOrderedEntity(Config.SHEETS.SECTIONS, 'sec', payload, user.email), 'Sección creada.');
  });
}

function apiCreateField(payload) {
  return Api.withAuth('apiCreateField', function(user) {
    return ok(CatalogService.createField(payload, user.email), 'Campo creado.');
  });
}

function apiCreateRelation(payload) {
  return Api.withAuth('apiCreateRelation', function(user) {
    return ok(CatalogService.createCategoryBottleRelation(payload, user.email), 'Relación creada.');
  });
}

function apiToggleEntity(payload) {
  return Api.withAuth('apiToggleEntity', function(user) {
    return ok(CatalogService.toggleEntity(payload, user.email), 'Estado actualizado.');
  });
}

function apiSaveDraft(payload) {
  return Api.withAuth('apiSaveDraft', function(user) {
    return ok(ArticleService.saveDraft(payload, user.email), 'Borrador guardado.');
  });
}

function apiActivateDraft(payload) {
  return Api.withAuth('apiActivateDraft', function(user) {
    return ok(ArticleService.activateDraft(payload, user.email), 'Artículo activado.');
  });
}

function apiAcquireDraftLock(payload) {
  return Api.withAuth('apiAcquireDraftLock', function(user) {
    return ok(DraftService.acquireLock(payload.borradorId, user.email), 'Bloqueo obtenido.');
  });
}

function apiReleaseDraftLock(payload) {
  return Api.withAuth('apiReleaseDraftLock', function(user) {
    return ok(DraftService.releaseLock(payload.borradorId, user.email), 'Bloqueo liberado.');
  });
}

function apiDiscardDraft(payload) {
  return Api.withAuth('apiDiscardDraft', function(user) {
    return ok(DraftService.discardDraft(payload, user.email), 'Borrador descartado.');
  });
}

function apiRecoverDraft(payload) {
  return Api.withAuth('apiRecoverDraft', function(user) {
    return ok(DraftService.recoverDraft(payload, user.email), 'Borrador recuperado.');
  });
}

function apiUploadImage(payload) {
  return Api.withAuth('apiUploadImage', function(user) {
    return ok(ImageService.uploadArticleImage(payload, user.email), 'Imagen cargada.');
  });
}

function apiGeneratePdf(payload) {
  return Api.withAuth('apiGeneratePdf', function(user) {
    return ok(PdfService.generateArticlePdf(payload.articuloId, user.email), 'PDF generado sin imágenes.');
  });
}

function apiCreateBackup() {
  return Api.withAuth('apiCreateBackup', function(user) {
    return ok(BackupService.createBackup(user.email), 'Respaldo creado.');
  });
}
