const SheetRepository = {
  _spreadsheet: null,
  TEXT_FORMAT_COLUMNS: Object.freeze({
    VALORES_ARTICULO: ['valor'],
    VALORES_BORRADOR: ['valor']
  }),

  getSpreadsheet: function() {
    if (this._spreadsheet) {
      return this._spreadsheet;
    }
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (activeSpreadsheet) {
      this._spreadsheet = activeSpreadsheet;
      return this._spreadsheet;
    }
    if (!Config.SPREADSHEET_ID || Config.SPREADSHEET_ID.indexOf('CONFIGURAR_') === 0) {
      throw new Error('Falta configurar SPREADSHEET_ID en Config.gs.');
    }
    this._spreadsheet = SpreadsheetApp.openById(Config.SPREADSHEET_ID);
    return this._spreadsheet;
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
      SheetRepository.applySheetFormats_(sheetName, sheet);
    });
  },

  applySheetFormats_: function(sheetName, sheet) {
    const columns = this.TEXT_FORMAT_COLUMNS[sheetName] || [];
    if (!columns.length) return;
    if (sheet.getMaxRows() < 2) {
      sheet.insertRowsAfter(1, 1);
    }
    const headers = Config.HEADERS[sheetName];
    const rowCount = Math.min(sheet.getMaxRows() - 1, Math.max(sheet.getLastRow() - 1, 1) + 100);
    columns.forEach(function(columnName) {
      const columnIndex = headers.indexOf(columnName);
      if (columnIndex === -1) return;
      sheet.getRange(2, columnIndex + 1, rowCount, 1).setNumberFormat('@');
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

  listSafe: function(sheetName) {
    try {
      return this.list(sheetName);
    } catch (error) {
      return [];
    }
  },

  append: function(sheetName, object) {
    const sheet = this.getSheet(sheetName);
    sheet.appendRow(objectToRow(this.headers(sheetName), object));
    return object;
  },

  appendMany: function(sheetName, objects) {
    if (!objects || !objects.length) return [];
    const sheet = this.getSheet(sheetName);
    const headers = this.headers(sheetName);
    const rows = objects.map(function(object) {
      return objectToRow(headers, object);
    });
    const startRow = Math.max(sheet.getLastRow() + 1, 2);
    sheet.getRange(startRow, 1, rows.length, headers.length).setValues(rows);
    return objects;
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
