const DraftService = {
  listPendingDrafts: function() {
    return SheetRepository.list(Config.SHEETS.DRAFTS).filter(function(row) {
      return row.estado === Config.STATES.DRAFT;
    });
  },

  listDiscardedDrafts: function() {
    return SheetRepository.list(Config.SHEETS.DISCARDED_DRAFTS).filter(function(row) {
      return row.estado === Config.STATES.DISCARDED;
    });
  },

  acquireLock: function(draftId, userEmail) {
    if (!draftId) throw new Error('Falta el borrador a bloquear.');
    const scriptLock = LockService.getScriptLock();
    scriptLock.waitLock(30000);
    try {
      this.expireOldLocks();
      const activeLock = SheetRepository.list(Config.SHEETS.LOCKS).find(function(row) {
        return row.borradorId === draftId && toBoolean(row.activo);
      });
      const date = nowIso();
      const expiration = new Date(Date.now() + Config.LOCK_MINUTES * 60000);
      const expiresIso = Utilities.formatDate(expiration, Config.TIME_ZONE, "yyyy-MM-dd'T'HH:mm:ss");
      if (activeLock && activeLock.usuario !== userEmail) {
        throw new Error('Este borrador está siendo editado por ' + activeLock.usuario + '. Puedes verlo en modo lectura.');
      }
      if (activeLock) {
        return SheetRepository.updateById(Config.SHEETS.LOCKS, activeLock.id, {
          ultimaActividad: date,
          venceEn: expiresIso
        });
      }
      const lock = {
        id: createId('blo'),
        borradorId: draftId,
        usuario: userEmail,
        fechaBloqueo: date,
        ultimaActividad: date,
        venceEn: expiresIso,
        activo: true
      };
      SheetRepository.append(Config.SHEETS.LOCKS, lock);
      return lock;
    } finally {
      scriptLock.releaseLock();
    }
  },

  releaseLock: function(draftId, userEmail) {
    const activeLock = SheetRepository.list(Config.SHEETS.LOCKS).find(function(row) {
      return row.borradorId === draftId && row.usuario === userEmail && toBoolean(row.activo);
    });
    if (!activeLock) return null;
    return SheetRepository.updateById(Config.SHEETS.LOCKS, activeLock.id, {
      activo: false,
      ultimaActividad: nowIso()
    });
  },

  expireOldLocks: function() {
    const now = nowIso();
    SheetRepository.list(Config.SHEETS.LOCKS).forEach(function(row) {
      if (toBoolean(row.activo) && row.venceEn && row.venceEn < now) {
        SheetRepository.updateById(Config.SHEETS.LOCKS, row.id, { activo: false });
      }
    });
  },

  discardDraft: function(payload, userEmail) {
    const draft = SheetRepository.findById(Config.SHEETS.DRAFTS, payload.borradorId);
    const reason = cleanText(payload.motivo, 500);
    if (!draft) throw new Error('No se encontró el borrador.');
    if (!reason) throw new Error('El motivo de descarte es obligatorio.');
    const discarded = {
      id: createId('des'),
      borradorId: draft.id,
      datosJson: JSON.stringify(draft),
      motivo: reason,
      fechaDescarte: nowIso(),
      descartadoPor: userEmail,
      fechaRecuperacion: '',
      recuperadoPor: '',
      estado: Config.STATES.DISCARDED
    };
    SheetRepository.append(Config.SHEETS.DISCARDED_DRAFTS, discarded);
    SheetRepository.updateById(Config.SHEETS.DRAFTS, draft.id, {
      estado: Config.STATES.DISCARDED,
      fechaModificacion: nowIso(),
      modificadoPor: userEmail,
      version: Number(draft.version || 1) + 1
    });
    this.releaseLock(draft.id, userEmail);
    HistoryService.recordEvent({
      user: userEmail,
      type: 'DESCARTAR_BORRADOR',
      entity: Config.SHEETS.DRAFTS,
      entityId: draft.id,
      productId: draft.id,
      reason: reason,
      details: [{ field: 'estado', before: draft.estado, after: Config.STATES.DISCARDED }]
    });
    return discarded;
  },

  recoverDraft: function(payload, userEmail) {
    const discarded = SheetRepository.findById(Config.SHEETS.DISCARDED_DRAFTS, payload.id);
    if (!discarded) throw new Error('No se encontró el borrador descartado.');
    const draftData = safeJsonParse(discarded.datosJson, null);
    if (!draftData) throw new Error('No fue posible recuperar los datos del borrador.');
    SheetRepository.updateById(Config.SHEETS.DRAFTS, draftData.id, {
      estado: Config.STATES.DRAFT,
      fechaModificacion: nowIso(),
      modificadoPor: userEmail,
      version: Number(draftData.version || 1) + 1
    });
    SheetRepository.updateById(Config.SHEETS.DISCARDED_DRAFTS, discarded.id, {
      fechaRecuperacion: nowIso(),
      recuperadoPor: userEmail,
      estado: Config.STATES.DRAFT
    });
    HistoryService.recordEvent({
      user: userEmail,
      type: 'RECUPERAR_BORRADOR',
      entity: Config.SHEETS.DRAFTS,
      entityId: draftData.id,
      productId: draftData.id,
      reason: payload.motivo || 'Recuperación de borrador.',
      details: [{ field: 'estado', before: Config.STATES.DISCARDED, after: Config.STATES.DRAFT }]
    });
    return draftData;
  }
};
