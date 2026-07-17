const ConfigService = {
  getValue: function(key) {
    const rows = SheetRepository.list(Config.SHEETS.CONFIG);
    const row = rows.find(function(item) {
      return item.clave === key;
    });
    return row ? row.valor : '';
  },

  setValue: function(key, value, description) {
    const rows = SheetRepository.list(Config.SHEETS.CONFIG);
    const current = rows.find(function(item) {
      return item.clave === key;
    });
    if (current) {
      return SheetRepository.updateConfigByKey(key, {
        valor: value,
        descripcion: description || current.descripcion || ''
      });
    }
    return SheetRepository.append(Config.SHEETS.CONFIG, {
      clave: key,
      valor: value,
      descripcion: description || ''
    });
  },

  getOrCreateFolder: function(key, folderName) {
    const savedId = this.getValue(key);
    if (savedId) {
      try {
        return DriveApp.getFolderById(savedId);
      } catch (error) {
        ErrorService.record('ConfigService.getOrCreateFolder', error);
      }
    }

    const existing = DriveApp.getFoldersByName(folderName);
    const folder = existing.hasNext() ? existing.next() : DriveApp.createFolder(folderName);
    this.setValue(key, folder.getId(), folderName);
    this.setValue(key + '_URL', folder.getUrl(), folderName + ' URL');
    return folder;
  },

  getImageFolder: function() {
    if (Config.DRIVE_IMAGE_FOLDER_ID && Config.DRIVE_IMAGE_FOLDER_ID.indexOf('CONFIGURAR_') !== 0) {
      return DriveApp.getFolderById(Config.DRIVE_IMAGE_FOLDER_ID);
    }
    return this.getOrCreateFolder('DRIVE_IMAGE_FOLDER_ID', 'APP-Z3L2 - Imágenes');
  },

  getBackupFolder: function() {
    if (Config.DRIVE_BACKUP_FOLDER_ID && Config.DRIVE_BACKUP_FOLDER_ID.indexOf('CONFIGURAR_') !== 0) {
      return DriveApp.getFolderById(Config.DRIVE_BACKUP_FOLDER_ID);
    }
    return this.getOrCreateFolder('DRIVE_BACKUP_FOLDER_ID', 'APP-Z3L2 - Respaldos');
  }
};
