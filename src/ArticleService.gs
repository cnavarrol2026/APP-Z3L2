const ArticleService = {
  getLookupData: function() {
    const categories = SheetRepository.list(Config.SHEETS.CATEGORIES).filter(function(row) { return toBoolean(row.activo); });
    const bottles = SheetRepository.list(Config.SHEETS.BOTTLES).filter(function(row) { return toBoolean(row.activo); });
    const relations = SheetRepository.list(Config.SHEETS.CATEGORY_BOTTLE).filter(function(row) { return toBoolean(row.activo); });
    const articles = SheetRepository.list(Config.SHEETS.ARTICLES).filter(function(row) { return row.estado === Config.STATES.ACTIVE; });
    return { categorias: categories, botellas: bottles, relaciones: relations, articulos: articles };
  },

  normalizeDraftPayload: function(data) {
    const copy = JSON.parse(JSON.stringify(data || {}));
    if (Array.isArray(copy.valores)) {
      copy.valores = copy.valores.map(function(item) {
        const next = Object.assign({}, item);
        next.valor = toSystemUpperText(next.valor, 500);
        return next;
      });
    }
    return copy;
  },

  validateUniqueCode: function(code, ignoreId) {
    const normalized = normalizeText(code);
    if (!normalized) {
      throw new Error('El código de artículo es obligatorio.');
    }
    const existsInArticles = SheetRepository.list(Config.SHEETS.ARTICLES).find(function(row) {
      return row.codigoNormalizado === normalized && row.id !== ignoreId;
    });
    const existsInDrafts = SheetRepository.list(Config.SHEETS.DRAFTS).find(function(row) {
      return row.codigoNormalizado === normalized && row.id !== ignoreId && row.estado !== Config.STATES.DISCARDED;
    });
    if (existsInArticles || existsInDrafts) {
      throw new Error('Ya existe un artículo o borrador con ese código.');
    }
  },

  saveDraft: function(payload, userEmail) {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const draftId = payload.id || createId('bor');
      const current = payload.id ? SheetRepository.findById(Config.SHEETS.DRAFTS, payload.id) : null;
      this.validateDraftPayload(payload, current ? current.id : '');
      const date = nowIso();
      const technicalPayload = this.normalizeDraftPayload(payload.payload || {});
      const row = {
        id: draftId,
        categoriaId: payload.categoriaId || '',
        botellaId: payload.botellaId || '',
        codigoArticulo: toSystemUpperText(payload.codigoArticulo, 80),
        codigoNormalizado: normalizeText(payload.codigoArticulo),
        descripcion: toSystemUpperText(payload.descripcion, 240),
        estado: Config.STATES.DRAFT,
        etqAplica: !!payload.etqAplica,
        codigoEtq: toSystemUpperText(payload.codigoEtq, 80),
        cetAplica: !!payload.cetAplica,
        codigoCet: toSystemUpperText(payload.codigoCet, 80),
        etapa: cleanText(payload.etapa || 'DATOS_GENERALES', 80),
        payloadJson: JSON.stringify(technicalPayload),
        fechaCreacion: current ? current.fechaCreacion : date,
        creadoPor: current ? current.creadoPor : userEmail,
        fechaModificacion: date,
        modificadoPor: userEmail,
        version: current ? Number(current.version || 1) + 1 : 1
      };
      if (current) {
        SheetRepository.updateById(Config.SHEETS.DRAFTS, current.id, row);
      } else {
        SheetRepository.append(Config.SHEETS.DRAFTS, row);
      }
      HistoryService.recordEvent({
        user: userEmail,
        type: current ? 'MODIFICAR_BORRADOR' : 'CREAR_BORRADOR',
        entity: Config.SHEETS.DRAFTS,
        entityId: row.id,
        productId: row.id,
        reason: payload.motivo || 'Guardado de borrador.',
        details: current ? this.diffRows(current, row) : [{ field: 'codigoArticulo', before: '', after: row.codigoArticulo }]
      });
      return row;
    } finally {
      lock.releaseLock();
    }
  },

  validateDraftPayload: function(payload, ignoreId) {
    this.validateUniqueCode(payload.codigoArticulo, ignoreId);
    if (!cleanText(payload.descripcion, 240)) {
      throw new Error('La descripción es obligatoria.');
    }
    if (payload.etqAplica && (!cleanText(payload.codigoEtq, 80))) {
      throw new Error('El código ETQ es obligatorio cuando ETQ aplica.');
    }
    if (payload.cetAplica && (!cleanText(payload.codigoCet, 80))) {
      throw new Error('El código CET es obligatorio cuando CET aplica.');
    }
  },

  activateDraft: function(payload, userEmail) {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const draft = SheetRepository.findById(Config.SHEETS.DRAFTS, payload.borradorId);
      if (!draft) {
        throw new Error('No se encontró el borrador.');
      }
      this.validateActivation(draft);
      const date = nowIso();
      const article = {
        id: createId('art'),
        categoriaId: draft.categoriaId,
        botellaId: draft.botellaId,
        codigoArticulo: draft.codigoArticulo,
        codigoNormalizado: draft.codigoNormalizado,
        descripcion: draft.descripcion,
        estado: Config.STATES.ACTIVE,
        etqAplica: draft.etqAplica,
        codigoEtq: draft.codigoEtq,
        cetAplica: draft.cetAplica,
        codigoCet: draft.codigoCet,
        fechaCreacion: date,
        creadoPor: userEmail,
        fechaModificacion: date,
        modificadoPor: userEmail,
        version: 1
      };
      SheetRepository.append(Config.SHEETS.ARTICLES, article);
      SheetRepository.updateById(Config.SHEETS.DRAFTS, draft.id, {
        estado: Config.STATES.ACTIVE,
        fechaModificacion: date,
        modificadoPor: userEmail,
        version: Number(draft.version || 1) + 1
      });
      DraftService.releaseLock(draft.id, userEmail);
      HistoryService.recordEvent({
        user: userEmail,
        type: 'ACTIVAR',
        entity: Config.SHEETS.ARTICLES,
        entityId: article.id,
        productId: article.id,
        reason: payload.motivo || 'Activación de borrador.',
        details: [{ field: 'estado', before: Config.STATES.DRAFT, after: Config.STATES.ACTIVE }]
      });
      return article;
    } finally {
      lock.releaseLock();
    }
  },

  validateActivation: function(draft) {
    if (!draft.categoriaId || !draft.botellaId) throw new Error('La categoría y la botella son obligatorias.');
    if (!SheetRepository.findById(Config.SHEETS.CATEGORIES, draft.categoriaId)) throw new Error('La categoría no existe.');
    if (!SheetRepository.findById(Config.SHEETS.BOTTLES, draft.botellaId)) throw new Error('La botella no existe.');
    this.validateUniqueCode(draft.codigoArticulo, draft.id);
    if (!draft.descripcion) throw new Error('La descripción es obligatoria.');
    if (toBoolean(draft.etqAplica) && !draft.codigoEtq) throw new Error('Falta el código ETQ.');
    if (toBoolean(draft.cetAplica) && !draft.codigoCet) throw new Error('Falta el código CET.');
  },

  diffRows: function(before, after) {
    return Object.keys(after).filter(function(key) {
      return String(before[key] || '') !== String(after[key] || '');
    }).map(function(key) {
      return { field: key, before: before[key] || '', after: after[key] || '' };
    });
  }
};

