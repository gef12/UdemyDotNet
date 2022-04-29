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
using Microsoft.AspNetCore.Hosting;
using System.IO;
using ProEventos.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using ProEventos.Persistence.Models;
//using ProEventos.Persistence.Models;

namespace ProEventos.API.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PalestrantesController : ControllerBase
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


        private readonly IPalestranteService _palestranteService;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IAccountService _accountService;

        public PalestrantesController(IPalestranteService palestranteService, IWebHostEnvironment hostEnvironment, IAccountService accountService)
        {
            _palestranteService = palestranteService;
            _hostEnvironment = hostEnvironment;
            _accountService = accountService;
        }


        [HttpGet("all")]
        public async Task<IActionResult> GetAll([FromQuery] PageParams pageParams)
        {
            try
            {
                var palestrantes = await _palestranteService.GetAllPalestrantesAsync(pageParams, true);
                if (palestrantes == null) return NoContent();

                Response.AddPagination(palestrantes.CurrentPage, palestrantes.PageSize, palestrantes.TotalCount, palestrantes.TotalCount);

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
                return Ok(palestrantes);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar recuperar paletrantes . Erro: {ex.Message} ");
            }


        }

        [HttpGet]
        public async Task<IActionResult> GetPalestrantes()
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId(), true);
                if (palestrante == null) return NoContent();
                return Ok(palestrante);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar recuperar palestrante . Erro: {ex.Message} ");
            }


        }

        // [HttpGet("{tema}/tema")]
        // public async Task<IActionResult> GetByTema(int id, string tema)
        // {
        //     try
        //     {
        //         var palestrante = await _palestranteService.GetAllEventosByTemaAsync(User.GetUserId(), tema, true);
        //         if (evento == null) return NoContent();
        //         return Ok(evento);
        //     }
        //     catch (Exception ex)
        //     {

        //         return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar recuperar eventos . Erro: {ex.Message} ");
        //     }


        // }

        [HttpPost]
        public async Task<IActionResult> Post(PalestranteAddDto model)
        {
            try
            {
                var palestrante = await _palestranteService.GetPalestranteByUserIdAsync(User.GetUserId(), false);

                if (palestrante == null)
                    palestrante = await _palestranteService.AddPalestrantes(User.GetUserId(), model);
                return Ok(palestrante);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar adicionar palestrantes . Erro: {ex.Message} ");
            }
        }





        [HttpPut]
        public async Task<IActionResult> Put(PalestranteUpdateDto model)
        {
            try
            {
                var palestrante = await _palestranteService.UpdatePalestrante(User.GetUserId(), model);
                if (palestrante == null) return NoContent();
                return Ok(palestrante);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar atualizar paletrante . Erro: {ex.Message} ");
            }
        }









    }
}
