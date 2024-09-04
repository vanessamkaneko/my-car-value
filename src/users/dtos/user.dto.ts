import { Expose } from "class-transformer";

// Dto p/ definir quais propriedades do user devem ser retornadas na resposta ("devem ser expostas ao mundo externo")
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}