const Api = {
  withSessionOnly: function(functionName, callback) {
    try {
      const user = SecurityService.requireAuthenticatedUser();
      return callback(user);
    } catch (error) {
      return fail(error.message, error.code || 'APP_ERROR');
    }
  },

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

function apiPing() {
  return ok({
    timestamp: nowIso(),
    app: Config.APP_NAME
  });
}

function apiCheckSheets() {
  return Api.withSessionOnly('apiCheckSheets', function(user) {
    let spreadsheet;
    try {
      spreadsheet = SheetRepository.getSpreadsheet();
    } catch (error) {
      throw new Error('No fue posible abrir el Google Sheets configurado. Verifica permisos del propietario y SPREADSHEET_ID. Detalle: ' + error.message);
    }
    const configSheet = spreadsheet.getSheetByName(Config.SHEETS.CONFIG);
    return ok({
      user: user,
      spreadsheetId: spreadsheet.getId(),
      spreadsheetName: spreadsheet.getName(),
      hasConfigSheet: !!configSheet
    });
  });
}

function apiGetInitialData() {
  return Api.withSessionOnly('apiGetInitialData', function(user) {
    const fallback = TemplateService.getFallbackAdminData();
    return ok({
      user: user,
      lookup: {
        categorias: [],
        botellas: [],
        relaciones: [],
        articulos: []
      },
      admin: {
        categorias: [],
        botellas: [],
        relaciones: [],
        secciones: fallback.secciones,
        campos: fallback.campos,
        unidades: fallback.unidades
      },
      drafts: [],
      discarded: [],
      history: [],
      warnings: []
    });
  });
}

function apiGetSavedData() {
  return Api.withSessionOnly('apiGetSavedData', function(user) {
    const fallback = TemplateService.getFallbackAdminData();
    SheetRepository.ensureDatabase();
    TemplateService.ensureDefaultTechnicalTemplate(user.email || user.effectiveEmail || 'usuario.google');
    const categories = SheetRepository.listSafe(Config.SHEETS.CATEGORIES).filter(function(row) { return toBoolean(row.activo); });
    const bottles = SheetRepository.listSafe(Config.SHEETS.BOTTLES).filter(function(row) { return toBoolean(row.activo); });
    const relations = SheetRepository.listSafe(Config.SHEETS.CATEGORY_BOTTLE).filter(function(row) { return toBoolean(row.activo); });
    const articles = SheetRepository.listSafe(Config.SHEETS.ARTICLES).filter(function(row) { return row.estado === Config.STATES.ACTIVE; });
    const articleValues = SheetRepository.listSafe(Config.SHEETS.ARTICLE_VALUES);
    const articleImages = SheetRepository.listSafe(Config.SHEETS.ARTICLE_IMAGES).filter(function(row) { return toBoolean(row.activo); });
    articles.forEach(function(article) {
      article.valores = articleValues.filter(function(value) { return value.articuloId === article.id; });
      article.imagenes = articleImages.filter(function(image) { return image.articuloId === article.id; });
    });
    const sections = SheetRepository.listSafe(Config.SHEETS.SECTIONS).filter(function(row) { return toBoolean(row.activo); }).sort(CatalogService.byOrder);
    const fields = SheetRepository.listSafe(Config.SHEETS.FIELDS).filter(function(row) { return toBoolean(row.activo); }).sort(CatalogService.byOrder);
    const units = SheetRepository.listSafe(Config.SHEETS.UNITS).filter(function(row) { return toBoolean(row.activo); }).sort(CatalogService.byOrder);
    const drafts = DraftService.listPendingDrafts();
    const images = SheetRepository.listSafe(Config.SHEETS.ARTICLE_IMAGES).filter(function(row) { return toBoolean(row.activo); });
    drafts.forEach(function(draft) {
      draft.imagenes = images.filter(function(image) { return image.articuloId === draft.id; });
    });
    const discarded = DraftService.listDiscardedDrafts();
    return ok({
      user: user,
      lookup: {
        categorias: categories,
        botellas: bottles,
        relaciones: relations,
        articulos: articles
      },
      admin: {
        categorias: categories,
        botellas: bottles,
        relaciones: relations,
        secciones: sections.length ? sections : fallback.secciones,
        campos: fields.length ? fields : fallback.campos,
        unidades: units.length ? units : fallback.unidades
      },
      drafts: drafts,
      discarded: discarded,
      history: [],
      warnings: []
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

function apiUpdateCategory(payload) {
  return Api.withAuth('apiUpdateCategory', function(user) {
    return ok(CatalogService.updateSimpleEntity(Config.SHEETS.CATEGORIES, payload, user.email), 'Categoría actualizada.');
  });
}

function apiCreateBottle(payload) {
  return Api.withAuth('apiCreateBottle', function(user) {
    return ok(CatalogService.createSimpleEntity(Config.SHEETS.BOTTLES, 'bot', payload, user.email), 'Botella creada.');
  });
}

function apiUpdateBottle(payload) {
  return Api.withAuth('apiUpdateBottle', function(user) {
    return ok(CatalogService.updateSimpleEntity(Config.SHEETS.BOTTLES, payload, user.email), 'Botella actualizada.');
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

function apiUpdateSection(payload) {
  return Api.withAuth('apiUpdateSection', function(user) {
    return ok(CatalogService.updateSection(payload, user.email), 'Sección actualizada.');
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

function apiFindProductCode(payload) {
  return Api.withSessionOnly('apiFindProductCode', function() {
    return ok(ArticleService.findCodeLocations(payload && payload.codigoArticulo), 'Busqueda realizada.');
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

function apiUpdateArticle(payload) {
  return Api.withAuth('apiUpdateArticle', function(user) {
    return ok(ArticleService.updateArticle(payload, user.email), 'Artículo actualizado.');
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

function apiUploadDraftImage(payload) {
  return Api.withAuth('apiUploadDraftImage', function(user) {
    return ok(ImageService.uploadDraftImage(payload, user.email), 'Imagen de borrador cargada.');
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
