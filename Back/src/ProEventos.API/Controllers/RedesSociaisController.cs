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
using ProEventos.API.Extensions;
//using ProEventos.Persistence.Models;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RedesSociaisController : ControllerBase
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


        private readonly IRedeSocialService _redeSocialService;

        private readonly IPalestranteService _palestranteService;
        private readonly IEventoService _eventoService;

        public RedesSociaisController(IRedeSocialService redeSocialService, IEventoService eventoService, IPalestranteService palestranteService)
        {
            _eventoService = eventoService;
            _palestranteService = palestranteService;
            _redeSocialService = redeSocialService;
        }

        [NonAction]

        private async Task<bool> AutorEvento(int eventoId)
        {
            var evento = await _eventoService.GetEventoByIdAsync(User.GetUserId(), eventoId, false);
            if (evento == null) return false;
            return true;
        }


        [HttpGet("evento/{eventoId}")]
        public async Task<IActionResult> GetByEvento(int eventoId)
        {
            try
            {
                if (!(await AutorEvento(eventoId)))
                    return Unauthorized();
                var redeSocials = await _redeSocialService.GetAllByEventoIdAsync(eventoId);
                if (redeSocials == null) return NoContent();

                return Ok(redeSocials);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar recuperar lotes . Erro: {ex.Message} ");
            }


        }

        [HttpGet("palestrante")]
        public async Task<IActionResult> GetByPalestrante()
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if (palestrante == null) return Unauthorized();


                var redeSocials = await _redeSocialService.GetAllByPalestranteIdAsync(palestrante.Id);
                if (redeSocials == null) return NoContent();

                return Ok(redeSocials);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar recuperar lotes . Erro: {ex.Message} ");
            }


        }





        [HttpPut("evento/{eventoId}")]
        public async Task<IActionResult> SaveRedeSocialByEvento(int eventoId, RedeSocialDto[] models)
        {
            try
            {
                if (!(await AutorEvento(eventoId)))
                    return Unauthorized();

                var redeSocials = await _redeSocialService.SaveByEvento(eventoId, models);
                if (redeSocials == null) return NoContent();
                return Ok(redeSocials);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar salvar  redes sociais evento . Erro: {ex.Message} ");
            }
        }

        [HttpPut("palestrante")]
        public async Task<IActionResult> SaveRedeSocialByPalestrante(RedeSocialDto[] models)
        {
            try
            {
                var palestrate = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if (palestrate == null) return Unauthorized();

                var redeSocials = await _redeSocialService.SaveByPalestrante(palestrate.Id, models);
                if (redeSocials == null) return NoContent();
                return Ok(redeSocials);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar salvar  redes sociais  paletrantes. Erro: {ex.Message} ");
            }
        }


        [HttpDelete("evento/{eventoId}/{redeSocialId}")]
        public async Task<IActionResult> DeleteByEvento(int eventoId, int redeSocialId)
        {
            try
            {
                if (!(await AutorEvento(eventoId)))
                    return Unauthorized();

                var redeSocial = await _redeSocialService.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if (redeSocial == null) return NoContent();

                if (await _redeSocialService.DeleteRedeSocialByEvento(eventoId, redeSocial.Id))
                {
                    return Ok(new { message = "Rede social  Deletada" });
                }
                else
                {
                    return BadRequest("Rede social  não deletada");
                    //return new  Exception ("Ocorreu um errro ao deletar ");
                }
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar deletar a rede social por evento . Erro: {ex.Message} ");
            }
        }


        [HttpDelete("palestrante/{redeSocialId}")]
        public async Task<IActionResult> DeleteByPalestrante(int redeSocialId)
        {
            try
            {
                var palestrate = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId());
                if (palestrate == null) return Unauthorized();


                var redeSocial = await _redeSocialService.GetRedeSocialPalestranteByIdsAsync(palestrate.Id, redeSocialId);
                if (redeSocial == null) return NoContent();

                if (await _redeSocialService.DeleteRedeSocialByPalestrante(palestrate.Id, redeSocial.Id))
                {
                    return Ok(new { message = "Rede social  Deletada by palestrante" });
                }
                else
                {
                    return BadRequest("Rede social  não deletada");
                    //return new  Exception ("Ocorreu um errro ao deletar ");
                }
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar deletar a rede social por evento . Erro: {ex.Message} ");
            }
        }
    }
}
