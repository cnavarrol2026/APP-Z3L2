const BackupService = {
  createBackup: function(userEmail) {
    const backup = {
      metadata: {
        app: Config.APP_NAME,
        createdAt: nowIso(),
        createdBy: userEmail,
        format: 'ZIP_CSV_JSON'
      },
      sheets: {}
    };
    const blobs = [];
    Object.keys(Config.HEADERS).forEach(function(sheetName) {
      const headers = Config.HEADERS[sheetName];
      const rows = SheetRepository.list(sheetName);
      backup.sheets[sheetName] = rows;
      const csv = [headers.join(',')]
        .concat(rows.map(function(row) {
          return headers.map(function(header) { return csvEscape(row[header]); }).join(',');
        }))
        .join('\r\n');
      blobs.push(Utilities.newBlob(csv, 'text/csv', sheetName + '.csv'));
    });
    blobs.push(Utilities.newBlob(JSON.stringify(backup, null, 2), 'application/json', 'backup.json'));
    const zipName = 'APP-Z3L2_respaldo_' + Utilities.formatDate(new Date(), Config.TIME_ZONE, 'yyyyMMdd_HHmmss') + '.zip';
    const zipBlob = Utilities.zip(blobs, zipName);
    const folder = ConfigService.getBackupFolder();
    const file = folder.createFile(zipBlob);
    const row = {
      id: createId('bak'),
      fecha: nowIso(),
      usuario: userEmail,
      driveFileId: file.getId(),
      nombreArchivo: file.getName(),
      url: file.getUrl(),
      tamanoBytes: file.getSize()
    };
    SheetRepository.append(Config.SHEETS.BACKUPS, row);
    HistoryService.recordEvent({
      user: userEmail,
      type: 'CREAR_RESPALDO',
      entity: Config.SHEETS.BACKUPS,
      entityId: row.id,
      productId: '',
      reason: 'Respaldo manual ZIP con CSV y JSON.',
      details: [{ field: 'archivo', before: '', after: row.nombreArchivo }]
    });
    return row;
  }
};
