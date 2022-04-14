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
    public class EventosController : ControllerBase
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


        private readonly IEventoService _eventoService;
        public EventosController(IEventoService eventoService)
        {
            _eventoService = eventoService;
        }


        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _eventoService.GetAllEventosAsync(true);
                if (eventos == null) return NoContent();
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
                return Ok(eventos);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar recuperar eventos . Erro: {ex.Message} ");
            }


        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(id, true);
                if (evento == null) return NoContent();
                return Ok(evento);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar recuperar eventos . Erro: {ex.Message} ");
            }


        }

        [HttpGet("{tema}/tema")]
        public async Task<IActionResult> GetByTema(int id, string tema)
        {
            try
            {
                var evento = await _eventoService.GetAllEventosByTemaAsync(tema, true);
                if (evento == null) return NoContent();
                return Ok(evento);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar recuperar eventos . Erro: {ex.Message} ");
            }


        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = await _eventoService.AddEventos(model);
                if (evento == null) return NoContent();
                return Ok(evento);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar adicionar eventos . Erro: {ex.Message} ");
            }
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, EventoDto model)
        {
            try
            {
                var evento = await _eventoService.UpdateEvento(id, model);
                if (evento == null) return NoContent();
                return Ok(evento);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar atualizar eventos . Erro: {ex.Message} ");
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var evento = await _eventoService.GetEventoByIdAsync(id, true);
                if (evento == null) return NoContent();

                if (await _eventoService.DeleteEvento(id))
                {
                    return Ok(new { message = "Deletado" });
                }
                else
                {
                    return BadRequest("Evento não deletado");
                    //return new  Exception ("Ocorreu um errro ao deletar ");
                }
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar deletera os eventos . Erro: {ex.Message} ");
            }
        }



    }
}
