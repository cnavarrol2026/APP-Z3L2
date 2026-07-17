function nowIso() {
  return Utilities.formatDate(new Date(), Config.TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ss");
}

function createId(prefix) {
  return prefix + '_' + Utilities.getUuid().replace(/-/g, '').slice(0, 16);
}

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function cleanText(value, maxLength) {
  const text = String(value || '').trim().replace(/\s+/g, ' ');
  return maxLength ? text.slice(0, maxLength) : text;
}

function toBoolean(value) {
  return value === true || value === 'TRUE' || value === 'true' || value === '1';
}

function ok(data, message) {
  return { ok: true, message: message || 'Operación realizada correctamente.', data: data || null };
}

function fail(message, errorCode, data) {
  return { ok: false, message: message || 'No fue posible completar la operación.', errorCode: errorCode || 'ERROR', data: data || null };
}

function asRowObject(headers, values) {
  return headers.reduce(function(row, header, index) {
    row[header] = values[index] === undefined ? '' : values[index];
    return row;
  }, {});
}

function objectToRow(headers, object) {
  return headers.map(function(header) {
    return object[header] === undefined ? '' : object[header];
  });
}

function csvEscape(value) {
  const text = String(value === undefined || value === null ? '' : value);
  if (/[",\r\n]/.test(text)) {
    return '"' + text.replace(/"/g, '""') + '"';
  }
  return text;
}

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function sanitizeFileName(name) {
  return cleanText(name, 120)
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, '_');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
