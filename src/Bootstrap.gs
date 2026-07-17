function bootstrapCorporateResources() {
  const user = SecurityService.requireAuthenticatedUser();
  if (user.email !== 'cnavarrol@vspt.cl') {
    throw new Error('Bootstrap detenido: la cuenta activa debe ser cnavarrol@vspt.cl y actualmente es ' + user.email + '.');
  }

  const spreadsheet = SpreadsheetApp.create('APP-Z3L2 - Base de Datos');
  spreadsheet.setSpreadsheetTimeZone(Config.TIME_ZONE);
  spreadsheet.setSpreadsheetLocale('es_CL');
  const sheets = spreadsheet.getSheets();
  if (sheets.length) {
    sheets[0].setName(Config.SHEETS.CONFIG);
  }

  Object.keys(Config.HEADERS).forEach(function(sheetName) {
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }
    const headers = Config.HEADERS[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  });

  SheetRepository.ensureDatabase();
  const imageFolder = ConfigService.getImageFolder();
  const backupFolder = ConfigService.getBackupFolder();

  return {
    owner: user.email,
    spreadsheetId: spreadsheet.getId(),
    spreadsheetUrl: spreadsheet.getUrl(),
    imageFolderId: imageFolder.getId(),
    imageFolderUrl: imageFolder.getUrl(),
    backupFolderId: backupFolder.getId(),
    backupFolderUrl: backupFolder.getUrl()
  };
}

function getProjectConfiguration() {
  SheetRepository.ensureDatabase();
  return {
    spreadsheetId: Config.SPREADSHEET_ID,
    imageFolderId: ConfigService.getValue('DRIVE_IMAGE_FOLDER_ID'),
    imageFolderUrl: ConfigService.getValue('DRIVE_IMAGE_FOLDER_ID_URL'),
    backupFolderId: ConfigService.getValue('DRIVE_BACKUP_FOLDER_ID'),
    backupFolderUrl: ConfigService.getValue('DRIVE_BACKUP_FOLDER_ID_URL')
  };
}

function ensureDriveFolders() {
  const user = SecurityService.requireAuthenticatedUser();
  if (user.email !== 'cnavarrol@vspt.cl') {
    throw new Error('Creación de carpetas detenida: la cuenta activa debe ser cnavarrol@vspt.cl y actualmente es ' + user.email + '.');
  }

  const imageFolder = DriveApp.createFolder('APP-Z3L2 - Imágenes');
  const backupFolder = DriveApp.createFolder('APP-Z3L2 - Respaldos');

  return {
    owner: user.email,
    imageFolderId: imageFolder.getId(),
    imageFolderUrl: imageFolder.getUrl(),
    backupFolderId: backupFolder.getId(),
    backupFolderUrl: backupFolder.getUrl()
  };
}
