const TemplateService = {
  DEFAULT_SECTIONS: [
    {
      id: 'sec_botella_insumos',
      nombre: 'Botella e Insumos',
      orden: 10,
      fields: [
        { id: 'cam_tipo_botella', nombre: 'Tipo de botella', tipo: Config.FIELD_TYPES.TEXT, obligatorio: true, orden: 10 },
        { id: 'cam_medidas_etiqueta', nombre: 'Medidas etiqueta', tipo: Config.FIELD_TYPES.TEXT, obligatorio: true, orden: 20 },
        { id: 'cam_altura_pegado_etiqueta', nombre: 'Altura de pegado (etiqueta)', tipo: Config.FIELD_TYPES.NUMBER, unidad: 'mm', obligatorio: true, orden: 30 },
        { id: 'cam_altura_contra_etiqueta', nombre: 'Altura contra-etiqueta', tipo: Config.FIELD_TYPES.NUMBER, unidad: 'mm', obligatorio: false, orden: 40 },
        { id: 'cam_altura_medalla', nombre: 'Altura medalla', tipo: Config.FIELD_TYPES.NUMBER, unidad: 'mm', obligatorio: false, orden: 50 }
      ]
    },
    {
      id: 'sec_ajustes_etiquetadora',
      nombre: 'Ajustes Mecánicos de Etiquetadora',
      orden: 20,
      fields: [
        { id: 'cam_entrada_guia_sin_fin', nombre: 'Entrada guía sin fin', tipo: Config.FIELD_TYPES.TEXT, obligatorio: false, orden: 10 },
        { id: 'cam_guia_botellas', nombre: 'Guía de botellas', tipo: Config.FIELD_TYPES.TEXT, obligatorio: false, orden: 20 },
        { id: 'cam_altura_estrella', nombre: 'Altura de estrella', tipo: Config.FIELD_TYPES.NUMBER, unidad: 'mm', obligatorio: false, orden: 30 },
        { id: 'cam_levas', nombre: 'Levas', tipo: Config.FIELD_TYPES.TEXT, obligatorio: false, orden: 40 },
        { id: 'cam_altura_estaciones', nombre: 'Altura estaciones', tipo: Config.FIELD_TYPES.NUMBER, unidad: 'mm', obligatorio: false, orden: 50 },
        { id: 'cam_profundidad_estaciones', nombre: 'Profundidad estaciones', tipo: Config.FIELD_TYPES.NUMBER, unidad: 'mm', obligatorio: false, orden: 60 },
        { id: 'cam_ajuste_lateral', nombre: 'Ajuste lateral', tipo: Config.FIELD_TYPES.NUMBER, unidad: 'mm', obligatorio: false, orden: 70 },
        { id: 'cam_velocidad_emision', nombre: 'Velocidad emisión', tipo: Config.FIELD_TYPES.NUMBER, unidad: 'm/min', obligatorio: false, orden: 80 },
        { id: 'cam_distancia_etiqueta', nombre: 'Distancia de etiqueta', tipo: Config.FIELD_TYPES.NUMBER, unidad: 'mm', obligatorio: false, orden: 90 },
        { id: 'cam_tipo_chaleco', nombre: 'Tipo de chaleco', tipo: Config.FIELD_TYPES.TEXT, obligatorio: false, orden: 100 }
      ]
    },
    {
      id: 'sec_ajustes_capsuladora',
      nombre: 'Ajustes de Capsuladora',
      orden: 30,
      fields: [
        { id: 'cam_formato_capsula', nombre: 'N° formato (cápsula)', tipo: Config.FIELD_TYPES.TEXT, obligatorio: false, orden: 10 },
        { id: 'cam_formato_botella', nombre: 'N° formato (botella)', tipo: Config.FIELD_TYPES.TEXT, obligatorio: false, orden: 20 },
        { id: 'cam_color_formato', nombre: 'Color de formato', tipo: Config.FIELD_TYPES.TEXT, obligatorio: false, orden: 30 },
        { id: 'cam_material_capsula', nombre: 'Material (PVC / Complex)', tipo: Config.FIELD_TYPES.TEXT, obligatorio: false, orden: 40 },
        { id: 'cam_sinfin_capsuladora', nombre: 'Sinfín capsuladora', tipo: Config.FIELD_TYPES.TEXT, obligatorio: false, orden: 50 }
      ]
    }
  ],

  DEFAULT_UNITS: [
    { id: 'uni_mm', nombre: 'mm', orden: 10 },
    { id: 'uni_m_min', nombre: 'm/min', orden: 20 }
  ],

  ensureDefaultTechnicalTemplate: function(userEmail) {
    const date = nowIso();
    const unitsByName = {};
    SheetRepository.list(Config.SHEETS.UNITS).forEach(function(unit) {
      unitsByName[unit.nombreNormalizado || normalizeText(unit.nombre)] = unit;
    });

    this.DEFAULT_UNITS.forEach(function(unit) {
      const normalized = normalizeText(unit.nombre);
      if (unitsByName[normalized]) {
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

    const sectionsById = {};
    SheetRepository.list(Config.SHEETS.SECTIONS).forEach(function(section) {
      sectionsById[section.id] = section;
    });

    const fieldsById = {};
    SheetRepository.list(Config.SHEETS.FIELDS).forEach(function(field) {
      fieldsById[field.id] = field;
    });

    this.DEFAULT_SECTIONS.forEach(function(section) {
      if (!sectionsById[section.id]) {
        SheetRepository.append(Config.SHEETS.SECTIONS, {
          id: section.id,
          nombre: section.nombre,
          nombreNormalizado: normalizeText(section.nombre),
          orden: section.orden,
          activo: true,
          fechaCreacion: date,
          creadoPor: userEmail,
          fechaModificacion: date,
          modificadoPor: userEmail,
          version: 1
        });
      }

      section.fields.forEach(function(field) {
        if (fieldsById[field.id]) {
          return;
        }
        const unit = field.unidad ? unitsByName[normalizeText(field.unidad)] : null;
        SheetRepository.append(Config.SHEETS.FIELDS, {
          id: field.id,
          seccionId: section.id,
          nombre: field.nombre,
          nombreNormalizado: normalizeText(section.id + '|' + field.nombre),
          tipo: field.tipo,
          obligatorio: field.obligatorio,
          unidadId: unit ? unit.id : '',
          orden: field.orden,
          activo: true,
          fechaCreacion: date,
          creadoPor: userEmail,
          fechaModificacion: date,
          modificadoPor: userEmail,
          version: 1
        });
      });
    });
  }
};
