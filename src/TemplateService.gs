const TemplateService = {
  DEFAULT_SECTIONS: [
    {
      id: 'sec_botella_insumos',
      nombre: 'Botella e Insumos',
      orden: 10,
      fields: [
        { id: 'cam_programa_maquina', nombre: 'Programa de máquina', tipo: 'TEXTO', obligatorio: true, orden: 10 },
        { id: 'cam_programa_estacion', nombre: 'Programa de estación', tipo: 'TEXTO', obligatorio: true, orden: 20 },
        { id: 'cam_tipo_botella', nombre: 'Tipo de botella', tipo: 'TEXTO', obligatorio: true, orden: 30 },
        { id: 'cam_altura_pegado_etiqueta', nombre: 'Altura de Etiquetado', tipo: 'NUMERO', unidad: 'mm', obligatorio: true, orden: 40 },
        { id: 'cam_altura_contra_etiqueta', nombre: 'Altura ContraEtiqueta (CET)', tipo: 'NUMERO', unidad: 'mm', obligatorio: false, orden: 50 },
        { id: 'cam_altura_medalla', nombre: 'Altura medalla', tipo: 'NUMERO', unidad: 'mm', obligatorio: false, orden: 60 },
        { id: 'cam_medidas_etiqueta', nombre: 'Medidas ETQ', tipo: 'TEXTO', obligatorio: true, orden: 70 },
        { id: 'cam_medidas_etiqueta_cet', nombre: 'Medidas CET', tipo: 'TEXTO', obligatorio: false, orden: 80 }
      ]
    },
    {
      id: 'sec_formatos',
      nombre: 'FORMATOS',
      orden: 20,
      fields: [
        { id: 'cam_tipo_chaleco', nombre: 'Tipo de chaleco', tipo: 'TEXTO', obligatorio: false, orden: 10 },
        { id: 'cam_antares_luz', nombre: 'LUZ', tipo: 'TEXTO', obligatorio: false, orden: 20 },
        { id: 'cam_antares_focus_radial', nombre: 'FOCUS RADIAL', tipo: 'TEXTO', obligatorio: false, orden: 30 },
        { id: 'cam_antares_camara', nombre: 'CÁMARA', tipo: 'TEXTO', obligatorio: false, orden: 40 },
        { id: 'cam_levas_platos', nombre: 'Levas Platos', tipo: 'TEXTO', obligatorio: false, orden: 100 }
      ]
    },
    {
      id: 'sec_ajustes_etiquetadora',
      nombre: 'Ajustes Mecánicos de Etiquetadora',
      orden: 30,
      fields: [
        { id: 'cam_ajuste_sinfin_a', nombre: 'Ajuste sinfín A', tipo: 'TEXTO', obligatorio: false, orden: 10 },
        { id: 'cam_ajuste_sinfin_b', nombre: 'Ajuste sinfín B', tipo: 'TEXTO', obligatorio: false, orden: 20 },
        { id: 'cam_guia_botellas_a', nombre: 'Guía botellas A', tipo: 'TEXTO', obligatorio: false, orden: 30 },
        { id: 'cam_guia_botellas_h', nombre: 'Guía botellas H', tipo: 'TEXTO', obligatorio: false, orden: 40 },
        { id: 'cam_altura_estrella_entrada', nombre: 'Altura estrella entrada', tipo: 'NUMERO', unidad: 'mm', obligatorio: false, orden: 50 },
        { id: 'cam_altura_estrella_salida', nombre: 'Altura estrella salida', tipo: 'NUMERO', unidad: 'mm', obligatorio: false, orden: 60 },
        { id: 'cam_est1_altura', nombre: 'Estación 1 - Altura', tipo: 'NUMERO', unidad: 'mm', obligatorio: false, orden: 110 },
        { id: 'cam_est2_altura', nombre: 'Estación 2 - Altura', tipo: 'NUMERO', unidad: 'mm', obligatorio: false, orden: 120 },
        { id: 'cam_est3_altura', nombre: 'Estación 3 - Altura', tipo: 'NUMERO', unidad: 'mm', obligatorio: false, orden: 130 },
        { id: 'cam_est1_profundidad', nombre: 'Estación 1 - Profundidad', tipo: 'NUMERO', unidad: 'mm', obligatorio: false, orden: 140 },
        { id: 'cam_est2_profundidad', nombre: 'Estación 2 - Profundidad', tipo: 'NUMERO', unidad: 'mm', obligatorio: false, orden: 150 },
        { id: 'cam_est3_profundidad', nombre: 'Estación 3 - Profundidad', tipo: 'NUMERO', unidad: 'mm', obligatorio: false, orden: 160 },
        { id: 'cam_est1_inclinacion', nombre: 'Estación 1 - Inclinación', tipo: 'NUMERO', obligatorio: false, orden: 170 },
        { id: 'cam_est2_inclinacion', nombre: 'Estación 2 - Inclinación', tipo: 'NUMERO', obligatorio: false, orden: 180 },
        { id: 'cam_est3_inclinacion', nombre: 'Estación 3 - Inclinación', tipo: 'NUMERO', obligatorio: false, orden: 190 },
        { id: 'cam_est1_ve', nombre: 'Estación 1 - VE', tipo: 'TEXTO', obligatorio: false, orden: 200 },
        { id: 'cam_est2_ve', nombre: 'Estación 2 - VE', tipo: 'TEXTO', obligatorio: false, orden: 210 },
        { id: 'cam_est3_ve', nombre: 'Estación 3 - VE', tipo: 'TEXTO', obligatorio: false, orden: 220 },
        { id: 'cam_est1_rs', nombre: 'Estación 1 - RS', tipo: 'TEXTO', obligatorio: false, orden: 230 },
        { id: 'cam_est2_rs', nombre: 'Estación 2 - RS', tipo: 'TEXTO', obligatorio: false, orden: 240 },
        { id: 'cam_est3_rs', nombre: 'Estación 3 - RS', tipo: 'TEXTO', obligatorio: false, orden: 250 },
        { id: 'cam_est1_df', nombre: 'Estación 1 - DF', tipo: 'TEXTO', obligatorio: false, orden: 260 },
        { id: 'cam_est2_df', nombre: 'Estación 2 - DF', tipo: 'TEXTO', obligatorio: false, orden: 270 },
        { id: 'cam_est3_df', nombre: 'Estación 3 - DF', tipo: 'TEXTO', obligatorio: false, orden: 280 }
      ]
    },
    {
      id: 'sec_ajustes_capsuladora',
      nombre: 'Ajustes de Capsuladora',
      orden: 40,
      fields: [
        { id: 'cam_programa_capsuladora_bypass_tapa', nombre: 'Programa capsuladora bypass tapa', tipo: 'TEXTO', obligatorio: false, orden: 5 },
        { id: 'cam_formato_capsula', nombre: 'Número formato (cápsula)', tipo: 'TEXTO', obligatorio: false, orden: 10 },
        { id: 'cam_formato_botella', nombre: 'Número formato (botella)', tipo: 'TEXTO', obligatorio: false, orden: 20 },
        { id: 'cam_color_formato', nombre: 'Color de formato', tipo: 'TEXTO', obligatorio: false, orden: 30 },
        { id: 'cam_material_capsula', nombre: 'Material (PVC / Complex)', tipo: 'TEXTO', obligatorio: false, orden: 40 },
        { id: 'cam_sinfin_capsuladora', nombre: 'Sinfín capsuladora', tipo: 'TEXTO', obligatorio: false, orden: 50 }
      ]
    }
  ],

  OBSOLETE_FIELD_IDS: [
    'cam_entrada_guia_sin_fin',
    'cam_guia_botellas',
    'cam_altura_estrella',
    'cam_levas',
    'cam_altura_estaciones',
    'cam_profundidad_estaciones',
    'cam_ajuste_lateral',
    'cam_velocidad_emision',
    'cam_distancia_etiqueta'
  ],

  DEFAULT_UNITS: [
    { id: 'uni_mm', nombre: 'mm', orden: 10 },
    { id: 'uni_m_min', nombre: 'm/min', orden: 20 }
  ],

  getFallbackAdminData: function() {
    const units = this.DEFAULT_UNITS.map(function(unit) {
      return {
        id: unit.id,
        nombre: unit.nombre,
        nombreNormalizado: normalizeText(unit.nombre),
        orden: unit.orden,
        activo: true
      };
    });
    const sections = [];
    const fields = [];
    this.DEFAULT_SECTIONS.forEach(function(section) {
      sections.push({
        id: section.id,
        nombre: section.nombre,
        nombreNormalizado: normalizeText(section.nombre),
        orden: section.orden,
        activo: true
      });
      section.fields.forEach(function(field) {
        const unit = field.unidad ? units.find(function(item) {
          return item.nombre === field.unidad;
        }) : null;
        fields.push({
          id: field.id,
          seccionId: section.id,
          nombre: field.nombre,
          nombreNormalizado: normalizeText(section.id + '|' + field.nombre),
          tipo: field.tipo,
          obligatorio: field.obligatorio,
          unidadId: unit ? unit.id : '',
          orden: field.orden,
          activo: true
        });
      });
    });
    return {
      secciones: sections,
      campos: fields,
      unidades: units
    };
  },

  ensureDefaultTechnicalTemplate: function(userEmail) {
    const date = nowIso();
    const unitsByName = this.ensureDefaultUnits(userEmail, date);
    const sectionIdMap = this.ensureDefaultSections(userEmail, date);
    this.ensureDefaultFields(userEmail, date, unitsByName, sectionIdMap);
    this.deactivateObsoleteFields(userEmail, date);
  },

  ensureDefaultUnits: function(userEmail, date) {
    const unitsByName = {};
    SheetRepository.list(Config.SHEETS.UNITS).forEach(function(unit) {
      unitsByName[unit.nombreNormalizado || normalizeText(unit.nombre)] = unit;
    });

    this.DEFAULT_UNITS.forEach(function(unit) {
      const normalized = normalizeText(unit.nombre);
      const current = unitsByName[normalized];
      if (current) {
        if (!toBoolean(current.activo) || String(current.orden || '') !== String(unit.orden || '')) {
          SheetRepository.updateById(Config.SHEETS.UNITS, current.id, {
            nombre: unit.nombre,
            nombreNormalizado: normalized,
            orden: unit.orden,
            activo: true,
            fechaModificacion: date,
            modificadoPor: userEmail,
            version: Number(current.version || 1) + 1
          });
        }
        unitsByName[normalized] = Object.assign({}, current, { id: current.id });
        return;
      }
      SheetRepository.append(Config.SHEETS.UNITS, {
        id: unit.id,
        nombre: unit.nombre,
        nombreNormalizado: normalized,
        orden: unit.orden,
        activo: true,
        fechaCreacion: date,
        creadoPor: userEmail,
        fechaModificacion: date,
        modificadoPor: userEmail,
        version: 1
      });
      unitsByName[normalized] = { id: unit.id };
    });
    return unitsByName;
  },

  ensureDefaultSections: function(userEmail, date) {
    const sectionIdMap = {};
    const sections = SheetRepository.list(Config.SHEETS.SECTIONS);
    const sectionsById = {};
    sections.forEach(function(section) {
      sectionsById[section.id] = section;
    });

    this.DEFAULT_SECTIONS.forEach(function(section) {
      let current = sectionsById[section.id];
      const normalized = normalizeText(section.nombre);
      if (!current && section.id === 'sec_formatos') {
        current = sections.find(function(row) {
          return row.id !== 'sec_ajustes_capsuladora' && normalizeText(row.nombre) === normalized;
        }) || null;
      }
      if (!current) {
        SheetRepository.append(Config.SHEETS.SECTIONS, {
          id: section.id,
          nombre: section.nombre,
          nombreNormalizado: normalized,
          orden: section.orden,
          activo: true,
          fechaCreacion: date,
          creadoPor: userEmail,
          fechaModificacion: date,
          modificadoPor: userEmail,
          version: 1
        });
        sectionIdMap[section.id] = section.id;
        return;
      }
      sectionIdMap[section.id] = current.id;
      if (
        current.nombre !== section.nombre ||
        current.nombreNormalizado !== normalized ||
        String(current.orden || '') !== String(section.orden || '') ||
        !toBoolean(current.activo)
      ) {
        SheetRepository.updateById(Config.SHEETS.SECTIONS, current.id, {
          nombre: section.nombre,
          nombreNormalizado: normalized,
          orden: section.orden,
          activo: true,
          fechaModificacion: date,
          modificadoPor: userEmail,
          version: Number(current.version || 1) + 1
        });
      }
    });
    return sectionIdMap;
  },

  ensureDefaultFields: function(userEmail, date, unitsByName, sectionIdMap) {
    const fields = SheetRepository.list(Config.SHEETS.FIELDS);
    const fieldsById = {};
    const fieldsBySectionAndName = {};
    fields.forEach(function(field) {
      fieldsById[field.id] = field;
      fieldsBySectionAndName[normalizeText(field.seccionId + '|' + field.nombre)] = field;
    });

    this.DEFAULT_SECTIONS.forEach(function(section) {
      const actualSectionId = sectionIdMap[section.id] || section.id;
      section.fields.forEach(function(field) {
        const unit = field.unidad ? unitsByName[normalizeText(field.unidad)] : null;
        const expected = {
          seccionId: actualSectionId,
          nombre: field.nombre,
          nombreNormalizado: normalizeText(actualSectionId + '|' + field.nombre),
          tipo: field.tipo,
          obligatorio: field.obligatorio,
          unidadId: unit ? unit.id : '',
          orden: field.orden,
          activo: true
        };
        const current = fieldsById[field.id] || fieldsBySectionAndName[expected.nombreNormalizado];
        if (!current) {
          SheetRepository.append(Config.SHEETS.FIELDS, Object.assign({
            id: field.id,
            fechaCreacion: date,
            creadoPor: userEmail,
            fechaModificacion: date,
            modificadoPor: userEmail,
            version: 1
          }, expected));
          return;
        }
        const hasChanges = Object.keys(expected).some(function(key) {
          return String(current[key] || '') !== String(expected[key] || '');
        });
        if (hasChanges || !toBoolean(current.activo)) {
          SheetRepository.updateById(Config.SHEETS.FIELDS, current.id, Object.assign({}, expected, {
            fechaModificacion: date,
            modificadoPor: userEmail,
            version: Number(current.version || 1) + 1
          }));
        }
      });
    });
  },

  deactivateObsoleteFields: function(userEmail, date) {
    const obsoleteIds = this.OBSOLETE_FIELD_IDS;
    SheetRepository.list(Config.SHEETS.FIELDS).forEach(function(field) {
      if (obsoleteIds.indexOf(field.id) === -1 || !toBoolean(field.activo)) {
        return;
      }
      SheetRepository.updateById(Config.SHEETS.FIELDS, field.id, {
        activo: false,
        fechaModificacion: date,
        modificadoPor: userEmail,
        version: Number(field.version || 1) + 1
      });
    });
  }
};
