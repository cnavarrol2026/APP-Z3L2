const ArticleService = {
  getLookupData: function() {
    const categories = SheetRepository.list(Config.SHEETS.CATEGORIES).filter(function(row) { return toBoolean(row.activo); });
    const bottles = SheetRepository.list(Config.SHEETS.BOTTLES).filter(function(row) { return toBoolean(row.activo); });
    const relations = SheetRepository.list(Config.SHEETS.CATEGORY_BOTTLE).filter(function(row) { return toBoolean(row.activo); });
    const articles = SheetRepository.list(Config.SHEETS.ARTICLES).filter(function(row) { return row.estado === Config.STATES.ACTIVE; });
    return { categorias: categories, botellas: bottles, relaciones: relations, articulos: articles };
  },

  normalizeDraftPayload: function(data) {
    const self = this;
    const copy = JSON.parse(JSON.stringify(data || {}));
    copy.capsuladoraAplica = copy.capsuladoraAplica !== false;
    copy.programaCapsuladoraBypassTapa = copy.capsuladoraAplica
      ? ''
      : toSystemUpperText(copy.programaCapsuladoraBypassTapa, 120);
    if (Array.isArray(copy.valores)) {
      copy.valores = copy.valores.map(function(item) {
        const next = Object.assign({}, item);
        next.campoId = cleanText(next.campoId, 80);
        if (self.isFlexibleCapsuladoraTextValue(next)) {
          next.valor = self.normalizeFlexibleTextValue(next.valor, cleanText(next.campo, 80) || next.campoId || 'El campo');
          if (self.isPinzasValue(next)) next.campo = 'PINZAS';
          return next;
        }
        if (self.isLevasPlatosValue(next)) {
          next.valor = JSON.stringify(self.normalizeLevasPlatos(next.valor));
          next.campo = 'Levas Platos';
          return next;
        }
        next.valor = toSystemUpperText(next.valor, 500);
        return next;
      }).filter(function(item) {
        return copy.capsuladoraAplica || !self.isCapsuladoraValue(item) || self.isCapsuladoraBypassValue(item);
      });
      if (!copy.capsuladoraAplica && copy.programaCapsuladoraBypassTapa) {
        const hasBypass = copy.valores.some(function(item) {
          return self.isCapsuladoraBypassValue(item);
        });
        if (!hasBypass) {
          copy.valores.push({
            campoId: 'cam_programa_capsuladora_bypass_tapa',
            campo: 'Programa capsuladora bypass tapa',
            valor: copy.programaCapsuladoraBypassTapa
          });
        }
      }
    }
    return copy;
  },

  isPinzasValue: function(item) {
    return item && (
      cleanText(item.campoId, 80) === 'cam_pinzas' ||
      normalizeText(item.campo) === 'pinzas'
    );
  },

  isFlexibleCapsuladoraTextValue: function(item) {
    if (!item) return false;
    const fieldId = cleanText(item.campoId, 80);
    const fieldName = normalizeText(item.campo);
    return [
      'cam_pinzas',
      'cam_color_formato',
      'cam_sinfin_capsuladora'
    ].indexOf(fieldId) !== -1 || [
      'pinzas',
      'color de formato',
      normalizeText('Sinfín capsuladora')
    ].indexOf(fieldName) !== -1;
  },

  normalizeFlexibleTextValue: function(value, label) {
    const text = toSystemUpperText(value, 120);
    if (text && !/^[A-ZÁÉÍÓÚÜÑ0-9 \-\/()]*$/.test(text)) {
      throw new Error(label + ' solo acepta letras, números, espacios y los caracteres - / ( ).');
    }
    return text;
  },

  normalizePinzasValue: function(value) {
    return this.normalizeFlexibleTextValue(value, 'PINZAS');
  },

  normalizeTechnicalValue: function(item) {
    const fieldId = cleanText(item.campoId, 80);
    const isLevasPlatos = this.isLevasPlatosValue(item);
    const isFlexibleText = this.isFlexibleCapsuladoraTextValue(item);
    const maxLength = isLevasPlatos ? 20000 : (isFlexibleText ? 120 : 500);
    const value = cleanText(item.valor, maxLength);
    if (isLevasPlatos) return value;
    if (isFlexibleText) return this.normalizeFlexibleTextValue(value, cleanText(item.campo, 80) || fieldId || 'El campo');
    return toSystemUpperText(value, 500);
  },

  isLevasPlatosValue: function(item) {
    return item && (
      cleanText(item.campoId, 80) === 'cam_levas_platos' ||
      normalizeText(item.campo) === normalizeText('Levas Platos')
    );
  },

  isCapsuladoraBypassValue: function(item) {
    return item && (
      cleanText(item.campoId, 80) === 'cam_programa_capsuladora_bypass_tapa' ||
      normalizeText(item.campo) === normalizeText('Programa capsuladora bypass tapa')
    );
  },

  isCapsuladoraValue: function(item) {
    if (!item) return false;
    const fieldId = cleanText(item.campoId, 80);
    const fieldName = normalizeText(item.campo);
    const capsuladoraIds = [
      'cam_programa_capsuladora_bypass_tapa',
      'cam_formato_capsula',
      'cam_formato_botella',
      'cam_color_formato',
      'cam_material_capsula',
      'cam_sinfin_capsuladora'
    ];
    const capsuladoraNames = [
      'Programa capsuladora bypass tapa',
      'Número formato (cápsula)',
      'Número formato (botella)',
      'Color de formato',
      'Material (PVC / Complex)',
      'Sinfín capsuladora'
    ].map(normalizeText);
    return capsuladoraIds.indexOf(fieldId) !== -1 || capsuladoraNames.indexOf(fieldName) !== -1;
  },

  normalizeLevasPlatos: function(value) {
    let rows = value;
    if (typeof rows === 'string') {
      rows = safeJsonParse(rows, []);
    }
    if (!Array.isArray(rows) || !rows.length) {
      rows = [{}];
    }
    return rows.map(function(row, index) {
      return {
        numeroElemento: index,
        accion: 'Posicionando',
        inicioMaster: toSystemUpperText(row && row.inicioMaster, 80),
        finalMaster: toSystemUpperText(row && row.finalMaster, 80),
        posicionRelativaSlave: toSystemUpperText(row && row.posicionRelativaSlave, 80)
      };
    });
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
      return row.codigoNormalizado === normalized && row.id !== ignoreId && toSystemUpperText(row.estado, 40) === Config.STATES.DRAFT;
    });
    if (existsInArticles) {
      throw new Error('El código ya existe como artículo activo: ' + existsInArticles.codigoArticulo + ' - ' + existsInArticles.descripcion + '.');
    }
    if (existsInDrafts) {
      throw new Error('El código ya existe en Pendientes: ' + existsInDrafts.codigoArticulo + ' - ' + existsInDrafts.descripcion + '. Abre ese pendiente con Completar / revisar antes de guardar cambios.');
    }
  },

  findCodeLocations: function(code) {
    const normalized = normalizeText(code);
    if (!normalized) throw new Error('Ingresa un código para buscar.');
    const results = [];
    SheetRepository.list(Config.SHEETS.DRAFTS).forEach(function(row) {
      if (row.codigoNormalizado === normalized || normalizeText(row.codigoArticulo) === normalized) {
        results.push({
          origen: 'BORRADORES',
          id: row.id,
          codigoArticulo: row.codigoArticulo,
          descripcion: row.descripcion,
          estado: row.estado,
          fechaModificacion: row.fechaModificacion
        });
      }
    });
    SheetRepository.list(Config.SHEETS.ARTICLES).forEach(function(row) {
      if (row.codigoNormalizado === normalized || normalizeText(row.codigoArticulo) === normalized) {
        results.push({
          origen: 'ARTICULOS',
          id: row.id,
          codigoArticulo: row.codigoArticulo,
          descripcion: row.descripcion,
          estado: row.estado,
          fechaModificacion: row.fechaModificacion
        });
      }
    });
    SheetRepository.list(Config.SHEETS.DISCARDED_DRAFTS).forEach(function(row) {
      const data = safeJsonParse(row.datosJson, {});
      const draftCode = data.codigoArticulo || '';
      if (normalizeText(draftCode) === normalized) {
        results.push({
          origen: 'BORRADORES_DESCARTADOS',
          id: row.id,
          borradorId: row.borradorId,
          codigoArticulo: draftCode,
          descripcion: data.descripcion || '',
          estado: row.estado,
          fechaModificacion: row.fechaDescarte,
          motivo: row.motivo
        });
      }
    });
    return results;
  },

  saveDraft: function(payload, userEmail) {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const draftId = payload.id || createId('bor');
      const current = payload.id ? SheetRepository.findById(Config.SHEETS.DRAFTS, payload.id) : null;
      if (payload.id && !current) {
        throw new Error('El borrador que intentas editar ya no existe. Abre Pendientes nuevamente o inicia un producto nuevo.');
      }
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
    const technicalPayload = payload.payload || {};
    if (!cleanText(payload.descripcion, 240)) {
      throw new Error('La descripción es obligatoria.');
    }
    if (payload.etqAplica && (!cleanText(payload.codigoEtq, 80))) {
      throw new Error('El código ETQ es obligatorio cuando ETQ aplica.');
    }
    if (payload.cetAplica && (!cleanText(payload.codigoCet, 80))) {
      throw new Error('El código CET es obligatorio cuando CET aplica.');
    }
    if (technicalPayload.capsuladoraAplica === false && !cleanText(technicalPayload.programaCapsuladoraBypassTapa, 120)) {
      throw new Error('El programa capsuladora bypass tapa es obligatorio cuando no aplica capsuladora.');
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
      if (toSystemUpperText(draft.estado, 40) !== Config.STATES.DRAFT) {
        throw new Error('Este borrador ya no está pendiente y no puede activarse nuevamente.');
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
      this.saveArticleValuesFromDraft(draft, article.id, userEmail, date);
      ImageService.moveDraftImagesToArticle(draft.id, article.id, userEmail, date);
      SheetRepository.updateById(Config.SHEETS.DRAFTS, draft.id, {
        estado: Config.STATES.ACTIVATED,
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
        details: [{ field: 'estado', before: Config.STATES.DRAFT, after: Config.STATES.ACTIVATED }]
      });
      return article;
    } finally {
      lock.releaseLock();
    }
  },

  updateArticle: function(payload, userEmail) {
    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const article = SheetRepository.findById(Config.SHEETS.ARTICLES, payload.id);
      if (!article) {
        throw new Error('No se encontró el producto activo para actualizar.');
      }
      this.validateArticlePayload(payload, article.id);
      const date = nowIso();
      const technicalPayload = this.normalizeDraftPayload(payload.payload || {});
      const updated = {
        id: article.id,
        categoriaId: payload.categoriaId || '',
        botellaId: payload.botellaId || '',
        codigoArticulo: toSystemUpperText(payload.codigoArticulo, 80),
        codigoNormalizado: normalizeText(payload.codigoArticulo),
        descripcion: toSystemUpperText(payload.descripcion, 240),
        estado: Config.STATES.ACTIVE,
        etqAplica: !!payload.etqAplica,
        codigoEtq: toSystemUpperText(payload.codigoEtq, 80),
        cetAplica: !!payload.cetAplica,
        codigoCet: toSystemUpperText(payload.codigoCet, 80),
        fechaCreacion: article.fechaCreacion,
        creadoPor: article.creadoPor,
        fechaModificacion: date,
        modificadoPor: userEmail,
        version: Number(article.version || 1) + 1
      };
      SheetRepository.updateById(Config.SHEETS.ARTICLES, article.id, updated);
      this.upsertArticleValues(article.id, technicalPayload.valores || [], userEmail, date);
      HistoryService.recordEvent({
        user: userEmail,
        type: 'MODIFICAR_ARTICULO',
        entity: Config.SHEETS.ARTICLES,
        entityId: article.id,
        productId: article.id,
        reason: payload.motivo || 'Edición de producto activo.',
        details: this.diffRows(article, updated)
      });
      return Object.assign({}, updated, {
        valores: SheetRepository.list(Config.SHEETS.ARTICLE_VALUES).filter(function(value) { return value.articuloId === article.id; }),
        imagenes: SheetRepository.list(Config.SHEETS.ARTICLE_IMAGES).filter(function(image) { return image.articuloId === article.id && toBoolean(image.activo); })
      });
    } finally {
      lock.releaseLock();
    }
  },

  validateArticlePayload: function(payload, ignoreId) {
    this.validateUniqueCode(payload.codigoArticulo, ignoreId);
    if (!payload.categoriaId || !payload.botellaId) throw new Error('La categoría y la botella son obligatorias.');
    if (!SheetRepository.findById(Config.SHEETS.CATEGORIES, payload.categoriaId)) throw new Error('La categoría no existe.');
    if (!SheetRepository.findById(Config.SHEETS.BOTTLES, payload.botellaId)) throw new Error('La botella no existe.');
    if (!cleanText(payload.descripcion, 240)) throw new Error('La descripción es obligatoria.');
    if (payload.etqAplica && !cleanText(payload.codigoEtq, 80)) throw new Error('El código ETQ es obligatorio cuando ETQ aplica.');
    if (payload.cetAplica && !cleanText(payload.codigoCet, 80)) throw new Error('El código CET es obligatorio cuando CET aplica.');
    const technicalPayload = payload.payload || {};
    if (technicalPayload.capsuladoraAplica === false && !cleanText(technicalPayload.programaCapsuladoraBypassTapa, 120)) {
      throw new Error('El programa capsuladora bypass tapa es obligatorio cuando no aplica capsuladora.');
    }
  },

  saveArticleValuesFromDraft: function(draft, articleId, userEmail, date) {
    const data = safeJsonParse(draft.payloadJson, {});
    const values = Array.isArray(data.valores) ? data.valores : [];
    values.forEach(function(item) {
      const fieldId = cleanText(item.campoId, 80);
      const value = ArticleService.normalizeTechnicalValue(item);
      if (!fieldId || !value) return;
      SheetRepository.append(Config.SHEETS.ARTICLE_VALUES, {
        id: createId('val'),
        articuloId: articleId,
        campoId: fieldId,
        valor: value,
        unidadId: cleanText(item.unidadId, 80),
        fechaCreacion: date,
        creadoPor: userEmail,
        fechaModificacion: date,
        modificadoPor: userEmail,
        version: 1
      });
    });
  },

  upsertArticleValues: function(articleId, values, userEmail, date) {
    const existing = SheetRepository.list(Config.SHEETS.ARTICLE_VALUES).filter(function(row) {
      return row.articuloId === articleId;
    });
    const sheet = SheetRepository.getSheet(Config.SHEETS.ARTICLE_VALUES);
    const headers = SheetRepository.headers(Config.SHEETS.ARTICLE_VALUES);
    const allRows = sheet.getDataRange().getValues();
    const idIndex = headers.indexOf('id');
    const rowIndexById = {};
    for (let i = 1; i < allRows.length; i++) {
      rowIndexById[allRows[i][idIndex]] = i + 1;
    }
    const existingByField = {};
    existing.forEach(function(row) {
      existingByField[row.campoId] = row;
    });
    values.forEach(function(item) {
      const fieldId = cleanText(item.campoId, 80);
      if (!fieldId) return;
      const normalizedValue = ArticleService.normalizeTechnicalValue(item);
      const current = existingByField[fieldId];
      if (current) {
        const updatedRow = Object.assign({}, current, {
          valor: normalizedValue,
          unidadId: cleanText(item.unidadId, 80),
          fechaModificacion: date,
          modificadoPor: userEmail,
          version: Number(current.version || 1) + 1
        });
        const rowIndex = rowIndexById[current.id];
        if (!rowIndex) throw new Error('No se encontró el valor técnico para actualizar: ' + current.id);
        sheet.getRange(rowIndex, 1, 1, headers.length).setValues([objectToRow(headers, updatedRow)]);
        return;
      }
      if (!normalizedValue) return;
      SheetRepository.append(Config.SHEETS.ARTICLE_VALUES, {
        id: createId('val'),
        articuloId: articleId,
        campoId: fieldId,
        valor: normalizedValue,
        unidadId: cleanText(item.unidadId, 80),
        fechaCreacion: date,
        creadoPor: userEmail,
        fechaModificacion: date,
        modificadoPor: userEmail,
        version: 1
      });
    });
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

