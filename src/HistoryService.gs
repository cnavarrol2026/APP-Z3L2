const HistoryService = {
  recordEvent: function(input) {
    const eventId = createId('his');
    SheetRepository.append(Config.SHEETS.HISTORY_EVENTS, {
      id: eventId,
      fecha: nowIso(),
      usuario: input.user || '',
      tipoAccion: input.type,
      entidad: input.entity,
      entidadId: input.entityId || '',
      productoId: input.productId || '',
      motivo: input.reason || ''
    });

    const detailRows = (input.details || []).map(function(detail) {
      return {
        id: createId('det'),
        eventoId: eventId,
        campo: detail.field,
        valorAnterior: detail.before === undefined ? '' : detail.before,
        valorNuevo: detail.after === undefined ? '' : detail.after
      };
    });
    SheetRepository.appendMany(Config.SHEETS.HISTORY_DETAIL, detailRows);

    return eventId;
  },

  listEvents: function(filters) {
    const events = SheetRepository.list(Config.SHEETS.HISTORY_EVENTS);
    const details = SheetRepository.list(Config.SHEETS.HISTORY_DETAIL);
    return events
      .filter(function(event) {
        if (filters.productId && event.productoId !== filters.productId) return false;
        if (filters.user && event.usuario !== filters.user) return false;
        if (filters.from && event.fecha < filters.from) return false;
        if (filters.to && event.fecha > filters.to) return false;
        return true;
      })
      .slice(-200)
      .reverse()
      .map(function(event) {
        event.detalles = details.filter(function(detail) {
          return detail.eventoId === event.id;
        });
        return event;
      });
  }
};
