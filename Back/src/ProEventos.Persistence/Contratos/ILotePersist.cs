using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{


    //EVENTOS
    public interface ILotePersist
    {
        /// <summary>
        ///     metodo get que retornara uma lista de lotes por eventoId
        /// </summary>
        /// <param name="eventoId"> codigo chave da tabela evento</param>
        /// <returns>Lista de Lotes</returns>

        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);


        /// <summary>
        /// metodo que retornara apenas um lote
        /// </summary>
        /// <param name="eventoId"> codigo chave  da tabela evento</param>
        /// <param name="loteId">codigo chave  da tabela lote</param>
        /// <returns> Apenas um lote</returns>
        Task<Lote> GetLoteByIdsAsync(int eventoId, int loteId);


    }
}