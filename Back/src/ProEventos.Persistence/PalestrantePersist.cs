using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contextos;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Models;

namespace ProEventos.Persistence
{



    public class PalestrantePersist : GeralPersist, IPalestrantePersist
    {
        private readonly ProEventosContext _context;
        public PalestrantePersist(ProEventosContext context) : base(context)
        {
            _context = context;
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        public async Task<PageList<Palestrante>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                    .Include(p => p.User)
                    .Include(p => p.RedesSociais);
            if (includeEventos)
            {
                query = query.Include(p => p.PalestrantesEventos)
                .ThenInclude(pe => pe.Evento);
            }
            query = query.AsNoTracking()
                                  .Where(p => (p.MiniCurriculo.ToLower().Contains(pageParams.Term.ToLower()) ||
                                                        p.User.PrimeiroNome.ToLower().Contains(pageParams.Term.ToLower()) ||
                                                        p.User.UltimoNome.ToLower().Contains(pageParams.Term.ToLower())) &&
                                                        p.User.Funcao == Domain.Enum.Funcao.Palestrante)
                                  .OrderBy(p => p.Id);

            return await PageList<Palestrante>.CreateAsync(query, pageParams.PageNumber, pageParams.pageSize);
        }

        // public async Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos)
        // {
        //     IQueryable<Palestrante> query = _context.Palestrantes
        //             .Include(p => p.RedesSociais);
        //     if (includeEventos)
        //     {
        //         query = query.Include(p => p.PalestrantesEventos)
        //         .ThenInclude(pe => pe.Evento);
        //     }
        //     query = query.OrderBy(p => p.Id)
        //                           .Where(p => p.User.PrimeiroNome.ToLower().Contains(nome.ToLower()));
        //     //&&/p.User.UltimoNome.ToLower().Contains(nome.ToLower()));

        //     return await query.ToArrayAsync();
        // }


        public async Task<Palestrante> GetPalestranteByUserIdAsync(int userId, bool includeEventos)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                    .Include(p => p.User)
                    .Include(p => p.RedesSociais);
            if (includeEventos)
            {
                query = query.Include(p => p.PalestrantesEventos)
                .ThenInclude(pe => pe.Evento);
            }
            query = query.OrderBy(p => p.Id)
                                  .Where(p => p.UserId == userId);

            return await query.FirstOrDefaultAsync();
        }


    }
}