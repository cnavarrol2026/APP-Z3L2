const ImageService = {
  uploadArticleImage: function(payload, userEmail) {
    this.validatePayload(payload);
    if (!Config.DRIVE_IMAGE_FOLDER_ID || Config.DRIVE_IMAGE_FOLDER_ID === 'CONFIGURAR_CARPETA_IMAGENES') {
      throw new Error('Falta configurar la carpeta de imágenes en Config.gs.');
    }
    const article = SheetRepository.findById(Config.SHEETS.ARTICLES, payload.articuloId);
    if (!article) {
      throw new Error('No se encontró el artículo asociado a la imagen.');
    }
    const folder = DriveApp.getFolderById(Config.DRIVE_IMAGE_FOLDER_ID);
    const bytes = Utilities.base64Decode(payload.base64);
    const blob = Utilities.newBlob(bytes, Config.IMAGE_MIME_TYPE, sanitizeFileName(payload.nombreArchivo));
    const file = folder.createFile(blob);
    const previous = SheetRepository.list(Config.SHEETS.ARTICLE_IMAGES).find(function(row) {
      return row.articuloId === payload.articuloId && row.tipoImagen === payload.tipoImagen && toBoolean(row.activo);
    });
    const date = nowIso();
    const imageRow = {
      id: createId('img'),
      articuloId: payload.articuloId,
      tipoImagen: payload.tipoImagen,
      codigo: cleanText(payload.codigo, 80),
      driveFileId: file.getId(),
      nombreArchivo: file.getName(),
      mimeType: Config.IMAGE_MIME_TYPE,
      tamanoBytes: bytes.length,
      url: file.getUrl(),
      activo: true,
      fechaCreacion: date,
      creadoPor: userEmail,
      fechaModificacion: date,
      modificadoPor: userEmail,
      version: 1
    };
    SheetRepository.append(Config.SHEETS.ARTICLE_IMAGES, imageRow);
    if (previous) {
      SheetRepository.updateById(Config.SHEETS.ARTICLE_IMAGES, previous.id, {
        activo: false,
        fechaModificacion: date,
        modificadoPor: userEmail,
        version: Number(previous.version || 1) + 1
      });
      try {
        DriveApp.getFileById(previous.driveFileId).setTrashed(true);
      } catch (error) {
        ErrorService.record('ImageService.uploadArticleImage.cleanup', error);
      }
    }
    HistoryService.recordEvent({
      user: userEmail,
      type: previous ? 'REEMPLAZAR_IMAGEN' : 'CARGAR_IMAGEN',
      entity: Config.SHEETS.ARTICLE_IMAGES,
      entityId: imageRow.id,
      productId: payload.articuloId,
      reason: payload.motivo || 'Carga de imagen ' + payload.tipoImagen,
      details: [
        { field: 'tipoImagen', before: previous ? previous.tipoImagen : '', after: imageRow.tipoImagen },
        { field: 'driveFileId', before: previous ? previous.driveFileId : '', after: imageRow.driveFileId }
      ]
    });
    return imageRow;
  },

  validatePayload: function(payload) {
    if (!payload || !payload.articuloId) throw new Error('Falta el artículo de la imagen.');
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
