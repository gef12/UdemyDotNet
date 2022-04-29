using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Application
{
    public class RedeSocialService : IRedeSocialService
    {
        private readonly IRedeSocialPersist _redeSocialPersist;
        private readonly IMapper _mapper;
        public RedeSocialService(IRedeSocialPersist redeSocialPersist, IMapper mapper)
        {

            _redeSocialPersist = redeSocialPersist;
            _mapper = mapper;
        }
        public async Task AddRedeSocial(int id, RedeSocialDto model, bool isEvento)
        {
            try
            {
                var redeSocial = _mapper.Map<RedeSocial>(model);
                if (isEvento)
                {
                    redeSocial.EventoId = id;
                    redeSocial.PalestranteId = null;
                    //redeSocial.EventoId = eventoId;
                }
                else
                {
                    redeSocial.PalestranteId = id;
                    redeSocial.EventoId = null;
                    //redeSocial.PalestranteId= palestranteId;
                }

                _redeSocialPersist.Add<RedeSocial>(redeSocial);
                await _redeSocialPersist.SaveChangesAsync();

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> SaveByEvento(int eventoId, RedeSocialDto[] models)
        {
            try
            {
                var redeSocials = await _redeSocialPersist.GetAllRedeSocialByEventoIdAsync(eventoId);
                if (redeSocials == null) return null;

                foreach (var model in models)
                {
                    if (model.Id == 0)
                    {
                        await AddRedeSocial(eventoId, model, true);
                    }
                    else
                    {
                        /// <summary>
                        /// realiza o update de lote quand o memso ja possui o id 
                        /// </summary>
                        /// <returns></returns>
                        var redeSocial = redeSocials.FirstOrDefault(redeSocial => redeSocial.Id == model.Id);

                        model.EventoId = eventoId;

                        _mapper.Map(model, redeSocial);

                        _redeSocialPersist.Update<RedeSocial>(redeSocial);

                        await _redeSocialPersist.SaveChangesAsync();

                    }
                }



                var redeSocialRetorno = await _redeSocialPersist.GetAllRedeSocialByEventoIdAsync(eventoId);
                return _mapper.Map<RedeSocialDto[]>(redeSocialRetorno);


            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> SaveByPalestrante(int palestranteId, RedeSocialDto[] models)
        {
            try
            {
                var redeSocials = await _redeSocialPersist.GetAllRedeSocialByPalestranteIdAsync(palestranteId);
                if (redeSocials == null) return null;

                foreach (var model in models)
                {
                    if (model.Id == 0)
                    {
                        await AddRedeSocial(palestranteId, model, false);
                    }
                    else
                    {
                        /// <summary>
                        /// realiza o update de lote quand o memso ja possui o id 
                        /// </summary>
                        /// <returns></returns>
                        var redeSocial = redeSocials.FirstOrDefault(redeSocial => redeSocial.Id == model.Id);

                        model.PalestranteId = palestranteId;

                        _mapper.Map(model, redeSocial);

                        _redeSocialPersist.Update<RedeSocial>(redeSocial);

                        await _redeSocialPersist.SaveChangesAsync();

                    }
                }



                var redeSocialRetorno = await _redeSocialPersist.GetAllRedeSocialByPalestranteIdAsync(palestranteId);
                return _mapper.Map<RedeSocialDto[]>(redeSocialRetorno);


            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteRedeSocialByEvento(int eventoId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);
                if (redeSocial == null) throw new Exception("rede Social para delete não encontrado");

                //_mapper.Map(evento, evento);
                _redeSocialPersist.Delete<RedeSocial>(redeSocial);
                return await _redeSocialPersist.SaveChangesAsync();



            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteRedeSocialByPalestrante(int palestranteId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(palestranteId, redeSocialId);
                if (redeSocial == null) throw new Exception("rede Social para delete não encontrado");

                //_mapper.Map(evento, evento);
                _redeSocialPersist.Delete<RedeSocial>(redeSocial);
                return await _redeSocialPersist.SaveChangesAsync();



            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }



        public async Task<RedeSocialDto[]> GetAllByEventoIdAsync(int eventoId)
        {
            try
            {
                var redeSocials = await _redeSocialPersist.GetAllRedeSocialByEventoIdAsync(eventoId);


                //Console.Write(eventos);
                if (redeSocials == null) return null;

                var resultado = _mapper.Map<RedeSocialDto[]>(redeSocials);


                return resultado;

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto[]> GetAllByPalestranteIdAsync(int palestranteId)
        {
            try
            {
                var redeSocials = await _redeSocialPersist.GetAllRedeSocialByPalestranteIdAsync(palestranteId);


                //Console.Write(eventos);
                if (redeSocials == null) return null;

                var resultado = _mapper.Map<RedeSocialDto[]>(redeSocials);


                return resultado;

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto> GetRedeSocialEventoByIdsAsync(int eventoId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialEventoByIdsAsync(eventoId, redeSocialId);

                if (redeSocial == null) return null;

                var resultado = _mapper.Map<RedeSocialDto>(redeSocial);

                return resultado;

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }

        public async Task<RedeSocialDto> GetRedeSocialPalestranteByIdsAsync(int palestranteId, int redeSocialId)
        {
            try
            {
                var redeSocial = await _redeSocialPersist.GetRedeSocialPalestranteByIdsAsync(palestranteId, redeSocialId);

                if (redeSocial == null) return null;

                var resultado = _mapper.Map<RedeSocialDto>(redeSocial);

                return resultado;

            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }
        }


    }
}