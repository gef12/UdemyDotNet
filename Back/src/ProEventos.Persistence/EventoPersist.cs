using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Models;

namespace ProEventos.Persistence
{


    //EVENTOS
    public class EventoPersist : IEventoPersist
    {
        private readonly ProEventosContext _context;
        public EventoPersist(ProEventosContext context)
        {
            _context = context;

            //funciona para todos os metodos gets mas casa  uma aplicação tenha neccesidade do track basta fazer metodo a metodo
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }





        public async Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                    .Include(e => e.Lotes)
                    .Include(e => e.RedesSociais);
            if (includePalestrantes)
            {
                query = query.Include(e => e.PalestrantesEventos)
                .ThenInclude(pe => pe.Palestrante);
            }
            //exemplo de tracking para cada metodo
            //query = query.AsNoTracking().OrderBy(e => e.Id);

            query = query.AsNoTracking()
             .Where(e => (e.Tema.ToLower().Contains(pageParams.Term.ToLower()) ||
                                    e.Local.ToLower().Contains(pageParams.Term.ToLower())) &&
                                    e.UserId == userId);
            //.Where(e => e.UserId == userId).OrderBy(e => e.Id);

            return await PageList<Evento>.CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);
        }

        // public async Task<PageList<Evento>> GetAllEventosByTemaAsync(int userId, PageParams pageParams, string tema, bool includePalestrantes = false)
        // {
        //     IQueryable<Evento> query = _context.Eventos
        //     .Include(e => e.Lotes)
        //     .Include(e => e.RedesSociais);
        //     if (includePalestrantes)
        //     {
        //         query = query.Include(e => e.PalestrantesEventos)
        //         .ThenInclude(pe => pe.Palestrante);
        //     }
        //     query = query.OrderBy(e => e.Id)
        //             .Where(e => e.Tema.ToLower().Contains(tema.ToLower()) && e.UserId == userId);

        //     return await query.ToArrayAsync();
        // }


        public async Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
        .Include(e => e.Lotes)
        .Include(e => e.RedesSociais);
            if (includePalestrantes)
            {
                query = query.Include(e => e.PalestrantesEventos)
                .ThenInclude(pe => pe.Palestrante);
            }
            query = query.OrderBy(e => e.Id)
                    .Where(e => e.Id == eventoId && e.UserId == userId);

            return await query.FirstOrDefaultAsync();
        }




    }
}