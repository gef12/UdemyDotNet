using System.Threading.Tasks;
using ProEventos.Domain;
using ProEventos.Persistence.Models;

namespace ProEventos.Persistence.Contratos
{


    //Palestrantes
    public interface IPalestrantePersist : IGeralPersist
    {

        // PALESTRANTES

        //Task<Palestrante[]> GetAllPalestrantesByNomeAsync(string nome, bool includeEventos);

        Task<PageList<Palestrante>> GetAllPalestrantesAsync(PageParams pageParams, bool includeEventos = false);

        Task<Palestrante> GetPalestranteByUserIdAsync(int userId, bool includeEventos = false);
    }
}