using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Persistence.Models;

namespace ProEventos.Persistence.Contratos
{


    //EVENTOS
    public interface IEventoPersist
    {


        //EVENTOS

        // Task<Evento[]> GetAllEventosByTemaAsync(int userId, string tema, bool includePalestrantes = false);

        // Task<Evento[]> GetAllEventosAsync(int userId, bool includePalestrantes = false);

        //Task<PageList<Evento>> GetAllEventosByTemaAsync(int userId, PageParams pageParams, string tema, bool includePalestrantes = false);

        Task<PageList<Evento>> GetAllEventosAsync(int userId, PageParams pageParams, bool includePalestrantes = false);
        Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false);


    }
}