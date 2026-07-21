const PdfService = {
  generateArticlePdf: function(articleId, userEmail) {
    if (!articleId) throw new Error('Falta el artículo para generar PDF.');
    const article = SheetRepository.findById(Config.SHEETS.ARTICLES, articleId);
    if (!article) throw new Error('No se encontró el artículo.');
    const category = SheetRepository.findById(Config.SHEETS.CATEGORIES, article.categoriaId) || {};
    const bottle = SheetRepository.findById(Config.SHEETS.BOTTLES, article.botellaId) || {};
    const values = SheetRepository.list(Config.SHEETS.ARTICLE_VALUES).filter(function(row) {
      return row.articuloId === articleId;
    });
    const fields = SheetRepository.list(Config.SHEETS.FIELDS);
    const units = SheetRepository.list(Config.SHEETS.UNITS);
    const doc = DocumentApp.create('Ficha ' + article.codigoArticulo + ' - ' + Config.APP_NAME);
    const body = doc.getBody();
    body.appendParagraph(Config.APP_NAME).setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph('Ficha técnica sin imágenes').setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph('Fecha de generación: ' + nowIso());
    body.appendParagraph('Generado por: ' + userEmail);
    body.appendParagraph('');
    body.appendParagraph('Categoría: ' + (category.nombre || ''));
    body.appendParagraph('Botella: ' + (bottle.nombre || ''));
    body.appendParagraph('Código de artículo: ' + article.codigoArticulo);
    body.appendParagraph('Descripción: ' + article.descripcion);
    body.appendParagraph('Estado: ' + article.estado);
    body.appendParagraph('ETQ: ' + (toBoolean(article.etqAplica) ? 'Aplica - ' + article.codigoEtq : 'No aplica'));
    body.appendParagraph('CET: ' + (toBoolean(article.cetAplica) ? 'Aplica - ' + article.codigoCet : 'No aplica'));
    body.appendParagraph('');
    body.appendParagraph('Parámetros').setHeading(DocumentApp.ParagraphHeading.HEADING2);
    if (!values.length) {
      body.appendParagraph('No existen parámetros registrados.');
    }
    values.forEach(function(value) {
      const field = fields.find(function(row) { return row.id === value.campoId; }) || {};
      const unit = units.find(function(row) { return row.id === value.unidadId; }) || {};
      if (value.campoId === 'cam_levas_platos') {
        const rows = safeJsonParse(value.valor, []);
        body.appendParagraph('Levas Platos:');
        if (!Array.isArray(rows) || !rows.length) {
          body.appendParagraph('Sin registros.');
          return;
        }
        rows.forEach(function(row) {
          body.appendParagraph(
            'N° ' + row.numeroElemento +
            ' | Acción: Posicionando' +
            ' | Inicio Master: ' + (row.inicioMaster || '') +
            ' | Final Master: ' + (row.finalMaster || '') +
            ' | Posición Relativa Slave: ' + (row.posicionRelativaSlave || '')
          );
        });
        return;
      }
      body.appendParagraph((field.nombre || value.campoId) + ': ' + value.valor + (unit.nombre ? ' ' + unit.nombre : ''));
    });
    doc.saveAndClose();
    const file = DriveApp.getFileById(doc.getId());
    const pdfBlob = file.getAs(MimeType.PDF);
    const pdf = DriveApp.createFile(pdfBlob).setName('Ficha_' + sanitizeFileName(article.codigoArticulo) + '.pdf');
    file.setTrashed(true);
    HistoryService.recordEvent({
      user: userEmail,
      type: 'GENERAR_PDF',
      entity: Config.SHEETS.ARTICLES,
      entityId: articleId,
      productId: articleId,
      reason: 'PDF generado sin imágenes.',
      details: [{ field: 'pdf', before: '', after: pdf.getUrl() }]
    });
    return {
      fileId: pdf.getId(),
      url: pdf.getUrl(),
      nombreArchivo: pdf.getName()
    };
  }
};
