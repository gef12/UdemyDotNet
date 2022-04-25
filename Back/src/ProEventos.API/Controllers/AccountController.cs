using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProEventos.API.Extensions;
using ProEventos.Application.Contratos;
using ProEventos.Application.Dtos;

namespace ProEventos.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly ITokenService _tokenService;

        public AccountController(IAccountService accountService,
                                               ITokenService tokenService)
        {
            _accountService = accountService;
            _tokenService = tokenService;
        }

        [HttpGet("GetUser")]
        //[AllowAnonymous]
        public async Task<IActionResult> GetUser()
        {
            try
            {
                var userName = User.GetUserName();
                //var userName = User.FindFirst(ClaimTypes.Name)?.Value;
                var user = await _accountService.GetUserByUserName(userName);

                return Ok(user);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar recuperar  usuario . Erro: {ex.Message} ");
            }
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            try
            {
                var user = await _accountService.GetUserByUserName(userLoginDto.Username);
                if (user == null) return Unauthorized("Usuario ou senha Invalido");

                //verificando se usuario e senha estão certos
                var result = await _accountService.CheckUserPasswordAsync(user, userLoginDto.Password);
                if (!result.Succeeded) return Unauthorized("Usuario ou senha Invalido");

                return Ok(new
                {
                    userName = user.Username,
                    PrimeiroNome = user.PrimeiroNome,
                    token = _tokenService.CreateToken(user).Result

                });
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar fazer login do  usuario . Erro: {ex.Message} ");
            }
        }

        [HttpPost("UpdateUser")]
        public async Task<IActionResult> UpdateUser(UserUpdateDto userUpdateDto)
        {
            try
            {
                var user = await _accountService.GetUserByUserName(User.GetUserName());
                if (user == null) return Unauthorized("Usuario Invalido");

                var userReturn = await _accountService.UpdateAccount(userUpdateDto);


                if (userReturn == null)
                    return NoContent();


                return Ok(userReturn);
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar atualizar  usuario . Erro: {ex.Message} ");
            }
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            try
            {
                if (await _accountService.UserExists(userDto.Username))
                    return BadRequest("Usuario ja existe");

                var user = await _accountService.CreateAccountAsync(userDto);


                if (userDto != null)
                    return Ok(user);


                return BadRequest("Usuario não criado, tente novamente mais tarde");
            }
            catch (Exception ex)
            {

                return this.StatusCode(StatusCodes.Status500InternalServerError, $"erro ao tentar regristar  usuario . Erro: {ex.Message} ");
            }
        }


    }
}