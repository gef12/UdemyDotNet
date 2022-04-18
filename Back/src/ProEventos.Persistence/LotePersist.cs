using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{


    //EVENTOS
    public class LotePersist : ILotePersist
    {
        private readonly ProEventosContext _context;
        public LotePersist(ProEventosContext context)
        {
            _context = context;

            //funciona para todos os metodos gets mas casa  uma aplicação tenha neccesidade do track basta fazer metodo a metodo
            //_context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public async Task<Lote> GetLoteByIdsAsync(int eventoId, int loteId)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking()
                                  .Where(lote => lote.EventoId == eventoId
                                                        && lote.Id == loteId);
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Lote[]> GetLotesByEventoIdAsync(int eventoId)
        {
            IQueryable<Lote> query = _context.Lotes;

            query = query.AsNoTracking()
                                  .Where(lote => lote.EventoId == eventoId);
            return await query.ToArrayAsync();
        }
    }
}