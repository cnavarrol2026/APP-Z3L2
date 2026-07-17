const SheetRepository = {
  getSpreadsheet: function() {
    if (!Config.SPREADSHEET_ID || Config.SPREADSHEET_ID.indexOf('CONFIGURAR_') === 0) {
      throw new Error('Falta configurar SPREADSHEET_ID en Config.gs.');
    }
    return SpreadsheetApp.openById(Config.SPREADSHEET_ID);
  },

  ensureDatabase: function() {
    const spreadsheet = this.getSpreadsheet();
    Object.keys(Config.HEADERS).forEach(function(sheetName) {
      let sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetName);
      }
      const headers = Config.HEADERS[sheetName];
      const range = sheet.getRange(1, 1, 1, headers.length);
      const current = range.getValues()[0];
      const needsHeader = current.join('') === '' || current.join('|') !== headers.join('|');
      if (needsHeader) {
        range.setValues([headers]);
        sheet.setFrozenRows(1);
      }
    });
  },

  getSheet: function(sheetName) {
    const sheet = this.getSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('No existe la hoja requerida: ' + sheetName);
    }
    return sheet;
  },

  headers: function(sheetName) {
    return Config.HEADERS[sheetName];
  },

  list: function(sheetName) {
    const sheet = this.getSheet(sheetName);
    const headers = this.headers(sheetName);
    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      return [];
    }
    return sheet
      .getRange(2, 1, lastRow - 1, headers.length)
      .getValues()
      .map(function(values) {
        return asRowObject(headers, values);
      });
  },

  append: function(sheetName, object) {
    const sheet = this.getSheet(sheetName);
    sheet.appendRow(objectToRow(this.headers(sheetName), object));
    return object;
  },

  updateById: function(sheetName, id, patch) {
    const sheet = this.getSheet(sheetName);
    const headers = this.headers(sheetName);
    const idIndex = headers.indexOf('id');
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][idIndex] === id) {
        const row = asRowObject(headers, values[i]);
        Object.keys(patch).forEach(function(key) {
          row[key] = patch[key];
        });
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([objectToRow(headers, row)]);
        return row;
      }
    }
    throw new Error('No se encontró el registro para actualizar: ' + id);
  },

  findById: function(sheetName, id) {
    return this.list(sheetName).find(function(row) {
      return row.id === id;
    }) || null;
  },

  updateConfigByKey: function(key, patch) {
    const sheetName = Config.SHEETS.CONFIG;
    const sheet = this.getSheet(sheetName);
    const headers = this.headers(sheetName);
    const values = sheet.getDataRange().getValues();
    const keyIndex = headers.indexOf('clave');
    for (let i = 1; i < values.length; i++) {
      if (values[i][keyIndex] === key) {
        const row = asRowObject(headers, values[i]);
        Object.keys(patch).forEach(function(field) {
          row[field] = patch[field];
        });
        sheet.getRange(i + 1, 1, 1, headers.length).setValues([objectToRow(headers, row)]);
        return row;
      }
    }
    throw new Error('No se encontró la clave de configuración: ' + key);
  }
};
