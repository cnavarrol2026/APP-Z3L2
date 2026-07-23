const AuditService = {
  runDatabaseAudit: function(userEmail) {
    let rows = this.readAuditRows_();
    const repairs = this.normalizeActivatedDraftStates_(rows, userEmail);
    if (repairs.length) rows = this.readAuditRows_();
    const activeArticles = rows[Config.SHEETS.ARTICLES].filter(function(row) {
      return toSystemUpperText(row.estado, 40) === Config.STATES.ACTIVE;
    });
    const pendingDrafts = rows[Config.SHEETS.DRAFTS].filter(function(row) {
      return toSystemUpperText(row.estado, 40) === Config.STATES.DRAFT;
    });
    const discardedDrafts = rows[Config.SHEETS.DISCARDED_DRAFTS].filter(function(row) {
      return row.estado === Config.STATES.DISCARDED;
    });
    const activeArticleIds = this.indexById_(activeArticles);
    const pendingDraftIds = this.indexById_(pendingDrafts);
    const ownerIds = Object.assign({}, activeArticleIds, pendingDraftIds);
    const articleValues = rows[Config.SHEETS.ARTICLE_VALUES];
    const articleImages = rows[Config.SHEETS.ARTICLE_IMAGES];
    const audit = {
      fecha: nowIso(),
      resumen: {
        categorias: rows[Config.SHEETS.CATEGORIES].length,
        botellas: rows[Config.SHEETS.BOTTLES].length,
        relacionesCategoriaBotella: rows[Config.SHEETS.CATEGORY_BOTTLE].length,
        articulosActivos: activeArticles.length,
        borradoresPendientes: pendingDrafts.length,
        borradoresDescartados: discardedDrafts.length,
        valoresArticulo: articleValues.length,
        valoresBorrador: rows[Config.SHEETS.DRAFT_VALUES].length,
        imagenesArticulo: articleImages.length,
        historialEventos: rows[Config.SHEETS.HISTORY_EVENTS].length,
        historialDetalle: rows[Config.SHEETS.HISTORY_DETAIL].length
      },
      duplicados: {
        ids: this.findDuplicatedIds_(rows),
        codigosArticulo: this.findDuplicateCodes_(activeArticles, pendingDrafts),
        valoresArticuloPorArticuloCampo: this.findDuplicateValueRows_(articleValues),
        imagenesActivasPorOwnerTipo: this.findDuplicateActiveImages_(articleImages)
      },
      integridad: {
        valoresSinArticuloActivo: articleValues
          .filter(function(row) { return row.articuloId && !activeArticleIds[row.articuloId]; })
          .map(function(row) { return AuditService.slimValueRow_(row); }),
        imagenesActivasSinArticuloOBorrador: articleImages
          .filter(function(row) { return toBoolean(row.activo) && row.articuloId && !ownerIds[row.articuloId]; })
          .map(function(row) { return AuditService.slimImageRow_(row); }),
        borradoresPendientes: pendingDrafts.map(function(draft) {
          return {
            id: draft.id,
            codigoArticulo: draft.codigoArticulo,
            descripcion: draft.descripcion,
            payloadTieneValores: Array.isArray(safeJsonParse(draft.payloadJson, {}).valores),
            imagenesActivas: articleImages.filter(function(image) {
              return image.articuloId === draft.id && toBoolean(image.activo);
            }).length
          };
        }),
        articulosActivos: activeArticles.map(function(article) {
          return {
            id: article.id,
            codigoArticulo: article.codigoArticulo,
            descripcion: article.descripcion,
            valores: articleValues.filter(function(value) {
              return value.articuloId === article.id;
            }).length,
            imagenesActivas: articleImages.filter(function(image) {
              return image.articuloId === article.id && toBoolean(image.activo);
            }).length
          };
        }),
        reparacionesAplicadas: repairs
      },
      formatosTexto: this.auditTextFormats_()
    };
    audit.estado = this.getAuditStatus_(audit);
    audit.alertas = this.buildAuditAlerts_(audit);
    return audit;
  },

  readAuditRows_: function() {
    const sheetNames = [
      Config.SHEETS.CATEGORIES,
      Config.SHEETS.BOTTLES,
      Config.SHEETS.CATEGORY_BOTTLE,
      Config.SHEETS.ARTICLES,
      Config.SHEETS.ARTICLE_VALUES,
      Config.SHEETS.ARTICLE_IMAGES,
      Config.SHEETS.DRAFTS,
      Config.SHEETS.DRAFT_VALUES,
      Config.SHEETS.DISCARDED_DRAFTS,
      Config.SHEETS.HISTORY_EVENTS,
      Config.SHEETS.HISTORY_DETAIL
    ];
    return sheetNames.reduce(function(result, sheetName) {
      result[sheetName] = SheetRepository.listSafe(sheetName);
      return result;
    }, {});
  },

  indexById_: function(rows) {
    return rows.reduce(function(index, row) {
      if (row.id) index[row.id] = true;
      return index;
    }, {});
  },

  normalizeActivatedDraftStates_: function(rows, userEmail) {
    const activeByCode = rows[Config.SHEETS.ARTICLES].reduce(function(index, row) {
      if (toSystemUpperText(row.estado, 40) === Config.STATES.ACTIVE && row.codigoNormalizado) index[row.codigoNormalizado] = row;
      return index;
    }, {});
    const date = nowIso();
    return rows[Config.SHEETS.DRAFTS]
      .filter(function(draft) {
        return draft.codigoNormalizado &&
          toSystemUpperText(draft.estado, 40) === Config.STATES.ACTIVE &&
          activeByCode[draft.codigoNormalizado];
      })
      .map(function(draft) {
        const article = activeByCode[draft.codigoNormalizado];
        SheetRepository.updateById(Config.SHEETS.DRAFTS, draft.id, {
          estado: Config.STATES.ACTIVATED,
          fechaModificacion: date,
          modificadoPor: userEmail || 'auditoria',
          version: Number(draft.version || 1) + 1
        });
        HistoryService.recordEvent({
          user: userEmail || 'auditoria',
          type: 'NORMALIZAR_BORRADOR_ACTIVADO',
          entity: Config.SHEETS.DRAFTS,
          entityId: draft.id,
          productId: article.id,
          reason: 'Reparación automática: borrador ya activado permanecía con estado ACTIVO.',
          details: [
            { field: 'estado', before: Config.STATES.ACTIVE, after: Config.STATES.ACTIVATED },
            { field: 'codigoArticulo', before: draft.codigoArticulo, after: draft.codigoArticulo }
          ]
        });
        return {
          id: draft.id,
          codigoArticulo: draft.codigoArticulo,
          descripcion: draft.descripcion,
          estadoAnterior: Config.STATES.ACTIVE,
          estadoNuevo: Config.STATES.ACTIVATED,
          articuloActivoId: article.id
        };
      });
  },

  findDuplicatedIds_: function(rowsBySheet) {
    return Object.keys(rowsBySheet).reduce(function(result, sheetName) {
      const duplicated = AuditService.findDuplicates_(rowsBySheet[sheetName], function(row) { return row.id; });
      if (duplicated.length) result[sheetName] = duplicated;
      return result;
    }, {});
  },

  findDuplicateCodes_: function(articles, drafts) {
    const rows = articles.concat(drafts).filter(function(row) {
      return row.codigoNormalizado && row.estado !== Config.STATES.DISCARDED;
    });
    return this.findDuplicates_(rows, function(row) { return row.codigoNormalizado; }).map(function(duplicate) {
      duplicate.registros = rows
        .filter(function(row) { return row.codigoNormalizado === duplicate.clave; })
        .map(function(row) { return AuditService.slimArticleRow_(row); });
      return duplicate;
    });
  },

  findDuplicateValueRows_: function(values) {
    return this.findDuplicates_(values, function(row) {
      if (!row.articuloId || !row.campoId) return '';
      return row.articuloId + '|' + row.campoId;
    });
  },

  findDuplicateActiveImages_: function(images) {
    return this.findDuplicates_(images.filter(function(row) { return toBoolean(row.activo); }), function(row) {
      if (!row.articuloId || !row.tipoImagen) return '';
      return row.articuloId + '|' + row.tipoImagen;
    });
  },

  findDuplicates_: function(rows, getKey) {
    const counts = {};
    rows.forEach(function(row) {
      const key = getKey(row);
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.keys(counts)
      .filter(function(key) { return counts[key] > 1; })
      .map(function(key) { return { clave: key, cantidad: counts[key] }; });
  },

  auditTextFormats_: function() {
    return [
      { sheetName: Config.SHEETS.ARTICLE_VALUES, columnName: 'valor' },
      { sheetName: Config.SHEETS.DRAFT_VALUES, columnName: 'valor' }
    ].map(function(target) {
      const sheet = SheetRepository.getSheet(target.sheetName);
      const headers = SheetRepository.headers(target.sheetName);
      const columnIndex = headers.indexOf(target.columnName) + 1;
      const rowsToCheck = Math.min(sheet.getMaxRows() - 1, Math.max(sheet.getLastRow() - 1, 1) + 20);
      const formats = sheet.getRange(2, columnIndex, rowsToCheck, 1).getNumberFormats();
      const nonTextCount = formats.reduce(function(total, row) {
        return total + (row[0] === '@' ? 0 : 1);
      }, 0);
      return {
        hoja: target.sheetName,
        columna: target.columnName,
        filasRevisadas: rowsToCheck,
        formatoTexto: nonTextCount === 0,
        celdasSinFormatoTexto: nonTextCount
      };
    });
  },

  slimValueRow_: function(row) {
    return {
      id: row.id,
      articuloId: row.articuloId,
      campoId: row.campoId
    };
  },

  slimImageRow_: function(row) {
    return {
      id: row.id,
      articuloId: row.articuloId,
      tipoImagen: row.tipoImagen,
      nombreArchivo: row.nombreArchivo
    };
  },

  slimArticleRow_: function(row) {
    return {
      id: row.id,
      codigoArticulo: row.codigoArticulo,
      descripcion: row.descripcion,
      estado: row.estado,
      fechaModificacion: row.fechaModificacion || row.fechaCreacion || ''
    };
  },

  getAuditStatus_: function(audit) {
    return this.hasProblems_(audit) ? 'OBSERVACIONES' : 'OK';
  },

  hasProblems_: function(audit) {
    return Object.keys(audit.duplicados.ids).length > 0 ||
      audit.duplicados.codigosArticulo.length > 0 ||
      audit.duplicados.valoresArticuloPorArticuloCampo.length > 0 ||
      audit.duplicados.imagenesActivasPorOwnerTipo.length > 0 ||
      audit.integridad.valoresSinArticuloActivo.length > 0 ||
      audit.integridad.imagenesActivasSinArticuloOBorrador.length > 0 ||
      audit.formatosTexto.some(function(item) { return !item.formatoTexto; });
  },

  buildAuditAlerts_: function(audit) {
    const alerts = [];
    if (Object.keys(audit.duplicados.ids).length) alerts.push('Hay IDs duplicados en una o más hojas.');
    if (audit.duplicados.codigosArticulo.length) alerts.push('Hay códigos de artículo duplicados entre activos y borradores.');
    if (audit.duplicados.valoresArticuloPorArticuloCampo.length) alerts.push('Hay más de un valor para el mismo artículo y campo.');
    if (audit.duplicados.imagenesActivasPorOwnerTipo.length) alerts.push('Hay más de una imagen activa para el mismo registro y tipo ETQ/CET.');
    if (audit.integridad.valoresSinArticuloActivo.length) alerts.push('Hay valores técnicos asociados a artículos que no están activos.');
    if (audit.integridad.imagenesActivasSinArticuloOBorrador.length) alerts.push('Hay imágenes activas asociadas a registros que no son artículo activo ni borrador pendiente.');
    audit.formatosTexto.forEach(function(item) {
      if (!item.formatoTexto) alerts.push('La hoja ' + item.hoja + ' tiene celdas de valor sin formato texto.');
    });
    if (!alerts.length) alerts.push('No se detectaron duplicados ni registros huérfanos en la revisión automática.');
    return alerts;
  }
};
