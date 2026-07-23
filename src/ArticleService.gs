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
        if (self.isPinzasValue(next)) {
          next.valor = self.normalizePinzasValue(next.valor);
          next.campo = 'PINZAS';
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

  normalizePinzasValue: function(value) {
    const text = toSystemUpperText(value, 120);
    if (text && !/^[A-ZÁÉÍÓÚÜÑ0-9 \-\/()]*$/.test(text)) {
      throw new Error('PINZAS solo acepta letras, números, espacios y los caracteres - / ( ).');
    }
    return text;
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
      return row.codigoNormalizado === normalized && row.id !== ignoreId && row.estado !== Config.STATES.DISCARDED;
    });
    if (existsInArticles) {
      throw new Error('El código ya existe como artículo activo: ' + existsInArticles.codigoArticulo + ' - ' + existsInArticles.descripcion + '.');
    }
    if (existsInDrafts) {
      throw new Error('El código ya existe en borradores con estado ' + (existsInDrafts.estado || 'SIN ESTADO') + ': ' + existsInDrafts.codigoArticulo + ' - ' + existsInDrafts.descripcion + '.');
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

  saveArticleValuesFromDraft: function(draft, articleId, userEmail, date) {
    const data = safeJsonParse(draft.payloadJson, {});
    const values = Array.isArray(data.valores) ? data.valores : [];
    values.forEach(function(item) {
      const fieldId = cleanText(item.campoId, 80);
      const isLevasPlatos = ArticleService.isLevasPlatosValue(item);
      const isPinzas = ArticleService.isPinzasValue(item);
      const maxLength = isLevasPlatos ? 20000 : (isPinzas ? 120 : 500);
      const value = cleanText(item.valor, maxLength);
      if (!fieldId || !value) return;
      SheetRepository.append(Config.SHEETS.ARTICLE_VALUES, {
        id: createId('val'),
        articuloId: articleId,
        campoId: fieldId,
        valor: isLevasPlatos ? value : (isPinzas ? ArticleService.normalizePinzasValue(value) : toSystemUpperText(value, 500)),
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

