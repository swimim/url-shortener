import { IsNotEmpty, IsString } from "class-validator";

export class GenerateURLDto {
  @IsNotEmpty()
  @IsString()
  original_url: string
}