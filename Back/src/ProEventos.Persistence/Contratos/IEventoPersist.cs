using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{


    //EVENTOS
    public interface IEventoPersist
    {


        //EVENTOS

        Task<Evento[]> GetAllEventosByTemaAsync(int userId, string tema, bool includePalestrantes = false);

        Task<Evento[]> GetAllEventosAsync(int userId, bool includePalestrantes = false);

        Task<Evento> GetEventoByIdAsync(int userId, int eventoId, bool includePalestrantes = false);


    }
}