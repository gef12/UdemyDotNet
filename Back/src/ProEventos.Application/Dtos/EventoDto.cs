using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


//utilizado para apenas disponibilizar campos atraves de uma camada DTO  
namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required(ErrorMessage = "O campo {0} e obrigatorio")]
        [MinLength(3, ErrorMessage = "O campo {0} dve ter 4 carcateres")]
        [MaxLength(50, ErrorMessage = "O campo {0} deve ter no maximo 50")]
        //outra forma de fazer
        // [StringLength(50, MinimumLength = 3, ErrorMessage="O campo deve esta entre 4 e 50 caracteres")]
        public string Tema { get; set; }

        public int QtdPessoas { get; set; }

        [Display(Name = "Qtd Pessoas")]
        [Range(1, 120000, ErrorMessage = "{0} deve esta entre 1 a 120000.")]

        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessage = "Não é uma imagem válida (gif | jpeg | jpg| bmp | png)")]
        public string ImagemURL { get; set; }

        [Required(ErrorMessage = "O campo {0} e obrigatorio")]
        [Phone(ErrorMessage = "O campo {0} esta com numero invalido")]
        public string Telefone { get; set; }

        [Display(Name = "e-mail")]
        [Required(ErrorMessage = "O campo {0} e obrigatorio")]
        [EmailAddress(ErrorMessage = "O campo {0}  deve ser um e-mail valido")]
        public string Email { get; set; }

        public IEnumerable<LoteDto> Lotes { get; set; }

        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }

        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}