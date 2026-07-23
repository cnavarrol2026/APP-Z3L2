const Config = Object.freeze({
  APP_NAME: 'Estándar de Configuración Zona 3 Línea 2',
  TIME_ZONE: 'America/Santiago',
  SPREADSHEET_ID: '1vdFkhk0nGzlnX_aZ80l9hmSdHhD3_LSQOVBdXbURH6A',
  DRIVE_IMAGE_FOLDER_ID: 'CONFIGURAR_CARPETA_IMAGENES_CORPORATIVA',
  DRIVE_BACKUP_FOLDER_ID: 'CONFIGURAR_CARPETA_RESPALDOS_CORPORATIVA',
  LOCK_MINUTES: 15,
  MAX_IMAGE_BYTES: 1024 * 1024,
  IMAGE_MIME_TYPE: 'image/png',
  IMAGE_EXTENSION: '.png',
  FIELD_TYPES: Object.freeze({
    TEXT: 'TEXTO',
    NUMBER: 'NUMERO'
  }),
  STATES: Object.freeze({
    DRAFT: 'BORRADOR',
    ACTIVATED: 'ACTIVADO',
    ACTIVE: 'ACTIVO',
    INACTIVE: 'INACTIVO',
    DISCARDED: 'DESCARTADO'
  }),
  IMAGE_TYPES: Object.freeze({
    ETQ: 'ETQ',
    CET: 'CET'
  }),
  SHEETS: Object.freeze({
    CONFIG: 'CONFIGURACION',
    CATEGORIES: 'CATEGORIAS',
    BOTTLES: 'BOTELLAS',
    CATEGORY_BOTTLE: 'CATEGORIA_BOTELLA',
    ARTICLES: 'ARTICULOS',
    SECTIONS: 'SECCIONES',
    FIELDS: 'CAMPOS',
    UNITS: 'UNIDADES',
    ARTICLE_VALUES: 'VALORES_ARTICULO',
    ARTICLE_IMAGES: 'IMAGENES_ARTICULO',
    DRAFTS: 'BORRADORES',
    DRAFT_VALUES: 'VALORES_BORRADOR',
    DISCARDED_DRAFTS: 'BORRADORES_DESCARTADOS',
    HISTORY_EVENTS: 'HISTORIAL_EVENTOS',
    HISTORY_DETAIL: 'HISTORIAL_DETALLE',
    LOCKS: 'BLOQUEOS',
    ERRORS: 'ERRORES_LOG',
    BACKUPS: 'RESPALDOS_LOG'
  }),
  HEADERS: Object.freeze({
    CONFIGURACION: ['clave', 'valor', 'descripcion'],
    CATEGORIAS: ['id', 'nombre', 'nombreNormalizado', 'activo', 'fechaCreacion', 'creadoPor', 'fechaModificacion', 'modificadoPor', 'version'],
    BOTELLAS: ['id', 'nombre', 'nombreNormalizado', 'activo', 'fechaCreacion', 'creadoPor', 'fechaModificacion', 'modificadoPor', 'version'],
    CATEGORIA_BOTELLA: ['id', 'categoriaId', 'botellaId', 'activo', 'fechaCreacion', 'creadoPor', 'fechaModificacion', 'modificadoPor', 'version'],
    ARTICULOS: ['id', 'categoriaId', 'botellaId', 'codigoArticulo', 'codigoNormalizado', 'descripcion', 'estado', 'etqAplica', 'codigoEtq', 'cetAplica', 'codigoCet', 'fechaCreacion', 'creadoPor', 'fechaModificacion', 'modificadoPor', 'version'],
    SECCIONES: ['id', 'nombre', 'nombreNormalizado', 'orden', 'activo', 'fechaCreacion', 'creadoPor', 'fechaModificacion', 'modificadoPor', 'version'],
    CAMPOS: ['id', 'seccionId', 'nombre', 'nombreNormalizado', 'tipo', 'obligatorio', 'unidadId', 'orden', 'activo', 'fechaCreacion', 'creadoPor', 'fechaModificacion', 'modificadoPor', 'version'],
    UNIDADES: ['id', 'nombre', 'nombreNormalizado', 'orden', 'activo', 'fechaCreacion', 'creadoPor', 'fechaModificacion', 'modificadoPor', 'version'],
    VALORES_ARTICULO: ['id', 'articuloId', 'campoId', 'valor', 'unidadId', 'fechaCreacion', 'creadoPor', 'fechaModificacion', 'modificadoPor', 'version'],
    IMAGENES_ARTICULO: ['id', 'articuloId', 'tipoImagen', 'codigo', 'driveFileId', 'nombreArchivo', 'mimeType', 'tamanoBytes', 'url', 'activo', 'fechaCreacion', 'creadoPor', 'fechaModificacion', 'modificadoPor', 'version'],
    BORRADORES: ['id', 'categoriaId', 'botellaId', 'codigoArticulo', 'codigoNormalizado', 'descripcion', 'estado', 'etqAplica', 'codigoEtq', 'cetAplica', 'codigoCet', 'etapa', 'payloadJson', 'fechaCreacion', 'creadoPor', 'fechaModificacion', 'modificadoPor', 'version'],
    VALORES_BORRADOR: ['id', 'borradorId', 'campoId', 'valor', 'unidadId', 'fechaCreacion', 'creadoPor', 'fechaModificacion', 'modificadoPor', 'version'],
    BORRADORES_DESCARTADOS: ['id', 'borradorId', 'datosJson', 'motivo', 'fechaDescarte', 'descartadoPor', 'fechaRecuperacion', 'recuperadoPor', 'estado'],
    HISTORIAL_EVENTOS: ['id', 'fecha', 'usuario', 'tipoAccion', 'entidad', 'entidadId', 'productoId', 'motivo'],
    HISTORIAL_DETALLE: ['id', 'eventoId', 'campo', 'valorAnterior', 'valorNuevo'],
    BLOQUEOS: ['id', 'borradorId', 'usuario', 'fechaBloqueo', 'ultimaActividad', 'venceEn', 'activo'],
    ERRORES_LOG: ['id', 'fecha', 'usuario', 'funcion', 'mensaje', 'detalle'],
    RESPALDOS_LOG: ['id', 'fecha', 'usuario', 'driveFileId', 'nombreArchivo', 'url', 'tamanoBytes']
  })
});
