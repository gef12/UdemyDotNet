using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.Persistence;
using ProEventos.Persistence.Contextos;
using ProEventos.Application.Contratos;
using Microsoft.AspNetCore.Http;
using ProEventos.Application.Dtos;
//using ProEventos.Persistence.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LotesController : ControllerBase
    {
        /*
        public IEnumerable<Evento> _evento = new Evento[]
            {
                new Evento ()   {
                        EventoId = 1,
                        Tema = "angular ",
                        Local = "BH",
                        Lote = "1",
                        QtdPessoas = 250,
                        DataEvento = DateTime.Now.AddDays(2).ToString(),
                        ImagemURL = "foto0.png"
                },
                new Evento ()   {
                        EventoId = 2,
                        Tema = "angular  4",
                        Local = "rio",
                        Lote = "3",
                        QtdPessoas = 350,
                        DataEvento = DateTime.Now.AddDays(4).ToString(),
                        ImagemURL = "foto.png"
                }

            };
            */


        private readonly ILoteService _loteService;
        public LotesController(ILoteService lotesService)
        {
            _loteService = lotesService;
        }


        [HttpGet("{eventoId}")]
        public async Task<IActionResult> Get(int eventoId)
        {
            try
            {
                var lotes = await _loteService.GetLotesByEventoIdAsync(eventoId);
                if (lotes == null) return NoContent();
                // var eventosRetorno = new List<EventoDto>();

                // //so retornando os campos necessario para 
                // foreach (var evento in eventos)
                // {
                //     eventosRetorno.Add(new EventoDto()
                //     {
                //         Id = evento.Id,
                //         Local = evento.Local,
                //         DataEvento = evento.DataEvento.ToString(),
                //         Tema = evento.Tema,
                //         QtdPessoas = evento.QtdPessoas,
                //         ImagemURL = evento.ImagemURL,
                //         Telefone = evento.Telefone,
                //         Email = evento.Email,
                //     });
                // }
                // 
                return Ok(lotes);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar recuperar lotes . Erro: {ex.Message} ");
            }


        }





        [HttpPut("{eventoId}")]
        public async Task<IActionResult> SaveLotes(int eventoId, LoteDto[] models)
        {
            try
            {
                var lotes = await _loteService.SaveLotes(eventoId, models);
                if (lotes == null) return NoContent();
                return Ok(lotes);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar salvar  lotess . Erro: {ex.Message} ");
            }
        }


        [HttpDelete("{eventoId}/{loteId}")]
        public async Task<IActionResult> Delete(int eventoId, int loteId)
        {
            try
            {
                var lote = await _loteService.GetLoteByIdsAsync(eventoId, loteId);
                if (lote == null) return NoContent();

                if (await _loteService.DeleteLote(lote.EventoId, lote.Id))
                {
                    return Ok(new { message = "Lote Deletado" });
                }
                else
                {
                    return BadRequest("Lote não deletado");
                    //return new  Exception ("Ocorreu um errro ao deletar ");
                }
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar deletera os lotes . Erro: {ex.Message} ");
            }
        }



    }
}
