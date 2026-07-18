const CatalogService = {
  getAdminData: function(showInactive) {
    return {
      categorias: this.filterActive(SheetRepository.list(Config.SHEETS.CATEGORIES), showInactive),
      botellas: this.filterActive(SheetRepository.list(Config.SHEETS.BOTTLES), showInactive),
      relaciones: this.filterActive(SheetRepository.list(Config.SHEETS.CATEGORY_BOTTLE), showInactive),
      secciones: this.filterActive(SheetRepository.list(Config.SHEETS.SECTIONS), showInactive).sort(this.byOrder),
      campos: this.filterActive(SheetRepository.list(Config.SHEETS.FIELDS), showInactive).sort(this.byOrder),
      unidades: this.filterActive(SheetRepository.list(Config.SHEETS.UNITS), showInactive).sort(this.byOrder)
    };
  },

  filterActive: function(rows, showInactive) {
    return rows.filter(function(row) {
      return showInactive || toBoolean(row.activo);
    });
  },

  byOrder: function(a, b) {
    return Number(a.orden || 0) - Number(b.orden || 0);
  },

  createSimpleEntity: function(sheetName, prefix, payload, userEmail) {
    const name = toSystemUpperText(payload && payload.nombre, 120);
    if (!name) {
      throw new Error('El nombre es obligatorio.');
    }
    const normalized = normalizeText(name);
    const duplicate = SheetRepository.list(sheetName).find(function(row) {
      return row.nombreNormalizado === normalized;
    });
    if (duplicate) {
      throw new Error('Ya existe un registro con ese nombre.');
    }
    const date = nowIso();
    const entity = {
      id: createId(prefix),
      nombre: name,
      nombreNormalizado: normalized,
      activo: true,
      fechaCreacion: date,
      creadoPor: userEmail,
      fechaModificacion: date,
      modificadoPor: userEmail,
      version: 1
    };
    SheetRepository.append(sheetName, entity);
    HistoryService.recordEvent({
      user: userEmail,
      type: 'CREAR',
      entity: sheetName,
      entityId: entity.id,
      reason: 'Creación de catálogo.',
      details: [{ field: 'nombre', before: '', after: name }]
    });
    return entity;
  },

  createOrderedEntity: function(sheetName, prefix, payload, userEmail) {
    const entity = this.createSimpleEntity(sheetName, prefix, payload, userEmail);
    const order = Number(payload && payload.orden) || SheetRepository.list(sheetName).length;
    return SheetRepository.updateById(sheetName, entity.id, {
      orden: order,
      fechaModificacion: nowIso(),
      modificadoPor: userEmail
    });
  },

  updateSection: function(payload, userEmail) {
    const id = cleanText(payload && payload.id, 80);
    const name = toSystemUpperText(payload && payload.nombre, 120);
    const order = Number(payload && payload.orden) || '';
    if (!id) {
      throw new Error('Falta la sección a editar.');
    }
    if (!name) {
      throw new Error('El nombre de la sección es obligatorio.');
    }
    const current = SheetRepository.findById(Config.SHEETS.SECTIONS, id);
    if (!current) {
      throw new Error('No se encontró la sección seleccionada.');
    }
    const normalized = normalizeText(name);
    const duplicate = SheetRepository.list(Config.SHEETS.SECTIONS).find(function(row) {
      return row.id !== id && row.nombreNormalizado === normalized;
    });
    if (duplicate) {
      throw new Error('Ya existe una sección con ese nombre.');
    }
    const patch = {
      nombre: name,
      nombreNormalizado: normalized,
      orden: order,
      fechaModificacion: nowIso(),
      modificadoPor: userEmail,
      version: Number(current.version || 1) + 1
    };
    const updated = SheetRepository.updateById(Config.SHEETS.SECTIONS, id, patch);
    HistoryService.recordEvent({
      user: userEmail,
      type: 'MODIFICAR',
      entity: Config.SHEETS.SECTIONS,
      entityId: id,
      reason: 'Edición de sección.',
      details: [
        { field: 'nombre', before: current.nombre || '', after: updated.nombre || '' },
        { field: 'orden', before: current.orden || '', after: updated.orden || '' }
      ].filter(function(detail) {
        return String(detail.before) !== String(detail.after);
      })
    });
    return updated;
  },

  createField: function(payload, userEmail) {
    const name = toSystemUpperText(payload && payload.nombre, 120);
    const sectionId = cleanText(payload && payload.seccionId, 80);
    const type = cleanText(payload && payload.tipo, 20);
    if (!name || !sectionId) {
      throw new Error('La sección y el nombre del campo son obligatorios.');
    }
    if ([Config.FIELD_TYPES.TEXT, Config.FIELD_TYPES.NUMBER].indexOf(type) === -1) {
      throw new Error('El tipo de campo no es válido.');
    }
    if (!SheetRepository.findById(Config.SHEETS.SECTIONS, sectionId)) {
      throw new Error('La sección seleccionada no existe.');
    }
    const normalized = normalizeText(sectionId + '|' + name);
    const duplicate = SheetRepository.list(Config.SHEETS.FIELDS).find(function(row) {
      return row.nombreNormalizado === normalized;
    });
    if (duplicate) {
      throw new Error('Ya existe un campo con ese nombre en la sección.');
    }
    const date = nowIso();
    const field = {
      id: createId('cam'),
      seccionId: sectionId,
      nombre: name,
      nombreNormalizado: normalized,
      tipo: type,
      obligatorio: !!payload.obligatorio,
      unidadId: payload.unidadId || '',
      orden: Number(payload.orden) || SheetRepository.list(Config.SHEETS.FIELDS).length + 1,
      activo: true,
      fechaCreacion: date,
      creadoPor: userEmail,
      fechaModificacion: date,
      modificadoPor: userEmail,
      version: 1
    };
    SheetRepository.append(Config.SHEETS.FIELDS, field);
    HistoryService.recordEvent({
      user: userEmail,
      type: 'CREAR',
      entity: Config.SHEETS.FIELDS,
      entityId: field.id,
      reason: 'Creación de campo dinámico.',
      details: [{ field: 'nombre', before: '', after: name }]
    });
    return field;
  },

  createCategoryBottleRelation: function(payload, userEmail) {
    const categoryId = cleanText(payload && payload.categoriaId, 80);
    const bottleId = cleanText(payload && payload.botellaId, 80);
    if (!SheetRepository.findById(Config.SHEETS.CATEGORIES, categoryId) || !SheetRepository.findById(Config.SHEETS.BOTTLES, bottleId)) {
      throw new Error('La categoría o botella seleccionada no existe.');
    }
    const duplicate = SheetRepository.list(Config.SHEETS.CATEGORY_BOTTLE).find(function(row) {
      return row.categoriaId === categoryId && row.botellaId === bottleId;
    });
    if (duplicate) {
      if (!toBoolean(duplicate.activo)) {
        return SheetRepository.updateById(Config.SHEETS.CATEGORY_BOTTLE, duplicate.id, {
          activo: true,
          fechaModificacion: nowIso(),
          modificadoPor: userEmail,
          version: Number(duplicate.version || 1) + 1
        });
      }
      throw new Error('La relación entre categoría y botella ya existe.');
    }
    const date = nowIso();
    const relation = {
      id: createId('rel'),
      categoriaId: categoryId,
      botellaId: bottleId,
      activo: true,
      fechaCreacion: date,
      creadoPor: userEmail,
      fechaModificacion: date,
      modificadoPor: userEmail,
      version: 1
    };
    SheetRepository.append(Config.SHEETS.CATEGORY_BOTTLE, relation);
    HistoryService.recordEvent({
      user: userEmail,
      type: 'CREAR_RELACION',
      entity: Config.SHEETS.CATEGORY_BOTTLE,
      entityId: relation.id,
      reason: 'Relación categoría-botella.',
      details: []
    });
    return relation;
  },

  toggleEntity: function(payload, userEmail) {
    const allowedSheets = [
      Config.SHEETS.CATEGORIES,
      Config.SHEETS.BOTTLES,
      Config.SHEETS.CATEGORY_BOTTLE,
      Config.SHEETS.SECTIONS,
      Config.SHEETS.FIELDS,
      Config.SHEETS.UNITS
    ];
    if (allowedSheets.indexOf(payload.sheetName) === -1) {
      throw new Error('La entidad no se puede activar o desactivar desde esta operación.');
    }
    const current = SheetRepository.findById(payload.sheetName, payload.id);
    if (!current) {
      throw new Error('No se encontró el registro.');
    }
    const active = !!payload.activo;
    const updated = SheetRepository.updateById(payload.sheetName, payload.id, {
      activo: active,
      fechaModificacion: nowIso(),
      modificadoPor: userEmail,
      version: Number(current.version || 1) + 1
    });
    HistoryService.recordEvent({
      user: userEmail,
      type: active ? 'REACTIVAR' : 'DESACTIVAR',
      entity: payload.sheetName,
      entityId: payload.id,
      reason: payload.motivo || 'Cambio de estado.',
      details: [{ field: 'activo', before: current.activo, after: active }]
    });
    return updated;
  }
};

