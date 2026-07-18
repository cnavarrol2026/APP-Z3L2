const ImageService = {
  uploadArticleImage: function(payload, userEmail) {
    this.validatePayload(payload, true);
    return this.uploadImageForOwner(payload.articuloId, payload, userEmail);
  },

  uploadDraftImage: function(payload, userEmail) {
    this.validatePayload(payload, false);
    const draft = SheetRepository.findById(Config.SHEETS.DRAFTS, payload.borradorId);
    if (!draft) {
      throw new Error('No se encontró el borrador asociado a la imagen.');
    }
    return this.uploadImageForOwner(payload.borradorId, payload, userEmail);
  },

  uploadImageForOwner: function(ownerId, payload, userEmail) {
    const article = SheetRepository.findById(Config.SHEETS.ARTICLES, ownerId);
    const draft = SheetRepository.findById(Config.SHEETS.DRAFTS, ownerId);
    if (!article && !draft) {
      throw new Error('No se encontró el registro asociado a la imagen.');
    }
    const folder = ConfigService.getImageFolder();
    const bytes = Utilities.base64Decode(payload.base64);
    const blob = Utilities.newBlob(bytes, Config.IMAGE_MIME_TYPE, sanitizeFileName(payload.nombreArchivo));
    const file = folder.createFile(blob);
    const previous = SheetRepository.list(Config.SHEETS.ARTICLE_IMAGES).find(function(row) {
      return row.articuloId === ownerId && row.tipoImagen === payload.tipoImagen && toBoolean(row.activo);
    });
    const date = nowIso();
    const imageRow = {
      id: previous ? previous.id : createId('img'),
      articuloId: ownerId,
      tipoImagen: payload.tipoImagen,
      codigo: cleanText(payload.codigo, 80),
      driveFileId: file.getId(),
      nombreArchivo: file.getName(),
      mimeType: Config.IMAGE_MIME_TYPE,
      tamanoBytes: bytes.length,
      url: file.getUrl(),
      activo: true,
      fechaCreacion: previous ? previous.fechaCreacion : date,
      creadoPor: previous ? previous.creadoPor : userEmail,
      fechaModificacion: date,
      modificadoPor: userEmail,
      version: previous ? Number(previous.version || 1) + 1 : 1
    };
    if (previous) {
      SheetRepository.updateById(Config.SHEETS.ARTICLE_IMAGES, previous.id, imageRow);
      try {
        DriveApp.getFileById(previous.driveFileId).setTrashed(true);
      } catch (error) {
        ErrorService.record('ImageService.uploadImageForOwner.cleanup', error);
      }
    } else {
      SheetRepository.append(Config.SHEETS.ARTICLE_IMAGES, imageRow);
    }
    HistoryService.recordEvent({
      user: userEmail,
      type: previous ? 'REEMPLAZAR_IMAGEN' : 'CARGAR_IMAGEN',
      entity: Config.SHEETS.ARTICLE_IMAGES,
      entityId: imageRow.id,
      productId: ownerId,
      reason: payload.motivo || 'Carga de imagen ' + payload.tipoImagen,
      details: [
        { field: 'tipoImagen', before: previous ? previous.tipoImagen : '', after: imageRow.tipoImagen },
        { field: 'driveFileId', before: previous ? previous.driveFileId : '', after: imageRow.driveFileId }
      ]
    });
    return imageRow;
  },

  moveDraftImagesToArticle: function(draftId, articleId, userEmail, date) {
    SheetRepository.list(Config.SHEETS.ARTICLE_IMAGES).forEach(function(row) {
      if (row.articuloId === draftId && toBoolean(row.activo)) {
        SheetRepository.updateById(Config.SHEETS.ARTICLE_IMAGES, row.id, {
          articuloId: articleId,
          fechaModificacion: date,
          modificadoPor: userEmail,
          version: Number(row.version || 1) + 1
        });
      }
    });
  },

  validatePayload: function(payload, requireArticle) {
    if (!payload) throw new Error('Falta la imagen.');
    if (requireArticle && !payload.articuloId) throw new Error('Falta el artículo de la imagen.');
    if (!requireArticle && !payload.borradorId) throw new Error('Falta el borrador de la imagen.');
    if ([Config.IMAGE_TYPES.ETQ, Config.IMAGE_TYPES.CET].indexOf(payload.tipoImagen) === -1) {
      throw new Error('El tipo de imagen no es válido.');
    }
    if (!String(payload.nombreArchivo || '').toLowerCase().endsWith(Config.IMAGE_EXTENSION)) {
      throw new Error('Solo se aceptan archivos PNG.');
    }
    if (payload.mimeType !== Config.IMAGE_MIME_TYPE) {
      throw new Error('El archivo debe ser PNG.');
    }
    if (!payload.base64) throw new Error('No se recibió la imagen.');
    const estimatedBytes = Math.floor(payload.base64.length * 3 / 4);
    if (estimatedBytes > Config.MAX_IMAGE_BYTES) {
      throw new Error('La imagen supera el máximo permitido de 1 MB.');
    }
  }
};
